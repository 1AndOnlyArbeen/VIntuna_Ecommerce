import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import UserContext from "../context/UserContext"

// Guards user-only store routes (profile, orders, addresses).
// Requires a logged-in user of any role. Waits for the auth check so a
// logged-in user isn't bounced on a page refresh, and preserves the
// intended destination so login can redirect back.
export default function RequireAuth() {
  const { user, loading } = useContext(UserContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
