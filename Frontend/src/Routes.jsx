import { createBrowserRouter } from "react-router-dom";
import { ABOUT_ROUTE, CONTACT_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, SHOP_ROUTE } from "./constants/routes";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import AuthLayout from "./layouts/AuthLayout";
import UnAuthLayout from "./layouts/UnAuthLayout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        children: [
          { index: true, element: <Home /> },
          { path: ABOUT_ROUTE, element: (<h1>About</h1>) },
          { path: CONTACT_ROUTE, element: (<h1>Contact</h1>) },
          {
            path: SHOP_ROUTE,
            children: [
              { index: true, element: (<h1>Shop</h1>) },
              { path: 'add', element: (<h1>Add Product</h1>) },
              { path: ':product_id', element: (<h1>Product Details</h1>) },
            ],
          },
        ],
      },
    ],
  },
  {
    children: [
      { path: LOGIN_ROUTE, element: <h1>Login</h1> },
      { path: REGISTER_ROUTE , element: <h1>Register</h1> },
    ],
  },
  { path: '*', element: <PageNotFound /> },
]);

export default router;