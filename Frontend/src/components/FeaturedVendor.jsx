import React, { useEffect, useState } from "react";
import { getFeaturedVendors } from "../api/vendorApi";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const FeaturedVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const featuredVendors = await getFeaturedVendors();
        setVendors(featuredVendors || []);
      } catch (err) {
        console.error("Error fetching featured vendors:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <section className="py-12 bg-[#f5f1ea]">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#5b4636]">
            Featured Vendors
          </h2>
          <Link
            to="/vendors"
            className="flex items-center gap-2 text-[#7f6e58] hover:text-[#a08c6c] font-semibold text-sm transition"
            aria-label="View all vendors"
          >
            View All Vendors <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-[#8b7a68]">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p className="text-center text-[#8b7a68]">No featured vendors available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            {vendors.map((vendor) => (
              <a
                href={`/vendor/${vendor._id}`}
                key={vendor._id}
                className="group block bg-[#e9e4db] rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 p-6 text-center focus:outline-none focus:ring-2 focus:ring-[#7f6e58]"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={vendor.storeLogo || "/placeholder.png"}
                    alt={`${vendor.businessName} Logo`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#c2ad96] shadow-inner"
                    loading="lazy"
                  />
                </div>

                <h3
                  className="text-lg font-bold text-[#5b4636] mb-1 truncate"
                  title={vendor.businessName}
                >
                  {vendor.businessName}
                </h3>

                <div className="flex justify-center items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(vendor.ratingAvg || 0)
                          ? "text-[#f4aa15]"
                          : "text-[#dcd6c9]"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.538 1.118L10 13.348l-3.376 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.96a1 1 0 00-.364-1.118L3.633 9.387c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.96z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-[#f4aa15] font-medium">
                    {vendor.ratingAvg?.toFixed(1) || "0.0"}
                  </span>
                </div>

                <p
                  className="text-sm text-[#7f6e58] truncate"
                  title={`${vendor.address?.city || "Unknown City"}, ${
                    vendor.address?.province || ""
                  }`}
                >
                  {vendor.address?.city || "Unknown City"},{" "}
                  {vendor.address?.province || ""}
                </p>

                <button
                  type="button"
                  className="mt-5 w-full py-2 rounded-md border border-[#8a9a5b] bg-white bg-opacity-20 backdrop-blur-sm text-[#5b6e2f] font-semibold shadow-md hover:bg-opacity-40 hover:text-[#7f934e] transition"
                >
                  Visit Store
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVendor;
