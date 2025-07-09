import React from "react"
import ProductCards from "../products/ProductCards"
import ProductListView from "../shop/ProductListView"

const VendorProductGrid = ({
  products = [],
  loading,
  viewMode = "grid",
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  if (loading) {
    return (
      <section className="py-10 px-4 container mx-auto">
        <p className="text-gray-600">Loading products...</p>
      </section>
    )
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <section className="py-10 px-4 container mx-auto">
        <p className="text-gray-500">No products from this vendor yet.</p>
      </section>
    )
  }

  return (
    <section className="py-10 px-4 container mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Vendor’s Products</h2>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCards
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onQuickView={onQuickView}
              />
              {product.isFeatured && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-semibold rounded shadow">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <ProductListView
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default VendorProductGrid
