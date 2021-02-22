import React, { useRef, useCallback, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';

import {
  Container, Content, AnimationContainer, Background,
} from './styles';
import api from '../../services/api';

interface SignInFormData {
    email: string;
    password: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória').min(6, 'No mínimo 6 dígitos'),
        passwordConfirm: Yup.mixed().test('match', 'As senhas não são iguais', (rest, value) => value.parent.password === value.parent.passwordConfirm),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const [, token] = location.search.split('=');

      if (!token) {
        throw new Error();
      }

      await api.post('/password/reset', {
        password: data.password,
        passwordConfirm: data.password,
        token,
      });

      addToast({
        type: 'success',
        title: 'Senha resetada',
        description: 'Sua senha foi resetada com sucesso.',
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
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar senha, tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }, [location.search, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />

            <Input name="passwordConfirm" icon={FiLock} type="password" placeholder="Confirme sua senha" />

            <Button loading={loading} type="submit">Resetar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default ResetPassword;
