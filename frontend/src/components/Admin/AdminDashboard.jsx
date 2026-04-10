import { Link } from "react-router-dom"
import { products, categories } from "../../data/products"

export default function AdminDashboard() {
  const totalProducts = products.length
  const inStock = products.filter(p => p.inStock).length
  const outOfStock = totalProducts - inStock
  const totalCategories = categories.length

  const stats = [
    { label: "Total Products", value: totalProducts, color: "bg-green-500", link: "/admin/products" },
    { label: "In Stock", value: inStock, color: "bg-blue-500", link: "/admin/products" },
    { label: "Out of Stock", value: outOfStock, color: "bg-red-500", link: "/admin/products" },
    { label: "Categories", value: totalCategories, color: "bg-yellow-500", link: "/admin/categories" },
    { label: "Banners", value: 3, color: "bg-purple-500", link: "/admin/banners" },
    { label: "Discounts", value: 5, color: "bg-pink-500", link: "/admin/discounts" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Overview</h1>

      {/* stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link
            key={s.label}
            to={s.link}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-3`}>
              {s.value}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* recent products */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 dark:text-white">Recent Products</h2>
          <Link to="/admin/products" className="text-green-600 text-sm hover:underline">View all</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="pb-2">Name</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map(p => (
              <tr key={p.id} className="border-b dark:border-gray-700 last:border-0">
                <td className="py-2.5 text-gray-800 dark:text-gray-200">{p.name}</td>
                <td className="py-2.5 text-gray-500 dark:text-gray-400">{p.category}</td>
                <td className="py-2.5 text-gray-800 dark:text-gray-200">Rs.{p.price}</td>
                <td className="py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.inStock ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"}`}>
                    {p.inStock ? "In Stock" : "Out"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
