import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'

function StoragePanel() {
  const [nombreGuardado, setNombreGuardado] = useState('')
  const [usuarioSesion, setUsuarioSesion] = useState('')

  const actualizarDatosStorage = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    if (usuarios.length > 0) {
      const ultimo = usuarios[usuarios.length - 1]
      setNombreGuardado(`${ultimo.nombre} (${ultimo.email})`)
    } else {
      setNombreGuardado('Todavía no hay usuarios registrados')
    }

    const sesion = JSON.parse(sessionStorage.getItem('pasteleria.auth') || 'null')
    if (sesion) {
      setUsuarioSesion(`${sesion.user?.nombre || sesion.user?.email} (${sesion.user?.rol})`)
    } else {
      setUsuarioSesion('No hay sesión activa')
    }
  }

  useEffect(() => {
    actualizarDatosStorage()
  }, [])

  const limpiarStorage = () => {
    sessionStorage.removeItem('pasteleria.auth')
    setNombreGuardado('Todavía no hay usuarios registrados')
    setUsuarioSesion('No hay sesión activa')
    window.location.reload() 
  }

  return (
    <div className="p-4 mb-4 rounded border shadow-sm bg-white" style={{ borderColor: '#FFC0CB' }}>
      <div className="text-muted fw-bold mb-2 small" style={{ color: '#8B4513' }}>
        Componente: StoragePanel
      </div>

      <h4 className="mb-3">Datos almacenados</h4>

      <p className="mb-2">
        <strong>localStorage (Usuarios):</strong> {nombreGuardado}
      </p>

      <p className="mb-3">
        <strong>sessionStorage (Sesión):</strong> {usuarioSesion}
      </p>

      <Button variant="outline-danger" size="sm" onClick={limpiarStorage}>
        Limpiar storage
      </Button>
    </div>
  )
}

export default StoragePanel