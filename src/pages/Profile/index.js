import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { Container } from './styles';
import { updatProfileRequest } from '../../store/modules/user/action';
import AvatarInput from './AvatarInput';
import { signOut } from '../../store/modules/auth/action';

function Profile() {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user.profile);

  const schema = Yup.object().shape({
    name: Yup.string().min(3, 'minimo 3 caracteres'),
    email: Yup.string().email('precisamos de um email válido'),
    oldPassword: Yup.string(),
    password: Yup.string()
      .min(0 || 6, 'mínimo 6 caracteres')
      .notRequired(),
    confirmPassword: Yup.string(),
  });

  function handleSubmit(data) {
    dispatch(updatProfileRequest(data));
  }
  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit} schema={schema}>
        <AvatarInput name="avatar_id" />

        <Input name="name" placeholder="Nome completo" />
        <Input name="email" placeholder="Seu endereço de e-mail" />

        <hr />

        <Input
          type="password"
          name="oldPassword"
          placeholder="Sua senha atual"
        />
        <Input type="password" name="newPassword" placeholder="Nova senha " />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirme a nova senha"
        />

        <button type="submit">Atualizar perfil</button>
      </Form>

      <button type="button" onClick={handleSignOut}>
        Sair do GoBarber
      </button>
    </Container>
  );
}

export default Profile;
