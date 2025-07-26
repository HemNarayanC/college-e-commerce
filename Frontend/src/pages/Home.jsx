import React from "react";
import HeroSection from "../components/HeroSection";
import ProductComparison from "../components/CompareBar";
import FeaturedVendor from "../components/FeaturedVendor";
import FilterSidebar from "../components/shop/FilterSidebar";
import ProductList from "../components/products/ProductList";
import ReviewsTab from "../components/ReviewTabs";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedVendor />
      <ProductList />
      <ProductComparison />
      {/* <FilterSidebar />
      <ReviewsTab /> */}
    </>
  );
};

export default Home;
