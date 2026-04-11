import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { searchProductsAPI } from "../../api"
import { products as mockProducts, categories as mockCategories } from "../../data/products"
import ProductCard from "../ProductCard/ProductCard"

const PER_PAGE = 50

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState(10000)
  const [sidebarSearch, setSidebarSearch] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    setPage(1); setSelectedCat("All"); setSortBy("featured"); setPriceRange(10000); setSidebarSearch("")
    async function search() {
      setLoading(true)
      try {
        const res = await searchProductsAPI(query)
        setResults(res.data?.length ? res.data : fallbackSearch())
      } catch { setResults(fallbackSearch()) }
      finally { setLoading(false) }
    }
    function fallbackSearch() {
      const q = query.toLowerCase()
      return mockProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (query) search()
    else { setResults([]); setLoading(false) }
  }, [query])

  // Categories from results
  const resultCategories = useMemo(() => {
    const counts = {}
    results.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [results])

  const maxPrice = useMemo(() => Math.max(...results.map(p => p.originalPrice || p.price), 500), [results])

  // Filtered + sorted
  const filtered = useMemo(() => {
    let r = selectedCat === "All" ? [...results] : results.filter(p => p.category === selectedCat)
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase()
      r = r.filter(p => p.name.toLowerCase().includes(q))
    }
    r = r.filter(p => p.price <= priceRange)
    if (sortBy === "price-asc") r.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc") r.sort((a, b) => b.price - a.price)
    return r
  }, [results, selectedCat, sidebarSearch, priceRange, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function clearFilters() {
    setSelectedCat("All"); setSortBy("featured"); setPriceRange(10000); setSidebarSearch(""); setPage(1)
  }

  const sidebarContent = (
    <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-outline-variant/15 dark:border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-5 space-y-7">
      {/* Search within results */}
      <div className="relative">
        <input className="w-full bg-[#e9e8e6]/50 dark:bg-white/[0.06] border border-outline-variant/20 rounded-xl py-2.5 px-3 pr-9 focus:outline-none focus:border-primary/50 focus:bg-white transition-all text-sm font-label text-on-surface placeholder:text-on-surface/40" placeholder="Refine search..." type="text" value={sidebarSearch} onChange={e => { setSidebarSearch(e.target.value); setPage(1) }} />
        <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface/40 text-[18px]">search</span>
      </div>

      {/* Category filter */}
      <section>
        <h3 className="text-[11px] font-label font-bold uppercase tracking-widest text-on-surface/60 mb-3">Categories</h3>
        <div className="bg-[#e5e4e2]/70 dark:bg-white/[0.06] rounded-xl p-1.5 space-y-0.5">
          <div onClick={() => { setSelectedCat("All"); setPage(1) }} className={`flex justify-between items-center cursor-pointer rounded-lg px-3 py-2.5 transition-all ${selectedCat === "All" ? "bg-white dark:bg-white/[0.1] shadow-[0_1px_6px_rgba(0,0,0,0.08)]" : "hover:bg-white/70 dark:hover:bg-white/[0.04]"}`}>
            <span className={`text-[13px] font-label ${selectedCat === "All" ? "text-on-surface font-bold" : "text-on-surface/70"}`}>All Results</span>
            <span className="text-[10px] font-bold text-on-surface/50 bg-[#d5d4d2] dark:bg-white/[0.1] px-2 py-0.5 rounded-full min-w-[24px] text-center">{results.length}</span>
          </div>
          {resultCategories.map(([cat, count]) => (
            <div key={cat} onClick={() => { setSelectedCat(cat); setPage(1) }} className={`flex justify-between items-center cursor-pointer rounded-lg px-3 py-2.5 transition-all ${selectedCat === cat ? "bg-white dark:bg-white/[0.1] shadow-[0_1px_6px_rgba(0,0,0,0.08)]" : "hover:bg-white/70 dark:hover:bg-white/[0.04]"}`}>
              <span className={`text-[13px] font-label ${selectedCat === cat ? "text-on-surface font-bold" : "text-on-surface/70"}`}>{cat}</span>
              <span className="text-[10px] font-bold text-on-surface/50 bg-[#d5d4d2] dark:bg-white/[0.1] px-2 py-0.5 rounded-full min-w-[24px] text-center">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-outline-variant/25" />

      {/* Price Range */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-label font-bold uppercase tracking-widest text-on-surface/60">Price Range</h3>
          <span className="text-[12px] font-label font-bold text-on-surface">Rs.{priceRange}</span>
        </div>
        <div className="bg-[#e5e4e2]/70 dark:bg-white/[0.06] rounded-xl p-3">
          <input className="w-full h-1.5 bg-[#d5d4d2] dark:bg-white/[0.1] appearance-none cursor-pointer accent-primary rounded-full" type="range" min="0" max={maxPrice} step="10" value={priceRange} onChange={e => { setPriceRange(Number(e.target.value)); setPage(1) }} />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-label text-on-surface/50">Rs.0</span>
            <span className="text-[10px] font-label text-on-surface/50">Rs.{maxPrice}</span>
          </div>
        </div>
      </section>

      <button onClick={clearFilters} className="w-full py-2.5 rounded-xl bg-[#e5e4e2]/70 dark:bg-white/[0.06] text-on-surface/60 font-label font-bold text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
        Clear All Filters
      </button>
    </div>
  )

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-12 min-h-[60vh]">
      {/* Header */}
      <header className="mb-10 sm:mb-14 animate-fade-in-down">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/20 pb-8 gap-4">
          <div>
            <nav className="flex gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant mb-4">
              <Link to="/" className="hover:text-primary cursor-pointer transition-colors">VintunaStore</Link>
              <span>/</span>
              <span className="text-primary font-semibold">Search Results</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tighter text-primary">
              "{query}"
            </h1>
          </div>
          <div className="hidden md:block">
            <p className="max-w-md text-on-surface-variant leading-relaxed font-body text-sm">
              Found <span className="text-primary font-bold">{results.length}</span> products matching your search. Use the filters to narrow down your results.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Mobile filter toggle */}
        <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="md:hidden flex items-center justify-center gap-2 py-3 border border-outline-variant/20 rounded-xl text-sm font-label font-bold text-primary uppercase tracking-widest cursor-pointer hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-[20px]">tune</span>
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showMobileFilters && (
          <div className="md:hidden animate-fade-in-up pb-4 border-b border-outline-variant/10">{sidebarContent}</div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-full md:w-60 lg:w-64 flex-shrink-0">
          <div className="sticky top-28">{sidebarContent}</div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm font-label text-on-surface-variant">
              Showing <span className="text-primary font-bold">{visible.length}</span> of {filtered.length} products
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-label uppercase tracking-widest opacity-60 hidden sm:block">Sort By</span>
              <select className="bg-transparent border-none text-xs font-label font-bold text-primary focus:ring-0 cursor-pointer" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-2xl p-3 border border-outline-variant/8">
                  <div className="aspect-square skeleton-shimmer rounded-xl mb-3" />
                  <div className="h-3 skeleton-shimmer rounded w-3/4 mb-1.5" />
                  <div className="h-2.5 skeleton-shimmer rounded w-1/2 mb-1.5" />
                  <div className="h-3 skeleton-shimmer rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {visible.map((p, i) => (
                <div key={p._id || p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <span className="material-symbols-outlined text-outline text-5xl mb-4 block">search_off</span>
              <h2 className="text-lg font-headline font-bold text-primary mb-2">No products found</h2>
              <p className="text-on-surface-variant text-sm mb-8 font-label">Try adjusting your filters or search for "momo", "dal bhat", or "milk"</p>
              <Link to="/" className="bg-velvet-gradient text-on-primary font-headline font-bold px-8 py-3 rounded-full hover:opacity-90 cursor-pointer transition-all btn-press uppercase tracking-widest text-sm shadow-lg">Browse All</Link>
            </div>
          )}

          {/* ATELIER Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 sm:mt-24 flex justify-center items-center gap-6 sm:gap-8 border-t border-outline-variant/10 pt-10 sm:pt-12 mb-8 sm:mb-12">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="text-xs font-label uppercase tracking-widest opacity-40 hover:opacity-100 disabled:hover:opacity-40 transition-opacity flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                <span className="material-symbols-outlined scale-75">west</span> Previous
              </button>
              <div className="flex gap-4 sm:gap-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => {
                  const show = num === 1 || num === totalPages || Math.abs(num - safePage) <= 1
                  const showEllipsis = (num === 2 && safePage > 3) || (num === totalPages - 1 && safePage < totalPages - 2)
                  if (!show && showEllipsis) return <span key={num} className="text-xs font-label text-on-surface-variant opacity-40">...</span>
                  if (!show) return null
                  return (
                    <button key={num} onClick={() => setPage(num)} className={`text-xs font-label cursor-pointer transition-opacity ${safePage === num ? "font-bold text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant opacity-40 hover:opacity-100"}`}>
                      {String(num).padStart(2, '0')}
                    </button>
                  )
                })}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="text-xs font-label uppercase tracking-widest text-primary hover:text-secondary disabled:opacity-40 disabled:hover:text-primary transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                Next <span className="material-symbols-outlined scale-75">east</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
