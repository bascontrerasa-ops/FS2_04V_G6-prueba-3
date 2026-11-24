import { httpRequest } from '../api/httpClient';
export const productService = {
  list: () => httpRequest('/productos'),
  find: (id) => httpRequest(`/productos/${id}`),
  create: (product) => httpRequest('/productos', { method: 'POST', body: JSON.stringify(product) }),
  update: (id, product) => httpRequest(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  remove: (id) => httpRequest(`/productos/${id}`, { method: 'DELETE' }),
};
