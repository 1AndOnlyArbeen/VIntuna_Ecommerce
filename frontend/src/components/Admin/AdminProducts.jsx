import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProductsAPI, deleteProductAPI, getCategoriesAPI } from "../../api"
import { products as mockProducts, categories as mockCategories } from "../../data/products"

const PRESET_TAGS = [
  { label: "Best Seller", emoji: "\u{1F525}" },
  { label: "Popular Now", emoji: "\u2B50" },
  { label: "Healthy", emoji: "\u{1F49A}" },
  { label: "Organic", emoji: "\u{1F33F}" },
  { label: "New Arrival", emoji: "\u{1F195}" },
  { label: "Limited", emoji: "\u23F3" },
]

const PER_PAGE = 8

export default function AdminProducts() {
  const navigate = useNavigate()
  const [productList, setProductList] = useState([])
  const [categories, setCategories] = useState(mockCategories)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([getProductsAPI(), getCategoriesAPI()])
        setProductList(prodRes.data?.length ? prodRes.data : mockProducts)
        if (catRes.data?.length) setCategories(catRes.data)
      } catch {
        setProductList(mockProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = productList.filter(p => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchCat
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return
    try {
      await deleteProductAPI(id)
    } catch {}
    setProductList(prev => prev.filter(p => (p._id || p.id) !== id))
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Products ({filtered.length})</h1>
        <button onClick={() => navigate("/admin/products/add")} className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search products..." value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id || c.id} value={c.name}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
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
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                  <td colSpan={6} className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No products found.</td></tr>
            ) : paginated.map(p => (
              <tr key={p._id || p.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src={p.image} alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover bg-gray-50 dark:bg-gray-700 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm block truncate">{p.name}</span>
                      <span className="text-xs text-gray-400 sm:hidden">{p.category}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{p.category}</td>
                <td className="px-3 sm:px-4 py-3 text-gray-800 dark:text-gray-200">
                  Rs.{p.price}
                  {p.originalPrice > p.price && <span className="text-gray-400 line-through ml-1 text-xs hidden sm:inline">Rs.{p.originalPrice}</span>}
                </td>
                <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(p.tags) ? p.tags : []).map((tag, i) => {
                      const preset = PRESET_TAGS.find(pt => pt.label === tag)
                      return <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">{preset ? `${preset.emoji} ` : ""}{tag}</span>
                    })}
                    {(!p.tags || p.tags.length === 0) && <span className="text-xs text-gray-400">--</span>}
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.inStock !== false ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"}`}>
                    {p.inStock !== false ? "In Stock" : "Out"}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/products/add?edit=${p._id || p.id}`)} className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => deleteProduct(p._id || p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700 gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(safePage - 1) * PER_PAGE + 1}-{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="px-2 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Prev</button>
              {getPageNumbers().map((p, i) => p === "..." ? (
                <span key={`e${i}`} className="px-1 text-gray-400 text-xs">...</span>
              ) : (
                <button key={p} onClick={() => goToPage(p)} className={`w-7 h-7 rounded text-xs font-medium transition-colors cursor-pointer ${p === safePage ? "bg-green-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{p}</button>
              ))}
              <button onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="px-2 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
