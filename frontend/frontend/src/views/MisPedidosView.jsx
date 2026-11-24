import { useCallback, useEffect, useState } from 'react'
import { Accordion, Alert, Badge, Button, Card, Container, Spinner, Table } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { pedidoService } from '../services/pedidoService'
import { estadoPedidoInfo, formatoFecha, formatoPrecio } from '../utils/pedidos'

function MisPedidosView() {
  const { session } = useAuth()
  const location = useLocation()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarPedidos = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setPedidos(await pedidoService.misPedidos())
    } catch (err) {
      setError(err.message || 'No se pudo cargar el historial de pedidos.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user?.rol === 'cliente') cargarPedidos()
    else setCargando(false)
  }, [session, cargarPedidos])

  if (!session) {
    return (
      <Container className="py-5">
        <Alert variant="info">Inicia sesión como cliente para consultar tus pedidos.</Alert>
        <Button as={Link} to="/login" state={{ from: '/mis-pedidos' }}>Iniciar sesión</Button>
      </Container>
    )
  }

  if (session.user?.rol !== 'cliente') {
    return <Container className="py-5"><Alert variant="warning">El historial de compras está disponible para cuentas de cliente.</Alert></Container>
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="mb-1">Mis pedidos</h1>
          <p className="text-muted mb-0">Consulta el estado y el detalle de tus compras.</p>
        </div>
        <Button variant="outline-secondary" onClick={cargarPedidos} disabled={cargando}>Actualizar</Button>
      </div>

      {location.state?.pedidoCreado && (
        <Alert variant="success">¡Tu pedido #{location.state.pedidoCreado} fue registrado correctamente!</Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {cargando ? (
        <div className="text-center py-5"><Spinner animation="border" role="status" /><span className="visually-hidden">Cargando pedidos...</span></div>
      ) : pedidos.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5">
          <h2 className="h4">Todavía no tienes pedidos</h2>
          <p className="text-muted">Cuando confirmes una compra, aparecerá aquí.</p>
          <Button as={Link} to="/" className="mx-auto">Ir a la tienda</Button>
        </Card>
      ) : (
        <Accordion alwaysOpen>
          {pedidos.map((pedido) => {
            const estado = estadoPedidoInfo(pedido.estado)
            return (
              <Accordion.Item eventKey={String(pedido.id)} key={pedido.id} className="mb-3 border rounded">
                <Accordion.Header>
                  <div className="d-flex flex-wrap align-items-center gap-3 w-100 pe-2">
                    <strong>Pedido #{pedido.id}</strong>
                    <span className="small text-muted">{formatoFecha(pedido.fechaCreacion)}</span>
                    <Badge bg={estado.variant}>{estado.label}</Badge>
                    <strong className="ms-auto me-2">{formatoPrecio(pedido.total)}</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Table responsive size="sm" bordered className="align-middle mb-3">
                    <thead className="table-light"><tr><th>Producto</th><th>Precio unitario</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
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
                  {pedido.observaciones && <p className="mb-0"><strong>Indicaciones:</strong> {pedido.observaciones}</p>}
                </Accordion.Body>
              </Accordion.Item>
            )
          })}
        </Accordion>
      )}
    </Container>
  )
}

export default MisPedidosView
