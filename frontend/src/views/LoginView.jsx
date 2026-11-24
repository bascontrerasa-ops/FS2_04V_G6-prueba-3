import { useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { saveAuthSession } from '../utils/authSession'

function LoginView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function iniciarSesion(event) {
    event.preventDefault()
    setError('')
    if (!email.includes('@')) {
      setError('Ingresa un correo válido')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      const datos = await authService.login(email, password)
      saveAuthSession(datos)
      if (datos.rol === 'admin') navigate('/admin/productos')
      else navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor')
    }
  }

  return (
    <Container className="py-4 form-container" style={{ maxWidth: '600px' }}>
      <h1 className="mb-4">Iniciar Sesión</h1>


      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Form onSubmit={iniciarSesion}>
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="******"
          />
        </Form.Group>

        <Button type="submit" className="btn-custom w-100 py-2">
          Ingresar
        </Button>
      </Form>
    </Container>
  )
}

export default LoginView