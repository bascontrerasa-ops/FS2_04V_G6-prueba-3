import { Alert, Col, Container, Row } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { useAuth } from '../../context/AuthContext'

function AdminLayout() {
  const { session } = useAuth()
  const usuario = session?.user

  if (!usuario || usuario.rol !== 'admin') {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Acceso restringido. Debes iniciar sesión como administrador.{' '}
          <Alert.Link as={Link} to="/login">Ir al login</Alert.Link>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3} lg={2}>
          <AdminSidebar />
        </Col>
        <Col md={9} lg={10}>
          <div className="admin-content shadow-sm">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminLayout