import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Spinner, Table } from 'react-bootstrap'
import { adminService } from '../../services/adminService'

function AdminUsuariosView() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarUsuarios = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const datos = await adminService.listUsers()
      setUsuarios(datos)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los usuarios.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  async function eliminarUsuario(usuario) {
    const confirmar = window.confirm(`¿Estás seguro de eliminar la cuenta de ${usuario.nombre} (${usuario.email})? Esta acción no se puede deshacer.`)
    if (!confirmar) return

    setMensaje('')
    setError('')
    try {
      await adminService.removeUser(usuario.id)
      setUsuarios((actuales) => actuales.filter((item) => item.id !== usuario.id))
      setMensaje(`La cuenta de ${usuario.nombre} fue eliminada.`)
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el usuario.')
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="mb-1">Gestión de usuarios</h1>
          <p className="text-muted mb-0">Administra las cuentas de clientes registradas.</p>
        </div>
        <Button variant="outline-secondary" onClick={cargarUsuarios} disabled={cargando}>Actualizar lista</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}

      {cargando ? (
        <div className="text-center py-5"><Spinner animation="border" role="status" /><span className="visually-hidden">Cargando usuarios...</span></div>
      ) : usuarios.length === 0 ? (
        <Alert variant="info">Todavía no hay cuentas de clientes registradas.</Alert>
      ) : (
        <Table responsive bordered hover className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td><span className="badge bg-secondary">{usuario.rol}</span></td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => eliminarUsuario(usuario)}>
                    Eliminar cuenta
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <p className="small text-muted mt-3">Por seguridad, esta sección muestra y permite eliminar cuentas de clientes. Las cuentas de administrador están protegidas.</p>
    </>
  )
}

export default AdminUsuariosView
