import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        className="product-image"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text className="text-muted mb-1">{producto.categoria}</Card.Text>
        <Card.Text className="fw-bold fs-5 text-primary mt-auto">
          ${producto.precio.toLocaleString('es-CL')}
        </Card.Text>
        <Button as={Link} to={`/producto/${producto.id}`} variant="outline-primary" className="w-100 mt-2">
          Ver Detalle
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard