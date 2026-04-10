import { NavLink, Outlet, Link } from "react-router-dom"
import { useContext, useState, useRef, useEffect } from "react"
import UserContext from "../../context/UserContext"
import DarkToggle from "../DarkToggle"
import logo from "../../assets/logo.png"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "\u{1F4CA}", end: true },
  { to: "/admin/products", label: "Products", icon: "\u{1F4E6}" },
  { to: "/admin/banners", label: "Banners", icon: "\u{1F5BC}\uFE0F" },
  { to: "/admin/featured", label: "Featured", icon: "\u2B50" },
  { to: "/admin/categories", label: "Categories", icon: "\u{1F4C1}" },
  { to: "/admin/discounts", label: "Discounts", icon: "\u{1F3F7}\uFE0F" },
  { to: "/admin/profile", label: "Profile", icon: "\u{1F464}" },
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
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-56 bg-green-800 dark:bg-gray-950 text-white flex flex-col shrink-0 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-green-700 dark:border-gray-800 flex items-center justify-between">
          <Link to="/admin" className="flex flex-col items-center gap-1 flex-1" onClick={() => setSidebarOpen(false)}>
            <img src={logo} alt="VintunaStore" className="h-10 object-contain" />
            <div className="text-[10px] text-green-300 dark:text-gray-500">Admin Panel</div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-green-300 hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-green-700 dark:bg-gray-800 text-yellow-400 font-semibold"
                    : "text-green-100 dark:text-gray-400 hover:bg-green-700/50 dark:hover:bg-gray-800"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-green-700 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-sm text-green-200 dark:text-gray-400 hover:text-yellow-400 cursor-pointer">
            {"\u{1F3EA}"} View Store
          </Link>
        </div>
      </aside>

      {/* main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-400 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="text-xs sm:text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium cursor-pointer hidden sm:flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              View Store
            </Link>
            <DarkToggle />

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1.5 cursor-pointer">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-green-500" />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform hidden sm:block ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-green-500" />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
                          {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name || "Admin"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "admin@example.com"}</p>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400 mt-1 inline-block">{user?.role || "Admin"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link to="/admin/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      {"\u{1F464}"} My Profile
                    </Link>
                    <Link to="/" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      {"\u{1F3EA}"} View Store
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
