import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getOrdersAPI } from "../api"

const STATUS_CONFIG = {
  pending:    { label: "Pending",      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400", step: 1 },
  warehouse:  { label: "In Warehouse", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",     step: 2 },
  delivering: { label: "Delivering",   color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400", step: 3 },
  delivered:  { label: "Delivered",    color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",   step: 4 },
  cancelled:  { label: "Cancelled",    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",       step: 0 },
}

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "warehouse", label: "In Warehouse" },
  { id: "delivering", label: "Delivering" },
  { id: "delivered", label: "Delivered" },
]

const PROGRESS_STEPS = [
  { key: "pending", label: "Ordered", icon: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  )},
  { key: "warehouse", label: "Warehouse", icon: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  )},
  { key: "delivering", label: "On the way", icon: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
  )},
  { key: "delivered", label: "Delivered", icon: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  )},
]

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getOrdersAPI()
        setOrders(res.data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = activeTab === "all" ? orders : orders.filter(o => o.status === activeTab)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-6">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
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
    <div className="max-w-3xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-5 animate-fade-in-down">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer btn-press ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-10 sm:p-14 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">When you place orders, they'll show up here.</p>
          <Link to="/" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer inline-block transition-colors btn-press">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, idx) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const currentStep = status.step

            return (
              <div key={order._id || order.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                {/* Order header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">Order #{order.orderId || order._id}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg self-start uppercase tracking-wider ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Progress tracker */}
                {order.status !== "cancelled" && (
                  <div className="px-4 sm:px-5 py-3 bg-gray-50 dark:bg-gray-900/30">
                    <div className="flex items-center justify-between">
                      {PROGRESS_STEPS.map((ps, i) => {
                        const isCompleted = currentStep > (i + 1)
                        const isCurrent = currentStep === (i + 1)
                        return (
                          <div key={ps.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                                isCompleted ? "bg-green-600 text-white"
                                  : isCurrent ? "bg-green-600 text-white ring-2 ring-green-200 dark:ring-green-800"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                              }`}>
                                {isCompleted ? (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                ) : ps.icon}
                              </div>
                              <span className={`text-[9px] sm:text-[10px] mt-1 font-medium text-center leading-tight ${
                                isCompleted || isCurrent ? "text-green-600 dark:text-green-400" : "text-gray-400"
                              }`}>{ps.label}</span>
                            </div>
                            {i < PROGRESS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 sm:mx-2 mb-4 rounded transition-colors ${
                                isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                              }`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Order items */}
                <div className="p-4 sm:p-5">
                  <div className="space-y-2.5">
                    {(order.items || order.products || []).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                        <span className="text-gray-700 dark:text-gray-300 truncate flex-1">{item.name || item.productId?.name}</span>
                        <span className="text-gray-400 shrink-0 text-xs">x{item.quantity}</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium shrink-0">Rs.{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {(order.items || order.products || []).length > 3 && (
                      <p className="text-xs text-gray-400">+{(order.items || order.products).length - 3} more items</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 gap-2">
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-500">Total: </span>
                      <span className="font-bold text-gray-900 dark:text-white">Rs.{order.totalAmount || order.total}</span>
                      {order.paymentMethod && (
                        <span className="text-xs text-gray-400 ml-2">via {order.paymentMethod}</span>
                      )}
                    </div>
                    <Link
                      to={`/orders/${order._id || order.id}`}
                      className="text-green-600 dark:text-green-400 text-xs font-semibold hover:underline cursor-pointer"
                    >
                      View Details
                    </Link>
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
