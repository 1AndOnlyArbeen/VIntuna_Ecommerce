import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"

const TAG_STYLES = {
  "Best Seller": "bg-secondary-container text-on-secondary-container",
  "Popular Now": "bg-primary text-on-primary",
  "Healthy": "bg-primary-container text-on-primary-container",
  "Organic": "bg-primary-container text-on-primary-container",
  "New Arrival": "bg-primary text-white",
  "Limited": "bg-secondary-container text-on-secondary-container",
}

export default function ProductCard({ product }) {
  const { addToCart, increaseQty, decreaseQty, getItemQty } = useCart()
  const pid = product._id || product.id
  const qty = getItemQty(pid)

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const tags = Array.isArray(product.tags) ? product.tags : []
  const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image

  function handleAdd() {
    addToCart({ ...product, id: pid, image: imgSrc })
  }

  return (
    <div className="group bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl rounded-xl border border-black/[0.07] dark:border-white/[0.08] shadow-[0_2px_6px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_12px_36px_rgba(0,0,0,0.10)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[6/5] overflow-hidden bg-surface-container-low">
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
              {discount}% off
            </span>
          </div>
        )}

        {tags.length > 0 && discount === 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md backdrop-blur-sm ${TAG_STYLES[tags[0]] || "bg-primary text-white"}`}>
              {tags[0]}
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-surface/60 backdrop-blur-[3px] flex items-center justify-center z-20">
            <span className="text-error font-headline font-bold text-[9px] bg-white px-3 py-1 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.12)]">Out of Stock</span>
          </div>
        )}

        <Link to={`/product/${pid}`} className="block w-full h-full">
          <img
            src={imgSrc || "https://placehold.co/400x400/e9e8e6/1a1c1b?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
      </div>

      {/* Info + Cart controls */}
      <div className="px-2.5 pt-2 pb-2.5">
        <Link to={`/product/${pid}`}>
          <h3 className="font-headline font-bold text-[11px] sm:text-xs text-on-surface leading-tight hover:text-secondary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-[8px] font-label text-on-surface/40 uppercase tracking-widest mt-0.5">{product.category}</p>

        {/* Price row */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-on-surface font-bold font-headline text-xs">Rs.{product.price}</span>
          {discount > 0 && (
            <span className="text-on-surface/25 line-through text-[9px]">Rs.{product.originalPrice}</span>
          )}
        </div>

        {/* Cart controls */}
        {product.inStock !== false && (
          <div className="mt-2">
            {qty === 0 ? (
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-1.5 bg-primary-container/10 hover:bg-primary-container text-primary-container hover:text-on-primary-container py-2 rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest cursor-pointer transition-all duration-200 active:scale-[0.97] border border-primary-container/20 hover:border-transparent"
              >
                <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => decreaseQty(pid)}
                  className="w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-error/10 text-on-surface-variant hover:text-error rounded-lg cursor-pointer transition-all duration-200 active:scale-90"
                >
                  {qty === 1 ? (
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  ) : (
                    <span className="font-bold text-sm">−</span>
                  )}
                </button>
                <div className="flex-1 h-8 bg-primary-container/10 rounded-lg flex items-center justify-center border border-primary-container/20">
                  <span className="font-headline font-bold text-xs text-primary">{qty} in cart</span>
                </div>
                <button
                  onClick={() => increaseQty(pid)}
                  className="w-8 h-8 flex items-center justify-center bg-primary-container hover:bg-primary text-on-primary-container hover:text-white rounded-lg cursor-pointer transition-all duration-200 active:scale-90 font-bold text-sm"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
