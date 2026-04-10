import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { logoutAPI } from "../../api"

export default function AdminProfile() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutAPI()
    } catch {
      // even if API fails, clear local state
    }
    localStorage.removeItem("vintuna-token")
    setUser(null)
    navigate("/login")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Not logged in</p>
      </div>
    )
  }

  const details = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Mobile", value: user.mobileNumber || "Not set" },
    { label: "Role", value: user.role },
    { label: "Status", value: user.status },
    { label: "Email Verified", value: user.verify_email ? "Yes" : "No" },
    { label: "Joined", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A" },
    { label: "Last Updated", value: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 max-w-lg">

        {/* avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-green-500 shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400 mt-1 inline-block">
              {user.role}
            </span>
          </div>
        </div>

        {/* details */}
        <div className="space-y-3">
          {details.map(item => (
            <div key={item.label} className="flex justify-between text-sm border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium py-2.5 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
