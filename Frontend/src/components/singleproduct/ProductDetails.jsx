import {
  FaStar,
  FaShare,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaCheck,
} from "react-icons/fa";
import { MdBalance } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../api/cartApi";
import {
  addToCompare,
  removeFromCompare,
} from "../../redux/product/compareProduct";
import VendorInfo from "./VendorInfo";
import { useNavigate } from "react-router-dom";

const ProductDetails = ({
  product,
  vendor,
  currentVariant,
  currentPrice,
  currentStock,
  isInStock,
  isLowStock,
  averageRating,
  reviews,
  quantity,
  setQuantity,
  selectedVariantIndex,
  setSelectedVariantIndex,
  addingToCart,
  setAddingToCart,
  handleQuantityChange,
  handleShare,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.auth_token);
  const user = useSelector((state) => state.auth.user);
  // console.log("User from ProductDetails:", user);
  const isLoggedIn = !!token;

  const compareList = useSelector((state) => state.compare.compareList);
  const isProductCompared = compareList.some((item) => item.id === product._id);

  // Explicit fallback variables:
  const displayedPrice = currentVariant?.price ?? currentPrice;
  const displayedStock = currentVariant?.stock ?? currentStock;
  const displayedColor = currentVariant?.color ?? "Default";

  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.warning("Please log in to add items to your cart.");
      return;
    }

    if (!user?.isActive) {
      toast.error("Your account is inactive. You cannot add to cart.");
      return;
    }

    if (!isInStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      setAddingToCart(true);
      const variantIdToSend =
        selectedVariantIndex !== null
          ? product.variants[selectedVariantIndex]._id
          : null;

      await addToCart({
        token,
        productId: product._id,
        variantId: variantIdToSend,
        quantity,
      });

      toast.success(
        `${product.name}${
          currentVariant?.color ? ` (${currentVariant.color})` : ""
        } added to cart!`
      );
    } catch (err) {
      toast.error("Failed to add to cart. Please try again.", err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.warning("Please log in to proceed.");
      return;
    }

    if (!user?.isActive) {
      toast.error("Your account is inactive. You cannot make purchases.");
      return;
    }

    const variantId =
      selectedVariantIndex !== null
        ? product.variants[selectedVariantIndex]._id
        : null;

    console.log("Buying product with:", {
      productId: product._id,
      variantId,
      quantity,
    });

    if (!product._id || !quantity || quantity < 1) {
      toast.error("Invalid product or quantity for checkout.");
      return;
    }

    navigate("/checkout", {
      state: {
        productId: product._id,
        variantId,
        quantity,
      },
    });
  };

  const handleCompare = () => {
    if (isProductCompared) {
      dispatch(removeFromCompare(product._id));
      toast.info(`${product.name} removed from compare list.`);
    } else {
      dispatch(addToCompare({ ...product, id: product._id }));
      toast.success(`${product.name} added to compare list.`);
    }
  };

  return (
    <div className="space-y-4 text-sm text-[#4b4b4b]">
      {/* Title & Ratings */}
      <div>
        <h1 className="text-xl font-semibold text-[#486e40] mb-1">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating)
                      ? "text-yellow-400"
                      : "text-[#8F9779]/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-[#486e40] font-medium">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-[#8F9779]">({reviews.length})</span>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleCompare}
              className={`p-1.5 rounded-full transition-all ${
                isProductCompared
                  ? "bg-blue-100 text-blue-500"
                  : "bg-[#f8f5f2] text-[#8F9779] hover:bg-blue-100 hover:text-blue-500"
              }`}
            >
              <MdBalance className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full bg-[#f8f5f2] text-[#8F9779] hover:bg-[#64973f]/10 hover:text-[#486e40]"
            >
              <FaShare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-[#64973f]">
        Rs. {displayedPrice.toFixed(2)}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-sm">
        {isInStock ? (
          <>
            <FaCheck className="w-3 h-3 text-[#64973f]" />
            <span className="text-[#64973f]">
              {isLowStock ? `Only ${displayedStock} left` : "In Stock"}
            </span>
          </>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 1 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-[#486e40]">
            Color: {displayedColor}
          </div>
          <div className="flex gap-2">
            {product.variants.map((variant, index) => (
              <button
                key={variant._id || index}
                onClick={() => setSelectedVariantIndex(index)}
                className={`relative p-0.5 rounded-lg transition-all ${
                  selectedVariantIndex === index
                    ? "ring-2 ring-[#64973f] ring-offset-1"
                    : "hover:ring-1 hover:ring-[#64973f]/50 hover:ring-offset-1"
                }`}
              >
                <div
                  className="w-8 h-8 rounded border border-[#8F9779]/20"
                  style={{
                    backgroundColor:
                      variant.color?.toLowerCase().replace(/\s+/g, "") ||
                      "#ccc",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Cart Buttons */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#8F9779]/30 rounded-md overflow-hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="px-3 py-2 hover:bg-[#f8f5f2] disabled:opacity-50"
            >
              <FaMinus className="w-3 h-3 text-[#486e40]" />
            </button>
            <span className="px-4 py-2 min-w-[40px] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= displayedStock}
              className="px-3 py-2 hover:bg-[#f8f5f2] disabled:opacity-50"
            >
              <FaPlus className="w-3 h-3 text-[#486e40]" />
            </button>
          </div>
          <span className="text-xs text-[#8F9779]">
            {displayedStock} available
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!isInStock || addingToCart}
            className="flex-1 bg-[#64973f] hover:bg-[#486e40] text-white text-sm py-2.5 rounded-md font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaShoppingCart className="w-4 h-4" />
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!isInStock}
            className="text-sm bg-[#486e40] hover:bg-[#64973f] text-white py-2.5 px-4 rounded-md font-medium disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Comfort Tags */}
      {product.comfortTags?.length > 0 && (
        <div className="space-y-2 pt-1">
          <h3 className="font-medium text-[#486e40]">Key Features</h3>
          <ul className="grid grid-cols-2 gap-1.5 text-xs text-[#8F9779]">
            {product.comfortTags.slice(0, 6).map((tag, index) => (
              <li key={index} className="flex items-center gap-2">
                <FaCheck className="w-3 h-3 text-[#64973f]" />
                {tag.replace(/-/g, " ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vendor Info */}
      {vendor && (
        <div className="max-w-md border-t border-[#8F9779]/20 pt-4 mt-4">
          <VendorInfo vendor={vendor} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
