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
  const qty = getItemQty(product.id)

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const tags = Array.isArray(product.tags) ? product.tags : []

  return (
    <div className="group cursor-pointer bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl rounded-lg border border-black/[0.07] dark:border-white/[0.08] shadow-[0_2px_6px_rgba(0,0,0,0.1),0_6px_20px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[6/5] overflow-hidden bg-surface-container-low">
        {discount > 0 && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container text-[7px] font-bold uppercase tracking-widest px-1.5 py-px rounded">
              {discount}%
            </span>
          </div>
        )}

        {tags.length > 0 && discount === 0 && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className={`text-[7px] font-bold uppercase tracking-widest px-1.5 py-px rounded backdrop-blur-sm ${TAG_STYLES[tags[0]] || "bg-primary text-white"}`}>
              {tags[0]}
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-surface/60 backdrop-blur-[3px] flex items-center justify-center z-20">
            <span className="text-error font-headline font-bold text-[9px] bg-white px-2 py-0.5 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.12)]">Out of Stock</span>
          </div>
        )}

        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {product.inStock !== false && qty === 0 && (
          <button
            onClick={() => addToCart(product)}
            className="absolute bottom-1.5 right-1.5 bg-white/80 dark:bg-white/[0.1] backdrop-blur-2xl p-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer active:scale-90 shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-10"
          >
            <span className="material-symbols-outlined text-primary text-[14px]">add_shopping_cart</span>
          </button>
        )}

        {qty > 0 && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center bg-primary-container/90 backdrop-blur-xl rounded-full px-0.5 py-px shadow-[0_2px_8px_rgba(0,0,0,0.18)] z-10 animate-scale-in">
            <button onClick={() => decreaseQty(product.id)} className="w-4.5 h-4.5 flex items-center justify-center text-on-primary-container hover:bg-white/20 rounded-full font-bold text-[9px] cursor-pointer transition-colors">
              {qty === 1 ? <span className="material-symbols-outlined text-[11px]">delete</span> : "−"}
            </button>
            <span className="w-3.5 text-center font-bold text-on-primary-container text-[9px] font-headline">{qty}</span>
            <button onClick={() => increaseQty(product.id)} className="w-4.5 h-4.5 flex items-center justify-center text-on-primary-container hover:bg-white/20 rounded-full font-bold text-[9px] cursor-pointer transition-colors">+</button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2 py-1.5 space-y-px">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-headline font-bold text-[10px] sm:text-[11px] text-on-surface leading-tight hover:text-secondary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-[7px] font-label text-on-surface/40 uppercase tracking-widest">{product.category}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-on-surface font-bold font-headline text-[11px]">Rs.{product.price}</span>
            {discount > 0 && (
              <span className="text-on-surface/25 line-through text-[8px]">Rs.{product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center text-secondary gap-px">
            <span className="material-symbols-outlined text-[9px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[7px] font-bold">4.8</span>
          </div>
        </div>
      </div>
    </div>
  )
}
