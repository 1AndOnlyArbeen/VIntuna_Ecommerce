import { useState, useRef, useEffect } from "react"

const PER_PAGE = 4

const defaultBanners = [
  { id: 1, title: "Mega Sale — Up to 50% Off", subtitle: "Grab the biggest discounts of the season!", buttonText: "Shop Now", image: "https://placehold.co/1200x420/F97316/FFFFFF?font=roboto&text=.", link: "/search?q=Snacks", active: true },
  { id: 2, title: "Free Delivery Above Rs.200", subtitle: "No hidden charges. What you see is what you pay.", buttonText: "Order Now", image: "https://placehold.co/1200x420/16A34A/FFFFFF?font=roboto&text=.", link: "/search?q=Nepali", active: true },
  { id: 3, title: "Pay via eSewa, Khalti & More", subtitle: "Multiple payment options. Fast & secure checkout.", buttonText: "Explore", image: "https://placehold.co/1200x420/7C3AED/FFFFFF?font=roboto&text=.", link: "/", active: true },
  { id: 4, title: "Flash Deals Every Day", subtitle: "Limited time offers on your favorite products.", buttonText: "Grab Deals", image: "https://placehold.co/1200x420/DC2626/FFFFFF?font=roboto&text=.", link: "/search?q=Drinks", active: true },
  { id: 5, title: "Farm Fresh & Organic Picks", subtitle: "Handpicked organic produce from local farms.", buttonText: "Shop Fresh", image: "https://placehold.co/1200x420/0284C7/FFFFFF?font=roboto&text=.", link: "/search?q=Fruits", active: true },
  { id: 6, title: "Buy 2 Get 1 Free", subtitle: "Stock up and save on everyday essentials.", buttonText: "Shop Now", image: "https://placehold.co/1200x420/DB2777/FFFFFF?font=roboto&text=.", link: "/search?q=Dairy", active: false },
  { id: 7, title: "Dashain Dhamaka Offers", subtitle: "Celebrate with unbeatable deals on groceries.", buttonText: "Explore Deals", image: "https://placehold.co/1200x420/EA580C/FFFFFF?font=roboto&text=.", link: "/search?q=Spices", active: true },
  { id: 8, title: "Tihar Special — Sweet Deals", subtitle: "Sweets, snacks, and festive essentials.", buttonText: "Shop Sweets", image: "https://placehold.co/1200x420/CA8A04/FFFFFF?font=roboto&text=.", link: "/search?q=Snacks", active: true },
  { id: 9, title: "Winter Essentials", subtitle: "Hot beverages, soups, and warming essentials.", buttonText: "Stay Warm", image: "https://placehold.co/1200x420/4338CA/FFFFFF?font=roboto&text=.", link: "/search?q=Tea", active: false },
  { id: 10, title: "New Year Clearance Sale", subtitle: "Ring in the new year with massive discounts!", buttonText: "Shop Sale", image: "https://placehold.co/1200x420/059669/FFFFFF?font=roboto&text=.", link: "/search?q=Rice", active: true },
]

const emptyForm = { title: "", subtitle: "", buttonText: "Shop Now", link: "/", image: null }

export default function AdminBanners() {
  const [banners, setBanners] = useState(defaultBanners)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [dragging, setDragging] = useState(false)
  const [page, setPage] = useState(1)
  const fileInputRef = useRef(null)

  const totalPages = Math.max(1, Math.ceil(banners.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visibleBanners = banners.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

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

  function openEdit(banner) {
    setEditingId(banner.id)
    setForm({ title: banner.title, subtitle: banner.subtitle || "", buttonText: banner.buttonText || "Shop Now", link: banner.link, image: banner.image })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => setForm(prev => ({ ...prev, image: e.target.result }))
    reader.readAsDataURL(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  function onDragOver(e) { e.preventDefault(); setDragging(true) }
  function onDragLeave(e) { e.preventDefault(); setDragging(false) }
  function onFileSelect(e) { handleFile(e.target.files?.[0]) }

  function removeImage() {
    setForm(prev => ({ ...prev, image: null }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.image) return

    if (editingId) {
      setBanners(prev => prev.map(b => b.id === editingId ? { ...b, ...form } : b))
    } else {
      setBanners(prev => [...prev, { id: Date.now(), ...form, active: true }])
      const newTotal = Math.ceil((banners.length + 1) / PER_PAGE)
      setPage(newTotal)
    }
    closeModal()
  }

  function toggleActive(id) {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))
  }

  function deleteBanner(id) {
    if (confirm("Remove this banner?")) {
      setBanners(prev => {
        const updated = prev.filter(b => b.id !== id)
        const newTotal = Math.max(1, Math.ceil(updated.length / PER_PAGE))
        if (page > newTotal) setPage(newTotal)
        return updated
      })
    }
  }

  function globalIndex(localIndex) {
    return (safePage - 1) * PER_PAGE + localIndex
  }

  const inputClass = "w-full border border-outline-variant/25 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"

  return (
    <div>
      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto animate-fade-in" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-on-surface">
                {editingId ? "Edit Banner" : "Add New Banner"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-on-surface/60 dark:hover:text-gray-300 hover:bg-surface-container-high/60 cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Title — big heading style */}
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Banner Title *</label>
                <input
                  type="text" placeholder="e.g. Mega Sale — Up to 50% Off" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-outline-variant/25 dark:border-gray-600 rounded-lg px-4 py-3.5 text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow placeholder:font-normal placeholder:text-on-surface/40"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Subtitle</label>
                <input
                  type="text" placeholder="Short description shown below the title" value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Button Text</label>
                  <input
                    type="text" placeholder="e.g. Shop Now, Explore, Grab Deals" value={form.buttonText}
                    onChange={e => setForm({ ...form, buttonText: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface/80 mb-1.5">Button Link (category/page)</label>
                  <input
                    type="text" placeholder="e.g. /search?q=Fruits or /products" value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    className={inputClass}
                  />
                  <p className="text-[10px] text-on-surface/40 mt-1">Use /search?q=CategoryName to link to a category</p>
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-semibold text-on-surface/80 mb-2">Banner Image *</label>
                {form.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-outline-variant/20 group">
                    <img src={form.image} alt="Preview" className="w-full h-[180px] sm:h-[220px] object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-surface-container-high text-on-surface text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg transition-colors">Replace</button>
                      <button type="button" onClick={removeImage}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-lg transition-colors">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-[180px] sm:h-[220px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragging
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-outline-variant/25 dark:border-gray-600 hover:border-green-400 hover:bg-surface-container-high/50/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      dragging ? "bg-green-100 dark:bg-green-900/40" : "bg-surface-container-high"
                    }`}>
                      <svg className={`w-6 h-6 ${dragging ? "text-primary" : "text-on-surface/40"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-on-surface/60 mb-0.5">
                      {dragging ? "Drop image here" : "Drag & drop banner image"}
                    </p>
                    <p className="text-xs text-on-surface/40">or click to browse</p>
                    <p className="text-[10px] text-on-surface/40 mt-1.5">Recommended: 1200 x 420px</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary-container hover:bg-primary text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors">
                  {editingId ? "Save Changes" : "Add Banner"}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-medium text-on-surface/50 hover:text-on-surface/80 dark:hover:text-gray-200 border border-outline-variant/20 rounded-lg cursor-pointer transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== HEADER (sticky blurry) ===== */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight text-center">Banners</h1>
            <p className="text-sm text-on-surface/50 mt-0.5">{banners.length} banners &middot; {banners.filter(b => b.active).length} active</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-primary-container hover:bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
          >
            + Add Banner
          </button>
        </div>
      </div>

      {/* ===== TABLE LIST ===== */}
      <div className="bg-white/90/90 backdrop-blur-sm rounded-xl border border-outline-variant/20/50/50 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low/60">
              <th className="px-4 py-3 w-8">#</th>
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3 hidden md:table-cell">Button</th>
              <th className="px-4 py-3 hidden lg:table-cell">Link</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleBanners.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-16 text-center text-on-surface/40">No banners yet. Add your first banner to get started.</td></tr>
            ) : visibleBanners.map((b, i) => (
              <tr key={b.id} className={`border-t border-outline-variant/15/50 hover:bg-surface-container-low/40 ${!b.active ? "opacity-50" : ""}`}>
                <td className="px-4 py-3 text-xs text-on-surface/40 font-medium">{globalIndex(i) + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Image thumbnail with overlay preview */}
                    <div className="relative w-28 sm:w-36 h-16 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20">
                      <img src={b.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                      <div className="absolute inset-0 flex items-center px-2">
                        <div className="min-w-0">
                          <p className="text-white text-[9px] sm:text-[10px] font-bold leading-tight truncate drop-shadow-md">{b.title}</p>
                          {b.subtitle && <p className="text-white/70 text-[7px] sm:text-[8px] truncate drop-shadow-sm">{b.subtitle}</p>}
                        </div>
                      </div>
                    </div>
                    {/* Text info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-on-surface text-sm truncate">{b.title}</h3>
                      {b.subtitle && <p className="text-xs text-on-surface/50 truncate">{b.subtitle}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="inline-block bg-surface-container-high text-on-surface/80 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {b.buttonText || "Shop Now"}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-on-surface/50 font-mono">{b.link}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    b.active
                      ? "bg-primary/10 text-primary dark:bg-green-900/40 dark:text-green-400"
                      : "bg-surface-container-high text-on-surface/50"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${b.active ? "bg-primary-container" : "bg-gray-400"}`} />
                    {b.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(b.id)} className="text-yellow-600 hover:text-yellow-800 dark:text-gold text-xs font-medium cursor-pointer">{b.active ? "Disable" : "Enable"}</button>
                    <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => deleteBanner(b.id)} className="text-error hover:text-red-700 dark:text-red-400 text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface/50">
            Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, banners.length)} of {banners.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 disabled:opacity-30 hover:bg-surface-container-low dark:hover:bg-gray-800 text-on-surface/60 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-8 h-8 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  safePage === num
                    ? "bg-primary-container text-white"
                    : "border border-outline-variant/20 text-on-surface/60 hover:bg-surface-container-low dark:hover:bg-gray-800"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 disabled:opacity-30 hover:bg-surface-container-low dark:hover:bg-gray-800 text-on-surface/60 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
