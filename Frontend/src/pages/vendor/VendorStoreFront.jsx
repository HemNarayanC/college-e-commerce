// VendorStoreFront.jsx
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import { filterProducts, sortProducts } from "../../utils/productUtils"
import VendorProfile from "../../components/vendor-frontstore/VendorProfile"
import FilterSection from "../../components/vendor-frontstore/FilterSection"
import VendorProductGrid from "../../components/vendor-frontstore/VendorProductGrid"
import Pagination from "../../components/vendor-frontstore/Pagination"
import ReviewsSection from "../../components/vendor-frontstore/ReviewSection"

import { getVendorFeedbacks, getVendors } from "../../api/vendorApi"
import { getProductsByVendor } from "../../api/productApi"

const VendorStoreFront = () => {
  const { vendorId } = useParams()
  const [vendorData, setVendorData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [products, setProducts] = useState([])

  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState("Featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const [filters, setFilters] = useState({
    category: "",
    vendor: "",
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    tags: [],
  })

  useEffect(() => {
    const fetchVendorAndReviews = async () => {
      try {
        const res = await getVendors()
        const vendor = res.find((v) => v._id.toString() === vendorId)
        if (!vendor) return console.error("Vendor not found")

        setVendorData(vendor)

        const feedbacks = await getVendorFeedbacks(vendorId)
        setReviews(feedbacks)

        const { products: fetchedProducts = [] } = await getProductsByVendor(vendorId)
        setProducts(fetchedProducts)
      } catch (err) {
        console.error("Error fetching vendor/reviews/products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVendorAndReviews()
  }, [vendorId])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(products, filters)
    return sortProducts(filtered, sortOption)
  }, [products, filters, sortOption])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const handleFollow = () => setIsFollowing(!isFollowing)
  const handleAddToCart = (product) => alert(`Added "${product.name}" to cart!`)
  const handleAddToWishlist = (product) => alert(`Added "${product.name}" to wishlist!`)
  const handleQuickView = (product) => alert(`Quick view for "${product.name}"`)
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  if (loading) return <div className="text-center py-10 text-gray-500">Loading vendor store...</div>
  if (!vendorData) return <div className="text-center py-10 text-red-500">Vendor not found.</div>

  const vendorsData = [{ _id: vendorData._id, businessName: vendorData.businessName, name: vendorData.businessName }]

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#64973f] to-[#486e40] h-64 relative">
        {vendorData.storeBanner && (
          <img src={vendorData.storeBanner} alt="Store Banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{vendorData.businessName}</h1>
            <p className="text-xl opacity-90">Premium Audio Equipment & Professional Solutions</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <VendorProfile
        vendor={vendorData}
        onFollow={handleFollow}
        isFollowing={isFollowing}
        totalProducts={products.length}
        totalFollowers={reviews.length}
      />

      {/* Filters */}
      <FilterSection
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
        currentProducts={currentProducts.length}
        totalProducts={filteredAndSortedProducts.length}
        categories={[]}
        vendors={vendorsData}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Products */}
      <VendorProductGrid
        products={products}
        viewMode={viewMode}
        vendorId={vendorId}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onQuickView={handleQuickView}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        onPageChange={handlePageChange}
        totalItems={filteredAndSortedProducts.length}
        currentItems={currentProducts.length}
      />

      {/* Reviews */}
      <ReviewsSection reviews={reviews} vendor={vendorData} />
    </div>
  )
}

export default VendorStoreFront
