import React from 'react';
import { Link } from 'react-router-dom';

import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import * as auth from '~/store/modules/auth/action';
import logo from '~/assets/logo.svg';

export default function SignIn() {
  const dispatch = useDispatch();

  function handleSubmit({ name, email, password }) {
    dispatch(auth.signUpRequest(name, email, password));
  }

  const schema = Yup.object().shape({
    name: Yup.string().required('Nome obrigatório'),
    email: Yup.string()
      .email('Insira um email valido')
      .required('E-mail obrigatório'),
    password: Yup.string()
      .min(6, 'mínimo 6 caracteres')
      .required('Senha obrigatória'),
  });

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form onSubmit={handleSubmit} schema={schema}>
        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">Acessar</button>

        <Link to="/">já tenho uma conta</Link>
      </Form>
    </>
  );
}
