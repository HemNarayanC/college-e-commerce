import { useState } from "react"
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa"
import { MdBalance } from "react-icons/md"

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onQuickView }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isCompared, setIsCompared] = useState(false)

  if (!product || !product.variants || product.variants.length === 0) return null

  const currentVariant = selectedVariantIndex !== null ? product.variants[selectedVariantIndex] : product.variants[0]

  const currentPrice = currentVariant?.price ?? product.price
  const currentStock = currentVariant?.stock ?? product.stock
  const isInStock = currentStock > 0
  const isLowStock = currentStock <= 5 && currentStock > 0

  const handleAddToCart = () => {
    onAddToCart(product)
  }

  const handleQuickView = () => {
    onQuickView(product)
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist(product)
  }

  const handleCompare = () => {
    setIsCompared(!isCompared)
    // You can add compare logic here if needed
  }

  // Calculate rating from mock data (using 4.5 as default)
  const rating = 4.5
  const reviewCount = Math.floor(Math.random() * 200) + 50

  return (
    <div
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-white border border-gray-200 rounded-lg w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 shadow-sm"
      >
        <FaHeart className={`w-4 h-4 ${isWishlisted ? "text-red-500" : "text-[#8F9779]"}`} />
      </button>

      {/* Stock Badge */}
      {isLowStock && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center rounded-full bg-orange-500 text-white px-2 py-1 text-xs font-semibold">
            {currentStock} left
          </span>
        </div>
      )}

      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center rounded-full bg-purple-500 text-white px-2 py-1 text-xs font-semibold">
            Featured
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-44 overflow-hidden bg-[#f8f5f2]">
        <img
          src={product.images?.[0] || "/placeholder.svg?height=200&width=250"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover Action Icons */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="p-2.5 bg-white rounded-full shadow-lg hover:bg-[#64973f] hover:text-white transition-all duration-200 disabled:opacity-50"
            title="Add to Cart"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2.5 bg-white rounded-full shadow-lg hover:bg-[#64973f] hover:text-white transition-all duration-200"
            title="Quick View"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={handleCompare}
            className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
              isCompared ? "bg-red-600 text-white hover:bg-red-500" : "bg-white hover:bg-[#64973f] hover:text-white"
            }`}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            <MdBalance className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-sm leading-tight text-[#486e40] line-clamp-2 group-hover:text-[#64973f] transition-colors">
          {product.name}
        </h3>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#486e40]">${currentPrice.toFixed(2)}</span>
            {currentVariant && currentVariant.price !== product.price && (
              <span className="text-sm text-[#8F9779] line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-xs text-[#8F9779]">({reviewCount})</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="text-sm">
          {!isInStock ? (
            <span className="text-red-600 font-medium">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-orange-600 font-medium">Low Stock</span>
          ) : (
            <span className="text-[#64973f] font-medium">In Stock</span>
          )}
        </div>

        {/* Color Variants */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#486e40]">Colors:</p>
            <div className="flex gap-2">
              {product.variants.map((variant, index) => {
                const isSelected = selectedVariantIndex === index
                return (
                  <button
                    key={variant._id || index}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`relative w-6 h-6 rounded-full transition-all duration-200 ${
                      isSelected ? "ring-2 ring-[#64973f] ring-offset-2 scale-110" : "hover:scale-105"
                    }`}
                    title={variant.color}
                  >
                    <div
                      className="w-full h-full rounded-full border border-gray-200"
                      style={{
                        backgroundColor: variant.color?.toLowerCase() || "#ccc",
                      }}
                    ></div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {product.comfortTags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.comfortTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full border border-[#64973f]/20 bg-[#64973f]/10 text-[#486e40] px-2 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {product.comfortTags.length > 3 && (
              <span className="inline-flex items-center rounded-full border border-[#8F9779]/20 bg-[#8F9779]/10 text-[#8F9779] px-2 py-1 text-xs font-medium">
                +{product.comfortTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Product Status */}
        {product.status === "inactive" && (
          <div className="mt-2 text-sm text-orange-600 font-medium">Currently unavailable</div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
