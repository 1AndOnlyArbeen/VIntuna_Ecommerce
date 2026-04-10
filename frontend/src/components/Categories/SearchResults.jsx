import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { searchProductsAPI } from "../../api"
import { products as mockProducts } from "../../data/products"
import ProductCard from "../ProductCard/ProductCard"

const PER_PAGE = 8

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPage(1)
    async function search() {
      setLoading(true)
      try {
        const res = await searchProductsAPI(query)
        setResults(res.data?.length ? res.data : fallbackSearch())
      } catch {
        setResults(fallbackSearch())
      } finally {
        setLoading(false)
      }
    }

    function fallbackSearch() {
      const q = query.toLowerCase()
      return mockProducts.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }

    if (query) search()
    else { setResults([]); setLoading(false) }
  }, [query])

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visible = results.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 min-h-[60vh] dark:bg-gray-900">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Results for "<span className="text-green-600 dark:text-green-400">{query}</span>"
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{results.length} products found</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-3">
              <div className="h-32 sm:h-36 skeleton-shimmer rounded-xl mb-3" />
              <div className="h-3 skeleton-shimmer rounded w-3/4 mb-2" />
              <div className="h-3 skeleton-shimmer rounded w-1/2 mb-3" />
              <div className="h-8 skeleton-shimmer rounded-xl" />
            </div>
          ))}
        </div>
      ) : visible.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {visible.map((p, i) => (
              <div key={p._id || p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 flex-wrap">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-green-50 dark:hover:bg-gray-800 dark:text-white cursor-pointer disabled:cursor-not-allowed transition-colors btn-press">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-9 h-9 text-xs sm:text-sm rounded-lg font-semibold cursor-pointer transition-all btn-press ${safePage === n ? "bg-green-600 text-white shadow-md shadow-green-600/20" : "border border-gray-200 dark:border-gray-700 dark:text-white hover:bg-green-50 dark:hover:bg-gray-800"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-green-50 dark:hover:bg-gray-800 dark:text-white cursor-pointer disabled:cursor-not-allowed transition-colors btn-press">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">No products found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Try searching for "momo", "dal bhat", or "milk"</p>
          <Link to="/" className="bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 cursor-pointer transition-colors btn-press">
            Browse All
          </Link>
        </div>
      )}
    </div>
  )
}
