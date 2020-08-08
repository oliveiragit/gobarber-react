import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import getHistory from '../../../services/history';

import { signInSuccess, signFailure, signInRequest } from './action';

export function* signIn({ payload }) {
  const history = getHistory();
  try {
    const { email, password } = payload;
    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });
    const { token, user } = response.data;

    if (token) api.defaults.headers.Authorization = `Bearer ${token}`;

    if (!user.provider) {
      toast.error('Usuário precisa ser prestador de serviço');
      yield put(signFailure());
      return;
    }

    yield put(signInSuccess(token, user));
    yield history.push('/dashboard');
  } catch (error) {
    toast.error('falha na autenticação, por favor tente novamente!');
    yield put(signFailure());
  }
}
export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', { name, email, password, provider: true });
    yield put(signInRequest(email, password));

    toast.success('Cadastro concluído com sucesso!');
  } catch (err) {
    if (err.response.data.error === 'email in use') {
      toast.error('email já tem cadastro');
    } else toast.error('oops, tente novamente mais tarde');
  }
}
export function setToken({ payload }) {
  try {
    if (!payload) return;
    const { token } = payload.auth;

    if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
    console.tron.error(err);
  }
}
export function signOut() {
  const history = getHistory();
  history.push('/');
}
export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
