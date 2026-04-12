import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { getProductsAPI, getCategoriesAPI, getBannersAPI } from "../../api"
import ProductCard from "../ProductCard/ProductCard"
import { useScrollRevealAll } from "../../hooks/useScrollReveal"

const PER_PAGE = 50

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrival" },
]

// Tags are derived dynamically from products loaded from the backend

export default function Home() {
  const [selectedCat, setSelectedCat] = useState("All")
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])
  const [slide, setSlide] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  const [sidebarSearch, setSidebarSearch] = useState("")
  const [priceRange, setPriceRange] = useState(0)
  const [priceInited, setPriceInited] = useState(false)
  const [selectedTag, setSelectedTag] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const timerRef = useRef(null)
  const containerRef = useScrollRevealAll()
  const bannerCount = banners.length

  const nextSlide = useCallback(() => setSlide(s => (s + 1) % bannerCount), [bannerCount])
  const prevSlide = useCallback(() => setSlide(s => (s - 1 + bannerCount) % bannerCount), [bannerCount])
  const goToSlide = useCallback((i) => setSlide(i), [])

  useEffect(() => {
    if (bannerCount === 0) return
    timerRef.current = setInterval(nextSlide, 4000)
    return () => clearInterval(timerRef.current)
  }, [nextSlide, bannerCount])

  function resetTimer() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(nextSlide, 4000)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes, bannerRes] = await Promise.all([
          getCategoriesAPI(), getProductsAPI(), getBannersAPI({ active: "true" }),
        ])
        setCategories(catRes.data?.data || catRes.data || [])
        setProducts(prodRes.data?.data || prodRes.data || [])
        setBanners(bannerRes.data?.data || bannerRes.data || [])
      } catch {}
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = {}
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [products])

  // Dynamic tags from products
  const TAG_OPTIONS = useMemo(() => {
    const tagSet = new Set()
    products.forEach(p => {
      if (Array.isArray(p.tags)) p.tags.forEach(t => tagSet.add(t))
    })
    return [...tagSet]
  }, [products])

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let result = selectedCat === "All" ? [...products] : products.filter(p => p.category === selectedCat)

    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }

    if (priceRange > 0) result = result.filter(p => p.price <= priceRange)

    if (selectedTag) {
      result = result.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag))
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price)

    return result
  }, [products, selectedCat, sidebarSearch, priceRange, selectedTag, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function pickCategory(cat) { setSelectedCat(cat); setPage(1) }

  function clearFilters() {
    setSelectedCat("All")
    setSidebarSearch("")
    setPriceRange(maxPrice)
    setSelectedTag("")
    setSortBy("featured")
    setPage(1)
  }

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000
    return Math.max(...products.map(p => p.originalPrice || p.price))
  }, [products])

  // Set priceRange to maxPrice once products load
  useEffect(() => {
    if (products.length > 0 && !priceInited) {
      setPriceRange(maxPrice)
      setPriceInited(true)
    }
  }, [products, maxPrice, priceInited])

  const minPrice = useMemo(() => {
    if (products.length === 0) return 0
    return Math.min(...products.map(p => p.price))
  }, [products])

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-outline-variant/15 dark:border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-5 space-y-7">
      {/* Search within category */}
      <div className="relative">
        <input
          className="w-full bg-[#e9e8e6]/50 dark:bg-white/[0.06] border border-outline-variant/20 rounded-xl py-2.5 px-3 pr-9 focus:outline-none focus:border-primary/50 focus:bg-white transition-all text-sm font-label text-on-surface placeholder:text-on-surface/40"
          placeholder="Search items..."
          type="text"
          value={sidebarSearch}
          onChange={e => { setSidebarSearch(e.target.value); setPage(1) }}
        />
        <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface/40 text-[18px]">search</span>
      </div>

      {/* Category filter */}
      <section>
        <h3 className="text-[11px] font-label font-bold uppercase tracking-widest text-on-surface/60 mb-3">Categories</h3>
        <div className="bg-[#e5e4e2]/70 dark:bg-white/[0.06] rounded-xl p-1.5 space-y-0.5">
          <div
            onClick={() => pickCategory("All")}
            className={`flex justify-between items-center cursor-pointer rounded-lg px-3 py-2.5 transition-all ${selectedCat === "All" ? "bg-white dark:bg-white/[0.1] shadow-[0_1px_6px_rgba(0,0,0,0.08)]" : "hover:bg-white/70 dark:hover:bg-white/[0.04]"}`}
          >
            <span className={`text-[13px] font-label ${selectedCat === "All" ? "text-on-surface font-bold" : "text-on-surface/70"}`}>All Products</span>
            <span className="text-[10px] font-bold text-on-surface/50 bg-[#d5d4d2] dark:bg-white/[0.1] px-2 py-0.5 rounded-full min-w-[24px] text-center">{products.length}</span>
          </div>
          {categories.map(cat => (
            <div
              key={cat._id || cat.id}
              onClick={() => pickCategory(cat.name)}
              className={`flex justify-between items-center cursor-pointer rounded-lg px-3 py-2.5 transition-all ${selectedCat === cat.name ? "bg-white dark:bg-white/[0.1] shadow-[0_1px_6px_rgba(0,0,0,0.08)]" : "hover:bg-white/70 dark:hover:bg-white/[0.04]"}`}
            >
              <span className={`text-[13px] font-label ${selectedCat === cat.name ? "text-on-surface font-bold" : "text-on-surface/70"}`}>{cat.name}</span>
              <span className="text-[10px] font-bold text-on-surface/50 bg-[#d5d4d2] dark:bg-white/[0.1] px-2 py-0.5 rounded-full min-w-[24px] text-center">{categoryCounts[cat.name] || 0}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-outline-variant/25" />

      {/* Tags filter */}
      <section>
        <h3 className="text-[11px] font-label font-bold uppercase tracking-widest text-on-surface/60 mb-3">Product Tags</h3>
        <div className="bg-[#e5e4e2]/70 dark:bg-white/[0.06] rounded-xl p-1.5 flex flex-wrap gap-1.5">
          {TAG_OPTIONS.map(tag => (
            <button
              key={tag}
              onClick={() => { setSelectedTag(selectedTag === tag ? "" : tag); setPage(1) }}
              className={`px-2.5 py-1.5 text-[11px] font-label rounded-lg transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-white dark:bg-white/[0.1] text-on-surface font-bold shadow-[0_1px_4px_rgba(0,0,0,0.07)]"
                  : "text-on-surface/60 hover:bg-white/70 dark:hover:bg-white/[0.04] hover:text-on-surface/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-outline-variant/25" />

      {/* Price Range */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-label font-bold uppercase tracking-widest text-on-surface/60">Price Range</h3>
          <span className="text-[12px] font-label font-bold text-primary">Up to Rs.{priceRange}</span>
        </div>
        <div className="bg-[#e5e4e2]/70 dark:bg-white/[0.06] rounded-xl p-3">
          <input
            className="w-full h-1.5 bg-[#d5d4d2] dark:bg-white/[0.1] appearance-none cursor-pointer accent-primary rounded-full"
            type="range"
            min={minPrice}
            max={maxPrice}
            step={maxPrice > 500 ? 10 : 5}
            value={priceRange || maxPrice}
            onChange={e => { setPriceRange(Number(e.target.value)); setPage(1) }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-label text-on-surface/50">Rs.{minPrice}</span>
            <span className="text-[10px] font-label text-on-surface/50">Rs.{maxPrice}</span>
          </div>
          {priceRange < maxPrice && (
            <p className="text-[10px] font-label text-primary font-semibold mt-2 text-center">
              Showing products up to Rs.{priceRange}
            </p>
          )}
        </div>
      </section>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2.5 rounded-xl bg-[#e5e4e2]/70 dark:bg-white/[0.06] text-on-surface/60 font-label font-bold text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  )

  return (
    <div ref={containerRef} className="min-h-screen bg-surface">

      {/* ===== BANNER SLIDER ===== */}
      {banners.length > 0 && <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 animate-fade-in-down">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl group">
          <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {banners.map(b => (
              <div key={b._id || b.id} className="w-full shrink-0 relative">
                <img src={b.image || "https://placehold.co/1200x420/1a3b1e/FFFFFF?text=VintunaStore"} alt="" className="w-full h-[200px] sm:h-[300px] md:h-[380px] lg:h-[440px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-14 lg:px-20">
                  <div className="max-w-lg">
                    <h2 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-headline font-extrabold leading-tight drop-shadow-lg mb-2 sm:mb-3 tracking-tight">{b.title}</h2>
                    <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 drop-shadow-md max-w-md font-body">{b.subtitle}</p>
                    <Link to={b.link} className="inline-block bg-surface hover:bg-surface-container-high text-primary font-headline font-bold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors shadow-lg btn-press uppercase tracking-widest">{b.buttonText}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { prevSlide(); resetTimer() }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer active:scale-90 shadow-lg z-10">
            <span className="material-symbols-outlined text-primary">chevron_left</span>
          </button>
          <button onClick={() => { nextSlide(); resetTimer() }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer active:scale-90 shadow-lg z-10">
            <span className="material-symbols-outlined text-primary">chevron_right</span>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => { goToSlide(i); resetTimer() }}
                className={`rounded-full cursor-pointer transition-all duration-300 ${i === slide ? "w-8 h-2 bg-surface shadow-md" : "w-2 h-2 bg-surface/50 hover:bg-surface/80"}`} />
            ))}
          </div>
        </div>
      </div>}

      {/* ===== HEADER SECTION (Breadcrumb + Title) ===== */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16">
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/20 pb-8 gap-4">
            <div>
              <nav className="flex gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant mb-4">
                <span className="hover:text-primary cursor-pointer">VintunaStore</span>
                <span>/</span>
                <span className="text-primary font-semibold">{selectedCat === "All" ? "All Products" : selectedCat}</span>
              </nav>
              <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tighter text-primary">
                {selectedCat === "All" ? "Fresh Groceries" : selectedCat}
              </h1>
            </div>
            <div className="hidden md:block">
              <p className="max-w-md text-on-surface-variant leading-relaxed font-body text-sm">
                Discover fresh groceries and daily essentials, delivered fast to your doorstep in Kathmandu. Quality products at honest prices.
              </p>
            </div>
          </div>
        </header>

        {/* ===== SIDEBAR + GRID LAYOUT ===== */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center justify-center gap-2 py-3 border border-outline-variant/20 rounded-xl text-sm font-label font-bold text-primary uppercase tracking-widest cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Mobile filters drawer */}
          {showMobileFilters && (
            <div className="md:hidden animate-fade-in-up pb-4 border-b border-outline-variant/10">
              {sidebarContent}
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-full md:w-60 lg:w-64 flex-shrink-0">
            <div className="sticky top-28">
              {sidebarContent}
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Sorting & Count */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm font-label text-on-surface-variant">
                Showing <span className="text-primary font-bold">{visible.length}</span> of {filtered.length} products
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-label uppercase tracking-widest opacity-60 hidden sm:block">Sort By</span>
                <select
                  className="bg-transparent border-none text-xs font-label font-bold text-primary focus:ring-0 cursor-pointer"
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setPage(1) }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(9)].map((_, i) => (
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
                <p className="font-headline font-bold text-primary text-lg mb-1">No products found</p>
                <p className="text-on-surface-variant text-sm mb-6">Try adjusting your filters or browse a different category</p>
                <button onClick={clearFilters} className="text-secondary font-label font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* ===== ATELIER PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="mt-20 sm:mt-24 flex justify-center items-center gap-6 sm:gap-8 border-t border-outline-variant/10 pt-10 sm:pt-12 mb-8 sm:mb-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="text-xs font-label uppercase tracking-widest opacity-40 hover:opacity-100 disabled:hover:opacity-40 transition-opacity flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined scale-75">west</span> Previous
                </button>
                <div className="flex gap-4 sm:gap-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => {
                    // Show first, last, and pages around current
                    const show = num === 1 || num === totalPages || Math.abs(num - safePage) <= 1
                    const showEllipsis = num === 2 && safePage > 3 || num === totalPages - 1 && safePage < totalPages - 2
                    if (!show && showEllipsis) return <span key={num} className="text-xs font-label text-on-surface-variant opacity-40">...</span>
                    if (!show) return null
                    return (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`text-xs font-label cursor-pointer transition-opacity ${
                          safePage === num
                            ? "font-bold text-primary border-b-2 border-primary pb-1"
                            : "text-on-surface-variant opacity-40 hover:opacity-100"
                        }`}
                      >
                        {String(num).padStart(2, '0')}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="text-xs font-label uppercase tracking-widest text-primary hover:text-secondary disabled:opacity-40 disabled:hover:text-primary transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next <span className="material-symbols-outlined scale-75">east</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BANNER ===== */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 reveal">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-velvet-gradient p-8 sm:p-12">
          <div className="absolute top-0 right-0 w-60 h-60 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-headline font-extrabold text-white mb-2 tracking-tight">Fresh deals every day!</h3>
              <p className="text-white/70 text-sm sm:text-base font-body">Quality groceries at honest prices, delivered to your door.</p>
            </div>
            <Link to="/" className="shrink-0 bg-gold hover:bg-white text-primary-container font-headline font-bold px-8 py-3.5 rounded-full transition-colors text-sm uppercase tracking-widest btn-press shadow-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
