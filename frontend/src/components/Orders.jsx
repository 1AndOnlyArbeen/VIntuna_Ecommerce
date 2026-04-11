import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getOrdersAPI } from "../api"

const STATUS_CONFIG = {
  pending:    { label: "Pending",      color: "bg-secondary-container/30 text-secondary", step: 1 },
  warehouse:  { label: "In Warehouse", color: "bg-primary/5 text-primary-container", step: 2 },
  delivering: { label: "Delivering",   color: "bg-primary/10 text-primary", step: 3 },
  delivered:  { label: "Delivered",    color: "bg-primary-container/20 text-primary-container", step: 4 },
  cancelled:  { label: "Cancelled",    color: "bg-error/10 text-error", step: 0 },
}

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "warehouse", label: "In Warehouse" },
  { id: "delivering", label: "Delivering" },
  { id: "delivered", label: "Delivered" },
]

const PROGRESS_STEPS = [
  { key: "pending", label: "Ordered", icon: "receipt_long" },
  { key: "warehouse", label: "Warehouse", icon: "warehouse" },
  { key: "delivering", label: "On the way", icon: "local_shipping" },
  { key: "delivered", label: "Delivered", icon: "check_circle" },
]

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchOrders() {
      try { const res = await getOrdersAPI(); setOrders(res.data || []) }
      catch { setOrders([]) }
      finally { setLoading(false) }
    }
    fetchOrders()
  }, [])

  const filtered = activeTab === "all" ? orders : orders.filter(o => o.status === activeTab)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
        <h1 className="text-2xl font-headline font-extrabold text-primary mb-6 tracking-tight">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6">
              <div className="h-4 skeleton-shimmer rounded w-1/3 mb-3" />
              <div className="h-3 skeleton-shimmer rounded w-1/2 mb-2" />
              <div className="h-3 skeleton-shimmer rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <h1 className="text-2xl font-headline font-extrabold text-primary mb-6 tracking-tight animate-fade-in-down">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-label font-bold whitespace-nowrap transition-all cursor-pointer btn-press uppercase tracking-widest ${
              activeTab === tab.id ? "bg-primary-container text-on-primary-container shadow-md" : "bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/30"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-12 text-center animate-fade-in">
          <span className="material-symbols-outlined text-outline text-5xl mb-4 block">inventory_2</span>
          <h2 className="text-lg font-headline font-bold text-primary mb-2">No orders yet</h2>
          <p className="text-on-surface-variant text-sm mb-8 font-label">When you place orders, they'll show up here.</p>
          <Link to="/" className="bg-velvet-gradient text-on-primary font-headline font-bold px-8 py-3 rounded-full text-sm cursor-pointer inline-block btn-press uppercase tracking-widest shadow-lg">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, idx) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const currentStep = status.step
            return (
              <div key={order._id || order.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="p-5 border-b border-outline-variant/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-headline font-bold text-primary">Order #{order.orderId || order._id}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 font-label">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                    <span className={`text-[10px] font-label font-bold px-3 py-1.5 rounded-full self-start uppercase tracking-widest ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                {/* Progress tracker */}
                {order.status !== "cancelled" && (
                  <div className="px-5 py-4 bg-surface-container-low">
                    <div className="flex items-center justify-between">
                      {PROGRESS_STEPS.map((ps, i) => {
                        const isCompleted = currentStep > (i + 1)
                        const isCurrent = currentStep === (i + 1)
                        return (
                          <div key={ps.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isCompleted ? "bg-primary-container text-on-primary-container"
                                  : isCurrent ? "bg-primary-container text-on-primary-container ring-3 ring-primary/10"
                                    : "bg-surface-container-high text-on-surface-variant/50"
                              }`}>
                                {isCompleted ? <span className="material-symbols-outlined text-[16px]">check</span>
                                  : <span className="material-symbols-outlined text-[16px]">{ps.icon}</span>}
                              </div>
                              <span className={`text-[9px] sm:text-[10px] mt-1.5 font-label font-bold text-center leading-tight uppercase tracking-widest ${
                                isCompleted || isCurrent ? "text-primary" : "text-on-surface-variant/40"
                              }`}>{ps.label}</span>
                            </div>
                            {i < PROGRESS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 sm:mx-2 mb-5 rounded ${isCompleted ? "bg-primary-container" : "bg-surface-container-high"}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="space-y-2.5">
                    {(order.items || order.products || []).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                        <span className="text-on-surface font-label truncate flex-1">{item.name || item.productId?.name}</span>
                        <span className="text-on-surface-variant shrink-0 text-xs font-label">x{item.quantity}</span>
                        <span className="text-primary font-headline font-bold shrink-0">Rs.{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
                    <div className="text-sm font-label">
                      <span className="text-on-surface-variant">Total: </span>
                      <span className="font-headline font-bold text-primary">Rs.{order.totalAmount || order.total}</span>
                    </div>
                    <Link to={`/orders/${order._id || order.id}`} className="text-secondary text-xs font-headline font-bold hover:underline cursor-pointer uppercase tracking-widest">Details</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
