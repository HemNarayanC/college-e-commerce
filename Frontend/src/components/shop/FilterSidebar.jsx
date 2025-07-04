import { useState } from "react";
import {
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaTimesCircle,
} from "react-icons/fa";
import { CRangeSlider } from "@coreui/react-pro";

const FilterSidebar = ({
  filters,
  onFiltersChange,
  categories,
  vendors,
  isOpen,
  onToggle,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    vendor: true,
    price: true,
    stock: true,
    tags: true,
  });

  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });

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
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (filterType, value, checked = null) => {
    const newFilters = { ...filters };

    if (filterType === "category" || filterType === "vendor") {
      newFilters[filterType] = value;
    } else if (filterType === "tags") {
      const currentTags = newFilters.tags || [];
      newFilters.tags = checked
        ? [...currentTags, value]
        : currentTags.filter((tag) => tag !== value);
    } else if (filterType === "inStock") {
      newFilters.inStock = checked;
    } else if (filterType === "price") {
      newFilters.minPrice = value.min;
      newFilters.maxPrice = value.max;
    }

    onFiltersChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);

    setTimeout(() => {
      handleFilterChange("price", newRange);
    }, 500);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    onFiltersChange({});
  };

  const FilterSection = ({ title, children, sectionKey }) => (
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 bg-[#f8f5f2] shadow-lg lg:shadow-none
          transform transition-transform duration-300 ease-in-out z-50 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaFilter className="w-5 h-5 text-[#64973f]" />
              <h2 className="text-xl font-bold text-[#486e40]">Filters</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-[#64973f] hover:text-[#688d4f] font-medium"
              >
                <FaTimesCircle className="w-4 h-4" />
                Clear All
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <FaTimes className="w-4 h-4 text-[#486e40]" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <FilterSection title="Category" sectionKey="category">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={!filters.category}
                    onChange={() => handleFilterChange("category", "")}
                    className="w-4 h-4 accent-[#486e40] border-gray-300 focus:ring-[#486e40]"
                  />
                  <span className="ml-2 text-sm text-[#8F9779]">
                    All Categories
                  </span>
                </label>
                {categories?.map((category) => (
                  <label key={category._id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category._id}
                      onChange={() =>
                        handleFilterChange("category", category._id)
                      }
                      className="w-4 h-4 accent-[#486e40] border-gray-300 focus:ring-[#486e40]"
                    />
                    <span className="ml-2 text-sm text-[#8F9779]">
                      {category.name || category.title || category._id}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Vendor Filter */}
            <FilterSection title="Brand" sectionKey="vendor">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="vendor"
                    checked={!filters.vendor}
                    onChange={() => handleFilterChange("vendor", "")}
                    className="w-4 h-4 accent-[#486e40] border-gray-300 focus:ring-[#486e40]"
                  />
                  <span className="ml-2 text-sm text-[#8F9779]">All Brands</span>
                </label>
                {vendors?.map((vendor) => (
                  <label key={vendor._id} className="flex items-center">
                    <input
                      type="radio"
                      name="vendor"
                      checked={filters.vendor === vendor._id}
                      onChange={() => handleFilterChange("vendor", vendor._id)}
                      className="w-4 h-4 accent-[#486e40] border-gray-300 focus:ring-[#486e40]"
                    />
                    <span className="ml-2 text-sm text-[#8F9779]">
                      {vendor.name || vendor.businessName || vendor._id}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Price Range Filter */}
            <FilterSection title="Price Range" sectionKey="price">
              <div className="space-y-3">
                <CRangeSlider
                  min={100}
                  max={1000000}
                  value={[priceRange.min || 0, priceRange.max || 0]}
                  onChange={(value) => {
                    handlePriceChange("min", value[0]);
                    handlePriceChange("max", value[1]);
                  }}
                />
              </div>
            </FilterSection>

            {/* Stock Filter */}
            <FilterSection title="Availability" sectionKey="stock">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) =>
                    handleFilterChange("inStock", null, e.target.checked)
                  }
                  className="w-4 h-4 accent-[#486e40] border-gray-300 rounded focus:ring-[#486e40]"
                />
                <span className="ml-2 text-sm text-[#8F9779]">In Stock Only</span>
              </label>
            </FilterSection>

            {/* Comfort Tags Filter */}
            <FilterSection title="Features" sectionKey="tags">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comfortTags.map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag) || false}
                      onChange={(e) =>
                        handleFilterChange("tags", tag, e.target.checked)
                      }
                      className="w-4 h-4 accent-[#486e40] border-gray-300 rounded focus:ring-[#486e40]"
                    />
                    <span className="ml-2 text-sm text-[#8F9779] capitalize">
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
