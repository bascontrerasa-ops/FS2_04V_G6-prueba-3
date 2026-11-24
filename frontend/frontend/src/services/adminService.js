import { httpRequest } from '../api/httpClient'

export const adminService = {
  listUsers: () => httpRequest('/admin/usuarios'),
  removeUser: (id) => httpRequest(`/admin/usuarios/${id}`, { method: 'DELETE' }),
  listOrders: () => httpRequest('/admin/pedidos'),
  updateOrderStatus: (id, estado) => httpRequest(`/admin/pedidos/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  }),
}
