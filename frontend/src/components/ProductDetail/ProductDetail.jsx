import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getProductByIdAPI, getProductsAPI } from "../../api"
import { products as mockProducts } from "../../data/products"
import { useCart } from "../../context/CartContext"
import ProductCard from "../ProductCard/ProductCard"

const REVIEWS = [
  { id: 1, name: "Aarav Sharma", verified: true, rating: 5, time: "1 month ago", title: "Amazing Quality — Highly Recommend!", body: "I've been ordering from VintunaStore for a few weeks now, and the quality is consistently great. The products are always fresh and the delivery is super quick. Definitely worth it!", avatar: null },
  { id: 2, name: "Sita Thapa", verified: true, rating: 4, time: "2 months ago", title: "Great Product, Fast Delivery!", body: "I bought this for my family and everyone loved it. The taste is authentic and the packaging was excellent. Will order again for sure.", avatar: null },
]

export default function ProductDetail() {
  const { productId } = useParams()
  const { addToCart, increaseQty, decreaseQty, getItemQty } = useCart()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("review")
  const [mainImage, setMainImage] = useState(0)

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
        if (mock) setSimilarProducts(mockProducts.filter(p => p.category === mock.category && p.id !== mock.id).slice(0, 4))
      } finally { setLoading(false) }
    }
    fetchProduct()
    window.scrollTo({ top: 0 })
  }, [productId])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div className="aspect-[4/5] skeleton-shimmer rounded-xl mb-3" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="w-16 h-16 skeleton-shimmer rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4 py-4">
            <div className="h-3 skeleton-shimmer rounded w-1/4" />
            <div className="h-8 skeleton-shimmer rounded w-3/4" />
            <div className="h-3 skeleton-shimmer rounded w-1/2" />
            <div className="h-6 skeleton-shimmer rounded w-1/3 mt-4" />
            <div className="h-16 skeleton-shimmer rounded mt-4" />
            <div className="h-12 skeleton-shimmer rounded w-full mt-6" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in">
        <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
        <h2 className="text-xl font-headline font-bold text-primary mb-2">Product not found</h2>
        <Link to="/" className="text-secondary hover:underline cursor-pointer text-sm font-headline font-semibold">Back to Shop</Link>
      </div>
    )
  }

  const pid = product._id || product.id
  const qty = getItemQty(pid)
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const tags = Array.isArray(product.tags) ? product.tags : []
  const productImages = [product.image, product.image, product.image, product.image]

  return (
    <div className="min-h-screen">
      {/* Breadcrumb hero */}
      <section className="bg-surface-container-low py-8 px-4 text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-headline font-extrabold text-primary mb-2 tracking-tight">Shop</h1>
        <div className="text-[11px] font-label text-on-surface-variant">
          <Link to="/" className="hover:text-primary cursor-pointer transition-colors">Home</Link>
          {" / "}
          <Link to="/" className="hover:text-primary cursor-pointer transition-colors">Shop</Link>
          {" / "}
          <span>{product.category}</span>
          {" / "}
          <span className="text-primary font-semibold">Product Details</span>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        {/* Product section - 2 columns on desktop, stacked on mobile */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-14 animate-fade-in-up">
          {/* Left: Images */}
          <div>
            {/* Main image */}
            <div className="relative bg-surface-container-low rounded-xl overflow-hidden mb-3 aspect-[4/5] flex items-center justify-center group">
              <img src={productImages[mainImage]} alt={product.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
              {/* Nav arrows */}
              <button onClick={() => setMainImage(i => (i - 1 + productImages.length) % productImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button onClick={() => setMainImage(i => (i + 1) % productImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
              {/* Badges */}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg">{discount}% OFF</span>
                </div>
              )}
              {tags.length > 0 && discount === 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg">{tags[0]}</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {productImages.map((img, i) => (
                <button key={i} onClick={() => setMainImage(i)} className={`p-1 rounded-lg flex-shrink-0 border-2 transition-all cursor-pointer ${mainImage === i ? "border-primary" : "border-outline-variant/20 hover:border-primary/40"}`}>
                  <img src={img} alt={`Thumb ${i + 1}`} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product info */}
          <div className="space-y-4">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-label">{product.category}</span>

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-primary tracking-tight">{product.name}</h2>
              {product.inStock !== false ? (
                <span className="bg-primary/5 text-primary-container text-[10px] px-2.5 py-1 rounded-full font-bold font-label shrink-0">In Stock</span>
              ) : (
                <span className="bg-error/5 text-error text-[10px] px-2.5 py-1 rounded-full font-bold font-label shrink-0">Out of Stock</span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex text-secondary">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <span className="text-xs text-on-surface-variant font-label">4.9 (245 Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="text-2xl font-headline font-extrabold text-primary">Rs.{product.price}</span>
              {discount > 0 && (
                <span className="text-sm text-on-surface-variant/50 line-through mb-0.5 font-label">Rs.{product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-xs text-on-surface-variant leading-relaxed font-body">{product.description}</p>
            )}

            {/* Controls section */}
            <div className="space-y-4 py-4 border-y border-outline-variant/10">
              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold font-label block mb-2 text-on-surface">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <span key={tag} className="text-[10px] font-label bg-surface-container-high/60 text-on-surface-variant px-2 py-0.5 rounded">{tag}</span>
                    ))}
                    <span className="text-[10px] font-label bg-surface-container-high/60 text-on-surface-variant px-2 py-0.5 rounded">{product.category}</span>
                  </div>
                </div>
              )}

              {/* Quantity + Add to cart + Buy now */}
              <div className="flex items-center gap-2 sm:gap-3">
                {qty > 0 ? (
                  <div className="flex items-center border border-outline-variant/20 rounded-lg">
                    <button onClick={() => decreaseQty(pid)} className="px-3 py-2 text-on-surface-variant cursor-pointer hover:text-primary transition-colors font-bold">
                      {qty === 1 ? <span className="material-symbols-outlined text-[16px]">delete</span> : "−"}
                    </button>
                    <span className="px-3 py-2 font-headline font-bold text-sm text-primary min-w-[32px] text-center">{qty}</span>
                    <button onClick={() => increaseQty(pid)} className="px-3 py-2 text-on-surface-variant cursor-pointer hover:text-primary transition-colors font-bold">+</button>
                  </div>
                ) : (
                  <div className="flex items-center border border-outline-variant/20 rounded-lg">
                    <span className="px-3 py-2 text-on-surface-variant/40 font-bold">−</span>
                    <span className="px-3 py-2 font-headline font-bold text-sm text-primary">0</span>
                    <span className="px-3 py-2 text-on-surface-variant/40 font-bold">+</span>
                  </div>
                )}
                <button
                  onClick={() => qty === 0 ? addToCart(product) : null}
                  disabled={product.inStock === false}
                  className="flex-1 bg-velvet-gradient text-on-primary py-3 rounded-lg text-xs font-headline font-bold uppercase tracking-wide cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  Add To Cart
                </button>
                <button className="bg-secondary-container text-on-secondary-container py-3 px-4 sm:px-6 rounded-lg text-xs font-headline font-bold uppercase tracking-wide cursor-pointer active:scale-[0.98] transition-all">
                  Buy Now
                </button>
                <button className="p-2.5 border border-outline-variant/20 rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors active:scale-90">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">favorite</span>
                </button>
              </div>
            </div>

            {/* SKU / Tags / Share */}
            <div className="text-[10px] font-label space-y-1.5 text-on-surface-variant">
              <p><span className="font-bold text-on-surface">SKU :</span> VNT-{String(pid).padStart(6, '0')}</p>
              <p><span className="font-bold text-on-surface">Category :</span> {product.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-on-surface">Share :</span>
                <div className="flex gap-1.5">
                  {["share", "public", "mail"].map(icon => (
                    <span key={icon} className="w-6 h-6 bg-surface-container-high/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-[12px] text-on-surface-variant">{icon}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === TABS SECTION === */}
        <section className="mb-10">
          <div className="flex border-b border-outline-variant/15 mb-6">
            {[
              { id: "description", label: "Description" },
              { id: "info", label: "Additional Info" },
              { id: "review", label: "Reviews" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-label font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-on-surface-variant/50 hover:text-on-surface-variant"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === "description" && (
            <div className="animate-fade-in">
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">{product.description || "No description available for this product."}</p>
              {product.deliveryTime && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                  <span className="font-label text-on-surface-variant">Estimated delivery: <span className="font-bold text-primary">{product.deliveryTime}</span></span>
                </div>
              )}
            </div>
          )}

          {/* Additional info tab */}
          {activeTab === "info" && (
            <div className="animate-fade-in">
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {[
                      ["Category", product.category],
                      ["Brand", "VintunaStore"],
                      ["Stock Status", product.inStock !== false ? "In Stock" : "Out of Stock"],
                      ["Delivery", product.deliveryTime || "Standard"],
                    ].map(([label, val]) => (
                      <tr key={label} className="border-b border-outline-variant/10 last:border-none">
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant w-1/3 font-label">{label}</th>
                        <td className="py-3 px-4 text-sm font-medium text-on-surface font-label">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Review tab */}
          {activeTab === "review" && (
            <div className="animate-fade-in">
              {/* Review summary */}
              <div className="mb-8">
                <div className="text-center mb-4">
                  <p className="text-4xl font-headline font-extrabold text-primary">4.9 <span className="text-sm font-normal text-on-surface-variant font-label">out of 5</span></p>
                  <div className="flex justify-center text-secondary my-2">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant font-label">(245 Reviews)</p>
                </div>
                {/* Rating bars */}
                <div className="space-y-2 max-w-sm mx-auto">
                  {[
                    { star: 5, pct: 85 },
                    { star: 4, pct: 60 },
                    { star: 3, pct: 15 },
                    { star: 2, pct: 5 },
                    { star: 1, pct: 2 },
                  ].map(r => (
                    <div key={r.star} className="flex items-center gap-3">
                      <span className="text-xs font-label w-10 text-on-surface-variant shrink-0">{r.star} Star</span>
                      <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-headline font-bold text-lg text-primary">Review List</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-on-surface-variant font-label">Sort by:</span>
                    <select className="text-[10px] border-outline-variant/20 rounded-lg py-1 pr-6 font-label bg-surface-container-low focus:ring-primary/20 focus:border-primary cursor-pointer">
                      <option>Newest</option>
                      <option>Oldest</option>
                    </select>
                  </div>
                </div>

                {REVIEWS.map(review => (
                  <article key={review.id} className="border-b border-outline-variant/10 pb-6 mb-6 last:border-none last:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-headline font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-headline font-bold text-on-surface">{review.name}</p>
                          {review.verified && <p className="text-[10px] text-primary-container font-label font-semibold">(Verified)</p>}
                        </div>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-label">{review.time}</span>
                    </div>
                    <h4 className="text-xs font-headline font-bold mb-2 uppercase text-on-surface">{review.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-3 font-body">{review.body}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex text-secondary">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className="text-xs font-headline font-bold text-on-surface">{review.rating}.0</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* === SIMILAR PRODUCTS === */}
        {similarProducts.length > 0 && (
          <section className="py-10 border-t border-outline-variant/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-label font-bold uppercase tracking-[0.3em] text-secondary mb-2 block">You Might Also Like</span>
                <h2 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight text-primary">
                  More from {product.category}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {similarProducts.map((p, i) => (
                <div key={p._id || p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
