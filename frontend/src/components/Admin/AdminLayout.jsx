import { NavLink, Outlet, Link } from "react-router-dom"
import { useContext, useState, useRef, useEffect } from "react"
import UserContext from "../../context/UserContext"
import DarkToggle from "../DarkToggle"
import logo from "../../assets/logo.png"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/products", label: "Products", icon: "inventory_2" },
  { to: "/admin/banners", label: "Banners", icon: "image" },
  { to: "/admin/featured", label: "Featured", icon: "star" },
  { to: "/admin/categories", label: "Categories", icon: "category" },
  { to: "/admin/discounts", label: "Discounts", icon: "sell" },
  { to: "/admin/profile", label: "Profile", icon: "person" },
]

export default function AdminLayout() {
  const { user } = useContext(UserContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen flex bg-surface">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-56 bg-primary-container text-on-primary-container flex flex-col shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex flex-col items-center gap-1 flex-1" onClick={() => setSidebarOpen(false)}>
            <img src={logo} alt="VintunaStore" className="h-10 object-contain brightness-200" />
            <div className="text-[10px] text-on-primary-container/50 font-label uppercase tracking-widest">Admin Panel</div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-on-primary-container/60 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-label rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-gold font-bold"
                    : "text-on-primary-container/70 hover:bg-white/5 hover:text-on-primary-container"
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-sm text-on-primary-container/60 hover:text-gold font-label cursor-pointer px-3 py-2">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            View Store
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-[#ededeb]/80 dark:bg-[#151a27]/80 backdrop-blur-2xl backdrop-saturate-150 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 border-b border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.1),0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-on-surface/60 cursor-pointer">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="text-xs text-primary hover:text-secondary font-label font-bold cursor-pointer hidden sm:flex items-center gap-1 uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              Store
            </Link>
            <DarkToggle />

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1.5 cursor-pointer">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container" />
                ) : (
                  <div className="w-8 h-8 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-xl border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-dropdown">
                  <div className="p-4 border-b border-outline-variant/15">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-base font-bold shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-headline font-bold text-on-surface truncate">{user?.name || "Admin"}</p>
                        <p className="text-xs text-on-surface/50 font-label truncate">{user?.email || "admin@example.com"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link to="/admin/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface/70 hover:bg-surface-container-high/50 font-label cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">person</span> My Profile
                    </Link>
                    <Link to="/" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface/70 hover:bg-surface-container-high/50 font-label cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">storefront</span> View Store
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Full-page transparent logo watermark */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center" style={{ left: "14rem" }}>
            <img src={logo} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.03] select-none" />
          </div>
          <div className="relative z-10 p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
