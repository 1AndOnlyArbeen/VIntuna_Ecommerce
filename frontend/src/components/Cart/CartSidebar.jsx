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
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface z-50 shadow-[0_0_60px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
          <h2 className="text-lg font-headline font-bold text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">shopping_bag</span>
            My Cart
            {cartCount > 0 && (
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                {cartCount}
              </span>
            )}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <img src={emptyCartImg} alt="empty cart" className="w-32 mb-6 opacity-80" />
              <h3 className="text-lg font-headline font-bold text-primary mb-1">Your cart is empty</h3>
              <p className="text-on-surface-variant text-sm mb-6 font-label">Add some items and come back!</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="bg-velvet-gradient text-on-primary font-headline font-bold px-8 py-3 rounded-full hover:opacity-90 cursor-pointer transition-all uppercase tracking-widest text-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-surface-container-low rounded-xl p-4 transition-all hover:bg-surface-container dark:hover:bg-gray-800">
                  <Link to={`/product/${item.id}`} onClick={() => setSidebarOpen(false)}>
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} onClick={() => setSidebarOpen(false)}
                      className="text-sm font-headline font-bold text-primary hover:text-secondary dark:hover:text-green-400 truncate block cursor-pointer transition-colors">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary font-headline">Rs.{item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-on-surface-variant/50 line-through">Rs.{item.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 flex items-center justify-center border border-primary-container text-primary-container rounded-full font-bold hover:bg-primary-container hover:text-on-primary-container text-xs cursor-pointer transition-colors">−</button>
                      <span className="w-5 text-center font-bold text-primary text-xs font-headline">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)} className="w-7 h-7 flex items-center justify-center border border-primary-container text-primary-container rounded-full font-bold hover:bg-primary-container hover:text-on-primary-container text-xs cursor-pointer transition-colors">+</button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-primary text-sm font-headline block">Rs.{item.price * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-on-surface-variant/40 hover:text-error cursor-pointer mt-2 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-outline-variant/10 px-6 py-5 shrink-0 space-y-4">
            <div className="space-y-2 text-sm font-label">
              <div className="flex justify-between text-on-surface-variant">
                <span>Item Total</span><span className="font-medium">Rs.{cartTotal}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-primary-container font-bold" : "font-medium"}>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-secondary font-medium">Add Rs.{200 - cartTotal} more for free delivery!</p>
              )}
              <div className="flex justify-between font-headline font-bold text-primary text-base pt-2 border-t border-outline-variant/10">
                <span>Grand Total</span><span>Rs.{grandTotal}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={clearCart}
                className="px-5 py-3 text-xs font-label font-bold text-error bg-error/5 rounded-full hover:bg-error/10 cursor-pointer transition-colors uppercase tracking-widest">
                Clear
              </button>
              <Link to="/cart" onClick={() => setSidebarOpen(false)}
                className="flex-1 bg-velvet-gradient text-on-primary font-headline font-bold py-3 rounded-full text-sm text-center cursor-pointer transition-all hover:opacity-90 shadow-lg shadow-primary/10 uppercase tracking-widest">
                Checkout — Rs.{grandTotal}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
