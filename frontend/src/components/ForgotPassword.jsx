import { useState, useContext } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import UserContext from "../context/UserContext"
import { forgetPasswordAPI, verifyForgetPasswordOtpAPI, resetPasswordAPI } from "../api"

export default function ForgotPassword() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSendOtp(e) {
    e.preventDefault(); setLoading(true); setError("")
    try { await forgetPasswordAPI(email); setStep(2) } catch (err) { setError(err.message) }
    setLoading(false)
  }

  async function handleVerifyOtp(e) {
    e.preventDefault(); setLoading(true); setError("")
    try { await verifyForgetPasswordOtpAPI(email, otp); setStep(3) } catch (err) { setError(err.message) }
    setLoading(false)
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) return setError("Passwords don't match")
    if (newPassword.length < 8) return setError("Password must be at least 8 characters")
    setLoading(true); setError("")
    try { await resetPasswordAPI(email, newPassword, confirmPassword, otp); navigate("/login", { state: { message: "Password reset successful! You can now log in." } }) }
    catch (err) { setError(err.message) }
    setLoading(false)
  }

  const inputClass = "w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
  const btnClass = "w-full bg-velvet-gradient text-on-primary font-headline font-bold py-3.5 rounded-full disabled:opacity-50 transition-all btn-press cursor-pointer uppercase tracking-widest text-sm shadow-lg"

  const icons = { 1: "mail", 2: "verified_user", 3: "lock" }
  const titles = { 1: "Forgot password?", 2: "Check your email", 3: "Set new password" }
  const descs = { 1: "Enter your email and we'll send you an OTP", 2: `We sent an OTP to ${email}`, 3: "Choose a strong password for your account" }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary-container text-3xl">{icons[step]}</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">{titles[step]}</h2>
          <p className="text-sm text-on-surface-variant mt-2 font-label">{descs[step]}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-primary-container w-8" : "bg-surface-container-high w-4"}`} />
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(26,28,27,0.04)] border border-outline-variant/10 p-7">
          {error && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-down font-label">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>{loading ? "Sending..." : "Send OTP"}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Enter OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" className={inputClass + " text-center tracking-[0.3em] text-lg font-headline font-bold"} required />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>{loading ? "Verifying..." : "Verify OTP"}</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-xs font-label font-bold cursor-pointer uppercase tracking-widest">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-xs font-label font-bold cursor-pointer uppercase tracking-widest">{showConfirm ? "Hide" : "Show"}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className={btnClass}>{loading ? "Resetting..." : "Reset Password"}</button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6 font-label">
          <Link to="/login" className="text-secondary font-headline font-bold hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
