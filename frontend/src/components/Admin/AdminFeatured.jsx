import { useState } from "react"
import { products } from "../../data/products"

export default function AdminFeatured() {
  // featured products are just flagged products
  // TODO: fetch from GET /api/admin/featured
  const [featuredIds, setFeaturedIds] = useState([1, 4, 7, 10, 13])

  function toggleFeatured(id) {
    // TODO: PATCH /api/admin/featured/:id
    setFeaturedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const featured = products.filter(p => featuredIds.includes(p.id))
  const notFeatured = products.filter(p => !featuredIds.includes(p.id))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Featured Products</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        These products will appear highlighted on the homepage. Click to add or remove.
      </p>

      {/* currently featured */}
      <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Currently Featured ({featured.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {featured.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 border-2 border-yellow-400 rounded-xl p-3 relative">
            <span className="absolute top-1 right-1 text-yellow-500 text-lg">⭐</span>
            <img src={p.image} alt={p.name} className="w-16 h-16 mx-auto object-contain mb-2" />
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 text-center truncate">{p.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Rs.{p.price}</p>
            <button
              onClick={() => toggleFeatured(p.id)}
              className="w-full mt-2 text-xs font-medium text-red-500 hover:text-red-700 py-1 border border-red-200 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Remove
            </button>
          </div>
        ))}
        {featured.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm col-span-4">No featured products yet. Add some below.</p>
        )}
      </div>

      {/* add more */}
      <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Add to Featured</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {notFeatured.map(p => (
              <tr key={p.id} className="border-t dark:border-gray-700">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{p.name}</td>
                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{p.category}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Rs.{p.price}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleFeatured(p.id)}
                    className="text-xs font-medium text-green-600 hover:text-green-800 px-3 py-1 border border-green-200 dark:border-green-800 rounded hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    + Feature
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
