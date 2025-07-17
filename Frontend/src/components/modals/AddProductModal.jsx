import { useEffect, useState, useRef } from "react";
import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaUpload,
  FaTag,
  FaPalette,
  FaInfoCircle,
  FaCheckCircle,
  FaSpinner,
  FaImage,
  FaTrash,
  FaStar,
  FaDollarSign,
  FaBoxes,
  FaPercent,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getCategories } from "../../api/categoryApi";
import { useSelector } from "react-redux";
import { addProduct, updateProduct } from "../../api/productApi";

const AddProductModal = ({ isOpen, onClose, initialProductData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    description: "",
    price: 0,
    stock: 0,
    comfortTags: [],
    images: [],
    variants: [],
    status: "active",
    commissionRate: 0.1,
    isFeatured: false,
  });

  const token = useSelector((state) => state.auth.auth_token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialProductData) {
        console.log("Initial Data", initialProductData)
        const initialImages =
          initialProductData.images?.map((url) => ({
            file: null,
            preview: url,
            path: url,
          })) || [];

                const variantStockSum = initialProductData.variants?.reduce(
        (sum, v) => sum + Number(v.stock || 0),
        0
      );

      const totalStock = Number(initialProductData.stock || 0);
      const baseStock = Math.max(totalStock - variantStockSum, 0);

        setFormData({
          ...initialProductData,
          price: Number(initialProductData.price || 0),
          stock: baseStock,
          commissionRate: Number(initialProductData.commissionRate || 0),
          images: initialImages,
          variants:
            initialProductData.variants?.map((v) => ({
              ...v,
              price: Number(v.price || 0),
              stock: Number(v.stock || 0),
            })) || [],
          comfortTags: initialProductData.comfortTags || [],
          status: initialProductData.status || "active",
          isFeatured: initialProductData.isFeatured || false,
          categoryId: initialProductData.categoryId._id || ""
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          categoryId: "",
          description: "",
          price: 0,
          stock: 0,
          comfortTags: [],
          images: [],
          variants: [],
          status: "active",
          commissionRate: 0.1,
          isFeatured: false,
        });
      }
    }
  }, [isOpen, initialProductData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploadLoading(true);
    try {
      const previews = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () =>
                resolve({ file, preview: reader.result, path: "" });
              reader.readAsDataURL(file);
            })
        )
      );

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...previews],
      }));

      toast.success(`${files.length} image(s) ready.`);
    } catch (error) {
      console.error("Image preview error:", error);
      toast.error("Failed to preview images.");
    } finally {
      setImageUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.info("Image removed.");
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", price: 0, stock: 0 }],
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [name]: name === "color" ? value : Number(value),
    };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newTag = e.target.value.trim().toLowerCase();
      if (!formData.comfortTags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          comfortTags: [...prev.comfortTags, newTag],
        }));
        e.target.value = "";
      } else {
        toast.warn("Tag already exists!");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      comfortTags: prev.comfortTags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("description", formData.description);
      form.append("categoryId", formData.categoryId);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("status", formData.status);
      form.append("commissionRate", formData.commissionRate);
      form.append("isFeatured", formData.isFeatured);
      form.append("comfortTags", JSON.stringify(formData.comfortTags));
      form.append("variants", JSON.stringify(formData.variants));

      // Only new files are uploaded
      formData.images.forEach((img) => {
        if (img.file) {
          form.append("images", img.file);
        }
      });

      let result;
      if (initialProductData?._id) {
        // Edit Mode
        result = await updateProduct(initialProductData._id, form, token);
      } else {
        // Add Mode
        result = await addProduct(form, token);
      }
      toast.success(result.message);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Product save failed:", error);
      toast.error("Failed to save product. Check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  const modalTitle = initialProductData ? "Edit Product" : "Add New Product";

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
      >
        {/* Header */}
        <div className="bg-white px-6 pt-5 pb-6 sm:p-6 sm:pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              {initialProductData ? <FaInfoCircle /> : <FaPlus />} {modalTitle}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FaInfoCircle className="text-blue-600" /> Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Luxury Sofa Set"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Product Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="luxury-sofa-set"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="A detailed description of your product..."
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FaDollarSign className="text-green-600" /> Base Price (NPR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumericChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FaBoxes className="text-orange-600" /> Base Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleNumericChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="0"
                  required
                />
              </div>
            
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  <FaStar className="inline text-yellow-500 mr-1" /> Mark as
                  Featured
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="block text-xs font-medium text-gray-700 mr-3">
                  Status:
                </label>
                <div className="flex gap-3">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                    <span className="ml-1 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === "inactive"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-red-600"
                    />
                    <span className="ml-1 text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Comfort Tags */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FaTag className="text-indigo-600" /> Comfort Tags
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.comfortTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 -mr-0.5 h-3.5 w-3.5 flex items-center justify-center rounded-full hover:bg-blue-200 text-blue-600"
                  >
                    <FaTimes className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Add tags (e.g., 'wooden', 'modern', press Enter)"
            />
          </div>

          {/* Images */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FaImage className="text-green-600" /> Product Images
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square rounded-md overflow-hidden shadow-sm border border-gray-200"
                >
                  <img
                    src={image.preview || "/placeholder.svg"}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors text-sm"
            >
              {imageUploadLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaUpload className="mr-2" />
              )}
              {imageUploadLoading ? "Uploading..." : "Upload Images"}
            </label>
          </div>

          {/* Variants */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FaPalette className="text-purple-600" /> Product Variants
            </h4>
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 mb-3 p-3 border border-gray-200 rounded-md"
              >
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="e.g., Red, Blue"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Price (NPR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVariant}
              className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 transition-colors text-sm"
            >
              <FaPlus className="mr-2" /> Add Variant
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaCheckCircle />{" "}
                {initialProductData ? "Update Product" : "Save Product"}
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
