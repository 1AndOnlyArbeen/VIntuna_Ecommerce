import { useState, useEffect, useRef } from "react"
import { getCategoriesAPI, deleteCategoryAPI } from "../../api"
import { categories as mockCats } from "../../data/products"

const PER_PAGE = 12

const emptyForm = { name: "", icon: "", description: "", tag: "", images: [] }

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  // modal state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getCategoriesAPI()
        setCats(res.data?.length ? res.data : mockCats)
      } catch {
        setCats(mockCats)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // lock body scroll
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showModal])

  const filtered = cats.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  // ---- modal ----
  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(cat) {
    setEditingId(cat._id || cat.id)
    setForm({
      name: cat.name,
      icon: cat.icon || "",
      description: cat.description || "",
      tag: cat.tag || "",
      images: cat.image ? [{ url: cat.image, preview: cat.image }] : [],
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ---- image handling ----
  function handleFiles(files) {
    const newImages = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }))
  }

  function removeImage(index) {
    setForm(prev => {
      const updated = [...prev.images]
      const removed = updated.splice(index, 1)[0]
      if (removed.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview)
      return { ...prev, images: updated }
    })
  }

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    // TODO: POST or PUT /api/admin/categories
    closeModal()
  }

  async function deleteCat(id) {
    if (!confirm("Delete this category?")) return
    try { await deleteCategoryAPI(id) } catch {}
    setCats(prev => prev.filter(c => (c._id || c.id) !== id))
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
      {/* ===== CATEGORY MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto animate-fade-in" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-on-surface">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-on-surface/60 dark:hover:text-gray-300 hover:bg-surface-container-high/60 cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">

                {/* LEFT — fields */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Category Name *</label>
                    <input type="text" placeholder="e.g. Fruits & Vegetables" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass} required />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-on-surface/50 mb-1">Emoji Icon</label>
                      <input type="text" placeholder="e.g. 🥬" value={form.icon}
                        onChange={e => setForm({ ...form, icon: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface/50 mb-1">Tag</label>
                      <input type="text" placeholder="e.g. popular" value={form.tag}
                        onChange={e => setForm({ ...form, tag: e.target.value })}
                        className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Description</label>
                    <textarea placeholder="Short category description..." value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className={`${inputClass} resize-none`} rows={3} />
                  </div>
                </div>

                {/* RIGHT — image */}
                <div className="w-full lg:w-64 xl:w-72 shrink-0 space-y-3">
                  <label className="block text-sm font-semibold text-on-surface/80">Category Image</label>

                  {/* Upload zone / preview */}
                  {form.images.length > 0 ? (
                    <div className="relative rounded-xl overflow-hidden border border-outline-variant/20 group">
                      <img src={form.images[0].preview} alt="Preview" className="w-full h-44 object-contain bg-surface-container-low" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="bg-white hover:bg-surface-container-high text-on-surface text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg transition-colors">Replace</button>
                        <button type="button" onClick={() => removeImage(0)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg transition-colors">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-outline-variant/25 dark:border-gray-600 hover:border-green-400 hover:bg-surface-container-high/50/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        dragActive ? "bg-green-100 dark:bg-green-900/40" : "bg-surface-container-high"
                      }`}>
                        <svg className={`w-5 h-5 ${dragActive ? "text-primary" : "text-on-surface/40"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-on-surface/60">
                        {dragActive ? "Drop here" : "Drag & drop or click"}
                      </p>
                      <p className="text-[10px] text-on-surface/40 mt-0.5">PNG, JPG, WebP</p>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { handleFiles(e.target.files); e.target.value = "" }} />

                  {/* Live preview card */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface/50 mb-1.5">Card Preview</label>
                    <div className="border border-outline-variant/20 rounded-xl p-3 bg-surface-container-low/50 text-center">
                      <div className="text-2xl mb-1">{form.icon || "📦"}</div>
                      <h3 className="font-medium text-on-surface text-sm">{form.name || "Category Name"}</h3>
                      {form.tag && <span className="text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded mt-1 inline-block">{form.tag}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-5 mt-5 border-t border-outline-variant/15">
                <button type="submit" className="flex-1 sm:flex-none bg-primary-container hover:bg-primary text-white font-semibold px-8 py-2.5 rounded-lg text-sm cursor-pointer transition-colors">
                  {editingId ? "Update Category" : "Add Category"}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight text-center">Categories ({filtered.length})</h1>
          <button onClick={openAdd} className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
            + Add Category
          </button>
        </div>

        <div className="bg-white/80/80 backdrop-blur-md rounded-xl border border-outline-variant/20/50/50 p-3 sm:p-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search categories..." value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
            className="w-full border border-outline-variant/25 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>
      </div>

      {/* ===== GRID ===== */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/90/90 backdrop-blur-sm border border-outline-variant/20/50/50 rounded-xl p-4 animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {paginated.map(cat => (
            <div key={cat._id || cat.id} className="bg-white/90/90 backdrop-blur-sm border border-outline-variant/20/50/50 rounded-xl p-3 sm:p-4 overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-20 sm:h-24 object-contain rounded-lg mb-3 bg-surface-container-low" />
              ) : (
                <div className="w-full h-20 sm:h-24 rounded-lg mb-3 bg-surface-container-high flex items-center justify-center text-3xl sm:text-4xl">{cat.icon}</div>
              )}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-1">{cat.icon}</div>
                <h3 className="font-medium text-on-surface text-xs sm:text-sm">{cat.name}</h3>
                {cat.tag && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded mt-1 inline-block">{cat.tag}</span>}
                {cat.description && <p className="text-xs text-on-surface/50 mt-1 line-clamp-2">{cat.description}</p>}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => openEdit(cat)} className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">Edit</button>
                <button onClick={() => deleteCat(cat._id || cat.id)} className="text-error text-xs font-medium hover:underline cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && <div className="text-center py-12 text-on-surface/40">No categories found.</div>}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white/60 backdrop-blur-2xl rounded-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 py-3 gap-2">
          <p className="text-xs text-on-surface/50">
            {(safePage - 1) * PER_PAGE + 1}-{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
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
  )
}
