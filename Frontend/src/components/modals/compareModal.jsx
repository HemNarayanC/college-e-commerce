import { FaDollarSign, FaBoxes, FaTag, FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { removeFromCompare } from "../../redux/product/compareProduct";

const CompareModal = ({ compareList, onClose }) => {
  const dispatch = useDispatch();

  if (!compareList || compareList.length < 2) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50 p-4">
      <div className="bg-white max-w-6xl w-full p-6 rounded-3xl shadow-lg relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1"
          aria-label="Close Comparison Modal"
        >
          <IoMdClose />
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900 tracking-wide">
          Compare Products
        </h2>

        <div
          className="flex justify-center space-x-4 overflow-x-auto max-w-full pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {compareList.map((product) => (
            <div
              key={product._id}
              className="w-[260px] flex-shrink-0 border border-gray-200 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative text-center group"
            >
              {/* Delete button hidden by default, shows on hover */}
              <button
                onClick={() => dispatch(removeFromCompare(product._id))}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <FaTrashAlt size={18} />
              </button>

              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-36 object-cover rounded-xl mb-3 shadow"
                loading="lazy"
              />

              <h3 className="text-lg font-semibold text-gray-900 truncate" title={product.name}>
                {product.name}
              </h3>

              <p className="text-sm text-gray-600 mt-1 truncate" title={product.vendorName}>
                {product.vendorName || "Vendor"}
              </p>

              <div className="flex items-start justify-center gap-2 mt-2 text-gray-700">
                <FaInfoCircle className="text-md text-blue-600 mt-1" />
                <p
                  className="text-xs leading-snug max-h-[3.5em] overflow-hidden text-left"
                  title={product.description}
                >
                  {product.description?.length > 80
                    ? product.description.slice(0, 80) + "..."
                    : product.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 mt-2 text-gray-700">
                <FaDollarSign className="text-md text-green-600" />
                <p className="text-md font-semibold">${product.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-center gap-1 mt-2">
                <FaBoxes
                  className={`text-md ${
                    product.stock > 5
                      ? "text-green-600"
                      : product.stock > 0
                      ? "text-yellow-500"
                      : "text-red-600"
                  }`}
                />
                <p
                  className={`font-semibold text-sm ${
                    product.stock > 5
                      ? "text-green-600"
                      : product.stock > 0
                      ? "text-yellow-500"
                      : "text-red-600"
                  }`}
                >
                  {product.stock > 5
                    ? "In Stock"
                    : product.stock > 0
                    ? "Low Stock"
                    : "Out of Stock"}
                </p>
              </div>

              {product.comfortTags?.length > 0 && (
                <div className="mt-3">
                  <FaTag className="inline text-md text-purple-600 mr-1" />
                  <div className="inline-flex flex-wrap gap-1 justify-center">
                    {product.comfortTags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm"
                        title={tag}
                      >
                        {tag}
                      </span>
                    ))}
                    {product.comfortTags.length > 4 && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        +{product.comfortTags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
