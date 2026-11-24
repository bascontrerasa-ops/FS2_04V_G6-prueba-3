import { httpRequest } from '../api/httpClient';
export const authService = {
  login: (email, password) => httpRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (user) => httpRequest('/auth/registro', { method: 'POST', body: JSON.stringify(user) }),
};
