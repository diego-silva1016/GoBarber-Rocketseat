import React, { useRef, useCallback, ChangeEvent } from 'react';
import {
  FiMail, FiLock, FiArrowLeft, FiCamera, FiUser,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import profile from '../../assets/profile.png';

import {
  Container, Content, Header, HeaderContent, AvatarInput,
} from './styles';
import api from '../../services/api';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: (val:string) => !!val.length,
          then: Yup.string().required('Campo obrigatório').min(6, 'No mínimo 6 dígitos'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: (val:string) => !!val.length,
            then: Yup.string().required('Campo obrigatório').min(6, 'No mínimo 6 dígitos'),
            otherwise: Yup.string(),
          })
          .oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta',
          ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (!data.old_password && data.password) {
        addToast({
          type: 'error',
          title: 'Senha atual não foi informada',
        });

        return;
      }

      const formData = {
        name: data.name,
        email: data.email,
        ...(data.old_password ? {
          old_password: data.old_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        } : {}),
      };

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      addToast({
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Perfil atualizado com sucesso.',
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Ocorreu um erro ao tentar atualizar o perfil, tente novamente.',
      });
    }
  }, [addToast, history, updateUser]);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const data = new FormData();
    if (e.target.files) {
      data.append('avatar', e.target.files[0]);

      api.patch('/users/avatar', data)
        .then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
    }
  }, [addToast, updateUser]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Link to="/dashboard">
            <FiArrowLeft size={24} />
          </Link>
        </HeaderContent>
      </Header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url ? user.avatar_url : profile} alt="GoBarber" />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" defaultValue={user.name} />

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input containerStyle={{ marginTop: '24px' }} name="old_password" icon={FiLock} type="password" placeholder="Senha atual" />

          <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />

          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar senha" />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};
export default Profile;
