import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function NavbarTienda() {
  const navigate = useNavigate()
  const { session, logout } = useAuth()
  const { cartCount } = useCart()
  const usuarioSesion = session?.user
  const esAdmin = usuarioSesion && usuarioSesion.rol === 'admin'

  const cerrarSesion = () => {
    logout()
    navigate('/login')
  }

  return (
    <Navbar className="navbar-custom" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🎂 Pastelería Artesanal
        </Navbar.Brand>
        <div className="d-flex align-items-center">
          <Nav className="flex-row me-3">
            <Nav.Link as={NavLink} to="/" className="px-2 text-light">
              Tienda
            </Nav.Link>
            
            {!usuarioSesion ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="px-2 text-light">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" className="px-2 text-light">
                  Registro
                </Nav.Link>
              </>
            ) : (
              <>
                {usuarioSesion.rol === 'cliente' && (
                  <Nav.Link as={NavLink} to="/mis-pedidos" className="px-2 text-light">
                    Mis pedidos
                  </Nav.Link>
                )}
                <Nav.Link onClick={cerrarSesion} className="px-2 text-warning" style={{ cursor: 'pointer' }}>
                  Cerrar ({usuarioSesion.nombre})
                </Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/carrito" className="px-2 text-light">
              🛒 Carrito{cartCount > 0 ? ` (${cartCount})` : ''}
            </Nav.Link>
          </Nav>

          {esAdmin && <Dropdown align="end">
            <Dropdown.Toggle 
              variant="dark" 
              id="menu-admin-barras" 
              className="border-0 fs-4 text-light px-2 py-1"
              style={{ background: 'transparent' }}
              title="Menú Administrador"
            >
              ☰
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow mt-2">
              <Dropdown.Header className="fw-bold text-muted">Panel Admin</Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item as={NavLink} to="/admin/productos" className="fw-bold text-primary">
                Gestión de productos
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/admin/usuarios">
                Gestión de usuarios
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/admin/pedidos">
                Gestión de pedidos
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}
        </div>
      </Container>
    </Navbar>
  )
}

export default NavbarTienda