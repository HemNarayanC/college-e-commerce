import { useState } from "react";
import {
  FaFilter,
  FaChevronDown,
  FaTh,
  FaList,
  FaTimes,
  FaChevronUp,
  FaTimesCircle,
} from "react-icons/fa";
import { CRangeSlider } from "@coreui/react-pro";

const FilterSection = ({
  showFilters,
  setShowFilters,
  sortOption,
  setSortOption,
  currentProducts,
  totalProducts,
  categories,
  vendors,
  filters,
  onFiltersChange,
  viewMode,
  setViewMode,
}) => {
  /* ----------------------------- Local State ----------------------------- */
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    vendor: true,
    price: true,
    stock: true,
    tags: true,
  });

  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 1000000,
  });

  /* --------------------------- Static Data ------------------------------ */
  const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "Name: A to Z",
    "Stock: High to Low",
  ];

  const comfortTags = [
    "cushioned",
    "ergonomic",
    "premium fabric",
    "soft",
    "durable",
    "comfortable",
    "luxury",
    "modern",
    "classic",
    "stylish",
    "wireless",
    "noise-cancelling",
    "bluetooth",
    "waterproof",
    "portable",
    "professional",
    "studio",
    "gaming",
  ];

  /* ---------------------------- Handlers ------------------------------- */
  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleFilterChange = (filterType, value, checked = null) => {
    const newFilters = { ...filters };

    switch (filterType) {
      case "category":
      case "vendor":
        newFilters[filterType] = value;
        break;
      case "tags": {
        const currentTags = newFilters.tags || [];
        newFilters.tags = checked
          ? [...currentTags, value]
          : currentTags.filter((tag) => tag !== value);
        break;
      }
      case "inStock":
        newFilters.inStock = checked;
        break;
      case "price":
        newFilters.minPrice = value.min;
        newFilters.maxPrice = value.max;
        break;
      default:
        break;
    }
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (values) => {
    const newRange = { min: values[0], max: values[1] };
    setPriceRange(newRange);
    // Debounce to avoid rapid updates
    setTimeout(() => handleFilterChange("price", newRange), 300);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    onFiltersChange({});
  };

  const FilterSectionComponent = ({ title, children, sectionKey }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="font-semibold text-[#486e40]">{title}</h3>
        {expandedSections[sectionKey] ? (
          <FaChevronUp className="w-4 h-4 text-[#486e40]" />
        ) : (
          <FaChevronDown className="w-4 h-4 text-[#486e40]" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">{children}</div>
      )}
    </div>
  );

  return (
    <>
      <section className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-[#f8f5f2] hover:bg-[#ede8e3] text-[#486e40] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-[#486e40]/20"
            >
              <FaFilter /> Filters
            </button>
            <div className="text-sm text-[#8F9779]">
              Showing{" "}
              <span className="font-medium text-[#486e40]">
                {currentProducts}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#486e40]">
                {totalProducts}
              </span>{" "}
              products
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="relative w-full md:w-48">
              <select
                className="appearance-none bg-[#f8f5f2] border border-[#486e40]/20 text-[#486e40] py-2 px-4 pr-8 rounded-lg w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#64973f]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#486e40] text-xs pointer-events-none" />
            </div>

            {/* View Mode Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`${
                  viewMode === "grid"
                    ? "bg-[#486e40] text-white"
                    : "bg-[#f8f5f2] text-[#486e40]"
                } p-2 rounded-lg border border-[#486e40]/20 hover:bg-[#ede8e3] transition-colors`}
                title="Grid View"
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`${
                  viewMode === "list"
                    ? "bg-[#486e40] text-white"
                    : "bg-[#f8f5f2] text-[#486e40]"
                } p-2 rounded-lg border border-[#486e40]/20 hover:bg-[#ede8e3] transition-colors`}
                title="List View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
      </section>
      {showFilters && (
        <section className="container mx-auto px-4 mb-6">
          <div className="bg-[#f8f5f2] rounded-lg shadow-sm border border-[#486e40]/20">
            <div className="p-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaFilter className="w-5 h-5 text-[#64973f]" />
                  <h2 className="text-xl font-bold text-[#486e40]">Filters</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-sm text-[#64973f] hover:text-[#688d4f] font-medium transition-colors"
                  >
                    <FaTimesCircle className="w-4 h-4" /> Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-[#486e40] hover:text-[#64973f] transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Category */}
                <FilterSectionComponent title="Category" sectionKey="category">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange("category", "")}
                      className="w-4 h-4 accent-[#486e40] border-gray-300"
                    />
                    <span className="ml-2 text-sm text-[#8F9779]">
                      All Categories
                    </span>
                  </label>
                  {categories?.map((cat) => (
                    <label key={cat._id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat._id}
                        onChange={() => handleFilterChange("category", cat._id)}
                        className="w-4 h-4 accent-[#486e40] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-[#8F9779]">
                        {cat.name || cat.title || cat._id}
                      </span>
                    </label>
                  ))}
                </FilterSectionComponent>

                {/* Vendor */}
                {vendors?.length > 0 && (
                  <FilterSectionComponent title="Brand" sectionKey="vendor">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="vendor"
                        checked={!filters.vendor}
                        onChange={() => handleFilterChange("vendor", "")}
                        className="w-4 h-4 accent-[#486e40] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-[#8F9779]">
                        All Brands
                      </span>
                    </label>
                    {vendors.map((v) => (
                      <label key={v._id} className="flex items-center">
                        <input
                          type="radio"
                          name="vendor"
                          checked={filters.vendor === v._id}
                          onChange={() => handleFilterChange("vendor", v._id)}
                          className="w-4 h-4 accent-[#486e40] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-[#8F9779]">
                          {v.name || v.businessName || v._id}
                        </span>
                      </label>
                    ))}
                  </FilterSectionComponent>
                )}

                {/* Price Range */}
                <FilterSectionComponent title="Price Range" sectionKey="price">
                  <div className="space-y-3">
                    <CRangeSlider
                      min={0}
                      max={1000}
                      value={[priceRange.min, priceRange.max]}
                      onChange={handlePriceChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-[#8F9779]">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>
                </FilterSectionComponent>

                {/* Stock */}
                <FilterSectionComponent title="Availability" sectionKey="stock">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock || false}
                      onChange={(e) =>
                        handleFilterChange("inStock", null, e.target.checked)
                      }
                      className="w-4 h-4 accent-[#486e40] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-[#8F9779]">
                      In Stock Only
                    </span>
                  </label>
                </FilterSectionComponent>

                {/* Tags */}
                <FilterSectionComponent title="Features" sectionKey="tags">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {comfortTags.map((tag) => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.tags?.includes(tag) || false}
                          onChange={(e) =>
                            handleFilterChange("tags", tag, e.target.checked)
                          }
                          className="w-4 h-4 accent-[#486e40] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-[#8F9779] capitalize">
                          {tag}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSectionComponent>
              </div>

              {/* Drawer Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-200 text-[#486e40] px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="bg-[#486e40] text-white px-4 py-2 rounded-lg hover:bg-[#64973f] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FilterSection;
