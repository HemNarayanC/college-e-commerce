// import axios from "axios";
// import { config } from "../config/config";

// /**
//  * Fetches all data required for the customer dashboard.
//  * @param {string} token - The authorization token.
//  * @returns {Promise<object>} The axios response object containing customer dashboard data.
//  */
// const getCustomerDashboardData = async (token) => {
//   const response = await axios.get(
//     `${config.baseApiUrl}/customer/dashboard/`,
//     {
//       headers: {
//         Authorization: token,
//       },
//       withCredentials: true,
//     }
//   );
//   return response;
// };

// /**
//  * Fetches all data required for the vendor dashboard.
//  * @param {string} token - The authorization token.
//  * @returns {Promise<object>} The axios response object containing vendor dashboard data.
//  */
// const getVendorDashboardData = async (token) => {
//   const response = await axios.get(
//     `${config.baseApiUrl}/vendor/dashboard`,
//     {
//       headers: {
//         Authorization: token,
//       },
//       withCredentials: true,
//     }
//   );
//   console.log("Response for Vendor Dashboard", response)
//   return response;
// };

// /**
//  * Fetches and aggregates all data for the admin dashboard from various endpoints.
//  * @param {string} token - The authorization token.
//  * @returns {Promise<object>} An object with a `data` property containing the aggregated admin dashboard data.
//  */
// const getAdminDashboardData = async (token) => {
//   const endpoints = {
//     lifetimeSales: "/admin-dashboard/lifetime-sales",
//     monthlySales: "/admin-dashboard/monthly-sales",
//     activeVendorCount: "/admin-dashboard/active-vendors",
//     topSellingCategories: "/admin-dashboard/top-categories",
//     lowStockProducts: "/admin-dashboard/low-stock",
//     orderVolumeGraph: "/admin-dashboard/order-graph",
//     platformEarnings: "/admin-dashboard/platform-earnings",
//     allUsers: "/users",
//     allVendors: "/vendors",
//     allProducts: "/products",
//     allCategories: "/products/getCategory",
//     flaggedReviews: "/admin/flagged",
//   };

//   const requests = Object.entries(endpoints).map(([key, url]) =>
//     axios
//       .get(`${config.baseApiUrl}${url}`, {
//         headers: { Authorization: token },
//         withCredentials: true,
//       })
//       .then((response) => ({ [key]: response.data }))
//       .catch((error) => {
//         console.error(`Error fetching admin data for ${key}:`, error.message);
//         return { [key]: null };
//       })
//   );

//   const results = await Promise.all(requests);
//   const combinedData = results.reduce(
//     (acc, current) => ({ ...acc, ...current }),
//     {}
//   );

//   const allUsers = combinedData.allUsers || [];
//   const allVendors = combinedData.allVendors || [];
//   const allProducts = combinedData.allProducts || {
//     products: [],
//     totalItems: 0,
//   };

//   const formattedData = {
//     stats: {
//       lifetimeSales: combinedData.lifetimeSales?.lifetimeSales || 0,
//       monthlySales: combinedData.monthlySales?.monthlySales || 0,
//       totalCustomers: allUsers.filter((u) => u.role === "customer").length,
//       totalVendors: allVendors.length,
//       activeVendors: combinedData.activeVendorCount?.activeVendorCount || 0,
//       pendingVendors: allVendors.filter((v) => v.status === "pending").length,
//       totalProducts: allProducts.totalItems,
//       totalOrders: 0,
//       platformEarnings: combinedData.platformEarnings?.platformEarnings || 0,
//     },
//     customers: allUsers.filter((u) => u.role === "customer"),
//     vendors: allVendors,
//     orders: [],
//     products: allProducts.products,
//     categories: combinedData.allCategories || [],
//     reviews: combinedData.flaggedReviews?.flaggedReviews || [],
//     analytics: {
//       orderVolume: combinedData.orderVolumeGraph || [],
//       topCategories: combinedData.topSellingCategories || [],
//       lowStock: combinedData.lowStockProducts || [],
//     },
//   };

//   return { data: formattedData };
// };

// export {
//   getAdminDashboardData,
//   getVendorDashboardData,
//   getCustomerDashboardData,
// };