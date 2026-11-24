import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/productService'

function TiendaView() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    productService.list()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error('Error al cargar productos:', error))
  }, [])

  return (
    <Container className="py-4">
      <h1 className="mb-4 font-weight-bold">Catálogo de Pasteles y Postres</h1>
      {productos.length === 0 ? (
        <p>No hay productos disponibles actualmente.</p>
      ) : (
        <Row className="g-4">
          {productos.map((producto) => (
            <Col md={6} lg={4} key={producto.id}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default TiendaView