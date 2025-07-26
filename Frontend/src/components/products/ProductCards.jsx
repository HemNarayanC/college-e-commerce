import { useState } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import { MdBalance } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCompare,
  removeFromCompare,
} from "../../redux/product/compareProduct";
import { toast } from "react-toastify";
import { addToCart } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../../constants/routes";

const ProductCards = ({ product }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.auth_token);
  const user = useSelector((state) => state.auth.user);
  console.log("Hello User = ", user);

  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const compareList = useSelector((state) => state.compare.compareList);

  const isCompared = compareList.some((item) => item.id === product._id);
  const navigate = useNavigate();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // LOCAL wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product || !product.variants || product.variants.length === 0)
    return null;

  const currentVariant =
    selectedVariantIndex !== null
      ? product.variants[selectedVariantIndex]
      : null;

  const currentPrice = currentVariant?.price ?? product.price;
  const currentStock = currentVariant?.stock ?? product.stock;
  const isInStock = currentStock > 0;
  const isLowStock = currentStock <= 5 && currentStock > 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.warning("Please log in to add items to your cart.", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

    try {
      const variantIdToSend =
        selectedVariantIndex !== null
          ? product.variants[selectedVariantIndex]._id
          : null;
      await addToCart({
        token,
        productId: product._id,
        variantId: variantIdToSend,
        quantity: 1,
      });

      toast.success(
        `${product.name}${currentVariant ? ` (${currentVariant.color})` : ""} added to cart!`,
        {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        }
      );
    } catch (err) {
      toast.error("Failed to add to cart. Please try again.");
      console.error(err);
    }
  };

  const handleQuickView = () => {
    navigate(`${SHOP_ROUTE}/products/${product._id}`);
  };

  const handleCompare = () => {
    if (isCompared) {
      dispatch(removeFromCompare(product._id));
    } else {
      dispatch(addToCompare({ ...product, id: product._id }));
    }
  };

  // Toggle local wishlist state
  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-white border border-gray-200 rounded-lg w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button - local toggle */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 shadow-sm"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        type="button"
      >
        <FaHeart
          className={`w-4 h-4 ${
            isWishlisted ? "text-red-500" : "text-gray-400"
          }`}
        />
      </button>

      {/* Stock Badge */}
      {isLowStock && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center rounded-full bg-orange-500 text-white px-2 py-1 text-xs font-semibold">
            {currentStock} left
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-44 overflow-hidden bg-gray-50">
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
            className="p-2.5 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50"
            title="Add to Cart"
            type="button"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>

          <button
            onClick={handleQuickView}
            className="p-2.5 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            title="Quick View"
            type="button"
          >
            <FaEye className="w-4 h-4" />
          </button>

          <button
            onClick={handleCompare}
            className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
              isCompared
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-white hover:bg-blue-600 hover:text-white"
            }`}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
            type="button"
          >
            <MdBalance className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-sm leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              Rs. {currentPrice.toFixed(2)}
            </span>
            {currentVariant && currentVariant.price !== product.price && (
              <span className="text-sm text-gray-500 line-through">
                Rs. {product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(4.0)</span>
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
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Colors:</p>
            <div className="flex gap-2">
              {product.variants.map((variant, index) => {
                const isSelected = selectedVariantIndex === index;
                return (
                  <button
                    key={variant._id || index}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`relative w-6 h-6 rounded-full transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-blue-600 ring-offset-2 scale-110"
                        : "hover:scale-105"
                    }`}
                    title={variant.color}
                    type="button"
                  >
                    <div
                      className="w-full h-full rounded-full border border-gray-200"
                      style={{
                        backgroundColor: variant.color?.toLowerCase() || "#ccc",
                      }}
                    ></div>
                  </button>
                );
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
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-2 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {product.comfortTags.length > 3 && (
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 px-2 py-1 text-xs font-medium">
                +{product.comfortTags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
