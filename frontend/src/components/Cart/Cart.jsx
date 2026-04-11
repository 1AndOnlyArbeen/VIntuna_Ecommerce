import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import UserContext from "../../context/UserContext"
import emptyCartImg from "../../assets/empty_cart.webp"

const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", icon: "payments", description: "Pay when you receive your order" },
  { id: "esewa", name: "eSewa", icon: null, color: "bg-green-500", letter: "e", description: "Pay via eSewa digital wallet" },
  { id: "khalti", name: "Khalti", icon: null, color: "bg-purple-600", letter: "K", description: "Pay via Khalti digital wallet" },
  { id: "ime", name: "IME Pay", icon: null, color: "bg-red-600", letter: "I", description: "Pay via IME Pay" },
  { id: "connectips", name: "ConnectIPS", icon: null, color: "bg-blue-700", letter: "C", description: "Direct bank transfer via ConnectIPS" },
  { id: "card", name: "Credit / Debit Card", icon: "credit_card", description: "Visa, Mastercard, or other cards" },
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
  const [address, setAddress] = useState({ fullName: "", phone: "", street: "", city: "", landmark: "", label: "home" })
  const [addressErrors, setAddressErrors] = useState({})
  const [orderNumber, setOrderNumber] = useState("")

  const deliveryFee = cartTotal >= 200 ? 0 : 25
  const grandTotal = cartTotal + deliveryFee

  function handleCheckout() {
    if (!user) { setShowLoginPrompt(true); return }
    setAddress(prev => ({ ...prev, fullName: prev.fullName || user.name || "", phone: prev.phone || user.mobileNumber || "" }))
    setStep(1)
    setShowCheckout(true)
  }

  function closeCheckout() { setShowCheckout(false); setStep(1); setSelectedPayment(""); setAddressErrors({}) }

  function validateAddress() {
    const errors = {}
    if (!address.fullName.trim()) errors.fullName = "Name is required"
    if (!address.phone.trim()) errors.phone = "Phone is required"
    if (!address.street.trim()) errors.street = "Address is required"
    if (!address.city.trim()) errors.city = "City is required"
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  function goToStep2() { if (validateAddress()) setStep(2) }
  function goToStep3() { if (selectedPayment) setStep(3) }

  function handlePlaceOrder() {
    const orderId = "VNT-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase()
    setOrderNumber(orderId)
  }

  function handleOrderComplete() { clearCart(); closeCheckout(); setOrderNumber(""); navigate("/") }

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 animate-fade-in">
        <img src={emptyCartImg} alt="empty cart" className="w-36 mb-6 opacity-80" />
        <h2 className="text-2xl font-headline font-extrabold text-primary mb-2">Your cart is empty</h2>
        <p className="text-on-surface-variant text-sm mb-8 font-label">Add some items and come back!</p>
        <Link to="/" className="bg-velvet-gradient text-on-primary font-headline font-bold px-10 py-4 rounded-full hover:opacity-90 cursor-pointer transition-all btn-press uppercase tracking-widest text-sm shadow-lg">
          Start Shopping
        </Link>
      </div>
    )
  }

  const inputClass = "w-full border rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-surface"
  const inputNormal = `${inputClass} border-outline-variant/30`
  const inputError = `${inputClass} border-error dark:border-red-500`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-screen">

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-scale-in">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-primary-container text-5xl mb-3 block">lock</span>
              <h3 className="text-xl font-headline font-bold text-primary">Login Required</h3>
              <p className="text-on-surface-variant text-sm mt-2 font-label">Please login to place your order. Your cart items are saved.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/login")} className="w-full bg-velvet-gradient text-on-primary font-headline font-bold py-3 rounded-full cursor-pointer uppercase tracking-widest text-sm">Login</button>
              <button onClick={() => navigate("/signup")} className="w-full border-2 border-primary text-primary font-headline font-bold py-3 rounded-full hover:bg-primary/5 cursor-pointer uppercase tracking-widest text-sm">Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl relative max-h-[92vh] flex flex-col animate-scale-in border border-outline-variant/10">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 shrink-0">
              <h3 className="text-lg font-headline font-bold text-primary">Checkout</h3>
              <button onClick={closeCheckout} className="text-on-surface-variant hover:text-primary cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Step indicator */}
            {step <= 3 && (
              <div className="px-6 pt-5 pb-3 shrink-0">
                <div className="flex items-center justify-between">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-headline font-bold transition-all ${
                          step > s.id ? "bg-primary-container text-on-primary-container"
                            : step === s.id ? "bg-primary-container text-on-primary-container ring-4 ring-primary/10"
                              : "bg-surface-container-high text-on-surface-variant"
                        }`}>
                          {step > s.id ? <span className="material-symbols-outlined text-[18px]">check</span> : s.id}
                        </div>
                        <span className={`text-[10px] mt-1.5 font-label font-bold uppercase tracking-widest ${
                          step >= s.id ? "text-primary" : "text-on-surface-variant/50"
                        }`}>{s.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-3 mb-5 rounded ${step > s.id ? "bg-primary-container" : "bg-surface-container-high"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {/* Step 1: Address */}
              {step === 1 && (
                <div className="p-6 space-y-4">
                  <h4 className="text-sm font-headline font-bold text-primary uppercase tracking-widest">Delivery Address</h4>
                  <div className="flex gap-2">
                    {["home", "work", "other"].map(label => (
                      <button key={label} type="button" onClick={() => setAddress({ ...address, label })}
                        className={`px-4 py-2 rounded-full text-xs font-label font-bold border transition-all cursor-pointer capitalize uppercase tracking-widest ${
                          address.label === label
                            ? "bg-primary/5 border-primary text-primary"
                            : "border-outline-variant/30 text-on-surface-variant hover:border-primary/30"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Full Name *</label>
                      <input type="text" placeholder="Your full name" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} className={addressErrors.fullName ? inputError : inputNormal} />
                      {addressErrors.fullName && <p className="text-xs text-error mt-1">{addressErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone *</label>
                      <input type="tel" placeholder="+977 98XXXXXXXX" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className={addressErrors.phone ? inputError : inputNormal} />
                      {addressErrors.phone && <p className="text-xs text-error mt-1">{addressErrors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Street Address *</label>
                    <input type="text" placeholder="House no., Street, Area" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className={addressErrors.street ? inputError : inputNormal} />
                    {addressErrors.street && <p className="text-xs text-error mt-1">{addressErrors.street}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">City *</label>
                      <input type="text" placeholder="e.g. Kathmandu" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className={addressErrors.city ? inputError : inputNormal} />
                      {addressErrors.city && <p className="text-xs text-error mt-1">{addressErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Landmark</label>
                      <input type="text" placeholder="Near..." value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} className={inputNormal} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="p-6">
                  <div className="bg-surface-container-low rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-on-surface-variant font-label">Delivering to</span>
                      <button onClick={() => setStep(1)} className="text-secondary text-xs font-headline font-bold cursor-pointer uppercase tracking-widest">Change</button>
                    </div>
                    <p className="text-sm font-headline font-bold text-primary">{address.fullName}</p>
                    <p className="text-xs text-on-surface-variant font-label">{address.street}, {address.city}</p>
                  </div>
                  <h4 className="text-sm font-headline font-bold text-primary mb-4 uppercase tracking-widest">Select Payment</h4>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map(method => (
                      <button key={method.id} onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                          selectedPayment === method.id ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/30"
                        }`}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          {method.icon ? (
                            <span className="material-symbols-outlined text-primary text-2xl">{method.icon}</span>
                          ) : (
                            <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center text-white font-headline font-bold text-lg`}>{method.letter}</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-headline font-bold text-primary">{method.name}</p>
                          <p className="text-xs text-on-surface-variant font-label">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPayment === method.id ? "border-primary" : "border-outline-variant/40"}`}>
                          {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="p-6 space-y-4">
                  <h4 className="text-sm font-headline font-bold text-primary uppercase tracking-widest">Review Your Order</h4>
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">Delivery</span>
                    <p className="text-sm font-headline font-bold text-primary mt-1">{address.fullName}</p>
                    <p className="text-xs text-on-surface-variant font-label">{address.street}, {address.city} | {address.phone}</p>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">Payment</span>
                    <p className="text-sm font-headline font-bold text-primary mt-1">{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</p>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">Items ({cartCount})</span>
                    <div className="mt-2 space-y-2 max-h-36 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <img src={item.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                            <span className="text-on-surface truncate font-label">{item.name}</span>
                            <span className="text-on-surface-variant shrink-0 text-xs">x{item.quantity}</span>
                          </div>
                          <span className="text-primary font-headline font-bold shrink-0 ml-2">Rs.{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-outline-variant/10 space-y-1 text-sm font-label">
                      <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span>Rs.{cartTotal}</span></div>
                      <div className="flex justify-between text-on-surface-variant"><span>Delivery</span><span className={deliveryFee === 0 ? "text-primary-container font-bold" : ""}>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span></div>
                      <div className="flex justify-between font-headline font-bold text-primary text-base pt-2"><span>Total</span><span>Rs.{grandTotal}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="p-8 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-secondary-container/20 blur-3xl rounded-full scale-150" />
                    <div className="relative w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center mx-auto shadow-lg">
                      <span className="material-symbols-outlined text-on-secondary-container !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-headline font-extrabold text-primary mb-3 tracking-tight">Order Placed!</h3>
                  <div className="bg-surface-container-low rounded-xl p-4 mb-4 inline-block">
                    <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Order Number</p>
                    <p className="text-lg font-headline font-bold text-primary tracking-wider">{orderNumber}</p>
                  </div>
                  <p className="text-on-surface-variant text-sm font-label mb-1">Total: <span className="font-bold text-primary">Rs.{grandTotal}</span></p>
                  <p className="text-on-surface-variant text-sm font-label mb-8">Payment: {PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</p>
                  <button onClick={handleOrderComplete} className="w-full bg-velvet-gradient text-on-primary py-4 rounded-full font-headline font-bold cursor-pointer uppercase tracking-widest text-sm shadow-lg">Continue Shopping</button>
                  <Link to="/orders" className="block mt-4 text-sm text-secondary font-headline font-bold hover:underline cursor-pointer uppercase tracking-widest">View Orders</Link>
                </div>
              )}
            </div>

            {/* Bottom actions */}
            {step <= 3 && (
              <div className="p-6 border-t border-outline-variant/10 shrink-0">
                <div className="flex gap-3">
                  {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-outline-variant/30 text-primary font-headline font-bold rounded-full text-sm hover:bg-surface-container-high cursor-pointer uppercase tracking-widest">Back</button>
                  )}
                  {step === 1 && <button onClick={goToStep2} className="flex-1 bg-velvet-gradient text-on-primary font-headline font-bold py-3 rounded-full text-sm cursor-pointer uppercase tracking-widest">Continue</button>}
                  {step === 2 && <button onClick={goToStep3} disabled={!selectedPayment} className="flex-1 bg-velvet-gradient disabled:bg-surface-container-high disabled:text-on-surface-variant text-on-primary font-headline font-bold py-3 rounded-full text-sm cursor-pointer disabled:cursor-not-allowed uppercase tracking-widest">{selectedPayment ? "Review Order" : "Select Payment"}</button>}
                  {step === 3 && <button onClick={() => { handlePlaceOrder(); setStep(4) }} className="flex-1 bg-velvet-gradient text-on-primary font-headline font-bold py-4 rounded-full text-base cursor-pointer uppercase tracking-widest shadow-lg">Place Order — Rs.{grandTotal}</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart page */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-down">
        <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-primary tracking-tight">
          My Cart <span className="text-on-surface-variant font-normal text-lg">({cartCount})</span>
        </h1>
        <button onClick={clearCart} className="text-error text-xs font-label font-bold cursor-pointer transition-colors btn-press bg-error/5 px-4 py-2 rounded-full hover:bg-error/10 uppercase tracking-widest">Clear</button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-outline-variant/10 overflow-hidden">
        {cart.map((item, i) => (
          <div key={item.id} className={`flex items-center gap-4 p-5 ${i !== cart.length - 1 ? "border-b border-outline-variant/10" : ""}`}>
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.id}`} className="text-sm font-headline font-bold text-primary hover:text-secondary truncate block cursor-pointer transition-colors">{item.name}</Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-primary font-headline">Rs.{item.price}</span>
                {item.originalPrice > item.price && <span className="text-xs text-on-surface-variant/40 line-through">Rs.{item.originalPrice}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => decreaseQty(item.id)} className="w-8 h-8 flex items-center justify-center border border-primary-container text-primary-container rounded-full font-bold hover:bg-primary-container hover:text-on-primary-container text-sm cursor-pointer transition-colors">−</button>
              <span className="w-6 text-center font-headline font-bold text-primary text-sm">{item.quantity}</span>
              <button onClick={() => increaseQty(item.id)} className="w-8 h-8 flex items-center justify-center border border-primary-container text-primary-container rounded-full font-bold hover:bg-primary-container hover:text-on-primary-container text-sm cursor-pointer transition-colors">+</button>
            </div>
            <span className="font-headline font-bold text-primary text-sm min-w-[60px] text-right">Rs.{item.price * item.quantity}</span>
            <button onClick={() => removeFromCart(item.id)} className="text-on-surface-variant/40 hover:text-error cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        ))}
      </div>

      {/* Bill */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-outline-variant/10 mt-4 p-6">
        <h3 className="font-headline font-bold text-primary mb-4 text-sm uppercase tracking-widest">Bill Details</h3>
        <div className="space-y-3 text-sm font-label">
          <div className="flex justify-between text-on-surface-variant"><span>Item Total</span><span>Rs.{cartTotal}</span></div>
          <div className="flex justify-between text-on-surface-variant"><span>Delivery Fee</span><span className={deliveryFee === 0 ? "text-primary-container font-bold" : ""}>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span></div>
          <div className="border-t border-outline-variant/10 pt-3 flex justify-between font-headline font-bold text-primary text-lg"><span>Grand Total</span><span>Rs.{grandTotal}</span></div>
          {deliveryFee > 0 && <p className="text-xs text-secondary font-medium">Add Rs.{200 - cartTotal} more for free delivery!</p>}
        </div>
      </div>

      <button onClick={handleCheckout} className="w-full mt-6 bg-velvet-gradient text-on-primary font-headline font-bold py-4 rounded-full text-lg shadow-xl shadow-primary/10 cursor-pointer transition-all btn-press uppercase tracking-widest">
        Checkout — Rs.{grandTotal}
      </button>
    </div>
  )
}
