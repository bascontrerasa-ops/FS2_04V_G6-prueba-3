import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'

function AdminAgregarProductoView() {
  const navigate = useNavigate()
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    descripcion: '',
    imagen: ''
  })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [errorServidor, setErrorServidor] = useState('')

  function manejarCambio(event) {
    const { name, value } = event.target
    setProducto({ ...producto, [name]: value })
  }

  function esUrlValida(valor) {
    try {
      new URL(valor)
      return true
    } catch {
      return false
    }
  }

  function validar() {
    const nuevosErrores = {}
    if (producto.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre es demasiado corto'
    }
    if (producto.precio === '' || Number(producto.precio) <= 0) {
      nuevosErrores.precio = 'El precio debe ser un monto mayor a 0'
    }
    if (producto.categoria.trim() === '') {
      nuevosErrores.categoria = 'Ingrese una categoría'
    }
    if (producto.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres'
    }
    if (!esUrlValida(producto.imagen)) {
      nuevosErrores.imagen = 'Ingrese una URL válida (http:// o https://)'
    }
    return nuevosErrores
  }

  async function guardarProducto(event) {
    event.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    setMensaje('')
    setErrorServidor('')

    if (Object.keys(nuevosErrores).length > 0) return

    try {
      await productService.create({ ...producto, precio: Number(producto.precio) })
      setMensaje('Producto guardado correctamente en la base de datos')
      setTimeout(() => navigate('/admin/productos'), 800)
    } catch (error) {
      setErrorServidor('No se pudo conectar con el servidor')
    }
  }

  return (
    <>
      <h1 className="mb-4">Agregar Nuevo Producto</h1>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}
      <Form onSubmit={guardarProducto}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={producto.nombre}
            onChange={manejarCambio}
            isInvalid={!!errores.nombre}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio ($)</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={producto.precio}
            onChange={manejarCambio}
            isInvalid={!!errores.precio}
          />
          <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            name="categoria"
            value={producto.categoria}
            onChange={manejarCambio}
            isInvalid={!!errores.categoria}
          />
          <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={producto.descripcion}
            onChange={manejarCambio}
            isInvalid={!!errores.descripcion}
          />
          <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>URL de la imagen</Form.Label>
          <Form.Control
            name="imagen"
            value={producto.imagen}
            onChange={manejarCambio}
            placeholder="https://..."
            isInvalid={!!errores.imagen}
          />
          <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">Guardar Producto</Button>
      </Form>
    </>
  )
}

export default AdminAgregarProductoView