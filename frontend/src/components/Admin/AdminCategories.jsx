import { useState, useEffect, useRef } from "react"
import { getCategoriesAPI, createCategoryAPI, updateCategoryAPI, deleteCategoryAPI } from "../../api"
import ConfirmModal from "../ConfirmModal"

const PER_PAGE = 10
const emptyForm = { name: "", images: [] }

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [dragActive, setDragActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const fileInputRef = useRef(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function fetchData() {
    setLoading(true)
    try { const res = await getCategoriesAPI(); setCats(res.data?.data || res.data || []) }
    catch { setCats([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showModal])

  const filtered = cats.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function openAdd() { setEditingId(null); setForm(emptyForm); setSaveError(""); setShowModal(true) }
  function openEdit(cat) {
    setEditingId(cat._id)
    setForm({ name: cat.name, images: cat.image ? [{ url: cat.image, preview: cat.image }] : [] })
    setSaveError(""); setShowModal(true)
  }
  function closeModal() { setShowModal(false); setEditingId(null); setForm(emptyForm); setSaveError(""); if (fileInputRef.current) fileInputRef.current.value = "" }

  function handleFiles(files) {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/")).map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setForm(prev => ({ ...prev, images: [...prev.images, ...imgs] }))
  }
  function removeImage(i) {
    setForm(prev => { const u = [...prev.images]; const r = u.splice(i, 1)[0]; if (r.preview?.startsWith("blob:")) URL.revokeObjectURL(r.preview); return { ...prev, images: u } })
  }
  function handleDrag(e) { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false) }
  function handleDrop(e) { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true); setSaveError("")
    const fd = new FormData()
    fd.append("name", form.name)
    const newFile = form.images.find(img => img.file)
    if (newFile) fd.append("image", newFile.file)
    try {
      if (editingId) await updateCategoryAPI(editingId, fd)
      else await createCategoryAPI(fd)
      closeModal(); await fetchData()
    } catch (err) { setSaveError(err.message || "Failed to save") }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    try { await deleteCategoryAPI(id); setCats(prev => prev.filter(c => c._id !== id)) } catch {}
    setDeleteTarget(null)
  }

  function goToPage(p) { setPage(Math.max(1, Math.min(p, totalPages))) }
  function getPageNumbers() {
    const pages = []
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
    else { pages.push(1); if (safePage > 3) pages.push("..."); for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i); if (safePage < totalPages - 2) pages.push("..."); pages.push(totalPages) }
    return pages
  }

  const inputClass = "w-full border border-outline-variant/25 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div>
      <ConfirmModal open={!!deleteTarget} title="Delete Category?" message="Are you sure you want to delete this category? This action cannot be undone." onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-on-surface">{editingId ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-on-surface/60 cursor-pointer"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {saveError && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl">{saveError}</div>}
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Category Name *</label>
                <input type="text" placeholder="e.g. Fruits & Vegetables" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-2">Category Image</label>
                {form.images.length > 0 ? (
                  <div className="relative rounded-xl overflow-hidden border border-outline-variant/20 group">
                    <img src={form.images[0].preview} alt="" className="w-full h-44 object-contain bg-surface-container-low" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-on-surface text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg">Replace</button>
                      <button type="button" onClick={() => removeImage(0)} className="bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                    className={`h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${dragActive ? "border-green-500 bg-green-50" : "border-outline-variant/25 hover:border-green-400"}`}>
                    <span className="material-symbols-outlined text-on-surface/40 text-3xl mb-1">add_photo_alternate</span>
                    <p className="text-xs text-on-surface/60">{dragActive ? "Drop here" : "Drag & drop or click"}</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { handleFiles(e.target.files); e.target.value = "" }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-primary-container hover:bg-primary text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50">{saving ? "Saving..." : editingId ? "Update" : "Add Category"}</button>
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-medium text-on-surface/50 border border-outline-variant/20 rounded-lg cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Categories ({filtered.length})</h1>
          <button onClick={openAdd} className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">+ Add Category</button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant/20 p-3 sm:p-4">
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">search</span>
            <input type="text" placeholder="Search categories..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              className="w-full border border-outline-variant/25 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(4)].map((_, i) => (
              <tr key={i} className="border-t border-outline-variant/15"><td colSpan={4} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : paginated.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-on-surface/40">{cats.length === 0 ? 'No categories yet. Click "+ Add Category".' : "No match."}</td></tr>
            ) : paginated.map(cat => (
              <tr key={cat._id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/50">
                <td className="px-4 py-3">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-10 h-10 rounded object-cover bg-surface-container-low" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center"><span className="material-symbols-outlined text-on-surface/30 text-[16px]">category</span></div>
                  )}
                </td>
                <td className="px-4 py-3 text-on-surface font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-on-surface/50 text-xs">{cat.createdAt ? new Date(cat.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)} className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => setDeleteTarget(cat._id)} className="text-error hover:text-red-700 text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-outline-variant/15 gap-2">
            <p className="text-xs text-on-surface/50">{(safePage - 1) * PER_PAGE + 1}-{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}</p>
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
