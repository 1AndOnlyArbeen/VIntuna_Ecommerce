import { useState, useEffect } from "react"
import { getDiscountsAPI, createDiscountAPI, updateDiscountAPI, toggleDiscountAPI, deleteDiscountAPI } from "../../api"
import ConfirmModal from "../ConfirmModal"

const PER_PAGE = 15
const emptyForm = { code: "", discount: "", type: "percent", minOrder: "", usageLimit: "" }

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function fetchData() {
    setLoading(true)
    try {
      const res = await getDiscountsAPI()
      setDiscounts(res.data?.data || res.data || [])
    } catch { setDiscounts([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showModal])

  const filtered = discounts.filter(d => !searchQuery || d.code.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function openAdd() { setEditingId(null); setForm(emptyForm); setSaveError(""); setShowModal(true) }
  function openEdit(d) {
    setEditingId(d._id)
    setForm({ code: d.code, discount: d.discount, type: d.type, minOrder: d.minOrder || "", usageLimit: d.usageLimit || "" })
    setSaveError(""); setShowModal(true)
  }
  function closeModal() { setShowModal(false); setEditingId(null); setForm(emptyForm); setSaveError("") }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.code || !form.discount) return
    setSaving(true); setSaveError("")

    const payload = {
      code: form.code, discount: Number(form.discount), type: form.type,
      minOrder: Number(form.minOrder || 0), usageLimit: Number(form.usageLimit || 100),
    }

    try {
      if (editingId) await updateDiscountAPI(editingId, payload)
      else await createDiscountAPI(payload)
      closeModal(); await fetchData()
    } catch (err) { setSaveError(err.message || "Failed to save") }
    finally { setSaving(false) }
  }

  async function handleToggle(id) { try { await toggleDiscountAPI(id); await fetchData() } catch {} }
  async function handleDelete(id) {
    try { await deleteDiscountAPI(id); setDiscounts(prev => prev.filter(d => d._id !== id)) } catch {}
    setDeleteTarget(null)
  }

  const inputClass = "w-full border border-outline-variant/25 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div>
      <ConfirmModal open={!!deleteTarget} title="Delete Discount?" message="Are you sure you want to delete this discount code? This action cannot be undone." onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
              <h2 className="text-lg font-bold text-on-surface">{editingId ? "Edit Discount" : "Add Discount"}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 cursor-pointer"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {saveError && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl">{saveError}</div>}
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Code *</label>
                <input type="text" placeholder="e.g. SUMMER20" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className={`${inputClass} uppercase font-mono`} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Value *</label>
                  <input type="number" min="0" placeholder="20" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}>
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat (Rs.)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Min Order</label>
                  <input type="number" min="0" placeholder="0" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Usage Limit</label>
                  <input type="number" min="1" placeholder="100" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-primary-container hover:bg-primary text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50">{saving ? "Saving..." : editingId ? "Update" : "Create"}</button>
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-medium text-on-surface/50 border border-outline-variant/20 rounded-lg cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Discounts</h1>
            <p className="text-sm text-on-surface/50 mt-0.5">{discounts.length} codes &middot; {discounts.filter(d => d.active).length} active</p>
          </div>
          <button onClick={openAdd} className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer">+ Add Discount</button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant/20 p-3">
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">search</span>
            <input type="text" placeholder="Search by code..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              className="w-full border border-outline-variant/25 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
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
            {loading ? [...Array(3)].map((_, i) => (
              <tr key={i} className="border-t"><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-on-surface/40">{discounts.length === 0 ? "No discounts yet." : "No match."}</td></tr>
            ) : paginated.map(d => (
              <tr key={d._id} className="border-t hover:bg-surface-container-low/50">
                <td className="px-4 py-3"><span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs">{d.code}</span></td>
                <td className="px-4 py-3">{d.type === "percent" ? `${d.discount}%` : `Rs.${d.discount}`}</td>
                <td className="px-4 py-3 text-on-surface/50">{d.minOrder > 0 ? `Rs.${d.minOrder}` : "None"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[80px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${d.used >= d.usageLimit ? "bg-red-500" : "bg-primary-container"}`} style={{ width: `${Math.min(100, (d.used / d.usageLimit) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-on-surface/50">{d.used}/{d.usageLimit}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.active ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface/50"}`}>{d.active ? "Active" : "Off"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="text-blue-600 text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => handleToggle(d._id)} className="text-yellow-600 text-xs font-medium cursor-pointer">{d.active ? "Disable" : "Enable"}</button>
                    <button onClick={() => setDeleteTarget(d._id)} className="text-error text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/15">
            <p className="text-xs text-on-surface/50">{(safePage - 1) * PER_PAGE + 1}-{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="px-2 py-1 rounded text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="px-2 py-1 rounded text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
