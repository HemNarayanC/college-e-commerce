"use client"

import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  onPageChange,
  totalItems,
  currentItems,
}) => {
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-[#8F9779]/10">
        <div className="text-sm text-[#8F9779]">
          Showing {indexOfFirstItem}-{indexOfLastItem} of {totalItems} products
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === 1
                  ? "bg-[#8F9779]/10 text-[#8F9779]/50 cursor-not-allowed"
                  : "bg-[#f8f5f2] text-[#486e40] hover:bg-[#64973f]/10"
              }`}
            >
              <FaChevronLeft />
            </button>

            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..."}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  page === currentPage
                    ? "bg-[#64973f] text-white"
                    : page === "..."
                      ? "bg-transparent text-[#8F9779] cursor-default"
                      : "bg-[#f8f5f2] text-[#486e40] hover:bg-[#64973f]/10"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === totalPages
                  ? "bg-[#8F9779]/10 text-[#8F9779]/50 cursor-not-allowed"
                  : "bg-[#f8f5f2] text-[#486e40] hover:bg-[#64973f]/10"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-[#f8f5f2] border border-[#8F9779]/20 text-[#486e40] py-2 px-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#64973f]"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number.parseInt(e.target.value))
                onPageChange(1)
              }}
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={36}>36 per page</option>
              <option value={48}>48 per page</option>
            </select>
            <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8F9779] text-xs pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pagination
