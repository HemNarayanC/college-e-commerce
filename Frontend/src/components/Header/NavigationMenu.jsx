import navMenu from "../../constants/navMenu";
import { NavLink } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <div className="w-full flex justify-center h-12 items-center bg-[#6D9886]">
      <header>
        {/* Navigation */}
        <nav className="text-[#FBF9F7]">
          <div className="flex justify-around gap-8">
            {navMenu.map((menu) => {
              return (
                <NavLink
                  className={({ isActive }) =>
                    `flex text-[15px] ${
                      isActive
                        ? "text-[#E1C699]" // Soft gold for active
                        : "hover:text-[#FBF9F7]" // Creamy white on hover
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
