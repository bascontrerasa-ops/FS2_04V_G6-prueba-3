import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { CartProvider, useCart } from '../context/CartContext'

const producto = {
  id: 7,
  nombre: 'Pie de Limón',
  categoria: 'Postres',
  precio: 14990,
  imagen: '/pie-limon.jpg',
}

function CartTestConsumer() {
  const { items, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart } = useCart()
  return (
    <div>
      <span>Unidades: {cartCount}</span>
      <span>Total: {cartTotal}</span>
      <span>Lineas: {items.length}</span>
      <button onClick={() => addToCart(producto)}>Agregar</button>
      <button onClick={() => updateQuantity(producto.id, 3)}>Cambiar cantidad</button>
      <button onClick={() => removeFromCart(producto.id)}>Quitar</button>
    </div>
  )
}

describe('CartContext', () => {
  test('permite agregar, modificar y quitar un producto del carrito', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(screen.getByText('Unidades: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 14990')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar cantidad' }))
    expect(screen.getByText('Unidades: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: 44970')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(screen.getByText('Unidades: 0')).toBeInTheDocument()
    expect(screen.getByText('Lineas: 0')).toBeInTheDocument()
  })
})
