import { useState, useContext, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import UserContext from "../../context/UserContext"
import { logoutAPI } from "../../api"
import DarkToggle from "../DarkToggle"
import logo from "../../assets/logo.png"

export default function Header() {
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const navigate = useNavigate()
  const { cartCount, setSidebarOpen } = useCart()
  const { user, setUser } = useContext(UserContext)
  const dropdownRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const prevCartCount = useRef(cartCount)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (showMobileSearch && mobileSearchRef.current) mobileSearchRef.current.focus()
  }, [showMobileSearch])

  useEffect(() => {
    if (cartCount !== prevCartCount.current && cartCount > 0) {
      setCartBounce(true)
      const t = setTimeout(() => setCartBounce(false), 300)
      return () => clearTimeout(t)
    }
    prevCartCount.current = cartCount
  }, [cartCount])

  function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/search?q=${encodeURIComponent(search)}`)
    setSearch("")
    setShowMobileSearch(false)
  }

  async function handleLogout() {
    try { await logoutAPI() } catch {}
    localStorage.removeItem("vintuna-token")
    setUser(null)
    setShowDropdown(false)
    navigate("/login")
  }

  return (
    <header className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_1px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.4)] border-b border-gray-200/40 dark:border-gray-800/50 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">

        {/* logo */}
        <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <img src={logo} alt="VintunaStore" className="h-8 sm:h-12 object-contain" />
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
          <div className="flex bg-gray-100/80 dark:bg-gray-800 rounded-xl overflow-hidden ring-1 ring-gray-200/60 dark:ring-gray-700">
            <div className="pl-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search "dal, momo, milk..."'
              className="flex-1 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none min-w-0 placeholder:text-gray-400"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 text-sm cursor-pointer shrink-0 transition-all btn-press">
              Search
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="sm:hidden w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <DarkToggle />

          {/* User avatar / Login */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1.5 cursor-pointer group">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-green-500 group-hover:border-green-400 transition-colors" />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-600 group-hover:bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium hidden md:block max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                <svg className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-200 hidden sm:block ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden animate-dropdown">
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-green-500 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {[
                      { to: "/profile", label: "My Account", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                      { to: "/orders", label: "My Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                      { to: "/addresses", label: "My Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full cursor-pointer transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 cursor-pointer flex items-center gap-1.5 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-sm font-medium hidden sm:block">Login</span>
            </Link>
          )}

          {/* cart */}
          <button onClick={() => setSidebarOpen(true)} className="relative flex items-center gap-1.5 sm:gap-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl cursor-pointer transition-all btn-press shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 ? (
              <span className="text-white text-xs sm:text-sm font-bold">{cartCount}</span>
            ) : (
              <span className="text-white/90 text-xs sm:text-sm hidden sm:block">Cart</span>
            )}
            {cartCount > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 bg-yellow-400 text-green-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_2px_10px_rgba(250,204,21,0.5)] ${cartBounce ? "animate-cart-bounce" : ""}`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="sm:hidden px-3 pb-2.5 animate-slide-down">
          <form onSubmit={handleSearch} className="flex bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden ring-1 ring-gray-200/60 dark:ring-gray-700">
            <input
              ref={mobileSearchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none min-w-0"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 text-sm cursor-pointer shrink-0 transition-all">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
