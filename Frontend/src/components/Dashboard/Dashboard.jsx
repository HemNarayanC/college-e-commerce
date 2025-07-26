import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";
import CustomerDashboard from "./CustomerDashboard";
import LoadingSpinner from "../shop/LoaderSpinner";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.auth_token);
  const user = useSelector((state) => state.auth.user);
  console.log("Dashboard rendered, token:", token, "user:", user);

  if (!token || !user) {
    return (
      <div className="text-red-500 text-center p-4">
        Authentication required to access dashboard.
      </div>
    );
  }

  if (user.role.includes("admin")) {
    return <AdminDashboard />;
  }

  if (user.role.includes("vendor")) {
    return <VendorDashboard />;
  }

  return <CustomerDashboard />;
};

export default Dashboard;
