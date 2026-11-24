import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'pasteleria.cart'

function readStoredCart() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((item) => item?.producto?.id != null && Number.isInteger(item.cantidad) && item.cantidad > 0)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(producto, cantidad = 1) {
    if (!producto?.id) return
    const cantidadValida = Math.min(50, Math.max(1, Math.floor(Number(cantidad) || 1)))
    setItems((actuales) => {
      const existente = actuales.find((item) => item.producto.id === producto.id)
      if (existente) {
        return actuales.map((item) => item.producto.id === producto.id
          ? { producto, cantidad: Math.min(50, item.cantidad + cantidadValida) }
          : item)
      }
      return [...actuales, { producto, cantidad: cantidadValida }]
    })
  }

  function updateQuantity(productoId, cantidad) {
    const cantidadValida = Math.floor(Number(cantidad))
    if (!Number.isFinite(cantidadValida) || cantidadValida < 1 || cantidadValida > 50) return
    setItems((actuales) => actuales.map((item) => item.producto.id === productoId
      ? { ...item, cantidad: cantidadValida }
      : item))
  }

  function removeFromCart(productoId) {
    setItems((actuales) => actuales.filter((item) => item.producto.id !== productoId))
  }

  function clearCart() {
    setItems([])
  }

  const resumen = useMemo(() => ({
    cartCount: items.reduce((total, item) => total + item.cantidad, 0),
    cartTotal: items.reduce((total, item) => total + (Number(item.producto.precio) || 0) * item.cantidad, 0),
  }), [items])

  const value = useMemo(() => ({
    items,
    ...resumen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }), [items, resumen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe utilizarse dentro de CartProvider')
  return context
}
