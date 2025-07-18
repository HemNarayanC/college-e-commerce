import { FaTimes } from "react-icons/fa";

const ImageModal = ({
  showImageModal,
  setShowImageModal,
  product,
  currentVariant,
  selectedImageIndex,
}) => {
  if (!showImageModal) return null;

  const getImageSrc = () => {
    if (currentVariant?.image) return currentVariant.image;
    if (Array.isArray(product?.images) && product.images[selectedImageIndex]) {
      return product.images[selectedImageIndex];
    }
    if (product?.images?.length > 0) return product.images[0];
    return "/placeholder.svg";
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        <button
          onClick={() => setShowImageModal(false)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <img
          src={getImageSrc()}
          alt={product?.name || "Product Image"}
          className="max-w-full max-h-[90vh] object-contain w-full h-auto rounded-lg border border-white/10 shadow-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
