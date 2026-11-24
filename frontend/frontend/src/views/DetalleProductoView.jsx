import { useEffect, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'

function DetalleProductoView() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [producto, setProducto] = useState(null)

  useEffect(() => {
    productService.find(id)
      .then((datos) => setProducto(datos))
      .catch(() => setProducto(null))
  }, [id])

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h2>Producto no encontrado</h2>
        <Button as={Link} to="/" variant="primary" className="mt-3">
          Volver a la tienda
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card className="product-detail shadow border-0">
        <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} className="detail-image" />
        <Card.Body className="p-4">
          <Card.Title as="h1" className="mb-3">{producto.nombre}</Card.Title>
          <Card.Text className="text-muted mb-2">
            <strong>Categoría:</strong> {producto.categoria}
          </Card.Text>
          <Card.Text className="fs-5">{producto.descripcion}</Card.Text>
          <Card.Text className="fs-3 fw-bold text-success my-3">
            ${producto.precio.toLocaleString('es-CL')}
          </Card.Text>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => addToCart(producto)}>
              Agregar al carrito
            </Button>
            <Button as={Link} to="/" variant="secondary">
              Volver a la tienda
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DetalleProductoView