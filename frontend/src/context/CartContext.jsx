import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

// load cart from localStorage on startup
function loadCart() {
  try {
    const saved = localStorage.getItem("vintuna-cart")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("vintuna-cart", JSON.stringify(cart))
  }, [cart])

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  function increaseQty(productId) {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function decreaseQty(productId) {
    setCart(prev =>
      prev
        .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0)
    )
  }

  function clearCart() {
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function getItemQty(productId) {
    const item = cart.find(i => i.id === productId)
    return item ? item.quantity : 0
  }

  // get the raw cart array for sending to backend after login
  // usage: after login, call POST /api/cart/merge with getCartForMerge()
  function getCartForMerge() {
    return cart.map(item => ({ productId: item.id, quantity: item.quantity }))
  }

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, increaseQty, decreaseQty,
      clearCart, cartCount, cartTotal, getItemQty, getCartForMerge,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </CartContext.Provider>
  )
}
