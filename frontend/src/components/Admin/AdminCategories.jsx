import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCategoriesAPI, deleteCategoryAPI } from "../../api"
import { categories as mockCats } from "../../data/products"

const PER_PAGE = 8

export default function AdminCategories() {
  const navigate = useNavigate()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filtered = cats.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Categories ({filtered.length})</h1>
        <button onClick={() => navigate("/admin/categories/add")} className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
          + Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search categories..." value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {paginated.map(cat => (
            <div key={cat._id || cat.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-3 sm:p-4 overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-20 sm:h-24 object-contain rounded-lg mb-3 bg-gray-50 dark:bg-gray-700" />
              ) : (
                <div className="w-full h-20 sm:h-24 rounded-lg mb-3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl sm:text-4xl">{cat.icon}</div>
              )}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-1">{cat.icon}</div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">{cat.name}</h3>
                {cat.tag && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded mt-1 inline-block">{cat.tag}</span>}
                {cat.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{cat.description}</p>}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => navigate(`/admin/categories/add?edit=${cat._id || cat.id}`)} className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">Edit</button>
                <button onClick={() => deleteCat(cat._id || cat.id)} className="text-red-500 text-xs font-medium hover:underline cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && <div className="text-center py-12 text-gray-400">No categories found.</div>}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 gap-2">
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
  )
}
