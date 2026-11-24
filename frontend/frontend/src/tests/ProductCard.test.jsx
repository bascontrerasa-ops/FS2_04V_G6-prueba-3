import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
import ProductCard from '../components/ProductCard'
import { CartProvider } from '../context/CartContext'

describe('ProductCard Component', () => {
  const productoPrueba = {
    id: 1,
    nombre: 'Torta Selva Negra',
    categoria: 'Tortas Tradicionales',
    precio: 22990,
    imagen: 'https://picsum.photos/200'
  }

  test('muestra correctamente los datos del producto pasados por props', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard producto={productoPrueba} />
        </CartProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Torta Selva Negra')).toBeInTheDocument()
    expect(screen.getByText('Tortas Tradicionales')).toBeInTheDocument()
    expect(screen.getByText('$22.990')).toBeInTheDocument()
  })

  test('contiene el botón/enlace hacia el detalle del producto', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard producto={productoPrueba} />
        </CartProvider>
      </BrowserRouter>
    )

    const enlaceDetalle = screen.getByRole('link', { name: /ver detalle/i })
    expect(enlaceDetalle).toBeInTheDocument()
    expect(enlaceDetalle.getAttribute('href')).toBe('/producto/1')
  })
})