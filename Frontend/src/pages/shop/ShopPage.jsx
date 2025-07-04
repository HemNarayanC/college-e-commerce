import { useState, useEffect, useCallback } from "react";
import { getCategories } from "../../api/categoryApi";
import { getVendors } from "../../api/vendorApi";
import { getAllProducts } from "../../api/productApi";
import FilterSidebar from "../../components/shop/FilterSidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import LoadingSpinner from "../../components/shop/LoaderSpinner";
import EmptyState from "../../components/shop/EmptyState";
import ProductCards from "../../components/Products/ProductCards";
import ProductListView from "../../components/shop/ProductListView";
import Pagination from "../../components/shop/Pagination";
import CompareBarAndModal from "../../components/CompareBar";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const productsPerPage = 20;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, vendorsData] = await Promise.all([
          getCategories(),
          getVendors(),
        ]);
        setCategories(categoriesData);
        setVendors(vendorsData);
      } catch (err) {
        setError("Failed to load initial data");
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const cleanFilters = (obj) => {
    const cleaned = {};
    for (const key in obj) {
      if (
        obj[key] !== null &&
        obj[key] !== undefined &&
        !(typeof obj[key] === "string" && obj[key].trim() === "") &&
        !(Array.isArray(obj[key]) && obj[key].length === 0)
      ) {
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const cleanedFilters = cleanFilters(filters);

      const queryFilters = {
        ...cleanedFilters,
        sortBy,
        page: currentPage,
        limit: productsPerPage,
      };

      if (cleanedFilters.tags && Array.isArray(cleanedFilters.tags)) {
        queryFilters.tag = cleanedFilters.tags.join(",");
        delete queryFilters.tags;
      }

      const response = await getAllProducts(queryFilters);
      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
      setTotalProducts(response.totalItems || 0);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, currentPage]);

  useEffect(() => {
    if (categories.length > 0 && vendors.length > 0) {
      fetchProducts();
    }
  }, [fetchProducts, categories.length, vendors.length]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#486e40] mb-2">
            Something went wrong
          </h2>
          <p className="text-[#8F9779] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#64973f] hover:bg-[#688d4f] text-white px-6 py-2 rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <div className="flex">
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          vendors={vendors}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        <div className="flex-1">
          <ShopHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalProducts={totalProducts}
            currentPage={currentPage}
            productsPerPage={productsPerPage}
            onToggleFilters={toggleSidebar}
          />

          <div className="p-6">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <EmptyState onClearFilters={clearAllFilters} />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCards key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {products.map((product) => (
                      <ProductListView key={product._id} product={product} />
                    ))}
                  </div>
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compare Bar with matched styling */}
      <CompareBarAndModal
        isOpen={isCompareOpen}
        onOpenModal={() => setIsCompareOpen(true)}
        onCloseModal={() => setIsCompareOpen(false)}
        theme={{
          backgroundColor: "#64973f",
          hoverColor: "#688d4f",
          textColor: "#ffffff",
        }}
      />
    </div>
  );
};

export default ShopPage;
