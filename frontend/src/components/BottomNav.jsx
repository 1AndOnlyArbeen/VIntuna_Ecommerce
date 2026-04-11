import { Link, useLocation } from "react-router-dom"

const NAV_ITEMS = [
  { to: "/", icon: "grid_view", label: "Shop", matchExact: true },
  { to: "/search?q=", icon: "search", label: "Search" },
  { to: "/orders", icon: "receipt_long", label: "Orders" },
  { to: "/profile", icon: "person", label: "Profile" },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface/80 backdrop-blur-xl z-50 border-t border-outline-variant/10">
      {NAV_ITEMS.map(item => {
        const isActive = item.matchExact
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to.split("?")[0])

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? "text-primary dark:text-green-400 bg-primary/5 dark:bg-green-900/20 rounded-full px-4 py-1"
                : "text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-0.5">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
