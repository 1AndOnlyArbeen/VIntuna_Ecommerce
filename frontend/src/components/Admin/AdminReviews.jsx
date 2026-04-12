import { useState, useEffect } from "react"
import { getAllReviewsAPI, deleteReviewAPI } from "../../api"
import ConfirmModal from "../ConfirmModal"

const PER_PAGE = 15

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function fetchData() {
    setLoading(true)
    try {
      const res = await getAllReviewsAPI({ page, limit: PER_PAGE })
      const d = res.data
      setReviews(d?.data || [])
      setTotalPages(d?.totalPages || 1)
      setTotal(d?.total || 0)
    } catch { setReviews([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page])

  async function handleDelete(id) {
    try { await deleteReviewAPI(id); fetchData() } catch {}
    setDeleteTarget(null)
  }

  return (
    <div>
      <ConfirmModal open={!!deleteTarget} title="Delete Review?" message="Are you sure you want to delete this review? This action cannot be undone." onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Reviews ({total})</h1>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 hidden md:table-cell">Review</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => (
              <tr key={i} className="border-t"><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : reviews.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-on-surface/40">No reviews yet.</td></tr>
            ) : reviews.map(r => (
              <tr key={r._id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-on-surface">{r.userId?.name || "Deleted"}</p>
                  <p className="text-xs text-on-surface/50">{r.userId?.email || ""}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {r.productId?.image?.[0] && <img src={r.productId.image[0]} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                    <span className="text-sm text-on-surface truncate max-w-[120px]">{r.productId?.name || "Deleted"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="material-symbols-outlined text-secondary text-[14px]" style={{ fontVariationSettings: `'FILL' ${i <= r.rating ? 1 : 0}` }}>star</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-xs font-bold text-on-surface truncate max-w-[200px]">{r.title || "—"}</p>
                  <p className="text-xs text-on-surface/50 truncate max-w-[200px]">{r.body || ""}</p>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface/50">{new Date(r.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setDeleteTarget(r._id)} className="text-error text-xs font-medium cursor-pointer">Delete</button>
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
