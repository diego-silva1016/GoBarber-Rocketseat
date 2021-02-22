import React, {
  useCallback, useState, useEffect, useMemo,
} from 'react';
import {
  format, parseISO, isToday, isAfter,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calender,
  Section,
  Appointment,
} from './styles';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import profile from '../../assets/profile.png';
import { useAuth } from '../../hooks/auth';

interface MonthAvailability {
    day: number;
    available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability[]>([]);

  // Quando seleciona um dia no calendário
  const handleDateChange = useCallback((date: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) setSelectedDate(date);
  }, []);

  // Quando troca o mês no calendário
  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  // Busca os dias do mẽs e a disponobilidade de cada dia
  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      },
    })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  // Busca os agendamentos do usuário logado
  useEffect(() => {
    api.get<IAppointment[]>('/appointments/me', {
      params: {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      },
    })
      .then((response) => {
        const appointmentsFormatted = response.data.map(appointment => ({
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
        }));

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  // Dias que não é possivel agendar um horário
  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => !monthDay.available)
      .map((monthDay) => new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        monthDay.day,
      ));

    return dates;
  }, [currentMonth, monthAvailability]);

  // Dia da semana em palavra
  const dayWeek = useMemo(() => format(selectedDate, 'cccc', {
    locale: ptBR,
  }), [selectedDate]);

  // Agendamentos da manhã
  const morningAppointments = useMemo(() => appointments
    .filter(item => parseISO(item.date).getHours() < 12),
  [appointments]);

  // Agendamentos da tarde
  const afternoonAppointments = useMemo(() => appointments
    .filter(item => parseISO(item.date).getHours() >= 12),
  [appointments]);

  // Proximo agendamento
  const nextAppointent = useMemo(() => appointments
    .find(item => isAfter(parseISO(item.date), new Date())),
  [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url ? user.avatar_url : profile} alt="GoBarber" />
            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={() => signOut()}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate)
            && <span>Hoje</span>}
            <span>
              {`dia ${selectedDate.getDate()}`}
            </span>
            <span>{dayWeek}</span>
          </p>

          {nextAppointent && (
          <NextAppointment>
            <strong>Agendamento a seguir</strong>
            <div>
              <img src={nextAppointent.user.avatar_url ? nextAppointent.user.avatar_url : profile} alt="GoBarber" />
              <strong>{nextAppointent.user.name}</strong>
              <span>
                <FiClock />
                {nextAppointent.hourFormatted}
              </span>
            </div>
          </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
            <p>Nenhum agendamento para esse período</p>
            )}
            { morningAppointments && morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img src={appointment.user.avatar_url ? appointment.user.avatar_url : profile} alt="GoBarber" />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
            <p>Nenhum agendamento para esse período</p>
            )}

            { afternoonAppointments && afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img src={appointment.user.avatar_url ? appointment.user.avatar_url : profile} alt="GoBarber" />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calender>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calender>
      </Content>

    </Container>
  );
};

export default Dashboard;
