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
    <header className="fixed top-0 w-full z-50 bg-[#ededeb]/80 dark:bg-[#151a27]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-black/8 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_6px_28px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-5 flex items-center justify-between gap-4">

        {/* Logo — bigger */}
        <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2">
          <img src={logo} alt="VintunaStore" className="h-12 sm:h-14 object-contain" />
        </Link>

        {/* Desktop search — center */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface/40 text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search "dal, momo, milk..."'
              className="w-full bg-white/70 dark:bg-white/[0.06] border border-outline-variant/20 rounded-full py-2.5 pl-10 pr-24 focus:outline-none focus:border-primary/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,59,30,0.08)] transition-all text-sm font-label text-on-surface placeholder:text-on-surface/35"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-on-surface text-white font-label font-bold text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all uppercase tracking-widest shadow-[0_2px_6px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.2)]">
              Search
            </button>
          </div>
        </form>

        {/* Right side — nav links + actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="font-headline font-semibold text-primary tracking-tight hover:text-secondary transition-colors duration-300 text-sm">
              Shop
            </Link>
            <Link to="/search?q=Nepali" className="font-headline font-semibold text-primary/60 tracking-tight hover:text-secondary transition-colors duration-300 text-sm">
              Categories
            </Link>
            <Link to="/contact" className="font-headline font-semibold text-primary/60 tracking-tight hover:text-secondary transition-colors duration-300 text-sm">
              Contact
            </Link>
          </nav>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-outline-variant/20" />

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden cursor-pointer hover:opacity-80 transition-opacity active:scale-95 bg-[#e5e4e2]/80 dark:bg-white/[0.08] w-9 h-9 rounded-full flex items-center justify-center border border-outline-variant/15"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">search</span>
          </button>

          <DarkToggle />

          {/* User avatar / Login */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 cursor-pointer group">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-container group-hover:ring-secondary transition-colors" />
                ) : (
                  <div className="w-9 h-9 bg-primary-container group-hover:bg-primary text-on-primary-container group-hover:text-on-primary rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-on-surface text-sm font-medium hidden lg:block max-w-[80px] truncate font-headline">{user.name?.split(" ")[0]}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-[0_12px_40px_rgba(26,28,27,0.08)] z-50 overflow-hidden animate-dropdown">
                  <div className="p-4 bg-surface-container-low border-b border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-container shrink-0" />
                      ) : (
                        <div className="w-11 h-11 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-headline font-bold text-primary truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {[
                      { to: "/profile", label: "My Account", icon: "person" },
                      { to: "/orders", label: "My Orders", icon: "receipt_long" },
                      { to: "/addresses", label: "My Addresses", icon: "location_on" },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-high cursor-pointer transition-colors font-label"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-surface-container-high cursor-pointer transition-colors font-label font-bold"
                      >
                        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-outline-variant/10 py-2">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error-container/30 w-full cursor-pointer transition-colors font-label">
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-2 text-primary hover:text-secondary cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[22px]">person</span>
              <span className="text-sm font-headline font-semibold">Login</span>
            </Link>
          )}

          {/* Cart button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative cursor-pointer hover:opacity-80 transition-all active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-primary text-[26px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ${cartBounce ? "animate-cart-bounce" : ""}`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3 animate-slide-down">
          <form onSubmit={handleSearch} className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">search</span>
            <input
              ref={mobileSearchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search "dal, momo, milk..."'
              className="w-full bg-white/70 dark:bg-white/[0.06] border border-outline-variant/20 rounded-full pl-9 pr-20 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,59,30,0.08)] transition-all font-label placeholder:text-on-surface/35"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button type="submit" className="bg-primary hover:bg-on-surface text-white font-label font-bold text-[10px] px-3 py-1.5 rounded-full cursor-pointer transition-all uppercase tracking-widest shadow-[0_2px_6px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.2)]">
                Go
              </button>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-1 rounded-full hover:bg-surface-container-high cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant/50 text-[18px]">close</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  )
}
