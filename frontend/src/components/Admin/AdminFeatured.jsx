import { useState, useEffect } from "react"
import { getProductsAPI, toggleFeaturedAPI } from "../../api"

const PER_PAGE = 10

export default function AdminFeatured() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [tab, setTab] = useState("featured")

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await getProductsAPI({ limit: 200 })
      setProducts(res.data?.data || res.data || [])
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  async function handleToggle(id) {
    try {
      await toggleFeaturedAPI(id)
      setProducts(prev => prev.map(p => p._id === id ? { ...p, featured: !p.featured } : p))
    } catch {}
  }

  const featured = products.filter(p => p.featured)
  const notFeatured = products.filter(p => !p.featured)
  const list = tab === "featured" ? featured : notFeatured
  const filtered = list.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function goToPage(p) { setPage(Math.max(1, Math.min(p, totalPages))) }

  return (
    <div>
      {/* HEADER */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-0 pb-4 bg-surface-container-high/50 backdrop-blur-xl">
        <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Featured Products ({featured.length})</h1>

        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant/20 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button onClick={() => { setTab("featured"); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${tab === "featured" ? "bg-primary-container text-white" : "border border-outline-variant/20 text-on-surface-variant"}`}>
              Featured ({featured.length})
            </button>
            <button onClick={() => { setTab("all"); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${tab === "all" ? "bg-primary-container text-white" : "border border-outline-variant/20 text-on-surface-variant"}`}>
              Not Featured ({notFeatured.length})
            </button>
          </div>
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">search</span>
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              className="w-full border border-outline-variant/25 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-on-surface/50 bg-surface-container-low">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(4)].map((_, i) => (
              <tr key={i} className="border-t"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
            )) : paginated.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-on-surface/40">
                {products.length === 0 ? "No products yet. Add products first." : tab === "featured" ? "No featured products. Add some from the \"Not Featured\" tab." : "All products are already featured."}
              </td></tr>
            ) : paginated.map(p => {
              const imgSrc = Array.isArray(p.image) ? p.image[0] : p.image
              return (
                <tr key={p._id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="w-9 h-9 rounded object-cover bg-surface-container-low shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-on-surface/30 text-[16px]">image</span></div>
                      )}
                      <span className="text-on-surface font-medium text-sm truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface/50 hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 text-on-surface font-bold">Rs.{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.featured ? "bg-gold/20 text-secondary" : "bg-surface-container-high text-on-surface/50"}`}>
                      {p.featured ? "Featured" : "Normal"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(p._id)}
                      className={`text-xs font-medium px-3 py-1 border rounded cursor-pointer transition-colors ${
                        p.featured
                          ? "text-error border-red-200 hover:bg-red-50"
                          : "text-primary border-green-200 hover:bg-green-50"
                      }`}>
                      {p.featured ? "Remove" : "+ Feature"}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-outline-variant/15 gap-2">
            <p className="text-xs text-on-surface/50">{(safePage - 1) * PER_PAGE + 1}-{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="px-2 py-1 rounded text-xs font-medium text-on-surface/60 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Prev</button>
              <button onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="px-2 py-1 rounded text-xs font-medium text-on-surface/60 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
