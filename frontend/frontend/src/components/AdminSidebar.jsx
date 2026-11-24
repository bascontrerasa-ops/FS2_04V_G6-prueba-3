import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function AdminSidebar() {
  return (
    <div className="admin-sidebar shadow-sm">
      <h4 className="mb-4">Panel Admin</h4>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/admin/productos">
          Listar Productos
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/productos/nuevo">
          Agregar Producto
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/usuarios">
          Gestionar Usuarios
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/pedidos">
          Gestionar Pedidos
        </Nav.Link>
      </Nav>
    </div>
  )
}

export default AdminSidebar