import React from "react";

const SortBarSimple = ({ sortBy, setSortBy, viewMode, setViewMode }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border px-3 py-1 rounded text-sm"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="newest">Newest</option>
      </select>

      <div className="space-x-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1 border rounded ${viewMode === "grid" ? "bg-[#8F9779] text-white" : ""}`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1 border rounded ${viewMode === "list" ? "bg-[#8F9779] text-white" : ""}`}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default SortBarSimple;