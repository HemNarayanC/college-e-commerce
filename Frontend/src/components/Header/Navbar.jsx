import { FaChevronDown, FaSearch, FaStore } from "react-icons/fa";
import TopHeader from "./TopHeader";
import { Link } from "react-router-dom";
import NavigationMenu from "./NavigationMenu";
import AuthMenu from "./AuthMenu";

const Navbar = () => {
  return (
    <div>
      <TopHeader />
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-2xl font-bold text-[#FF0000]">
            <Link to="#" className="flex items-center">
              <FaStore />
              <span>NepalMart</span>
            </Link>
          </div>

          <div className="w-full md:w-2/5 relative">
            <div className="flex">
              <div className="relative group w-1/3">
                <button className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-l-md w-full text-sm text-gray-700 border-r border-gray-300 cursor-pointer whitespace-nowrap">
                  <span className="truncate"></span>
                  <FaChevronDown />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    <Link
                      key=""
                      to="#"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick=""
                    >
                      <p>Categories</p>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative w-2/3">
                <input
                  type="text"
                  className="w-full pl-4 pr-10 py-2 text-sm outline-none"
                  placeholder="Search products..."
                  value=""
                  onChange=""
                />
                <button
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 bg-[#FF0000] rounded-r-md cursor-pointer whitespace-nowrap"
                  onClick=""
                >
                  <FaSearch className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            
            <AuthMenu />
          </div>
        </div>
      </div>
      <NavigationMenu />
    </div>
  );
};

export default Navbar;
