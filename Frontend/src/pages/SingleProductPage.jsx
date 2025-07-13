import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getProductById } from "../api/productApi"
import { getVendorById } from "../api/vendorApi"
import { getReviewsByProductId } from "../api/reviewApi"

import ProductImageGallery from "../components/singleproduct/ProductImageGallery"
import ProductDetails from "../components/singleproduct/ProductDetails"
import VendorInfo from "../components/singleproduct/VendorInfo"
import ShippingInfo from "../components/singleproduct/ShippingInfo"
import ProductTabs from "../components/singleproduct/ProductTabs"
import ImageModal from "../components/singleproduct/ImageModal"

const SingleProductPage = () => {
  const { productId } = useParams()

  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState("description")
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null) // <-- null by default
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  // Determine current variant only if one is selected
  const currentVariant =
    selectedVariantIndex !== null ? product?.variants?.[selectedVariantIndex] : null

  const currentStock =
    selectedVariantIndex !== null
      ? product?.variants?.[selectedVariantIndex]?.stock ?? 0
      : product?.stock ?? 0

  const currentPrice =
    selectedVariantIndex !== null
      ? product?.variants?.[selectedVariantIndex]?.price ?? 0
      : product?.price ?? 0

  const isInStock = currentStock > 0
  const isLowStock = isInStock && currentStock <= 5

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        console.error("Product ID is missing")
        return
      }

      try {
        const fetchedProduct = await getProductById(productId)
        setProduct(fetchedProduct)

        // Reset variant selection when product changes
        setSelectedVariantIndex(null)
        setQuantity(1)

        // Handle vendorId which could be string or object
        const vendorId =
          typeof fetchedProduct.vendorId === "string"
            ? fetchedProduct.vendorId
            : fetchedProduct.vendorId?._id

        if (vendorId) {
          const fetchedVendor = await getVendorById(vendorId)
          setVendor(fetchedVendor)
        }

        const fetchedReviews = await getReviewsByProductId(productId)
        setReviews(fetchedReviews.reviews)
      } catch (error) {
        console.error("Error during API fetch:", error)
      }
    }

    fetchData()
  }, [productId])

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.min(Math.max(prev + delta, 1), currentStock))
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Product link copied to clipboard!")
  }

  const formatDate = (date) => new Date(date).toLocaleDateString()

  if (!product)
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-500">
        Loading product...
      </div>
    )

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <ProductImageGallery
          product={product}
          currentVariant={currentVariant}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          setShowImageModal={setShowImageModal}
        />

        <ProductDetails
          product={product}
          currentVariant={currentVariant}
          currentPrice={currentPrice}
          currentStock={currentStock}
          isInStock={isInStock}
          isLowStock={isLowStock}
          averageRating={averageRating}
          reviews={reviews}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedVariantIndex={selectedVariantIndex}
          setSelectedVariantIndex={setSelectedVariantIndex}
          addingToCart={addingToCart}
          setAddingToCart={setAddingToCart}
          handleQuantityChange={handleQuantityChange}
          handleShare={handleShare}
        />
      </div>

      <VendorInfo vendor={vendor} />
      <ShippingInfo />

      <ProductTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        product={product}
        vendor={vendor}
        currentPrice={currentPrice}
        currentStock={currentStock}
        reviews={reviews}
        formatDate={formatDate}
      />

      <ImageModal
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        product={product}
        currentVariant={currentVariant}
        selectedImageIndex={selectedImageIndex}
      />
    </div>
  )
}

export default SingleProductPage
