import { FaExpand } from "react-icons/fa";

const ProductImageGallery = ({
  product,
  currentVariant,
  selectedImageIndex,
  setSelectedImageIndex,
  setShowImageModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-[#f8f5f2] rounded-xl overflow-hidden group">
        <img
          src={
            currentVariant?.image ||
            product.images?.[selectedImageIndex] ||
            product.images?.[0] ||
            "/placeholder.svg"
          }
          alt={product.name}
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
          className="max-w-full max-h-full object-contain rounded-lg"
        />

        <button
          onClick={() => setShowImageModal(true)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaExpand className="w-4 h-4 text-[#486e40]" />
        </button>
        {product.isFeatured && (
          <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Featured
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? "border-[#64973f] ring-2 ring-[#64973f]/20"
                  : "border-[#8F9779]/20 hover:border-[#64973f]/50"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
