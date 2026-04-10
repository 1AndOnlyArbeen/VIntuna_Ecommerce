import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import emptyCartImg from "../../assets/empty_cart.webp"

export default function CartSidebar() {
  const {
    cart, removeFromCart, increaseQty, decreaseQty,
    clearCart, cartTotal, cartCount,
    sidebarOpen, setSidebarOpen,
  } = useCart()

  // lock body scroll when open
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

  const deliveryFee = cartTotal >= 200 ? 0 : 25
  const grandTotal = cartTotal + deliveryFee

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            My Cart
            {cartCount > 0 && (
              <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <img src={emptyCartImg} alt="empty cart" className="w-32 mb-4 opacity-80" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Your cart is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Add some items and come back!</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 cursor-pointer transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                  <Link to={`/product/${item.id}`} onClick={() => setSidebarOpen(false)}>
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 truncate block cursor-pointer"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Rs.{item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">Rs.{item.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => decreaseQty(item.id)} className="w-6 h-6 flex items-center justify-center border border-green-600 text-green-600 rounded-md font-bold hover:bg-green-600 hover:text-white text-xs cursor-pointer transition-colors">-</button>
                      <span className="w-5 text-center font-bold text-gray-800 dark:text-white text-xs">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)} className="w-6 h-6 flex items-center justify-center border border-green-600 text-green-600 rounded-md font-bold hover:bg-green-600 hover:text-white text-xs cursor-pointer transition-colors">+</button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-gray-900 dark:text-white text-sm block">Rs.{item.price * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 cursor-pointer mt-1 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals & actions */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 shrink-0 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Item Total</span><span>Rs.{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-green-600">Add Rs.{200 - cartTotal} more for free delivery!</p>
              )}
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1 border-t border-gray-100 dark:border-gray-800">
                <span>Grand Total</span><span>Rs.{grandTotal}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-4 py-2.5 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer transition-colors"
              >
                Clear
              </button>
              <Link
                to="/cart"
                onClick={() => setSidebarOpen(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm text-center cursor-pointer transition-colors shadow-lg shadow-green-600/20"
              >
                Checkout — Rs.{grandTotal}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
