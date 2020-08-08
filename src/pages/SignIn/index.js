import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import * as auth from '../../store/modules/auth/action';
import logo from '../../assets/logo.svg';

export default function SignIn() {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(auth.signInRequest(email, password));
  }

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Insira um email valido')
      .required('E-mail obrigatório'),
    password: Yup.string().required('Senha obrigatória'),
  });

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form onSubmit={handleSubmit} schema={schema}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'carregando...' : 'Acessar'}
        </button>

        <Link to="/register">criar conta gratuita</Link>
      </Form>
    </>
  );
}
