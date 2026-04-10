import { useState } from "react"

// mock banners — replace with api later
const defaultBanners = [
  { id: 1, title: "Summer Sale - 50% Off!", image: "https://via.placeholder.com/800x200/22C55E/FFFFFF?text=Summer+Sale", active: true },
  { id: 2, title: "Free Delivery Weekend", image: "https://via.placeholder.com/800x200/EAB308/333333?text=Free+Delivery", active: true },
  { id: 3, title: "New Arrivals", image: "https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=New+Arrivals", active: false },
]

export default function AdminBanners() {
  const [banners, setBanners] = useState(defaultBanners)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")

  function addBanner(e) {
    e.preventDefault()
    if (!title) return
    // TODO: POST /api/admin/banners
    setBanners(prev => [...prev, {
      id: Date.now(),
      title,
      image: image || `https://via.placeholder.com/800x200/22C55E/FFFFFF?text=${encodeURIComponent(title)}`,
      active: true,
    }])
    setTitle("")
    setImage("")
    setShowForm(false)
  }

  function toggleActive(id) {
    // TODO: PATCH /api/admin/banners/:id
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))
  }

  function deleteBanner(id) {
    // TODO: DELETE /api/admin/banners/:id
    if (confirm("Remove this banner?")) {
      setBanners(prev => prev.filter(b => b.id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Banners</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm"
        >
          {showForm ? "Cancel" : "+ Add Banner"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addBanner} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Banner title *" value={title}
              onChange={e => setTitle(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="text" placeholder="Image URL (optional)" value={image}
              onChange={e => setImage(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg text-sm">
            Add Banner
          </button>
        </form>
      )}

      <div className="space-y-4">
        {banners.map(b => (
          <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <img src={b.image} alt={b.title} className="w-full h-32 object-cover" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{b.title}</h3>
                <span className={`text-xs font-medium ${b.active ? "text-green-600" : "text-gray-400"}`}>
                  {b.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(b.id)}
                  className={`text-xs font-medium px-3 py-1 rounded ${b.active ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"}`}
                >
                  {b.active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => deleteBanner(b.id)} className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
