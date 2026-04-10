import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProductsAPI, getCategoriesAPI } from "../../api"
import { categories as mockCategories, products as mockProducts } from "../../data/products"
import ProductCard from "../ProductCard/ProductCard"
import { useScrollRevealAll } from "../../hooks/useScrollReveal"

const PER_PAGE = 8

const BANNER_CONTENT = {
  top: { text: "Free Delivery on orders above Rs.200", sub: "No hidden charges. What you see is what you pay." },
  bottom: { text: "Fresh deals every day — order now!", sub: "Quality groceries at honest prices, delivered to your door." },
}

export default function Home() {
  const [selectedCat, setSelectedCat] = useState("All")
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState(mockCategories)
  const [products, setProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(true)
  const containerRef = useScrollRevealAll()

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([getCategoriesAPI(), getProductsAPI()])
        if (catRes.data?.length) setCategories(catRes.data)
        if (prodRes.data?.length) setProducts(prodRes.data)
      } catch {
        // fallback to mock data
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = selectedCat === "All" ? products : products.filter(p => p.category === selectedCat)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function pickCategory(cat) {
    setSelectedCat(cat)
    setPage(1)
  }

  function Banner({ data }) {
    return (
      <div className="relative bg-yellow-400/30 dark:bg-yellow-500/10 backdrop-blur-2xl rounded-2xl p-5 sm:p-7 overflow-hidden border border-yellow-300/30 dark:border-yellow-500/15 shadow-[0_6px_32px_rgba(250,204,21,0.12),0_2px_8px_rgba(250,204,21,0.06)] dark:shadow-[0_6px_32px_rgba(250,204,21,0.08)]">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #ca8a04 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-xl font-bold text-yellow-900 dark:text-yellow-300 mb-0.5">{data.text}</h3>
            <p className="text-yellow-800/70 dark:text-yellow-200/50 text-xs sm:text-sm">{data.sub}</p>
          </div>
          <Link
            to="/"
            className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold px-5 py-2 rounded-xl transition-all text-sm btn-press shadow-[0_3px_16px_rgba(250,204,21,0.3)] hover:shadow-[0_5px_24px_rgba(250,204,21,0.45)]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* top banner */}
      <div className="max-w-screen-xl mx-auto px-4 pt-5 sm:pt-6 animate-fade-in-down">
        <Banner data={BANNER_CONTENT.top} />
      </div>

      {/* categories */}
      <div className="max-w-screen-xl mx-auto px-4 pt-10 sm:pt-14 pb-6 sm:pb-8 reveal">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Shop by Category</h2>
          <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-green-200 to-transparent dark:from-green-900 rounded hidden sm:block" />
        </div>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide">
          <button
            onClick={() => pickCategory("All")}
            className={`flex flex-col items-center min-w-[70px] sm:min-w-[85px] p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 shrink-0 cursor-pointer ${
              selectedCat === "All"
                ? "border-green-600 bg-green-50 dark:bg-green-900/50 shadow-md shadow-green-600/10 scale-105"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-400 hover:shadow-md hover:-translate-y-1 hover:scale-105"
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1 transition-transform duration-300 group-hover:scale-110">🏪</span>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">All</span>
          </button>
          {categories.map((cat, i) => (
            <button
              key={cat._id || cat.id}
              onClick={() => pickCategory(cat.name)}
              className={`flex flex-col items-center min-w-[70px] sm:min-w-[85px] p-2 rounded-xl border-2 transition-all duration-300 shrink-0 cursor-pointer ${
                selectedCat === cat.name
                  ? "border-green-600 bg-green-50 dark:bg-green-900/50 shadow-md shadow-green-600/10 scale-105"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-400 hover:shadow-md hover:-translate-y-1 hover:scale-105"
              }`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-10 h-10 sm:w-14 sm:h-14 object-contain mb-1 rounded-lg transition-transform duration-300 hover:scale-110" />
              ) : (
                <span className="text-xl sm:text-2xl mb-1 transition-transform duration-300 inline-block hover:scale-125 hover:rotate-6">{cat.icon}</span>
              )}
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* products grid */}
      <div className="max-w-screen-xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-4 reveal">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {selectedCat === "All" ? "All Products" : selectedCat}
          </h2>
          <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {filtered.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-3 overflow-hidden">
                <div className="h-32 sm:h-36 skeleton-shimmer rounded-lg mb-3" />
                <div className="h-3 skeleton-shimmer rounded w-3/4 mb-2" />
                <div className="h-3 skeleton-shimmer rounded w-1/2 mb-3" />
                <div className="h-8 skeleton-shimmer rounded-lg" />
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {visible.map((p, i) => (
              <div key={p._id || p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No products in this category yet</p>
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 flex-wrap reveal">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-green-50 dark:hover:bg-gray-800 dark:text-white cursor-pointer disabled:cursor-not-allowed transition-colors btn-press"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-9 h-9 text-xs sm:text-sm rounded-lg font-semibold cursor-pointer transition-all btn-press ${
                  safePage === num
                    ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                    : "border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-800 dark:text-white"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-green-50 dark:hover:bg-gray-800 dark:text-white cursor-pointer disabled:cursor-not-allowed transition-colors btn-press"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* bottom banner */}
      <div className="max-w-screen-xl mx-auto px-4 pb-10 reveal">
        <Banner data={BANNER_CONTENT.bottom} />
      </div>
    </div>
  )
}
