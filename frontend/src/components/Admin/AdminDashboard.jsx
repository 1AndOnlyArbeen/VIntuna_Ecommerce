import { Link } from "react-router-dom"
import { products, categories } from "../../data/products"

export default function AdminDashboard() {
  const totalProducts = products.length
  const inStock = products.filter(p => p.inStock).length
  const outOfStock = totalProducts - inStock
  const totalCategories = categories.length

  const stats = [
    { label: "Total Products", value: totalProducts, icon: "inventory_2", color: "bg-primary-container text-on-primary-container", link: "/admin/products" },
    { label: "In Stock", value: inStock, icon: "check_circle", color: "bg-primary/10 text-primary", link: "/admin/products" },
    { label: "Out of Stock", value: outOfStock, icon: "cancel", color: "bg-error/10 text-error", link: "/admin/products" },
    { label: "Categories", value: totalCategories, icon: "category", color: "bg-secondary-container text-on-secondary-container", link: "/admin/categories" },
    { label: "Banners", value: 3, icon: "image", color: "bg-primary/5 text-primary", link: "/admin/banners" },
    { label: "Discounts", value: 5, icon: "sell", color: "bg-gold/20 text-secondary", link: "/admin/discounts" },
  ]

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight text-center mb-8">Dashboard Overview</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {stats.map(s => (
          <Link
            key={s.label}
            to={s.link}
            className="bg-white/60 backdrop-blur-2xl rounded-xl p-5 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all"
          >
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
            </div>
            <p className="text-2xl font-headline font-extrabold text-on-surface">{s.value}</p>
            <p className="text-xs text-on-surface/50 font-label mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-on-surface">Recent Products</h2>
          <Link to="/admin/products" className="text-secondary text-xs font-label font-bold hover:underline uppercase tracking-widest">View all</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-on-surface/50 border-b border-black/[0.06]">
              <th className="pb-2 font-label text-[11px] uppercase tracking-widest">Name</th>
              <th className="pb-2 font-label text-[11px] uppercase tracking-widest">Category</th>
              <th className="pb-2 font-label text-[11px] uppercase tracking-widest">Price</th>
              <th className="pb-2 font-label text-[11px] uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map(p => (
              <tr key={p.id} className="border-b border-outline-variant/10 last:border-0">
                <td className="py-2.5 text-on-surface font-label font-medium">{p.name}</td>
                <td className="py-2.5 text-on-surface/60 font-label">{p.category}</td>
                <td className="py-2.5 text-on-surface font-headline font-bold">Rs.{p.price}</td>
                <td className="py-2.5">
                  <span className={`text-[10px] font-label font-bold px-2 py-0.5 rounded-full ${p.inStock ? "bg-primary/10 text-primary" : "bg-error/10 text-error"}`}>
                    {p.inStock ? "In Stock" : "Out"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
