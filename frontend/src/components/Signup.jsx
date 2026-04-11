import { useState, useContext } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import UserContext from "../context/UserContext"
import { signupAPI } from "../api"

export default function Signup() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", address: "", gender: "", dob: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); setError("") }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword || !form.address || !form.gender || !form.dob) return setError("Please fill all fields")
    if (form.password !== form.confirmPassword) return setError("Passwords don't match")
    if (form.password.length < 6) return setError("Password must be at least 6 characters")
    if (form.phone.length < 10) return setError("Enter a valid phone number")
    setLoading(true); setError("")
    try {
      await signupAPI({ name: form.name, email: form.email, password: form.password })
      navigate("/login", { state: { message: "Account created! Please check your email to verify, then log in." } })
    } catch (err) { setError(err.message || "Signup failed. Try again.") }
    finally { setLoading(false) }
  }

  const inputClass = "w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary-container text-3xl">person_add</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Create your account</h2>
          <p className="text-sm text-on-surface-variant mt-2 font-label">Join VintunaStore and start shopping</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(26,28,27,0.04)] border border-outline-variant/10 p-7">
          {error && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-down font-label">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your full name" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone</label>
              <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+977 98XXXXXXXX" className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min 6 chars" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-xs font-label font-bold cursor-pointer uppercase tracking-widest">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Confirm</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} placeholder="Re-enter" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-xs font-label font-bold cursor-pointer uppercase tracking-widest">{showConfirm ? "Hide" : "Show"}</button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Delivery Address</label>
              <textarea value={form.address} onChange={e => update("address", e.target.value)} placeholder="House no., Street, Area" rows={2} className={inputClass + " resize-none"} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Gender</label>
                <select value={form.gender} onChange={e => update("gender", e.target.value)} className={inputClass} required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} className={inputClass} required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-velvet-gradient text-on-primary font-headline font-bold py-3.5 rounded-full mt-2 disabled:opacity-50 transition-all btn-press cursor-pointer uppercase tracking-widest text-sm shadow-lg">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6 font-label">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary font-headline font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
