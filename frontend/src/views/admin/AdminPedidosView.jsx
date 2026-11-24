import { Fragment, useCallback, useEffect, useState } from 'react'
import { Alert, Badge, Button, Form, Spinner, Table } from 'react-bootstrap'
import { adminService } from '../../services/adminService'
import { estadoPedidoInfo, estadosPedido, formatoFecha, formatoPrecio } from '../../utils/pedidos'

function AdminPedidosView() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(null)
  const [detalleAbierto, setDetalleAbierto] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarPedidos = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setPedidos(await adminService.listOrders())
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pedidos.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarPedidos() }, [cargarPedidos])

  async function cambiarEstado(pedido, estado) {
    setActualizando(pedido.id)
    setError('')
    setMensaje('')
    try {
      const actualizado = await adminService.updateOrderStatus(pedido.id, estado)
      setPedidos((actuales) => actuales.map((item) => item.id === pedido.id ? actualizado : item))
      setMensaje(`El pedido #${pedido.id} ahora está ${estadoPedidoInfo(estado).label.toLowerCase()}.`)
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado del pedido.')
    } finally {
      setActualizando(null)
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="mb-1">Gestión de pedidos</h1>
          <p className="text-muted mb-0">Revisa las compras y actualiza su estado de preparación y entrega.</p>
        </div>
        <Button variant="outline-secondary" onClick={cargarPedidos} disabled={cargando}>Actualizar lista</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}

      {cargando ? (
        <div className="text-center py-5"><Spinner animation="border" role="status" /><span className="visually-hidden">Cargando pedidos...</span></div>
      ) : pedidos.length === 0 ? (
        <Alert variant="info">Todavía no hay pedidos registrados.</Alert>
      ) : (
        <Table responsive bordered hover className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th style={{ minWidth: 190 }}>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const estado = estadoPedidoInfo(pedido.estado)
              const expandido = detalleAbierto === pedido.id
              return (
                <Fragment key={pedido.id}>
                  <tr key={`pedido-${pedido.id}`}>
                    <td className="fw-semibold">#{pedido.id}</td>
                    <td>{formatoFecha(pedido.fechaCreacion)}</td>
                    <td>
                      <div className="fw-semibold">{pedido.clienteNombre}</div>
                      <small className="text-muted">{pedido.clienteEmail}</small>
                    </td>
                    <td>{(pedido.detalles || []).reduce((sum, item) => sum + item.cantidad, 0)} unidades</td>
                    <td className="fw-semibold">{formatoPrecio(pedido.total)}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Badge bg={estado.variant} className="align-self-start">{estado.label}</Badge>
                        <Form.Select
                          size="sm"
                          aria-label={`Estado del pedido ${pedido.id}`}
                          value={pedido.estado}
                          disabled={actualizando === pedido.id}
                          onChange={(event) => cambiarEstado(pedido, event.target.value)}
                        >
                          {estadosPedido.map((opcion) => <option key={opcion.value} value={opcion.value}>{opcion.label}</option>)}
                        </Form.Select>
                        {actualizando === pedido.id && <small className="text-muted">Guardando...</small>}
                      </div>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => setDetalleAbierto(expandido ? null : pedido.id)}>
                        {expandido ? 'Ocultar' : 'Ver detalle'}
                      </Button>
                    </td>
                  </tr>
                  {expandido && (
                    <tr key={`detalle-${pedido.id}`}>
                      <td colSpan={7} className="bg-light">
                        <div className="p-2">
                          <h2 className="h6">Detalle del pedido #{pedido.id}</h2>
                          <Table responsive size="sm" bordered className="bg-white mb-2">
                            <thead><tr><th>Producto</th><th>Precio unitario</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
                            <tbody>
                              {(pedido.detalles || []).map((detalle) => (
                                <tr key={detalle.id}>
                                  <td>{detalle.nombreProducto}</td>
                                  <td>{formatoPrecio(detalle.precioUnitario)}</td>
                                  <td>{detalle.cantidad}</td>
                                  <td>{formatoPrecio(detalle.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          {pedido.observaciones && <p className="small mb-0"><strong>Indicaciones del cliente:</strong> {pedido.observaciones}</p>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default AdminPedidosView
