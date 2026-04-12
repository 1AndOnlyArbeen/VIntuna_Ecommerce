import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAdminStatsAPI } from "../../api"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try { const res = await getAdminStatsAPI(); setStats(res.data) }
      catch {}
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight text-center mb-8">Dashboard</h1>
        <div className="bg-white/60 rounded-xl border border-black/[0.06] p-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-5 skeleton-shimmer rounded mb-3 last:mb-0" />)}
        </div>
      </div>
    )
  }

  const overviewRows = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: "inventory_2", link: "/admin/products" },
    { label: "In Stock", value: stats?.inStock || 0, icon: "check_circle", link: "/admin/products" },
    { label: "Out of Stock", value: stats?.outOfStock || 0, icon: "cancel", link: "/admin/products" },
    { label: "Featured", value: stats?.featuredCount || 0, icon: "star", link: "/admin/featured" },
    { label: "Categories", value: stats?.totalCategories || 0, icon: "category", link: "/admin/categories" },
    { label: "Banners", value: `${stats?.activeBanners || 0} active / ${stats?.totalBanners || 0} total`, icon: "image", link: "/admin/banners" },
    { label: "Discounts", value: `${stats?.activeDiscounts || 0} active / ${stats?.totalDiscounts || 0} total`, icon: "sell", link: "/admin/discounts" },
    { label: "Reviews", value: stats?.totalReviews || 0, icon: "rate_review", link: "/admin/reviews" },
    { label: "Contacts", value: `${stats?.unreadContacts || 0} new / ${stats?.totalContacts || 0} total`, icon: "mail", link: "/admin/contacts" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "group", link: "/admin" },
  ]

  const orderRows = [
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: "receipt_long" },
    { label: "Pending", value: stats?.pendingOrders || 0, icon: "pending" },
    { label: "Delivering", value: stats?.deliveringOrders || 0, icon: "local_shipping" },
    { label: "Delivered", value: stats?.deliveredOrders || 0, icon: "check_circle" },
  ]

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight text-center mb-8">Dashboard</h1>

      {/* Overview Table */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-outline-variant/15 bg-surface-container-low/60">
          <h2 className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest">Store Overview</h2>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {overviewRows.map(r => (
              <tr key={r.label} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50">
                <td className="px-5 py-3.5 w-10">
                  <span className="material-symbols-outlined text-primary text-[20px]">{r.icon}</span>
                </td>
                <td className="py-3.5 text-on-surface font-label">{r.label}</td>
                <td className="px-5 py-3.5 text-right font-headline font-bold text-on-surface">{r.value}</td>
                <td className="px-5 py-3.5 text-right w-16">
                  <Link to={r.link} className="text-secondary text-xs font-label font-bold hover:underline uppercase tracking-widest">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders Table */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-outline-variant/15 bg-surface-container-low/60 flex items-center justify-between">
          <h2 className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest">Orders</h2>
          <Link to="/admin/orders" className="text-secondary text-xs font-label font-bold hover:underline uppercase tracking-widest">Manage</Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {orderRows.map(r => (
              <tr key={r.label} className="border-b border-outline-variant/10 last:border-0">
                <td className="px-5 py-3.5 w-10">
                  <span className="material-symbols-outlined text-primary text-[20px]">{r.icon}</span>
                </td>
                <td className="py-3.5 text-on-surface font-label">{r.label}</td>
                <td className="px-5 py-3.5 text-right font-headline font-bold text-on-surface">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Orders Table */}
      {stats?.recentOrders?.length > 0 && (
        <div className="bg-white/60 backdrop-blur-2xl rounded-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-3 border-b border-outline-variant/15 bg-surface-container-low/60 flex items-center justify-between">
            <h2 className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest">Recent Orders</h2>
            <Link to="/admin/orders" className="text-secondary text-xs font-label font-bold hover:underline uppercase tracking-widest">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-left text-on-surface/50 bg-surface-container-low">
                  <th className="px-4 py-2.5 font-label text-[11px] uppercase tracking-widest">Order</th>
                  <th className="px-4 py-2.5 font-label text-[11px] uppercase tracking-widest">Customer</th>
                  <th className="px-4 py-2.5 font-label text-[11px] uppercase tracking-widest">Total</th>
                  <th className="px-4 py-2.5 font-label text-[11px] uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(o => (
                  <tr key={o._id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50">
                    <td className="px-4 py-2.5 text-xs font-mono font-medium text-primary">{o.orderId}</td>
                    <td className="px-4 py-2.5 text-on-surface/60 font-label">{o.userId?.name || "N/A"}</td>
                    <td className="px-4 py-2.5 text-on-surface font-headline font-bold">Rs.{o.totalAmount}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-label font-bold px-2 py-0.5 rounded-full ${
                        o.status === "delivered" ? "bg-primary/10 text-primary" : o.status === "cancelled" ? "bg-error/10 text-error" : "bg-secondary-container/30 text-secondary"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
