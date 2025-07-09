import { FaStar, FaThumbsUp, FaThumbsDown, FaChevronDown } from "react-icons/fa";

const ReviewsSection = ({ reviews, vendor }) => {
  console.log("Reviews from ReviewSection", reviews)
  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });

    const total = reviews.length;
    return Object.keys(distribution)
      .map((rating) => ({
        rating: Number.parseInt(rating),
        count: distribution[rating],
        percentage: total > 0 ? (distribution[rating] / total) * 100 : 0,
      }))
      .reverse();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  };

  const getInitials = (user) => {
    if (!user) return "NA";
    if (typeof user === "string") return user.slice(0, 2).toUpperCase();
    if (user.name) return user.name.slice(0, 2).toUpperCase();
    return "NA";
  };

  const getUserName = (user) => {
    if (!user) return "Anonymous";
    if (typeof user === "string") return `User ${user.slice(-4)}`;
    if (user.name) return user.name;
    return `User ${user._id?.slice(-4) || ""}`;
  };

  const ratingDistribution = calculateRatingDistribution();

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-[#8F9779]/10">
        <h2 className="text-3xl font-bold text-[#486e40] mb-8">Customer Reviews</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#f8f5f2] to-[#64973f]/5 p-6 rounded-xl border border-[#8F9779]/10">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-[#64973f] mb-2">
                  {vendor.ratingAvg?.toFixed(1) || "0.0"}
                </div>
                <div className="flex justify-center text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(vendor.ratingAvg || 0) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="text-sm text-[#8F9779]">
                  Based on {reviews.length} reviews
                </div>
              </div>

              <div className="space-y-3">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <div className="w-12 text-sm text-[#8F9779]">{item.rating} stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-xs text-[#8F9779] text-right">
                      {item.percentage.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#64973f] text-white py-3 px-4 rounded-lg hover:bg-[#688d4f] transition-colors mt-6 font-medium">
                Write a Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#486e40]">Recent Reviews</h3>
              <div className="relative">
                <select className="appearance-none bg-[#f8f5f2] border border-[#8F9779]/20 text-[#486e40] py-2 px-4 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#64973f]">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                  <option>Lowest Rated</option>
                  <option>Most Helpful</option>
                </select>
                <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8F9779] text-xs pointer-events-none" />
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-[#8F9779]/20 pb-6 last:pb-0 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#64973f]/10 rounded-full flex items-center justify-center text-[#486e40] font-bold">
                        {getInitials(review.userId)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#486e40]">{getUserName(review.userId)}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#8F9779]">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[#8F9779]">{review.comment}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-xs text-[#8F9779]">Was this review helpful?</div>
                    <button className="text-xs bg-[#f8f5f2] hover:bg-[#64973f]/10 text-[#486e40] px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <FaThumbsUp />
                      Yes ({review.helpful || 0})
                    </button>
                    <button className="text-xs bg-[#f8f5f2] hover:bg-[#64973f]/10 text-[#486e40] px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <FaThumbsDown />
                      No ({review.notHelpful || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-white border-2 border-[#64973f] text-[#486e40] hover:bg-[#64973f]/5 px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
