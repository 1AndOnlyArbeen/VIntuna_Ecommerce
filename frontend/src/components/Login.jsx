import { useState, useContext } from "react"
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom"
import UserContext from "../context/UserContext"
import { loginAPI } from "../api"

export default function Login() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError("")
    try {
      const res = await loginAPI(email, password)
      localStorage.setItem("vintuna-token", res.data.accessToken)
      setUser(res.data.user)
      navigate("/")
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary-container text-3xl">person</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Welcome back</h2>
          <p className="text-sm text-on-surface-variant mt-2 font-label">Sign in to your VintunaStore account</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(26,28,27,0.04)] border border-outline-variant/10 p-7">
          {successMessage && (
            <div className="bg-primary/5 border border-primary/20 text-primary-container text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-down font-label">{successMessage}</div>
          )}
          {error && (
            <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-down font-label">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  className="w-full border border-outline-variant/30 rounded-xl px-4 py-3 pr-16 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-xs font-label font-bold cursor-pointer transition-colors uppercase tracking-widest">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-secondary font-label font-bold hover:underline uppercase tracking-widest">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-velvet-gradient text-on-primary font-headline font-bold py-3.5 rounded-full disabled:opacity-50 transition-all btn-press cursor-pointer uppercase tracking-widest text-sm shadow-lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6 font-label">
          Don't have an account?{" "}
          <Link to="/signup" className="text-secondary font-headline font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
