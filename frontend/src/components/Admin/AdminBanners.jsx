import { useState, useRef, useEffect } from "react"
import { getBannersAPI, createBannerAPI, updateBannerAPI, toggleBannerAPI, deleteBannerAPI } from "../../api"
import ConfirmModal from "../ConfirmModal"

const PER_PAGE = 6
const emptyForm = { title: "", subtitle: "", buttonText: "Shop Now", link: "/", imageFile: null, imagePreview: "" }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const fileInputRef = useRef(null)

  async function fetchData() {
    setLoading(true)
    try {
      const res = await getBannersAPI()
      setBanners(res.data?.data || res.data || [])
    } catch { setBanners([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showModal])

  const totalPages = Math.max(1, Math.ceil(banners.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visible = banners.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function openAdd() { setEditingId(null); setForm(emptyForm); setSaveError(""); setShowModal(true) }
  function openEdit(b) {
    setEditingId(b._id)
    setForm({ title: b.title, subtitle: b.subtitle || "", buttonText: b.buttonText || "Shop Now", link: b.link || "/", imageFile: null, imagePreview: b.image || "" })
    setSaveError(""); setShowModal(true)
  }
  function closeModal() { setShowModal(false); setEditingId(null); setForm(emptyForm); setSaveError(""); if (fileInputRef.current) fileInputRef.current.value = "" }

  function onFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true); setSaveError("")

    const fd = new FormData()
    fd.append("title", form.title)
    fd.append("subtitle", form.subtitle)
    fd.append("buttonText", form.buttonText)
    fd.append("link", form.link)
    if (form.imageFile) fd.append("image", form.imageFile)

    try {
      if (editingId) await updateBannerAPI(editingId, fd)
      else await createBannerAPI(fd)
      closeModal(); await fetchData()
    } catch (err) { setSaveError(err.message || "Failed to save") }
    finally { setSaving(false) }
  }

  async function handleToggle(id) {
    try { await toggleBannerAPI(id); await fetchData() } catch {}
  }

  async function handleDelete(id) {
    try { await deleteBannerAPI(id); setBanners(prev => prev.filter(b => b._id !== id)) } catch {}
    setDeleteTarget(null)
  }

  const inputClass = "w-full border border-outline-variant/25 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div>
      <ConfirmModal open={!!deleteTarget} title="Delete Banner?" message="Are you sure you want to delete this banner? This action cannot be undone." onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-on-surface">{editingId ? "Edit Banner" : "Add New Banner"}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-on-surface/60 cursor-pointer"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {saveError && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl">{saveError}</div>}
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Title *</label>
                <input type="text" placeholder="e.g. Mega Sale — Up to 50% Off" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={`${inputClass} text-lg font-bold`} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Subtitle</label>
                <input type="text" placeholder="Short description" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Button Text</label>
                  <input type="text" value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Link</label>
                  <input type="text" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-2">Banner Image</label>
                {form.imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-outline-variant/20 group">
                    <img src={form.imagePreview} alt="Preview" className="w-full h-[180px] object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-on-surface text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg">Replace</button>
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, imageFile: null, imagePreview: "" }))} className="bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="h-[180px] border-2 border-dashed border-outline-variant/25 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-all">
                    <span className="material-symbols-outlined text-on-surface/40 text-3xl mb-1">add_photo_alternate</span>
                    <p className="text-xs text-on-surface/60">Click to upload (1200x420 recommended)</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-primary-container hover:bg-primary text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save Changes" : "Add Banner"}</button>
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-medium text-on-surface/50 border border-outline-variant/20 rounded-lg cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Banners</h1>
            <p className="text-sm text-on-surface/50 mt-0.5">{banners.length} total &middot; {banners.filter(b => b.active).length} active</p>
          </div>
          <button onClick={openAdd} className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer">+ Add Banner</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3 hidden md:table-cell">Button</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => (
              <tr key={i} className="border-t"><td colSpan={4} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : visible.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-on-surface/40">{banners.length === 0 ? 'No banners yet. Click "+ Add Banner".' : "No banners match."}</td></tr>
            ) : visible.map(b => (
              <tr key={b._id} className={`border-t hover:bg-surface-container-low/50 ${!b.active ? "opacity-50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-16 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container-low">
                      {b.image ? <img src={b.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-on-surface/30">image</span></div>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-on-surface text-sm truncate">{b.title}</h3>
                      {b.subtitle && <p className="text-xs text-on-surface/50 truncate">{b.subtitle}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs bg-surface-container-high text-on-surface/80 px-2.5 py-1 rounded-lg">{b.buttonText}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.active ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface/50"}`}>{b.active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleToggle(b._id)} className="text-yellow-600 text-xs font-medium cursor-pointer">{b.active ? "Disable" : "Enable"}</button>
                    <button onClick={() => openEdit(b)} className="text-blue-600 text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => setDeleteTarget(b._id)} className="text-error text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/15">
            <p className="text-xs text-on-surface/50">{(safePage - 1) * PER_PAGE + 1}-{Math.min(safePage * PER_PAGE, banners.length)} of {banners.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="px-2 py-1 rounded text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded text-xs font-medium cursor-pointer ${n === safePage ? "bg-primary-container text-white" : "text-on-surface/60 hover:bg-surface-container-high/60"}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="px-2 py-1 rounded text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
