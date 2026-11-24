export const estadosPedido = [
  { value: 'PENDIENTE', label: 'Pendiente', variant: 'warning' },
  { value: 'CONFIRMADO', label: 'Confirmado', variant: 'primary' },
  { value: 'EN_PREPARACION', label: 'En preparación', variant: 'info' },
  { value: 'LISTO', label: 'Listo', variant: 'success' },
  { value: 'ENTREGADO', label: 'Entregado', variant: 'success' },
  { value: 'CANCELADO', label: 'Cancelado', variant: 'danger' },
]

export function estadoPedidoInfo(estado) {
  return estadosPedido.find((item) => item.value === estado)
    || { value: estado, label: estado || 'Sin estado', variant: 'secondary' }
}

export function formatoPrecio(valor) {
  return `$${Number(valor || 0).toLocaleString('es-CL')}`
}

export function formatoFecha(fecha) {
  if (!fecha) return 'Fecha no disponible'
  const fechaValida = new Date(fecha)
  return Number.isNaN(fechaValida.getTime())
    ? 'Fecha no disponible'
    : fechaValida.toLocaleString('es-CL')
}
