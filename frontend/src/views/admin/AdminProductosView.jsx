import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { productService } from '../../services/productService'

function AdminProductosView() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    cargarProductos()
  }, [])

  function cargarProductos() {
    productService.list()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error('Error al cargar productos:', error))
  }

  async function eliminarProducto(id) {
    if (!window.confirm('¿Deseas eliminar este producto de la pastelería?')) return

    try {
      await productService.remove(id)
      setProductos((actuales) => actuales.filter((producto) => producto.id !== id))
    } catch (error) {
      alert(error.message || 'No se pudo eliminar el producto')
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        <Button as={Link} to="/admin/productos/nuevo" variant="success">
          + Agregar Producto
        </Button>
      </div>
      <Table responsive bordered hover align="middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>
                <img src={producto.imagen} alt={producto.nombre} className="admin-thumb" />
              </td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>${producto.precio.toLocaleString('es-CL')}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/productos/editar/${producto.id}`}
                  variant="warning"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => eliminarProducto(producto.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminProductosView