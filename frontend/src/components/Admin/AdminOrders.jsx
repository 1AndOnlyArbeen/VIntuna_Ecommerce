import { useState, useEffect } from "react"
import { getAdminOrdersAPI, updateAdminOrderStatusAPI } from "../../api"

const STATUS_CONFIG = {
  pending:    { label: "Pending",      color: "bg-secondary-container/30 text-secondary" },
  warehouse:  { label: "In Warehouse", color: "bg-primary/5 text-primary-container" },
  delivering: { label: "Delivering",   color: "bg-primary/10 text-primary" },
  delivered:  { label: "Delivered",    color: "bg-primary-container/20 text-primary-container" },
  cancelled:  { label: "Cancelled",    color: "bg-error/10 text-error" },
}
const STATUS_OPTIONS = ["pending", "warehouse", "delivering", "delivered", "cancelled"]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function fetchOrders() {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (filterStatus) params.status = filterStatus
      const res = await getAdminOrdersAPI(params)
      const d = res.data
      setOrders(d?.data || d?.orders || [])
      setTotalPages(d?.totalPages || 1)
      setTotal(d?.total || 0)
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [filterStatus, page])

  async function changeStatus(orderId, newStatus) {
    try { await updateAdminOrderStatusAPI(orderId, newStatus); fetchOrders() } catch {}
  }

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Orders ({total})</h1>
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant/20 p-3 flex flex-wrap gap-2">
          <button onClick={() => { setFilterStatus(""); setPage(1) }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${!filterStatus ? "bg-primary-container text-white" : "border border-outline-variant/20 text-on-surface-variant"}`}>All</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${filterStatus === s ? "bg-primary-container text-white" : "border border-outline-variant/20 text-on-surface-variant"}`}>{STATUS_CONFIG[s]?.label || s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => (
              <tr key={i} className="border-t"><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-on-surface/40">No orders found.</td></tr>
            ) : orders.map(order => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              return (
                <tr key={order._id} className="border-t hover:bg-surface-container-low/50">
                  <td className="px-4 py-3"><span className="text-xs font-mono font-bold text-primary">{order.orderId}</span></td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-on-surface">{order.userId?.name || "N/A"}</p>
                    <p className="text-xs text-on-surface/50">{order.userId?.email || ""}</p>
                  </td>
                  <td className="px-4 py-3 text-on-surface/60 text-xs">{order.items?.length || 0} items</td>
                  <td className="px-4 py-3 font-bold text-on-surface">Rs.{order.totalAmount}</td>
                  <td className="px-4 py-3 text-xs text-on-surface/50">{new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${status.color}`}>{status.label}</span></td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => changeStatus(order._id, e.target.value)}
                      className="text-xs border border-outline-variant/25 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/15">
            <p className="text-xs text-on-surface/50">Page {page} of {totalPages} ({total} total)</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
