import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/productApi"
import ProductCards from "./ProductCards";
import CompareBarAndModal from "../CompareBar";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        // Filter only featured products
        console.log(response)
        const featuredProducts = (response.products || []).filter(
          (product) => product.isFeatured === true
        );
        setProducts(featuredProducts);
      } catch (err) {
        console.error("Error loading products:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-10 px-4 container mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>

      {loading ? (
        <p className="text-gray-600">Loading featured products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No featured products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCards product={product} />
              {/* Featured badge */}
              <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-semibold rounded shadow">
                Featured
              </span>
            </div>
          ))}
        </div>
      )}
      <CompareBarAndModal
        isOpen={isCompareOpen}
        onOpenModal={() => setIsCompareOpen(true)}
        onCloseModal={() => setIsCompareOpen(false)}
      />
    </section>
  );
};

export default ProductList;
