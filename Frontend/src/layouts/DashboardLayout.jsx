import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HOME_ROUTE } from "../constants/routes";
import TopHeader from "../components/Header/TopHeader";
import AuthMenu from "../components/Header/AuthMenu";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

const DashboardLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.auth_token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(HOME_ROUTE);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return <><DashboardHeader />
  <Outlet />
  </>;
  
};

export default DashboardLayout;
