import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"

const TAG_STYLES = {
  "Best Seller": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Popular Now": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Healthy": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Organic": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "New Arrival": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Limited": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function ProductCard({ product }) {
  const { addToCart, increaseQty, decreaseQty, getItemQty } = useCart()
  const qty = getItemQty(product.id)

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const tags = Array.isArray(product.tags) ? product.tags : []

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-2xl p-3 relative group cursor-pointer hover-lift overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
      {/* discount tag */}
      {discount > 0 && (
        <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg z-10 shadow-sm">
          -{discount}%
        </span>
      )}

      {/* product tags */}
      {tags.length > 0 && (
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {tags.slice(0, 1).map(tag => (
            <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${TAG_STYLES[tag] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* out of stock overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-10">
          <span className="text-red-500 font-bold text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm">Out of Stock</span>
        </div>
      )}

      <Link to={`/product/${product.id}`}>
        <div className="flex justify-center mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 sm:h-36 object-cover rounded-xl group-hover:scale-[1.06] transition-transform duration-300 ease-out"
          />
        </div>
      </Link>

      <div className="space-y-1.5">
        <p className="text-[10px] text-green-600 dark:text-green-500 font-semibold tracking-wide uppercase">VintunaStore</p>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-base font-bold text-gray-900 dark:text-white">Rs.{product.price}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">Rs.{product.originalPrice}</span>
          )}
        </div>

        {/* add / qty controls */}
        <div className="pt-1">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className="w-full border-2 border-green-600 text-green-600 font-bold text-sm py-1.5 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-green-600 cursor-pointer btn-press"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-between bg-green-600 rounded-xl py-1.5 px-1 animate-scale-in">
              <button onClick={() => decreaseQty(product.id)} className="text-white font-bold text-lg w-8 h-6 flex items-center justify-center hover:bg-green-700 rounded-lg cursor-pointer transition-colors">
                {qty === 1 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : "−"}
              </button>
              <span className="text-white font-bold text-sm min-w-[20px] text-center">{qty}</span>
              <button onClick={() => increaseQty(product.id)} className="text-white font-bold text-lg w-8 h-6 flex items-center justify-center hover:bg-green-700 rounded-lg cursor-pointer transition-colors">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
