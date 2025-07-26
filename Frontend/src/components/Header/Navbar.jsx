import { FaChevronDown, FaHeart, FaSearch, FaStore } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import TopHeader from "./TopHeader";
import { Link } from "react-router-dom";
import NavigationMenu from "./NavigationMenu";
import AuthMenu from "./AuthMenu";
import IconBadge from "../IconBadge";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/categoryApi";
import CartSidebar from "../cart/cartSidebar";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-[#FBF9F7] relative right-1 z-50">
      {/* <TopHeader /> */}

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-2xl font-bold text-[#6D9886]">
            <Link to="/" className="flex items-center space-x-2">
              <FaStore />
              <span>NivaSa</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-2/5 relative">
            <div className="flex">
              {/* Category Dropdown */}
              <div className="relative group w-1/3">
                <button className="flex items-center justify-between bg-[#F2E7D5] px-4 py-2 rounded-l-md w-full text-sm text-[#5A5A5A] border-r border-[#E1C699] cursor-pointer whitespace-nowrap">
                  <span className="truncate">Categories</span>
                  <FaChevronDown />
                </button>
                <div className="absolute left-0 mt-0 w-50 bg-white shadow-sm rounded-md hidden group-hover:block z-50">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat._id}`}
                        className="block px-4 py-2 text-sm text-[#2C2C2C] hover:bg-[#F2E7D5]"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative w-2/3">
                <input
                  type="text"
                  className="w-full pl-4 pr-10 py-2 text-sm outline-none bg-white border border-[#E1C699] text-[#2C2C2C]"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-0 top-0 h-full px-3 text-white bg-[#6D9886] rounded-r-md cursor-pointer">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {/* <IconBadge
              icon={<FaHeart />}
              label="Wishlist"
              count="0"
              badgePosition="-right-2"
            /> */}
            <IconBadge
              icon={<FaCartShopping />}
              label="Cart"
              badgePosition="-right-4"
              onClick={() => setIsCartOpen(true)}
            />

            <AuthMenu />
          </div>
        </div>
      </div>

      <NavigationMenu />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Navbar;
