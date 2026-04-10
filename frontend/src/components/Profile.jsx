import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../context/UserContext"
import { updateUserAPI, logoutAPI } from "../api"

export default function Profile() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobileNumber || "",
    password: "",
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError("")
    setSuccess("")
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.mobile || !form.password) {
      return setError("All fields are required")
    }
    setLoading(true)
    setError("")
    try {
      const res = await updateUserAPI(form)
      setSuccess(res.message || "Profile updated successfully")
      setEditing(false)
      setForm(prev => ({ ...prev, password: "" }))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleLogout() {
    try { await logoutAPI() } catch {}
    localStorage.removeItem("vintuna-token")
    setUser(null)
    navigate("/login")
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Please login first</p>
      </div>
    )
  }

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 dark:bg-gray-900 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          {/* header gradient */}
          <div className="h-20 bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-900 dark:to-emerald-900 relative">
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-green-600/30 border-4 border-white dark:border-gray-800">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-12 pb-6 px-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">{user.email}</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl mb-4 animate-fade-in-down">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-2.5 rounded-xl mb-4 animate-fade-in-down">
                {success}
              </div>
            )}

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Name</label>
                  <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Name" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="Email" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
                  <input type="tel" value={form.mobile} onChange={e => update("mobile", e.target.value)} placeholder="Mobile Number" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Enter new password" className={inputClass + " pr-14"} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-medium cursor-pointer transition-colors">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl disabled:opacity-50 transition-colors btn-press cursor-pointer">
                  {loading ? "Updating..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => { setEditing(false); setError(""); setSuccess("") }} className="w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  Cancel
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 space-y-2.5">
                  {[
                    { label: "Phone", value: user.mobileNumber || "Not set" },
                    { label: "Status", value: user.status },
                    { label: "Role", value: user.role },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setEditing(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors btn-press cursor-pointer">
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
