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
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await forgetPasswordAPI(email)
      setStep(2)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await verifyForgetPasswordOtpAPI(email, otp)
      setStep(3)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) return setError("Passwords don't match")
    if (newPassword.length < 8) return setError("Password must be at least 8 characters")
    setLoading(true)
    setError("")
    try {
      await resetPasswordAPI(email, newPassword, confirmPassword, otp)
      navigate("/login", { state: { message: "Password reset successful! You can now log in." } })
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
  const btnClass = "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl disabled:opacity-50 transition-colors btn-press cursor-pointer"

  const stepConfig = {
    1: { title: "Forgot password?", desc: "Enter your email and we'll send you an OTP", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    2: { title: "Check your email", desc: `We sent an OTP to ${email}`, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    3: { title: "Set new password", desc: "Choose a strong password for your account", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  }

  const info = stepConfig[step]

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 dark:bg-gray-900 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={info.icon} />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{info.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{info.desc}</p>
        </div>

        {/* step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-green-500 w-8" : "bg-gray-200 dark:bg-gray-700 w-4"
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 sm:p-7">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl mb-4 animate-fade-in-down">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Enter OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" className={inputClass + " text-center tracking-[0.3em] text-lg font-bold"} required />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-medium cursor-pointer transition-colors">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className={inputClass + " pr-14"} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-medium cursor-pointer transition-colors">
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          <Link to="/login" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}
