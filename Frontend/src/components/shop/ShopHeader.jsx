import { FaThLarge, FaList, FaFilter, FaSort } from "react-icons/fa";

const ShopHeader = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  totalProducts,
  currentPage,
  productsPerPage,
  onToggleFilters,
}) => {
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "-name", label: "Name Z-A" },
    { value: "price", label: "Price Low to High" },
    { value: "-price", label: "Price High to Low" },
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
  ];

  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="bg-[#f8f5f2] border-b border-gray-200 p-4 sticky top-0 z-30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side - Results count and filter toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleFilters}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#8F9779] text-[#486e40] rounded-lg hover:bg-[#f0edea] transition-colors"
          >
            <FaFilter className="w-4 h-4" />
            Filters
          </button>
          <div className="text-sm text-[#8F9779]">
            Showing {startProduct}-{endProduct} of {totalProducts} products
          </div>
        </div>

        {/* Right side - View mode and sort */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <FaSort className="w-4 h-4 text-[#8F9779]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="border border-[#8F9779] text-[#486e40] rounded-lg px-3 py-2 text-sm bg-white outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[#8F9779] rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#64973f] text-white"
                  : "bg-white text-[#8F9779] hover:bg-[#f0edea]"
              }`}
              title="Grid View"
            >
              <FaThLarge className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[#64973f] text-white"
                  : "bg-white text-[#8F9779] hover:bg-[#f0edea]"
              }`}
              title="List View"
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
