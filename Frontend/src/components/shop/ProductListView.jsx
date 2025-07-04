import { useState } from "react"
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa"
import { MdBalance } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { addToCompare, removeFromCompare } from "../../redux/product/compareProduct"

const ProductListView = ({ product }) => {
  const dispatch = useDispatch()
  const compareList = useSelector((state) => state.compare.compareList)
  const isCompared = compareList.some((item) => item.id === product._id)

  const [selectedVariant, setSelectedVariant] = useState(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product || !product.variants || product.variants.length === 0) return null

  const currentVariant = product.variants[selectedVariant]
  const currentPrice = currentVariant?.price || product.price
  const currentStock = currentVariant?.stock || product.stock
  const isInStock = currentStock > 0
  const isLowStock = currentStock <= 5 && currentStock > 0

  const handleCompare = () => {
    if (isCompared) {
      dispatch(removeFromCompare(product._id))
    } else {
      dispatch(addToCompare({ ...product, id: product._id }))
    }
  }

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      productId: product._id,
      variant: currentVariant,
    })
  }

  const handleQuickView = () => {
    console.log("Quick view:", product._id)
  }

  const toggleWishlist = () => setIsWishlisted(!isWishlisted)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <img
            src={product.images?.[0] || "/placeholder.svg?height=200&width=200"}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {isLowStock && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center rounded-full bg-orange-500 text-white px-2 py-1 text-xs font-semibold">
                {currentStock} left
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-2 line-clamp-3">{product.description}</p>
            </div>
            <button onClick={toggleWishlist} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <FaHeart className={`w-5 h-5 ${isWishlisted ? "text-red-500" : "text-gray-400"}`} />
            </button>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
              {currentVariant && currentVariant.price !== product.price && (
                <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.0)</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {!isInStock ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-orange-600 font-medium">Low Stock</span>
            ) : (
              <span className="text-green-600 font-medium">In Stock</span>
            )}
          </div>

          {/* Color Variants */}
          {product.variants.length > 1 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Colors:</p>
              <div className="flex gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant._id || index}
                    onClick={() => setSelectedVariant(index)}
                    className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
                      selectedVariant === index ? "ring-2 ring-blue-600 ring-offset-2 scale-110" : "hover:scale-105"
                    }`}
                    title={variant.color}
                  >
                    <div
                      className="w-full h-full rounded-full border border-gray-200"
                      style={{ backgroundColor: variant.color.toLowerCase() }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.comfortTags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.comfortTags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
              {product.comfortTags.length > 4 && (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 px-3 py-1 text-sm font-medium">
                  +{product.comfortTags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleQuickView}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaEye className="w-4 h-4" />
              Quick View
            </button>
            <button
              onClick={handleCompare}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isCompared
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MdBalance className="w-4 h-4" />
              {isCompared ? "Remove" : "Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListView
