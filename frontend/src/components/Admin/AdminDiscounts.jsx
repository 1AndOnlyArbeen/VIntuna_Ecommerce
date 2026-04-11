import { useState, useEffect } from "react"

const PER_PAGE = 20

const defaultDiscounts = [
  { id: 1, code: "WELCOME10", discount: 10, type: "percent", minOrder: 100, active: true, usageLimit: 100, used: 23 },
  { id: 2, code: "FLAT50", discount: 50, type: "flat", minOrder: 300, active: true, usageLimit: 50, used: 12 },
  { id: 3, code: "SUMMER20", discount: 20, type: "percent", minOrder: 200, active: false, usageLimit: 200, used: 187 },
  { id: 4, code: "FREE25", discount: 25, type: "flat", minOrder: 0, active: true, usageLimit: 500, used: 45 },
  { id: 5, code: "MEGA30", discount: 30, type: "percent", minOrder: 500, active: true, usageLimit: 100, used: 8 },
  { id: 6, code: "DASHAIN50", discount: 50, type: "flat", minOrder: 400, active: true, usageLimit: 300, used: 156 },
  { id: 7, code: "TIHAR15", discount: 15, type: "percent", minOrder: 150, active: true, usageLimit: 250, used: 89 },
  { id: 8, code: "NEWUSER", discount: 100, type: "flat", minOrder: 500, active: true, usageLimit: 1000, used: 342 },
  { id: 9, code: "SAVE40", discount: 40, type: "flat", minOrder: 250, active: false, usageLimit: 100, used: 100 },
  { id: 10, code: "WEEKEND5", discount: 5, type: "percent", minOrder: 0, active: true, usageLimit: 999, used: 512 },
  { id: 11, code: "VIP25", discount: 25, type: "percent", minOrder: 1000, active: true, usageLimit: 50, used: 3 },
  { id: 12, code: "FLASH60", discount: 60, type: "flat", minOrder: 350, active: true, usageLimit: 75, used: 41 },
  { id: 13, code: "ORGANIC10", discount: 10, type: "percent", minOrder: 200, active: true, usageLimit: 200, used: 67 },
  { id: 14, code: "FREEDEL", discount: 30, type: "flat", minOrder: 100, active: true, usageLimit: 500, used: 213 },
  { id: 15, code: "HOLI20", discount: 20, type: "percent", minOrder: 300, active: false, usageLimit: 150, used: 150 },
  { id: 16, code: "SPRING15", discount: 15, type: "flat", minOrder: 0, active: true, usageLimit: 400, used: 178 },
  { id: 17, code: "LOYAL35", discount: 35, type: "flat", minOrder: 200, active: true, usageLimit: 100, used: 22 },
  { id: 18, code: "BUNDLE20", discount: 20, type: "percent", minOrder: 600, active: true, usageLimit: 80, used: 14 },
  { id: 19, code: "REFER50", discount: 50, type: "flat", minOrder: 250, active: true, usageLimit: 1000, used: 389 },
  { id: 20, code: "NEWYEAR25", discount: 25, type: "percent", minOrder: 400, active: false, usageLimit: 200, used: 200 },
  { id: 21, code: "FIRST100", discount: 100, type: "flat", minOrder: 500, active: true, usageLimit: 500, used: 167 },
  { id: 22, code: "SUPER15", discount: 15, type: "percent", minOrder: 150, active: true, usageLimit: 300, used: 88 },
  { id: 23, code: "GRAB10", discount: 10, type: "flat", minOrder: 0, active: true, usageLimit: 999, used: 456 },
  { id: 24, code: "WINTER30", discount: 30, type: "percent", minOrder: 350, active: true, usageLimit: 120, used: 34 },
  { id: 25, code: "FESTIVE40", discount: 40, type: "flat", minOrder: 200, active: false, usageLimit: 100, used: 99 },
]

const emptyForm = { code: "", discount: "", type: "percent", minOrder: "", usageLimit: "" }

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState(defaultDiscounts)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = discounts.filter(d => !searchQuery || d.code.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  // lock body scroll
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(d) {
    setEditingId(d.id)
    setForm({ code: d.code, discount: d.discount, type: d.type, minOrder: d.minOrder || "", usageLimit: d.usageLimit || "" })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.code || !form.discount) return

    if (editingId) {
      setDiscounts(prev => prev.map(d => d.id === editingId ? {
        ...d,
        code: form.code.toUpperCase(),
        discount: Number(form.discount),
        type: form.type,
        minOrder: Number(form.minOrder || 0),
        usageLimit: Number(form.usageLimit || 100),
      } : d))
    } else {
      setDiscounts(prev => [...prev, {
        id: Date.now(),
        code: form.code.toUpperCase(),
        discount: Number(form.discount),
        type: form.type,
        minOrder: Number(form.minOrder || 0),
        active: true,
        usageLimit: Number(form.usageLimit || 100),
        used: 0,
      }])
    }
    closeModal()
  }

  function toggleActive(id) {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d))
  }

  function deleteDiscount(id) {
    if (confirm("Delete this discount code?")) {
      setDiscounts(prev => {
        const updated = prev.filter(d => d.id !== id)
        const newTotal = Math.max(1, Math.ceil(updated.length / PER_PAGE))
        if (page > newTotal) setPage(newTotal)
        return updated
      })
    }
  }

  function goToPage(p) { setPage(Math.max(1, Math.min(p, totalPages))) }

  function getPageNumbers() {
    const pages = []
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
    else {
      pages.push(1)
      if (safePage > 3) pages.push("...")
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  const inputClass = "w-full border border-outline-variant/25 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div>
      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
              <h2 className="text-lg font-bold text-on-surface">
                {editingId ? "Edit Discount" : "Add New Discount"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-on-surface/60 dark:hover:text-gray-300 hover:bg-surface-container-high/60 cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Coupon Code *</label>
                <input type="text" placeholder="e.g. SUMMER20" value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  className={`${inputClass} uppercase font-mono`} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Discount Value *</label>
                  <input type="number" min="0" placeholder="e.g. 20" value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })}
                    className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Discount Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}>
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat (Rs.)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Min Order Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">Rs.</span>
                    <input type="number" min="0" placeholder="0" value={form.minOrder}
                      onChange={e => setForm({ ...form, minOrder: e.target.value })}
                      className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Usage Limit</label>
                  <input type="number" min="1" placeholder="100" value={form.usageLimit}
                    onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                    className={inputClass} />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/15">
                <p className="text-xs font-medium text-on-surface/50 mb-2">Preview</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/40 px-3 py-1 rounded-lg text-sm tracking-wider">
                    {form.code ? form.code.toUpperCase() : "CODE"}
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {form.discount ? (form.type === "percent" ? `${form.discount}% off` : `Rs.${form.discount} off`) : "—"}
                  </span>
                </div>
                {form.minOrder && Number(form.minOrder) > 0 && (
                  <p className="text-xs text-on-surface/40 mt-1">Min order: Rs.{form.minOrder}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary-container hover:bg-primary text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors">
                  {editingId ? "Save Changes" : "Create Discount"}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-medium text-on-surface/50 hover:text-on-surface/80 dark:hover:text-gray-200 border border-outline-variant/20 rounded-lg cursor-pointer transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== HEADER + SEARCH (sticky blurry) ===== */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight text-center">Discount Codes</h1>
            <p className="text-sm text-on-surface/50 mt-0.5">{discounts.length} codes &middot; {discounts.filter(d => d.active).length} active</p>
          </div>
          <button onClick={openAdd} className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors">
            + Add Discount
          </button>
        </div>

        <div className="bg-white/80/80 backdrop-blur-md rounded-xl border border-outline-variant/20/50/50 p-3 sm:p-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by code..." value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
            className="w-full border border-outline-variant/25 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white/90/90 backdrop-blur-sm rounded-xl border border-outline-variant/20/50/50 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-on-surface/40">No discount codes found.</td></tr>
            ) : paginated.map(d => (
              <tr key={d.id} className="border-t hover:bg-surface-container-low/50 dark:hover:bg-gray-700/30">
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/40 px-2 py-0.5 rounded text-xs">
                    {d.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface">
                  {d.type === "percent" ? `${d.discount}%` : `Rs.${d.discount}`}
                </td>
                <td className="px-4 py-3 text-on-surface/50">
                  {d.minOrder > 0 ? `Rs.${d.minOrder}` : "None"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[80px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.used >= d.usageLimit ? "bg-red-500" : d.used / d.usageLimit > 0.7 ? "bg-yellow-500" : "bg-primary-container"}`}
                        style={{ width: `${Math.min(100, (d.used / d.usageLimit) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-on-surface/50">{d.used}/{d.usageLimit}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    d.active
                      ? "bg-primary/10 text-primary dark:bg-green-900 dark:text-green-400"
                      : "bg-surface-container-high text-on-surface/50"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${d.active ? "bg-primary-container" : "bg-gray-400"}`} />
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => toggleActive(d.id)} className="text-yellow-600 hover:text-yellow-800 text-xs font-medium cursor-pointer">
                      {d.active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => deleteDiscount(d.id)} className="text-error hover:text-red-700 text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-outline-variant/15 gap-2">
            <p className="text-xs text-on-surface/50">
              Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="px-2 py-1 rounded text-xs font-medium text-on-surface/60 hover:bg-surface-container-high/60 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Prev</button>
              {getPageNumbers().map((p, i) => p === "..." ? (
                <span key={`e${i}`} className="px-1 text-on-surface/40 text-xs">...</span>
              ) : (
                <button key={p} onClick={() => goToPage(p)} className={`w-7 h-7 rounded text-xs font-medium transition-colors cursor-pointer ${p === safePage ? "bg-primary-container text-white" : "text-on-surface/60 hover:bg-surface-container-high/60"}`}>{p}</button>
              ))}
              <button onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="px-2 py-1 rounded text-xs font-medium text-on-surface/60 hover:bg-surface-container-high/60 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
