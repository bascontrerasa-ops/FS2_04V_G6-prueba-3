import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Image, Row, Spinner, Table } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { pedidoService } from '../services/pedidoService'
import { formatoPrecio } from '../utils/pedidos'

function CarritoView() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const [observaciones, setObservaciones] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [error, setError] = useState('')

  function cambiarCantidad(id, valor) {
    const cantidad = Number(valor)
    if (Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 50) updateQuantity(id, cantidad)
  }

  function vaciarCarrito() {
    if (window.confirm('¿Quieres quitar todos los productos del carrito?')) clearCart()
  }

  async function confirmarPedido() {
    if (!session) {
      navigate('/login', { state: { from: '/carrito' } })
      return
    }
    if (session.user?.rol !== 'cliente') {
      setError('Solo una cuenta de cliente puede confirmar un pedido.')
      return
    }
    if (!window.confirm(`¿Confirmas tu pedido por ${formatoPrecio(cartTotal)}?`)) return

    setConfirmando(true)
    setError('')
    try {
      const pedido = await pedidoService.crear({
        items: items.map(({ producto, cantidad }) => ({ productoId: producto.id, cantidad })),
        observaciones: observaciones.trim(),
      })
      clearCart()
      navigate('/mis-pedidos', { state: { pedidoCreado: pedido.id } })
    } catch (err) {
      setError(err.message || 'No se pudo confirmar el pedido. Inténtalo nuevamente.')
    } finally {
      setConfirmando(false)
    }
  }

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm text-center p-5">
          <div className="display-3 mb-3" aria-hidden="true">🛒</div>
          <h1 className="h2">Tu carrito está vacío</h1>
          <p className="text-muted">Explora nuestros productos y agrega tus favoritos.</p>
          <Button as={Link} to="/" variant="primary" className="mx-auto">Ir a la tienda</Button>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="mb-1">Mi carrito</h1>
          <p className="text-muted mb-0">Modifica las cantidades o elimina los productos que ya no quieras.</p>
        </div>
        <Button variant="outline-danger" onClick={vaciarCarrito}>Vaciar carrito</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Row className="g-4">
        <Col lg={8}>
          <Table responsive bordered hover className="bg-white align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th style={{ minWidth: 105 }}>Cantidad</th>
                <th>Subtotal</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {items.map(({ producto, cantidad }) => (
                <tr key={producto.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <Image src={producto.imagen} alt={producto.nombre} rounded className="cart-thumb" />
                      <div>
                        <div className="fw-semibold">{producto.nombre}</div>
                        <small className="text-muted">{producto.categoria}</small>
                      </div>
                    </div>
                  </td>
                  <td>{formatoPrecio(producto.precio)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      aria-label={`Cantidad de ${producto.nombre}`}
                      value={cantidad}
                      onChange={(event) => cambiarCantidad(producto.id, event.target.value)}
                    />
                  </td>
                  <td className="fw-semibold">{formatoPrecio(producto.precio * cantidad)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      aria-label={`Quitar ${producto.nombre}`}
                      onClick={() => removeFromCart(producto.id)}
                    >
                      Quitar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Form.Group className="mt-3">
            <Form.Label htmlFor="observaciones-pedido">Indicaciones para el pedido (opcional)</Form.Label>
            <Form.Control
              id="observaciones-pedido"
              as="textarea"
              rows={3}
              maxLength={500}
              value={observaciones}
              onChange={(event) => setObservaciones(event.target.value)}
              placeholder="Ej.: dedicatoria, indicaciones especiales..."
            />
            <Form.Text muted>{observaciones.length}/500 caracteres</Form.Text>
          </Form.Group>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="h4 mb-3">Resumen del pedido</h2>
              <div className="d-flex justify-content-between mb-2">
                <span>Productos ({items.reduce((sum, item) => sum + item.cantidad, 0)})</span>
                <span>{formatoPrecio(cartTotal)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                <span>Total estimado</span>
                <span className="text-success">{formatoPrecio(cartTotal)}</span>
              </div>
              <p className="small text-muted">Al confirmar, el servidor verificará los productos y precios actuales y guardará tu pedido como pendiente. Esta acción no realiza un pago en línea.</p>

              {!session ? (
                <Alert variant="info" className="small">
                  Para confirmar la compra debes iniciar sesión con una cuenta de cliente.
                  <Button as={Link} to="/login" state={{ from: '/carrito' }} variant="outline-primary" className="w-100 mt-2">
                    Iniciar sesión
                  </Button>
                </Alert>
              ) : session.user?.rol !== 'cliente' ? (
                <Alert variant="warning" className="small mb-0">La confirmación de compras está disponible para cuentas de cliente.</Alert>
              ) : (
                <Button onClick={confirmarPedido} variant="success" className="w-100 mb-2" disabled={confirmando}>
                  {confirmando ? <><Spinner size="sm" className="me-2" />Guardando pedido...</> : 'Confirmar pedido'}
                </Button>
              )}
              <Button as={Link} to="/" variant="outline-secondary" className="w-100">Seguir comprando</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CarritoView
