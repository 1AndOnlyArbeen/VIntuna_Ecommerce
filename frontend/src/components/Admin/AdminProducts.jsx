import { useState, useEffect, useRef } from "react"
import { getProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI, getCategoriesAPI } from "../../api"
import ConfirmModal from "../ConfirmModal"

const PRESET_TAGS = [
  { label: "Best Seller", emoji: "\u{1F525}" },
  { label: "Popular Now", emoji: "\u2B50" },
  { label: "Healthy", emoji: "\u{1F49A}" },
  { label: "Organic", emoji: "\u{1F33F}" },
  { label: "New Arrival", emoji: "\u{1F195}" },
  { label: "Limited", emoji: "\u23F3" },
]

const UNIT_OPTIONS = [
  "kg", "g", "mg", "L", "ml", "piece", "pack", "dozen", "box", "bottle", "pouch", "bundle",
]

const PER_PAGE = 8

const emptyForm = {
  name: "", sellingPrice: "", comparePrice: "", category: "",
  description: "", images: [], unit: "", weight: "", inStock: true, tags: [],
}

export default function AdminProducts() {
  const [productList, setProductList] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  // modal
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
    try {
      const [prodRes, catRes] = await Promise.all([getProductsAPI(), getCategoriesAPI()])
      const prods = prodRes.data?.data || prodRes.data || []
      const cats = catRes.data?.data || catRes.data || []
      setProductList(prods)
      setCategories(cats)
    } catch {
      setProductList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showModal])

  const filtered = productList.filter(p => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchCat
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function openAdd() {
    setEditingId(null)
    setForm({ ...emptyForm, category: categories[0]?.name || "" })
    setSaveError("")
    setShowModal(true)
  }

  function openEdit(product) {
    setEditingId(product._id)
    const imgArr = Array.isArray(product.image) ? product.image : product.image ? [product.image] : []
    setForm({
      name: product.name,
      sellingPrice: product.price,
      comparePrice: product.originalPrice || "",
      category: product.category,
      description: product.description || "",
      images: imgArr.map(url => ({ url, preview: url })),
      unit: product.unit || "",
      weight: "",
      inStock: product.inStock !== false,
      tags: Array.isArray(product.tags) ? product.tags : [],
    })
    setSaveError("")
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    setSaveError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // image handling
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
    e.preventDefault(); e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  function handleDrop(e) {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  function toggleTag(label) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(label) ? prev.tags.filter(t => t !== label) : [...prev.tags, label],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.sellingPrice) return

    setSaving(true)
    setSaveError("")

    const fd = new FormData()
    fd.append("name", form.name)
    fd.append("price", form.sellingPrice)
    fd.append("originalPrice", form.comparePrice || form.sellingPrice)
    fd.append("category", form.category)
    fd.append("description", form.description)
    fd.append("unit", form.unit)
    fd.append("inStock", form.inStock)
    fd.append("tags", JSON.stringify(form.tags))

    // only append new file uploads (not existing URLs)
    const hasNewFiles = form.images.some(img => img.file)
    if (hasNewFiles) {
      form.images.forEach(img => {
        if (img.file) fd.append("images", img.file)
      })
    }

    try {
      if (editingId) {
        await updateProductAPI(editingId, fd)
      } else {
        await createProductAPI(fd)
      }
      closeModal()
      await fetchData()
    } catch (err) {
      setSaveError(err.message || "Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProductAPI(id)
      setProductList(prev => prev.filter(p => p._id !== id))
    } catch {}
    setDeleteTarget(null)
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

  const discount = form.comparePrice && form.sellingPrice && Number(form.comparePrice) > Number(form.sellingPrice)
    ? Math.round(((Number(form.comparePrice) - Number(form.sellingPrice)) / Number(form.comparePrice)) * 100)
    : 0

  const inputClass = "w-full border border-outline-variant/25 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div>
      <ConfirmModal open={!!deleteTarget} title="Delete Product?" message="Are you sure you want to delete this product? This action cannot be undone." onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      {/* ===== PRODUCT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-scale-in my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-on-surface">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-on-surface/60 hover:bg-surface-container-high/60 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {saveError && <div className="bg-error/5 border border-error/20 text-error text-sm px-4 py-3 rounded-xl mb-4">{saveError}</div>}

              <div className="flex flex-col lg:flex-row gap-6">
                {/* LEFT */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Product Name *</label>
                    <input type="text" placeholder="e.g. Organic Bananas" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} required />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-2">Details</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-on-surface/50 mb-1">Category</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                          <option value="">Select</option>
                          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-on-surface/50 mb-1">Weight / Qty</label>
                        <input type="text" placeholder="e.g. 500" value={form.weight}
                          onChange={e => setForm({ ...form, weight: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-on-surface/50 mb-1">Unit</label>
                        <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className={inputClass}>
                          <option value="">Select unit</option>
                          {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-2">Pricing</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-on-surface/50 mb-1">Selling Price *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">Rs.</span>
                          <input type="number" min="0" placeholder="0" value={form.sellingPrice}
                            onChange={e => setForm({ ...form, sellingPrice: e.target.value })} className={`${inputClass} pl-10`} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-on-surface/50 mb-1">
                          Compare Price {discount > 0 && <span className="text-primary font-semibold">({discount}% off)</span>}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">Rs.</span>
                          <input type="number" min="0" placeholder="0" value={form.comparePrice}
                            onChange={e => setForm({ ...form, comparePrice: e.target.value })} className={`${inputClass} pl-10`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Description</label>
                    <textarea placeholder="Write a short product description..." value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.inStock}
                      onChange={e => setForm({ ...form, inStock: e.target.checked })}
                      className="w-4 h-4 rounded border-outline-variant/25 text-primary focus:ring-green-500" />
                    <div>
                      <span className="text-sm font-medium text-on-surface/80">In Stock</span>
                      <p className="text-xs text-on-surface/40">Uncheck if currently unavailable</p>
                    </div>
                  </label>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-72 xl:w-80 space-y-4 shrink-0">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Product Images</label>
                    <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragActive ? "border-green-500 bg-green-50" : "border-outline-variant/25 hover:border-green-400"}`}>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                        onChange={e => { handleFiles(e.target.files); e.target.value = "" }} />
                      <span className="material-symbols-outlined text-on-surface/40 text-3xl mb-1 block">add_photo_alternate</span>
                      <p className="text-xs font-medium text-on-surface/60">{dragActive ? "Drop here" : "Drag & drop or click"}</p>
                      <p className="text-[10px] text-on-surface/40 mt-0.5">PNG, JPG, WebP up to 5MB</p>
                    </div>

                    {form.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {form.images.map((img, i) => (
                          <div key={i} className="relative group rounded-lg overflow-hidden border border-outline-variant/20 aspect-square bg-surface-container-low">
                            <img src={img.preview} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(i)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">x</button>
                            {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary-container/90 text-white text-[8px] text-center py-0.5 font-medium">Main</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface/80 mb-1">Display Tags</label>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PRESET_TAGS.map(tag => {
                        const isActive = form.tags.includes(tag.label)
                        return (
                          <button key={tag.label} type="button" onClick={() => toggleTag(tag.label)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                              isActive ? "bg-green-100 border-green-500 text-green-700" : "bg-surface-container-low border-outline-variant/20 text-on-surface/60"
                            }`}>
                            <span>{tag.emoji}</span><span>{tag.label}</span>
                            {isActive && <span className="text-primary">{"\u2713"}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-5 mt-5 border-t border-outline-variant/15">
                <button type="submit" disabled={saving}
                  className="flex-1 sm:flex-none bg-primary-container hover:bg-primary text-white font-semibold px-8 py-2.5 rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </button>
                <button type="button" onClick={closeModal}
                  className="px-6 py-2.5 text-sm font-medium text-on-surface/50 border border-outline-variant/20 rounded-lg cursor-pointer transition-colors hover:text-on-surface/80">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== HEADER + FILTERS ===== */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Products ({filtered.length})</h1>
          <button onClick={openAdd} className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">+ Add Product</button>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant/20 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">search</span>
            <input type="text" placeholder="Search products..." value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              className="w-full border border-outline-variant/25 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
            className="border border-outline-variant/25 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-3 sm:px-4 py-3">Product</th>
              <th className="px-3 sm:px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="px-3 sm:px-4 py-3">Price</th>
              <th className="px-3 sm:px-4 py-3 hidden md:table-cell">Tags</th>
              <th className="px-3 sm:px-4 py-3">Status</th>
              <th className="px-3 sm:px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-outline-variant/15">
                  <td colSpan={6} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-on-surface/40">
                {productList.length === 0 ? "No products yet. Click \"+ Add Product\" to create one." : "No products match your filters."}
              </td></tr>
            ) : paginated.map(p => {
              const imgSrc = Array.isArray(p.image) ? p.image[0] : p.image
              return (
                <tr key={p._id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/50">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover bg-surface-container-low shrink-0" />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-surface-container-high flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-surface/30 text-[16px]">image</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-on-surface font-medium text-xs sm:text-sm block truncate">{p.name}</span>
                        <span className="text-xs text-on-surface/40 sm:hidden">{p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-on-surface/50 hidden sm:table-cell">{p.category}</td>
                  <td className="px-3 sm:px-4 py-3 text-on-surface">
                    Rs.{p.price}
                    {p.originalPrice > p.price && <span className="text-on-surface/40 line-through ml-1 text-xs hidden sm:inline">Rs.{p.originalPrice}</span>}
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(p.tags) ? p.tags : []).map((tag, i) => {
                        const preset = PRESET_TAGS.find(pt => pt.label === tag)
                        return <span key={i} className="text-xs bg-surface-container-high text-on-surface/60 px-1.5 py-0.5 rounded-full">{preset ? `${preset.emoji} ` : ""}{tag}</span>
                      })}
                      {(!p.tags || p.tags.length === 0) && <span className="text-xs text-on-surface/40">--</span>}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.inStock !== false ? "bg-primary/10 text-primary" : "bg-error/10 text-error"}`}>
                      {p.inStock !== false ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer">Edit</button>
                      <button onClick={() => setDeleteTarget(p._id)} className="text-error hover:text-red-700 text-xs font-medium cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-outline-variant/15 gap-2">
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
    </div>
  )
}
