import { createBrowserRouter } from "react-router-dom";
import {
  ABOUT_ROUTE,
  CONTACT_ROUTE,
  PROFILE_SETTINGS,
  SHOP_ROUTE,
  USER_PROFILE,
  VENDOR_FRONT_STORE_ROUTE,
  VENDOR_REGISTER_ROUTE,
} from "./constants/routes";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import About from "./pages/About";
import VendorRegistration from "./pages/vendor/VendorRegistration";
import AuthLayout from "./layouts/AuthLayout";
import ShopPage from "./pages/shop/ShopPage";
import VendorStoreFront from "./pages/vendor/VendorStoreFront";
import SingleProductPage from "./pages/SingleProductPage";
import DashboardPage from "./pages/Dashboard";
import SettingsPage from "../src/components/Dashboard/Settings";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./components/Dashboard/Profile";
import CheckoutPage from "./pages/CheckOut";
import PaymentSuccess from "./pages/PaymentSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        children: [
          { index: true, element: <Home /> },
          { path: ABOUT_ROUTE, element: <About /> },
          { path: CONTACT_ROUTE, element: <h1>Contact</h1> },
          {
            path: SHOP_ROUTE,
            children: [
              { index: true, element: <ShopPage /> },
              { path: "add", element: <h1>Add Product</h1> },
              { path: "products/:productId", element: <SingleProductPage /> },
            ],
          },
          {
            element: <AuthLayout />,
            children: [
              { path: VENDOR_REGISTER_ROUTE, element: <VendorRegistration /> },
              {
                path: `${VENDOR_FRONT_STORE_ROUTE}/:vendorId`,
                element: <VendorStoreFront />,
              },
              { path: PROFILE_SETTINGS, element: <SettingsPage /> },
              { path: USER_PROFILE, element: <ProfilePage /> },

            ],
          },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/payment/success", element: <PaymentSuccess /> },

        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {index: true, element: <DashboardPage />},
    ],
  },
  // {
  //   path: "/",
  //   element: <AuthLayout />,
  //   children: [
  //     { path: LOGIN_ROUTE, element: <Login /> },
  //     { path: REGISTER_ROUTE, element: <Register /> },
  //   ],
  // },
  { path: "*", element: <PageNotFound /> },
]);

export default router;
