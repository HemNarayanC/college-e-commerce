"use client"

import { useState, useEffect } from "react"
import { FaRegCommentDots, FaStar, FaUser, FaFlag, FaPaperPlane, FaStore, FaUserTie, FaReply } from "react-icons/fa"

// Demo data that matches your backend model structure
const demoReviews = [
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9d0",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9d1",
      name: "Sarah Johnson",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 5,
    comment:
      "Absolutely love this product! The quality is outstanding and it exceeded my expectations. The comfort level is amazing and I would definitely recommend this to anyone looking for something similar. Great value for money!",
    comfortScore: 9,
    createdAt: "2024-01-15T10:30:00Z",
    replies: [
      {
        userId: {
          _id: "64f8a1b2c3d4e5f6a7b8c9d3",
          name: "Green Living Store",
          role: "vendor",
        },
        message:
          "Thank you so much for your wonderful review, Sarah! We're thrilled that you're happy with your purchase. Your feedback means a lot to us!",
        createdAt: "2024-01-16T09:15:00Z",
      },
    ],
    flags: [],
    isActive: true,
  },
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9d4",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9d5",
      name: "Mike Chen",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 4,
    comment:
      "Pretty good overall. The product does what it's supposed to do and the quality is decent. Only minor complaint is that the packaging could be better - arrived a bit damaged but the product itself was fine.",
    comfortScore: 7,
    createdAt: "2024-01-12T14:20:00Z",
    replies: [],
    flags: [],
    isActive: true,
  },
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9d6",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9d7",
      name: "Emily Rodriguez",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 5,
    comment:
      "Fantastic product! I've been using it for a few weeks now and it's been perfect. The comfort score I'm giving reflects how satisfied I am. Fast shipping too!",
    comfortScore: 10,
    createdAt: "2024-01-10T16:45:00Z",
    replies: [
      {
        userId: {
          _id: "64f8a1b2c3d4e5f6a7b8c9d3",
          name: "Green Living Store",
          role: "vendor",
        },
        message:
          "Emily, thank you for taking the time to leave such a positive review! We're so glad you're enjoying the product and that our shipping met your expectations.",
        createdAt: "2024-01-11T10:30:00Z",
      },
    ],
    flags: [],
    isActive: true,
  },
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9d8",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9d9",
      name: "David Thompson",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 3,
    comment:
      "It's okay, not bad but not amazing either. For the price point, I expected a bit more. The comfort is average and the build quality could be improved. Might work for some people but didn't quite meet my needs.",
    comfortScore: 5,
    createdAt: "2024-01-08T09:15:00Z",
    replies: [
      {
        userId: {
          _id: "64f8a1b2c3d4e5f6a7b8c9d3",
          name: "Green Living Store",
          role: "vendor",
        },
        message:
          "Hi David, thank you for your honest feedback. We appreciate all reviews as they help us improve. If you'd like to discuss your concerns further, please feel free to contact our customer service team.",
        createdAt: "2024-01-09T11:20:00Z",
      },
    ],
    flags: [],
    isActive: true,
  },
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9da",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9db",
      name: "Anonymous User",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 1,
    comment:
      "This is terrible garbage! Complete waste of money. The seller is probably a scammer and this product should be banned from the platform. Don't buy this trash!",
    comfortScore: 1,
    createdAt: "2024-01-05T16:45:00Z",
    replies: [],
    flags: [
      {
        userId: "64f8a1b2c3d4e5f6a7b8c9d3",
        reason: "inappropriate",
        createdAt: "2024-01-06T08:30:00Z",
      },
    ],
    isActive: true,
  },
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9dc",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9dd",
      name: "Lisa Wang",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 4,
    comment:
      "Good product with solid build quality. I'm quite satisfied with my purchase. The comfort level is good and it serves its purpose well. Would consider buying from this seller again.",
    comfortScore: 8,
    createdAt: "2024-01-03T12:30:00Z",
    replies: [],
    flags: [],
    isActive: true,
  },
  {
    _id: "64f8a1b2c3d4e5f6a7b8c9de",
    userId: {
      _id: "64f8a1b2c3d4e5f6a7b8c9df",
      name: "James Wilson",
    },
    productId: "64f8a1b2c3d4e5f6a7b8c9d2",
    rating: 5,
    comment:
      "Excellent product! Exactly what I was looking for. The quality is top-notch and the comfort factor is outstanding. Highly recommend to anyone considering this purchase.",
    comfortScore: 9,
    createdAt: "2024-01-01T18:20:00Z",
    replies: [
      {
        userId: {
          _id: "64f8a1b2c3d4e5f6a7b8c9d3",
          name: "Green Living Store",
          role: "vendor",
        },
        message:
          "James, we're so happy to hear that you're satisfied with your purchase! Thank you for choosing our product and for the excellent review.",
        createdAt: "2024-01-02T09:45:00Z",
      },
    ],
    flags: [],
    isActive: true,
  },
]

// Mock API functions that simulate your backend
const reviewAPI = {
  // Get reviews for a product
  getReviewsByProduct: async (productId, page = 1, limit = 10) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = demoReviews.slice(startIndex, endIndex)

    return {
      total: demoReviews.length,
      page,
      limit,
      reviews: paginatedReviews,
    }
  },

  // Add a new review
  addReview: async (reviewData, token) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newReview = {
      _id: `new_${Date.now()}`,
      userId: {
        _id: "current_user_id",
        name: "You",
      },
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      comfortScore: reviewData.comfortScore,
      createdAt: new Date().toISOString(),
      replies: [],
      flags: [],
      isActive: true,
    }

    // Add to demo data
    demoReviews.unshift(newReview)

    return { message: "Review added", review: newReview }
  },

  // Flag a review
  flagReview: async (reviewId, reason, token) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const review = demoReviews.find((r) => r._id === reviewId)
    if (review) {
      const newFlag = {
        userId: "current_user_id",
        reason,
        createdAt: new Date().toISOString(),
      }
      review.flags.push(newFlag)
    }

    return { message: "Review flagged", review }
  },

  // Reply to a review (vendor only)
  replyToReview: async (reviewId, message, token) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const review = demoReviews.find((r) => r._id === reviewId)
    if (review) {
      const newReply = {
        userId: {
          _id: "vendor_id",
          name: "Green Living Store",
          role: "vendor",
        },
        message,
        createdAt: new Date().toISOString(),
      }
      review.replies.push(newReply)
    }

    return { message: "Reply added", review }
  },
}

// Star Rating Component
const SimpleStarRating = ({ rating, onRatingChange, readonly = false, size = "md" }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating)
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-all duration-200 ${sizeClasses[size]}`}
          >
            <FaStar className={`${isFilled ? "text-yellow-400" : "text-gray-300"} transition-colors duration-200`} />
          </button>
        )
      })}
    </div>
  )
}

// Reply Component
const ReviewReply = ({ reply, formatDate }) => {
  return (
    <div className="ml-8 mt-3 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
      <div className="flex items-center gap-2 mb-1">
        <FaStore className="text-blue-600 text-xs" />
        <span className="font-semibold text-blue-800 text-sm">{reply.userId?.name || "Vendor"}</span>
        <span className="text-blue-600 text-xs">• {formatDate(reply.createdAt)}</span>
      </div>
      <p className="text-blue-700 text-sm">{reply.message}</p>
    </div>
  )
}

// Review Comment Component
const ReviewComment = ({ review, onFlag, onReply, isVendor = false, formatDate, token }) => {
  const [showFlagMenu, setShowFlagMenu] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const handleFlag = async (reason) => {
    try {
      await onFlag(review._id, reason)
      setShowFlagMenu(false)
    } catch (error) {
      console.error("Error flagging review:", error)
    }
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setIsSubmittingReply(true)
    try {
      await onReply(review._id, replyMessage.trim())
      setReplyMessage("")
      setShowReplyForm(false)
    } catch (error) {
      console.error("Error replying to review:", error)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleClickOutside = () => {
    setShowFlagMenu(false)
  }

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-[#8F9779] rounded-full flex items-center justify-center flex-shrink-0">
          <FaUser className="text-white text-sm" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#486e40] text-sm">{review.userId?.name || "Anonymous"}</span>
            <SimpleStarRating rating={review.rating} readonly size="sm" />
            <span className="text-[#8F9779] text-xs">• {formatDate(review.createdAt)}</span>

            {/* Flag indicator */}
            {review.flags && review.flags.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                Flagged ({review.flags.length})
              </span>
            )}

            {/* Actions for vendors */}
            {isVendor && (
              <div className="relative ml-auto flex items-center gap-2">
                {/* Reply button */}
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-[#8F9779] hover:text-[#64973f] p-1 transition-colors rounded-full hover:bg-green-50"
                  title="Reply to Review"
                >
                  <FaReply className="text-xs" />
                </button>

                {/* Flag button */}
                <button
                  onClick={() => setShowFlagMenu(!showFlagMenu)}
                  className="text-[#8F9779] hover:text-red-500 p-1 transition-colors rounded-full hover:bg-red-50"
                  title="Report Review"
                >
                  <FaFlag className="text-xs" />
                </button>

                {showFlagMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={handleClickOutside}></div>
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="p-2 bg-red-50 border-b border-red-100">
                        <div className="flex items-center gap-2">
                          <FaFlag className="text-red-500 text-xs" />
                          <span className="text-xs font-semibold text-red-700">Report Review</span>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => handleFlag("spam")}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                          Report as spam
                        </button>
                        <button
                          onClick={() => handleFlag("inappropriate")}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          Inappropriate content
                        </button>
                        <button
                          onClick={() => handleFlag("fake")}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          Fake review
                        </button>
                        <button
                          onClick={() => handleFlag("offensive")}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Offensive language
                        </button>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={() => setShowFlagMenu(false)}
                          className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Review text */}
          <p className="text-gray-700 text-sm leading-relaxed mb-2">{review.comment}</p>

          {/* Comfort Score */}
          {review.comfortScore && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#8F9779]">Comfort Score:</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#64973f] rounded-full transition-all duration-300"
                    style={{ width: `${(review.comfortScore / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-[#486e40] font-medium">{review.comfortScore}/10</span>
              </div>
            </div>
          )}

          {/* Replies */}
          {review.replies && review.replies.length > 0 && (
            <div className="mt-3">
              {review.replies.map((reply, index) => (
                <ReviewReply key={index} reply={reply} formatDate={formatDate} />
              ))}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && isVendor && (
            <form onSubmit={handleReplySubmit} className="mt-3 bg-gray-50 rounded-lg p-3">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#64973f] focus:border-transparent resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{replyMessage.length}/500</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !replyMessage.trim()}
                    className="px-4 py-1 bg-[#64973f] hover:bg-[#486e40] text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingReply ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// Review Form Component
const ReviewForm = ({ onSubmit, isVendor, productId }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [comfortScore, setComfortScore] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!rating) {
      alert("Please select a rating")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        productId,
        rating,
        comment: comment.trim(),
        comfortScore,
      })

      // Reset form
      setRating(0)
      setComment("")
      setComfortScore(5)
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        {isVendor ? (
          <>
            <FaStore className="text-[#486e40] text-sm" />
            <h4 className="font-semibold text-[#486e40]">Write a Review (Vendor)</h4>
          </>
        ) : (
          <>
            <FaUser className="text-[#486e40] text-sm" />
            <h4 className="font-semibold text-[#486e40]">Write a Review</h4>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#486e40] font-medium">Your Rating:</span>
          <SimpleStarRating rating={rating} onRatingChange={setRating} />
          {rating > 0 && <span className="text-sm text-[#8F9779]">({rating}/5)</span>}
        </div>

        {/* Comfort Score */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#486e40] font-medium">Comfort Score:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              value={comfortScore}
              onChange={(e) => setComfortScore(Number(e.target.value))}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #64973f 0%, #64973f ${(comfortScore / 10) * 100}%, #e5e7eb ${(comfortScore / 10) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <span className="text-sm text-[#8F9779] font-medium">{comfortScore}/10</span>
          </div>
        </div>

        {/* Comment textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            isVendor
              ? "Share your professional experience or response..."
              : "Share your experience with this product..."
          }
          rows={4}
          maxLength={1000}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#64973f] focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{comment.length}/1000 characters</span>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#64973f] hover:bg-[#486e40] text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <FaPaperPlane className="text-sm" />
                Post Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// Reviews List Component
const ReviewsList = ({ reviews, formatDate, onFlag, onReply, isVendor = false, token }) => {
  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getAverageComfortScore = () => {
    const reviewsWithComfort = reviews.filter((r) => r.comfortScore)
    if (reviewsWithComfort.length === 0) return 0
    const sum = reviewsWithComfort.reduce((acc, review) => acc + review.comfortScore, 0)
    return (sum / reviewsWithComfort.length).toFixed(1)
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#486e40]">{getAverageRating()}</div>
              <div className="text-sm text-[#8F9779]">out of 5</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#486e40]">{getAverageComfortScore()}</div>
              <div className="text-sm text-[#8F9779]">comfort score</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-[#486e40] font-medium mb-1">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </div>
              <div className="text-xs text-[#8F9779]">Based on customer feedback</div>
            </div>
            {/* Vendor indicator */}
            {isVendor && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                <FaUserTie className="text-blue-600 text-xs" />
                <span className="text-xs font-medium text-blue-700">Vendor View</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-0">
        {reviews.map((review) => (
          <ReviewComment
            key={review._id}
            review={review}
            onFlag={onFlag}
            onReply={onReply}
            isVendor={isVendor}
            formatDate={formatDate}
            token={token}
          />
        ))}
      </div>
    </div>
  )
}

// Main Reviews Tab Component
const ReviewsTab = ({ productId = "64f8a1b2c3d4e5f6a7b8c9d2", isVendor = false, token = "demo_token" }) => {
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  const formatDate = (date) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffTime = Math.abs(now - reviewDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  // Load reviews
  const loadReviews = async (page = 1) => {
    try {
      setLoading(true)
      const data = await reviewAPI.getReviewsByProduct(productId, page, pagination.limit)
      setReviews(data.reviews)
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
      })
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load reviews on component mount
  useEffect(() => {
    if (productId) {
      loadReviews()
    }
  }, [productId])

  const handleSubmitReview = async (reviewData) => {
    try {
      await reviewAPI.addReview(reviewData, token)
      setShowReviewForm(false)
      // Reload reviews to show the new one
      await loadReviews()
    } catch (error) {
      throw error
    }
  }

  const handleFlagReview = async (reviewId, reason) => {
    try {
      await reviewAPI.flagReview(reviewId, reason, token)
      alert(`Review reported for: ${reason}. Thank you for helping keep our community safe.`)
      // Reload to show flag indicator
      await loadReviews()
    } catch (error) {
      alert("Failed to flag review. Please try again.")
    }
  }

  const handleReplyToReview = async (reviewId, message) => {
    try {
      await reviewAPI.replyToReview(reviewId, message, token)
      // Reload reviews to show the new reply
      await loadReviews()
    } catch (error) {
      alert("Failed to reply to review. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#486e40]">Customer Reviews</h3>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#64973f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8F9779]">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#486e40]">Customer Reviews</h3>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading reviews: {error}</p>
          <button
            onClick={() => loadReviews()}
            className="bg-[#64973f] hover:bg-[#486e40] text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with user type indicator */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-[#486e40]">Customer Reviews</h3>
          {isVendor && (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <FaStore className="text-green-600 text-xs" />
              <span className="text-xs font-medium text-green-700">Vendor Access</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-[#64973f] hover:bg-[#486e40] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isVendor ? <FaStore className="text-sm" /> : <FaUser className="text-sm" />}
          {showReviewForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Vendor features info */}
      {isVendor && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FaFlag className="text-blue-600 text-sm mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Vendor Features Active</p>
              <p className="text-xs text-blue-600 mt-1">
                You can flag inappropriate reviews and reply to customer feedback using the action buttons next to each
                review.
              </p>
            </div>
          </div>
        </div>
      )}

      {reviews?.length > 0 ? (
        <>
          <ReviewsList
            reviews={reviews}
            formatDate={formatDate}
            onFlag={handleFlagReview}
            onReply={handleReplyToReview}
            isVendor={isVendor}
            token={token}
          />

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => loadReviews(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                onClick={() => loadReviews(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Review Form at Bottom */}
          {showReviewForm && <ReviewForm onSubmit={handleSubmitReview} isVendor={isVendor} productId={productId} />}
        </>
      ) : (
        <div className="text-center py-12">
          <FaRegCommentDots className="text-[#8F9779] text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#486e40] mb-2">No Reviews Yet</h3>
          <p className="text-[#8F9779] mb-6">
            {isVendor
              ? "No customer reviews yet. Encourage customers to share their experience!"
              : "Be the first to review this product!"}
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-[#64973f] hover:bg-[#486e40] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            {isVendor ? <FaStore className="text-sm" /> : <FaUser className="text-sm" />}
            Write First Review
          </button>

          {/* Review Form at Bottom when no reviews */}
          {showReviewForm && <ReviewForm onSubmit={handleSubmitReview} isVendor={isVendor} productId={productId} />}
        </div>
      )}
    </div>
  )
}

export default ReviewsTab
