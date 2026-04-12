import { useState, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../context/UserContext"
import { updateUserAPI, uploadAvatarAPI, logoutAPI } from "../api"

export default function Profile() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", mobile: user?.mobileNumber || "", password: "" })
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileInputRef = useRef(null)

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarLoading(true)
    try {
      const fd = new FormData()
      fd.append("avatar", file)
      const res = await uploadAvatarAPI(fd)
      setUser(prev => ({ ...prev, avatar: res.data?.avatar || prev?.avatar }))
      setSuccess("Avatar updated!")
    } catch (err) { setError(err.message || "Failed to upload avatar") }
    finally { setAvatarLoading(false); if (fileInputRef.current) fileInputRef.current.value = "" }
  }

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); setError(""); setSuccess("") }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.mobile || !form.password) return setError("All fields are required")
    setLoading(true); setError("")
    try { const res = await updateUserAPI(form); setSuccess(res.message || "Profile updated"); setEditing(false); setForm(prev => ({ ...prev, password: "" })) }
    catch (err) { setError(err.message) }
    setLoading(false)
  }

  async function handleLogout() {
    try { await logoutAPI() } catch {}
    localStorage.removeItem("vintuna-token"); setUser(null); navigate("/login")
  }

  if (!user) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-on-surface-variant font-label">Please login first</p></div>

  const inputClass = "w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(26,28,27,0.04)] border border-outline-variant/10 overflow-hidden">
          {/* Header gradient */}
          <div className="h-24 bg-velvet-gradient relative">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover shadow-xl border-4 border-surface-container-lowest" />
                ) : (
                  <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-2xl font-headline font-bold shadow-xl border-4 border-surface-container-lowest">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-[20px]">{avatarLoading ? "hourglass_empty" : "photo_camera"}</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
            </div>
          </div>

          <div className="pt-14 pb-8 px-7">
            <h2 className="text-lg font-headline font-bold text-primary text-center">{user.name}</h2>
            <p className="text-sm text-on-surface-variant text-center mb-6 font-label">{user.email}</p>

            {error && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-down font-label">{error}</div>}
            {success && <div className="bg-primary/5 border border-primary/20 text-primary-container text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-down font-label">{success}</div>}

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Name</label>
                  <input type="text" value={form.name} onChange={e => update("name", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone</label>
                  <input type="tel" value={form.mobile} onChange={e => update("mobile", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Enter new password" className={inputClass + " pr-14"} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-xs font-label font-bold cursor-pointer uppercase tracking-widest">{showPassword ? "Hide" : "Show"}</button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-velvet-gradient text-on-primary font-headline font-bold py-3 rounded-full disabled:opacity-50 cursor-pointer uppercase tracking-widest text-sm">{loading ? "Updating..." : "Save Changes"}</button>
                <button type="button" onClick={() => { setEditing(false); setError(""); setSuccess("") }} className="w-full border border-outline-variant/30 text-primary font-headline font-bold py-3 rounded-full hover:bg-surface-container-high cursor-pointer uppercase tracking-widest text-sm">Cancel</button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
                  {[
                    { label: "Phone", value: user.mobileNumber || "Not set" },
                    { label: "Status", value: user.status },
                    { label: "Role", value: user.role },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant font-label">{item.label}</span>
                      <span className="text-primary font-headline font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setEditing(true)} className="w-full bg-velvet-gradient text-on-primary font-headline font-bold py-3 rounded-full cursor-pointer uppercase tracking-widest text-sm shadow-lg">Edit Profile</button>
                <button onClick={handleLogout} className="w-full text-error hover:bg-error/5 font-headline font-bold py-3 rounded-full cursor-pointer uppercase tracking-widest text-sm">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
