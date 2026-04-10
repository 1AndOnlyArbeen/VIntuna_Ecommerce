import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import UserContext from "../../context/UserContext"
import emptyCartImg from "../../assets/empty_cart.webp"

const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", icon: "\u{1F4B5}", description: "Pay when you receive your order" },
  { id: "esewa", name: "eSewa", icon: null, color: "bg-green-500", letter: "e", description: "Pay via eSewa digital wallet" },
  { id: "khalti", name: "Khalti", icon: null, color: "bg-purple-600", letter: "K", description: "Pay via Khalti digital wallet" },
  { id: "ime", name: "IME Pay", icon: null, color: "bg-red-600", letter: "I", description: "Pay via IME Pay" },
  { id: "connectips", name: "ConnectIPS", icon: null, color: "bg-blue-700", letter: "C", description: "Direct bank transfer via ConnectIPS" },
  { id: "card", name: "Credit / Debit Card", icon: "\u{1F4B3}", description: "Visa, Mastercard, or other cards" },
]

const STEPS = [
  { id: 1, label: "Address" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Confirmation" },
]

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart, cartTotal, cartCount } = useCart()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", landmark: "", label: "home",
  })
  const [addressErrors, setAddressErrors] = useState({})
  const [orderNumber, setOrderNumber] = useState("")

  const deliveryFee = cartTotal >= 200 ? 0 : 25
  const grandTotal = cartTotal + deliveryFee

  function handleCheckout() {
    if (!user) { setShowLoginPrompt(true); return }
    // pre-fill from user data
    setAddress(prev => ({
      ...prev,
      fullName: prev.fullName || user.name || "",
      phone: prev.phone || user.mobileNumber || "",
    }))
    setStep(1)
    setShowCheckout(true)
  }

  function closeCheckout() {
    setShowCheckout(false)
    setStep(1)
    setSelectedPayment("")
    setAddressErrors({})
  }

  function validateAddress() {
    const errors = {}
    if (!address.fullName.trim()) errors.fullName = "Name is required"
    if (!address.phone.trim()) errors.phone = "Phone is required"
    if (!address.street.trim()) errors.street = "Address is required"
    if (!address.city.trim()) errors.city = "City is required"
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  function goToStep2() {
    if (validateAddress()) setStep(2)
  }

  function goToStep3() {
    if (!selectedPayment) return
    setStep(3)
  }

  function handlePlaceOrder() {
    // TODO: POST /api/orders with cart, address, payment
    const orderId = "VNT-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase()
    setOrderNumber(orderId)
  }

  function handleOrderComplete() {
    clearCart()
    closeCheckout()
    setOrderNumber("")
    navigate("/")
  }

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900 animate-fade-in">
        <img src={emptyCartImg} alt="empty cart" className="w-40 mb-5 opacity-80" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Add some items and come back!</p>
        <Link to="/" className="bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 cursor-pointer transition-colors btn-press">
          Start Shopping
        </Link>
      </div>
    )
  }

  const inputClass = "w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
  const inputNormal = `${inputClass} border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white`
  const inputError = `${inputClass} border-red-400 dark:border-red-500 dark:bg-gray-700/50 dark:text-white`

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 dark:bg-gray-900 min-h-screen">

      {/* ========== LOGIN PROMPT ========== */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-scale-in">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Login Required</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Please login to place your order. Your cart items are saved.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/login")} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg cursor-pointer">Login</button>
              <button onClick={() => navigate("/signup")} className="w-full border-2 border-green-600 text-green-600 dark:text-green-400 font-bold py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer">Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== CHECKOUT MODAL (Multi-step) ========== */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl relative max-h-[92vh] flex flex-col animate-scale-in">

            {/* Header with close */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Checkout</h3>
              <button onClick={closeCheckout} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Step indicator */}
            {step <= 3 && (
              <div className="px-5 pt-4 pb-2 shrink-0">
                <div className="flex items-center justify-between">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          step > s.id
                            ? "bg-green-600 text-white"
                            : step === s.id
                              ? "bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-900/40"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                        }`}>
                          {step > s.id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : s.id}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium ${
                          step >= s.id ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
                        }`}>{s.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-4 rounded ${
                          step > s.id ? "bg-green-500" : "bg-gray-200 dark:bg-gray-600"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">

              {/* ---- STEP 1: Address ---- */}
              {step === 1 && (
                <div className="p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Delivery Address</h4>

                  {/* Address type */}
                  <div className="flex gap-2">
                    {["home", "work", "other"].map(label => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setAddress({ ...address, label })}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer capitalize ${
                          address.label === label
                            ? "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400"
                            : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {label === "home" ? "\u{1F3E0}" : label === "work" ? "\u{1F3E2}" : "\u{1F4CD}"} {label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name *</label>
                      <input
                        type="text" placeholder="Your full name"
                        value={address.fullName}
                        onChange={e => setAddress({ ...address, fullName: e.target.value })}
                        className={addressErrors.fullName ? inputError : inputNormal}
                      />
                      {addressErrors.fullName && <p className="text-xs text-red-500 mt-0.5">{addressErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number *</label>
                      <input
                        type="tel" placeholder="+977 98XXXXXXXX"
                        value={address.phone}
                        onChange={e => setAddress({ ...address, phone: e.target.value })}
                        className={addressErrors.phone ? inputError : inputNormal}
                      />
                      {addressErrors.phone && <p className="text-xs text-red-500 mt-0.5">{addressErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Street Address *</label>
                    <input
                      type="text" placeholder="House no., Street, Area"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      className={addressErrors.street ? inputError : inputNormal}
                    />
                    {addressErrors.street && <p className="text-xs text-red-500 mt-0.5">{addressErrors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">City *</label>
                      <input
                        type="text" placeholder="e.g. Kathmandu"
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        className={addressErrors.city ? inputError : inputNormal}
                      />
                      {addressErrors.city && <p className="text-xs text-red-500 mt-0.5">{addressErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Landmark (optional)</label>
                      <input
                        type="text" placeholder="Near..."
                        value={address.landmark}
                        onChange={e => setAddress({ ...address, landmark: e.target.value })}
                        className={inputNormal}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---- STEP 2: Payment ---- */}
              {step === 2 && (
                <div className="p-5">
                  {/* Mini order summary */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Delivering to</span>
                      <button onClick={() => setStep(1)} className="text-green-600 text-xs font-medium cursor-pointer">Change</button>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{address.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{address.street}, {address.city}{address.landmark ? ` (${address.landmark})` : ""}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{address.phone}</p>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Payment Method</h4>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${
                          selectedPayment === method.id
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                          {method.icon ? (
                            <span className="text-2xl">{method.icon}</span>
                          ) : (
                            <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                              {method.letter}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{method.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedPayment === method.id ? "border-green-500" : "border-gray-300 dark:border-gray-600"
                        }`}>
                          {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---- STEP 3: Confirmation ---- */}
              {step === 3 && (
                <div className="p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Review Your Order</h4>

                  {/* Address card */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivery Address</span>
                      <button onClick={() => setStep(1)} className="text-green-600 text-xs font-medium cursor-pointer">Edit</button>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{address.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{address.street}, {address.city}</p>
                    {address.landmark && <p className="text-xs text-gray-500 dark:text-gray-400">Landmark: {address.landmark}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">{address.phone}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">{address.label}</span>
                  </div>

                  {/* Payment card */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</span>
                      <button onClick={() => setStep(2)} className="text-green-600 text-xs font-medium cursor-pointer">Change</button>
                    </div>
                    {(() => {
                      const m = PAYMENT_METHODS.find(p => p.id === selectedPayment)
                      if (!m) return null
                      return (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                            {m.icon ? <span className="text-xl">{m.icon}</span> : (
                              <div className={`w-8 h-8 ${m.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>{m.letter}</div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.name}</span>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Order items */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Items ({cartCount})</span>
                    <div className="mt-2 space-y-2 max-h-36 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <img src={item.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                            <span className="text-gray-400 shrink-0">x{item.quantity}</span>
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 font-medium shrink-0 ml-2">Rs.{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1 text-sm">
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Subtotal</span><span>Rs.{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Delivery</span>
                        <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1">
                        <span>Total</span><span>Rs.{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- STEP 4: Success ---- */}
              {step === 4 && (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Order Placed!</h3>
                  <div className="inline-block bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Order Number</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400 tracking-wider">{orderNumber}</p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    Total: <span className="font-semibold text-gray-700 dark:text-gray-300">Rs.{grandTotal}</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    Payment: <span className="font-medium text-gray-700 dark:text-gray-300">{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Delivering to: <span className="font-medium text-gray-700 dark:text-gray-300">{address.street}, {address.city}</span>
                  </p>
                  <button onClick={handleOrderComplete} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl cursor-pointer">
                    Continue Shopping
                  </button>
                  <Link to="/orders" className="block mt-3 text-sm text-green-600 dark:text-green-400 font-medium hover:underline cursor-pointer">
                    View My Orders
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom actions (steps 1-3) */}
            {step <= 3 && (
              <div className="p-5 border-t border-gray-100 dark:border-gray-700 shrink-0">
                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {step === 1 && (
                    <button
                      onClick={goToStep2}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm cursor-pointer"
                    >
                      Continue to Payment
                    </button>
                  )}
                  {step === 2 && (
                    <button
                      onClick={goToStep3}
                      disabled={!selectedPayment}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm cursor-pointer"
                    >
                      {selectedPayment ? "Review Order" : "Select a payment method"}
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      onClick={() => { handlePlaceOrder(); setStep(4) }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-lg cursor-pointer"
                    >
                      Place Order - Rs.{grandTotal}
                    </button>
                  )}
                </div>
                {step === 3 && (
                  <p className="text-xs text-gray-400 text-center mt-2">By placing this order, you agree to our terms & conditions</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== CART PAGE ========== */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-down">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">My Cart <span className="text-gray-400 dark:text-gray-500 font-normal text-base">({cartCount})</span></h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-xs font-medium cursor-pointer transition-colors btn-press bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">Clear Cart</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        {cart.map((item, i) => (
          <div key={item.id} className={`flex items-center gap-4 p-4 ${i !== cart.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}>
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 truncate block cursor-pointer">
                {item.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Rs.{item.price}</span>
                {item.originalPrice > item.price && <span className="text-xs text-gray-400 line-through">Rs.{item.originalPrice}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 flex items-center justify-center border-2 border-green-600 text-green-600 rounded-lg font-bold hover:bg-green-600 hover:text-white text-sm cursor-pointer">−</button>
              <span className="w-6 text-center font-bold text-gray-800 dark:text-white text-sm">{item.quantity}</span>
              <button onClick={() => increaseQty(item.id)} className="w-7 h-7 flex items-center justify-center border-2 border-green-600 text-green-600 rounded-lg font-bold hover:bg-green-600 hover:text-white text-sm cursor-pointer">+</button>
            </div>
            <div className="text-right min-w-[60px]">
              <span className="font-bold text-gray-900 dark:text-white text-sm">Rs.{item.price * item.quantity}</span>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* bill */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 mt-4 p-5">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-sm">Bill Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Item Total</span><span>Rs.{cartTotal}</span></div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? "text-green-600" : ""}>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
          </div>
          <hr className="dark:border-gray-700" />
          <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base"><span>Grand Total</span><span>Rs.{grandTotal}</span></div>
          {deliveryFee > 0 && <p className="text-xs text-green-600">Add Rs.{200 - cartTotal} more for free delivery!</p>}
        </div>
      </div>

      <button onClick={handleCheckout} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg shadow-green-600/20 cursor-pointer transition-all btn-press">
        Checkout — Rs.{grandTotal}
      </button>
    </div>
  )
}
