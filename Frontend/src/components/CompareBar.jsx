import React, { useRef, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCompare } from "../redux/product/compareProduct";
import CompareModal from "./modals/compareModal";

const CompareBarAndModal = () => {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.compare.compareList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBar, setShowBar] = useState(compareList.length > 0);
  const hideTimeout = useRef(null);

  useEffect(() => {
    if (compareList.length === 0) {
      setIsModalOpen(false);
      setShowBar(false);
    } else {
      setShowBar(true);
      startHideTimer();
    }
  }, [compareList]);

  const startHideTimer = () => {
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowBar(false), 5000);
  };

  const handleBarInteraction = () => {
    if (showBar) startHideTimer();
  };

  const openCompareModal = () => {
    if (compareList.length > 1) setIsModalOpen(true);
  };

  return (
    <>
      {compareList.length > 0 && (
        <>
          {/* Bottom Bar */}
          <div
            onMouseEnter={handleBarInteraction}
            onMouseMove={handleBarInteraction}
            className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg p-4 flex justify-center items-center space-x-6 z-50 transition-all duration-500 ${
              showBar ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {compareList.map((product) => (
              <div
                key={product._id}
                className="text-center relative group"
                onMouseEnter={handleBarInteraction}
              >
                <div className="relative">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                  />
                  <button
                    onClick={() => dispatch(removeFromCompare(product._id))}
                    className="absolute -top-2 -right-2 text-xs bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-400"
                    aria-label={`Remove ${product.name}`}
                  >
                    <IoMdClose />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 truncate max-w-[100px]">
                  {product.name}
                </p>
              </div>
            ))}

            <button
              onClick={openCompareModal}
              className="px-6 py-2 bg-[#64973f] text-white rounded-lg flex items-center gap-2 hover:bg-[#6f8e58] transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <FaEye className="text-lg" />
              <span>| Compare</span>
            </button>
          </div>

          {/* Floating Button */}
          <div
            className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
              !showBar ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <button
              onClick={() => {
                setShowBar(true);
                startHideTimer();
              }}
              className="bg-[#64973f] hover:bg-[#688d4f] text-white p-4 rounded-full shadow-lg transition duration-200 flex items-center gap-2 group relative"
              aria-label="Show Comparison Bar"
            >
              <FaEye className="text-xl" />
              <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Show Comparison
              </span>
            </button>
          </div>
        </>
      )}

      {/* Compare Modal */}
      {isModalOpen && (
        <CompareModal
          compareList={compareList}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default CompareBarAndModal