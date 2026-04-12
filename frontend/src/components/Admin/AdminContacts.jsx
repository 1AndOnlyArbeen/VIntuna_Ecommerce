import { useState, useEffect } from "react"
import { getAllContactsAPI, toggleContactReadAPI, deleteContactAPI } from "../../api"
import ConfirmModal from "../ConfirmModal"

const PER_PAGE = 15

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function fetchData() {
    setLoading(true)
    try {
      const params = { page, limit: PER_PAGE }
      if (filter) params.read = filter
      const res = await getAllContactsAPI(params)
      const d = res.data
      setContacts(d?.data || [])
      setTotalPages(d?.totalPages || 1)
      setTotal(d?.total || 0)
    } catch { setContacts([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, filter])

  async function handleToggleRead(id) {
    try { await toggleContactReadAPI(id); fetchData() } catch {}
  }

  async function handleDelete(id) {
    try { await deleteContactAPI(id); fetchData() } catch {}
    setDeleteTarget(null)
  }

  return (
    <div>
      <ConfirmModal open={!!deleteTarget} title="Delete Message?" message="Are you sure you want to delete this contact message? This action cannot be undone." onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Contact Messages ({total})</h1>
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant/20 p-3 flex gap-2">
          {[
            { val: "", label: "All" },
            { val: "false", label: "Unread" },
            { val: "true", label: "Read" },
          ].map(f => (
            <button key={f.val} onClick={() => { setFilter(f.val); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${filter === f.val ? "bg-primary-container text-white" : "border border-outline-variant/20 text-on-surface-variant"}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => (
              <tr key={i} className="border-t"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : contacts.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-on-surface/40">No messages.</td></tr>
            ) : contacts.map(c => (
              <tr key={c._id} className={`border-t border-outline-variant/15 hover:bg-surface-container-low/50 ${!c.read ? "bg-primary/[0.02]" : ""}`}>
                <td className="px-4 py-3">
                  <p className={`text-sm text-on-surface ${!c.read ? "font-bold" : "font-medium"}`}>{c.name}</p>
                  <p className="text-xs text-on-surface/50">{c.email}</p>
                  {c.phone && <p className="text-xs text-on-surface/40">{c.phone}</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-on-surface/80 truncate max-w-[300px]">{c.message}</p>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface/50">{new Date(c.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.read ? "bg-surface-container-high text-on-surface/50" : "bg-primary/10 text-primary"}`}>
                    {c.read ? "Read" : "New"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleRead(c._id)} className="text-blue-600 text-xs font-medium cursor-pointer">{c.read ? "Unread" : "Read"}</button>
                    <button onClick={() => setDeleteTarget(c._id)} className="text-error text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/15">
            <p className="text-xs text-on-surface/50">Page {page} of {totalPages}</p>
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
