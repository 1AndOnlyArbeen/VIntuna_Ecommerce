import { useState, useContext } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import UserContext from "../context/UserContext"
import { signupAPI } from "../api"

export default function Signup() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    address: "", gender: "", dob: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword || !form.address || !form.gender || !form.dob) {
      setError("Please fill all fields")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (form.phone.length < 10) {
      setError("Enter a valid phone number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { name, email, password } = form
      await signupAPI({ name, email, password })
      navigate("/login", { state: { message: "Account created! Please check your email to verify, then log in." } })
    } catch (err) {
      setError(err.message || "Signup failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-gray-900 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join VintunaStore and start shopping</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 sm:p-7">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl mb-4 animate-fade-in-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your full name" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+977 98XXXXXXXX" className={inputClass} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min 6 chars" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-medium cursor-pointer transition-colors">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} placeholder="Re-enter" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-medium cursor-pointer transition-colors">
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Delivery Address</label>
              <textarea value={form.address} onChange={e => update("address", e.target.value)} placeholder="House no., Street, Area" rows={2} className={inputClass + " resize-none"} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Gender</label>
                <select value={form.gender} onChange={e => update("gender", e.target.value)} className={inputClass} required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} className={inputClass} required />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl mt-1 disabled:opacity-50 transition-colors btn-press cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
