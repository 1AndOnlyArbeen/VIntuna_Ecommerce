import { useState, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { categories as defaultCats } from "../../data/products"

export default function AdminAddCategory() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("edit")
  const editCat = editId ? defaultCats.find(c => c.id === Number(editId)) : null

  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(() => {
    if (editCat) {
      return {
        name: editCat.name,
        icon: editCat.icon || "",
        description: editCat.description || "",
        tag: editCat.tag || "",
        images: editCat.image ? [{ url: editCat.image, preview: editCat.image }] : [],
      }
    }
    return { name: "", icon: "", description: "", tag: "", images: [] }
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

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    // TODO: POST or PUT /api/admin/categories
    navigate("/admin/categories")
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/categories")}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {editCat ? "Edit Category" : "Add New Category"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ---- LEFT COLUMN ---- */}
          <div className="flex-1 space-y-5">

            {/* Name */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Fruits & Vegetables"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Icon & Tag */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    placeholder="e.g. \u{1F96C}"
                    value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. popular, seasonal"
                    value={form.tag}
                    onChange={e => setForm({ ...form, tag: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Write a short category description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={4}
              />
            </div>

            {/* Image Upload - drag & drop */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Image</label>
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
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
              {form.images.length > 0 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {form.images.length} image{form.images.length > 1 ? "s" : ""} added - see preview on the right
                </p>
              )}
            </div>
          </div>

          {/* ---- RIGHT COLUMN ---- */}
          <div className="w-full lg:w-80 space-y-5">

            {/* Image Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Image Preview</label>
              {form.images.length > 0 ? (
                <div>
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

            {/* Live Preview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Card Preview</label>
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50 text-center">
                {form.images[0] ? (
                  <img src={form.images[0].preview} alt="" className="w-full h-24 object-cover rounded-lg mb-3 bg-white dark:bg-gray-800" />
                ) : (
                  <div className="w-full h-24 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-sm mb-3">
                    No image
                  </div>
                )}
                <div className="text-3xl mb-1">{form.icon || "\u{1F4E6}"}</div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {form.name || "Category Name"}
                </h3>
                {form.tag && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded mt-1 inline-block">{form.tag}</span>
                )}
                {form.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{form.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex gap-3 sticky bottom-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors"
          >
            {editCat ? "Update Category" : "Add Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
