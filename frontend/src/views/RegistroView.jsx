import { useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { authService } from '../services/authService'

function RegistroView() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: ''
  })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  function manejarCambio(event) {
    const { name, value } = event.target
    setFormulario({ ...formulario, [name]: value })
  }

  function validar() {
    const nuevosErrores = {}
    if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres'
    }
    if (!formulario.email.includes('@')) {
      nuevosErrores.email = 'Ingrese un correo electrónico válido'
    }
    if (formulario.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (formulario.password !== formulario.confirmar) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden'
    }
    return nuevosErrores
  }

  async function registrar(event) {
    event.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    setMensaje('')

    if (Object.keys(nuevosErrores).length > 0) return

    try {
      const datos = await authService.register({
        nombre: formulario.nombre,
        email: formulario.email,
        password: formulario.password
      })
      setMensaje(datos.mensaje || 'Usuario registrado exitosamente')
      setFormulario({ nombre: '', email: '', password: '', confirmar: '' })
    } catch (err) {
      setErrores({ email: err.message || 'No se pudo conectar con el servidor' })
    }
  }

  return (
    <Container className="py-4 form-container">
      <h1 className="mb-4">Registro de Usuario</h1>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Form onSubmit={registrar}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            isInvalid={!!errores.nombre}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formulario.email}
            onChange={manejarCambio}
            isInvalid={!!errores.email}
          />
          <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formulario.password}
            onChange={manejarCambio}
            isInvalid={!!errores.password}
          />
          <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="confirmar"
            value={formulario.confirmar}
            onChange={manejarCambio}
            isInvalid={!!errores.confirmar}
          />
          <Form.Control.Feedback type="invalid">{errores.confirmar}</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">Registrarse</Button>
      </Form>
    </Container>
  )
}

export default RegistroView