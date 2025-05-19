import React from "react";
import navMenu from "../../constants/navMenu";
import { NavLink } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <div className="w-full flex justify-center h-12 items-center bg-[#ff0000]">
      <header>
        {/* Navigation */}
        <nav className="text-white">
              <div className="flex justify-around gap-8">
                {navMenu.map((menu) => {
                  return (
                    <NavLink
                      className={({ isActive }) =>
                        `flex text-[15px] text-white ${
                          isActive
                            ? "text-red-500"
                            : "hover:text-gray-100"
                        }`
                      }
                      key={menu.route}
                      to={menu.route}
                    >
                      {menu.label}
                    </NavLink>
                  );
                })}
              </div>
        </nav>
      </header>
    </div>
  );
};

export default NavigationMenu;
