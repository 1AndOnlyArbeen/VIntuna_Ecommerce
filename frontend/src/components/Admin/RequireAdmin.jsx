import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import UserContext from "../../context/UserContext"

// Guards the /admin route group. Mirrors the backend verifyAdmin check
// (role === "ADMIN"). Waits for the auth check to finish so a logged-in
// admin isn't bounced on a page refresh.
export default function RequireAdmin() {
  const { user, loading } = useContext(UserContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "ADMIN") return <Navigate to="/" replace />

  return <Outlet />
}
