import { httpRequest } from '../api/httpClient'

export const pedidoService = {
  crear: (pedido) => httpRequest('/pedidos', {
    method: 'POST',
    body: JSON.stringify(pedido),
  }),
  misPedidos: () => httpRequest('/pedidos'),
}
