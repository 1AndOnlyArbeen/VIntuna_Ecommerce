import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getProductByIdAPI, getProductsAPI } from "../../api"
import { products as mockProducts } from "../../data/products"
import { useCart } from "../../context/CartContext"
import ProductCard from "../ProductCard/ProductCard"

export default function ProductDetail() {
  const { productId } = useParams()
  const { addToCart, increaseQty, decreaseQty, getItemQty } = useCart()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await getProductByIdAPI(productId)
        setProduct(res.data)
        const allRes = await getProductsAPI({ category: res.data.category })
        setSimilarProducts((allRes.data || []).filter(p => (p._id || p.id) !== (res.data._id || res.data.id)).slice(0, 4))
      } catch {
        const mock = mockProducts.find(p => p.id === Number(productId))
        setProduct(mock || null)
        if (mock) {
          setSimilarProducts(mockProducts.filter(p => p.category === mock.category && p.id !== mock.id).slice(0, 4))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo({ top: 0 })
  }, [productId])

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="flex-1 skeleton-shimmer rounded-2xl h-60 sm:h-80" />
          <div className="flex-1 space-y-4">
            <div className="h-6 skeleton-shimmer rounded w-3/4" />
            <div className="h-4 skeleton-shimmer rounded w-1/2" />
            <div className="h-8 skeleton-shimmer rounded w-1/3" />
            <div className="h-20 skeleton-shimmer rounded" />
            <div className="h-12 skeleton-shimmer rounded-xl w-48" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center dark:bg-gray-900 px-4 animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Product not found</h2>
        <Link to="/" className="text-green-600 hover:underline cursor-pointer text-sm font-medium">Back to Home</Link>
      </div>
    )
  }

  const pid = product._id || product.id
  const qty = getItemQty(pid)
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const tags = Array.isArray(product.tags) ? product.tags : []

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8 dark:bg-gray-900 min-h-screen">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-5 sm:mb-6 overflow-x-auto animate-fade-in">
        <Link to="/" className="hover:text-green-600 cursor-pointer shrink-0 transition-colors">Home</Link>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="shrink-0">{product.category}</span>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-700 dark:text-gray-300 truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6 sm:gap-10">
        {/* image */}
        <div className="flex-1 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-3 sm:p-4 overflow-hidden sticky top-24">
            <img src={product.image} alt={product.name} className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-xl" />
          </div>
        </div>

        {/* info */}
        <div className="flex-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span key={tag} className="text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-400 dark:text-gray-500">{product.category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">VintunaStore</span>
          </div>

          <div className="flex items-baseline gap-3 mb-5 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Rs.{product.price}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">Rs.{product.originalPrice}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">-{discount}%</span>
              </>
            )}
          </div>

          {product.description && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mb-6">
            {product.inStock !== false ? (
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium text-sm bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-500 font-medium text-sm bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Out of Stock
              </span>
            )}
          </div>

          <div className="w-full max-w-xs">
            {qty === 0 ? (
              <button
                onClick={() => addToCart(product)}
                disabled={product.inStock === false}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-base disabled:opacity-30 cursor-pointer transition-all btn-press shadow-lg shadow-green-600/20"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center justify-center gap-8 bg-green-600 rounded-xl py-3.5 animate-scale-in shadow-lg shadow-green-600/20">
                <button onClick={() => decreaseQty(pid)} className="text-white font-bold text-2xl w-10 h-8 flex items-center justify-center hover:bg-green-700 rounded-lg cursor-pointer transition-colors">
                  {qty === 1 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : "\u2212"}
                </button>
                <span className="text-white font-bold text-xl">{qty}</span>
                <button onClick={() => increaseQty(pid)} className="text-white font-bold text-2xl w-10 h-8 flex items-center justify-center hover:bg-green-700 rounded-lg cursor-pointer transition-colors">+</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              More from {product.category}
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {similarProducts.map((p, i) => (
              <div key={p._id || p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
