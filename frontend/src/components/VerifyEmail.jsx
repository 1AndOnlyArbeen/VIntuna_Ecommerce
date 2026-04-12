import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { verifyEmailAPI } from "../api"

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get("code")
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!code) { setError("Invalid verification link"); setLoading(false); return }

    async function verify() {
      try {
        await verifyEmailAPI(code)
        setSuccess(true)
      } catch (err) {
        setError(err.message || "Verification failed")
      } finally { setLoading(false) }
    }
    verify()
  }, [code])

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-primary/5">
          <span className="material-symbols-outlined text-primary-container text-3xl">
            {loading ? "hourglass_empty" : success ? "verified" : "error"}
          </span>
        </div>

        {loading && (
          <>
            <h2 className="text-2xl font-headline font-extrabold text-primary mb-2">Verifying...</h2>
            <p className="text-sm text-on-surface-variant font-label">Please wait while we verify your email.</p>
          </>
        )}

        {success && (
          <>
            <h2 className="text-2xl font-headline font-extrabold text-primary mb-2">Email Verified!</h2>
            <p className="text-sm text-on-surface-variant font-label mb-6">Your email has been verified successfully. You can now log in.</p>
            <Link to="/login" className="bg-velvet-gradient text-on-primary font-headline font-bold px-8 py-3 rounded-full cursor-pointer uppercase tracking-widest text-sm shadow-lg inline-block">
              Go to Login
            </Link>
          </>
        )}

        {!loading && error && (
          <>
            <h2 className="text-2xl font-headline font-extrabold text-error mb-2">Verification Failed</h2>
            <p className="text-sm text-on-surface-variant font-label mb-6">{error}</p>
            <Link to="/login" className="text-secondary font-headline font-bold hover:underline cursor-pointer uppercase tracking-widest text-sm">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
