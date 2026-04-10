import { useState, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { products as initialProducts, categories } from "../../data/products"

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

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("edit")

  // find product if editing
  const editProduct = editId ? initialProducts.find(p => p.id === Number(editId)) : null

  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(() => {
    if (editProduct) {
      return {
        name: editProduct.name,
        sellingPrice: editProduct.price,
        comparePrice: editProduct.originalPrice,
        category: editProduct.category,
        description: editProduct.description || "",
        images: editProduct.image ? [{ url: editProduct.image, preview: editProduct.image }] : [],
        unit: "",
        weight: "",
        inStock: editProduct.inStock,
        tags: Array.isArray(editProduct.tags) ? editProduct.tags : [],
      }
    }
    return {
      name: "", sellingPrice: "", comparePrice: "", category: categories[0]?.name || "",
      description: "", images: [], unit: "", weight: "", inStock: true, tags: [],
    }
  })

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

  // ---- tags ----
  function toggleTag(label) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(label)
        ? prev.tags.filter(t => t !== label)
        : [...prev.tags, label],
    }))
  }

  // ---- submit ----
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.sellingPrice) return

    // TODO: POST or PUT to /api/admin/products
    // For now just navigate back
    navigate("/admin/products")
  }

  const discount = form.comparePrice && form.sellingPrice && Number(form.comparePrice) > Number(form.sellingPrice)
    ? Math.round(((Number(form.comparePrice) - Number(form.sellingPrice)) / Number(form.comparePrice)) * 100)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/products")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {editProduct ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ============ LEFT COLUMN ============ */}
          <div className="flex-1 space-y-5">

            {/* Product Name */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Organic Bananas"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category, Weight, Unit */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Weight / Qty</label>
                  <input
                    type="text"
                    placeholder="e.g. 500"
                    value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select unit</option>
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pricing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Selling Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                    <input
                      type="number" min="0" placeholder="0"
                      value={form.sellingPrice}
                      onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Compare Price
                    {discount > 0 && <span className="ml-2 text-green-600 font-semibold">({discount}% off)</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                    <input
                      type="number" min="0" placeholder="0"
                      value={form.comparePrice}
                      onChange={e => setForm({ ...form, comparePrice: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
              {discount > 0 && (
                <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 text-xs text-green-700 dark:text-green-400">
                  Customer saves Rs.{Number(form.comparePrice) - Number(form.sellingPrice)} ({discount}% off)
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Write a short product description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={4}
              />
            </div>

            {/* In Stock */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={e => setForm({ ...form, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock</span>
                  <p className="text-xs text-gray-400">Uncheck if this product is currently unavailable</p>
                </div>
              </label>
            </div>

            {/* Image Upload - Drag & Drop at bottom of left */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Images</label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${dragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.01]"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => { handleFiles(e.target.files); e.target.value = "" }}
                />
                <div className="text-4xl mb-3">{dragActive ? "\u{1F4E5}" : "\u{1F4F8}"}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-green-600 dark:text-green-400">Click to upload</span> or drag and drop images here
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
              </div>
              {form.images.length > 0 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {form.images.length} image{form.images.length > 1 ? "s" : ""} added - see preview on the right
                </p>
              )}
            </div>
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <div className="w-full lg:w-80 space-y-5">

            {/* Image Previews - top of right */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Image Preview</label>
              {form.images.length > 0 ? (
                <div>
                  {/* Main image large */}
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 mb-3">
                    <img
                      src={form.images[0].preview}
                      alt="Main preview"
                      className="w-full h-48 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(0)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-colors"
                    >
                      x
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-green-600/90 text-white text-[10px] text-center py-1 font-medium">
                      Main Image
                    </span>
                  </div>
                  {/* Thumbnails */}
                  {form.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {form.images.slice(1).map((img, i) => (
                        <div key={i + 1} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 aspect-square bg-gray-50 dark:bg-gray-700">
                          <img src={img.preview} alt={`Preview ${i + 2}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i + 1)}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg h-48 flex flex-col items-center justify-center text-gray-400">
                  <div className="text-3xl mb-2">{"\u{1F5BC}\uFE0F"}</div>
                  <p className="text-xs">Upload images to see preview</p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Display Tags</label>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Shown on product card in home page</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_TAGS.map(tag => {
                  const isActive = form.tags.includes(tag.label)
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => toggleTag(tag.label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${isActive
                          ? "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                    >
                      <span>{tag.emoji}</span>
                      <span>{tag.label}</span>
                      {isActive && <span className="ml-0.5 text-green-600">{"\u2713"}</span>}
                    </button>
                  )
                })}
              </div>
              {form.tags.length > 0 && (
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Selected: {form.tags.map((t, i) => {
                    const preset = PRESET_TAGS.find(p => p.label === t)
                    return <span key={t}>{i > 0 && ", "}{preset?.emoji} {t}</span>
                  })}
                </div>
              )}
            </div>

            {/* Live Preview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Card Preview</label>
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-900/50">
                <div className="relative">
                  {form.images[0] ? (
                    <img src={form.images[0].preview} alt="" className="w-full h-32 object-contain rounded-lg bg-white dark:bg-gray-800" />
                  ) : (
                    <div className="w-full h-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                  {form.tags.length > 0 && (
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                      {form.tags.slice(0, 2).map(t => {
                        const preset = PRESET_TAGS.find(p => p.label === t)
                        return (
                          <span key={t} className="bg-white dark:bg-gray-800 shadow text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                            {preset?.emoji} {t}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {form.name || "Product Name"}
                  </p>
                  {form.weight && form.unit && (
                    <p className="text-xs text-gray-400">{form.weight} {form.unit}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Rs.{form.sellingPrice || "0"}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">Rs.{form.comparePrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons - sticky bottom */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex gap-3 sticky bottom-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors"
          >
            {editProduct ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
