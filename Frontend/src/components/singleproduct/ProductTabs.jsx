import { useState } from "react";
import {
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaRegCommentDots,
} from "react-icons/fa";

const ProductTabs = ({
  activeTab,
  setActiveTab,
  product,
  vendor,
  currentPrice,
  currentStock,
  reviews,
  formatDate,
}) => {
  const ReviewsList = ({ reviews, formatDate }) => {
    const [expandedReplies, setExpandedReplies] = useState(new Set());

    const toggleReplies = (reviewId) => {
      const newExpanded = new Set(expandedReplies);
      if (newExpanded.has(reviewId)) {
        newExpanded.delete(reviewId);
      } else {
        newExpanded.add(reviewId);
      }
      setExpandedReplies(newExpanded);
    };

    return (
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-[#8F9779]/20 pb-6 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#64973f]/10 rounded-full flex items-center justify-center text-[#486e40] font-bold">
                {review.userId?.name?.[0] || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-[#486e40]">
                    {review.userId?.name || "Anonymous"}
                  </h4>
                  <span className="text-xs text-[#8F9779]">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-[#8F9779]/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[#8F9779] mb-4">{review.comment}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-[#8F9779]">
                    Was this helpful?
                  </span>
                  <button className="flex items-center gap-1 text-xs text-[#486e40] hover:text-[#64973f] transition-colors">
                    <FaThumbsUp className="w-3 h-3" />
                    Yes ({review.helpful || 0})
                  </button>
                  <button className="flex items-center gap-1 text-xs text-[#486e40] hover:text-[#64973f] transition-colors">
                    <FaThumbsDown className="w-3 h-3" />
                    No ({review.notHelpful || 0})
                  </button>
                </div>

                {/* Replies Toggle Button */}
                {review.replies?.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleReplies(review._id)}
                      className="flex items-center gap-2 text-sm text-[#486e40] hover:text-[#64973f] transition-colors mb-3 font-medium"
                    >
                      <FaReply className="w-3 h-3" />
                      {expandedReplies.has(review._id) ? "Hide" : "Show"}{" "}
                      {review.replies.length}{" "}
                      {review.replies.length === 1 ? "Reply" : "Replies"}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedReplies.has(review._id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Replies Dropdown */}
                    {expandedReplies.has(review._id) && (
                      <div className="space-y-3 pl-6 border-l-2 border-[#64973f]/20 bg-[#f8f5f2]/30 rounded-r-lg p-4 animate-in slide-in-from-top-2 duration-200">
                        {review.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className="flex items-start gap-3"
                          >
                            <div className="w-8 h-8 bg-[#64973f]/20 rounded-full flex items-center justify-center text-[#486e40] font-bold text-sm">
                              {reply.userId?.name?.[0] || "V"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-[#486e40] text-sm">
                                  {reply.userId?.name || "Vendor"}
                                </span>
                                <span className="text-xs text-[#8F9779]">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-[#8F9779] text-sm leading-relaxed">
                                {reply.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border-t border-[#8F9779]/20">
      <div className="flex border-b border-[#8F9779]/20">
        {["description", "specifications", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-[#64973f] border-b-2 border-[#64973f]"
                : "text-[#8F9779] hover:text-[#486e40]"
            }`}
          >
            {tab}
            {tab === "reviews" && (
              <span className="ml-1">({reviews.length})</span>
            )}
          </button>
        ))}
      </div>
      <div className="p-8">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-[#8F9779] leading-relaxed whitespace-pre-line">
                {product.description ||
                  "This is a high-quality product with excellent features and great value for money."}
              </p>
            </div>
            {product.comfortTags && product.comfortTags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-[#486e40] mb-4">
                  Product Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.comfortTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border border-[#64973f]/20 bg-[#64973f]/10 text-[#486e40] px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#486e40] border-b pb-2 border-[#8F9779]/20">
              Product Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8f5f2] p-6 rounded-lg border border-[#8F9779]/10 shadow-sm">
              {/* Brand */}
              <div className="flex flex-col">
                <span className="text-sm text-[#8F9779] mb-1">Brand</span>
                <span className="font-medium text-[#486e40]">
                  {vendor?.businessName || "Unknown"}
                </span>
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <span className="text-sm text-[#8F9779] mb-1">Category</span>
                <span className="font-medium text-[#486e40]">
                  {product?.categoryId?.name || "Uncategorized"}
                </span>
              </div>

              {/* Base Price */}
              <div className="flex flex-col">
                <span className="text-sm text-[#8F9779] mb-1">Base Price</span>
                <span className="font-medium text-[#486e40]">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Variant Price */}
              {product.variants?.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-sm text-[#8F9779] mb-1">
                    Selected Variant Price
                  </span>
                  <span className="font-medium text-[#486e40]">
                    ${currentPrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Variant Stock */}
              {product.variants?.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-sm text-[#8F9779] mb-1">
                    Stock (Selected Variant)
                  </span>
                  <span className="font-medium text-[#486e40]">
                    {currentStock} units
                  </span>
                </div>
              )}

              {/* Comfort Tags */}
              {product.comfortTags?.length > 0 && (
                <div className="md:col-span-2">
                  <span className="text-sm text-[#8F9779] mb-1 block">
                    Comfort Tags
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.comfortTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full border border-[#64973f]/20 bg-[#64973f]/10 text-[#486e40] px-3 py-1 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Variant Attributes */}
              {product.variants?.length > 0 &&
                Object.entries(
                  product.variants.find(
                    (v) => v.price === currentPrice && v.stock === currentStock
                  ) || {}
                ).map(
                  ([key, value]) =>
                    !["_id", "price", "stock"].includes(key) && (
                      <div key={key} className="flex flex-col capitalize">
                        <span className="text-sm text-[#8F9779] mb-1">
                          {key}
                        </span>
                        <span className="font-medium text-[#486e40]">
                          {value}
                        </span>
                      </div>
                    )
                )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#486e40]">
                Customer Reviews
              </h3>
              <button className="bg-[#64973f] hover:bg-[#486e40] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Write a Review
              </button>
            </div>
            {reviews?.length > 0 ? (
              <ReviewsList reviews={reviews} formatDate={formatDate} />
            ) : (
              <div className="text-center py-12">
                <FaRegCommentDots className="text-[#8F9779] text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#486e40] mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-[#8F9779] mb-6">
                  Be the first to review this product!
                </p>
                <button className="bg-[#64973f] hover:bg-[#486e40] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Write First Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
