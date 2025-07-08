import { FaSearch } from "react-icons/fa"

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FaSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't find any products matching your current filters. Try adjusting your search criteria or clearing all
        filters.
      </p>
      <button
        onClick={onClearFilters}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}

export default EmptyState
