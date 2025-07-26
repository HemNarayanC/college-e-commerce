import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import navMenu from "../../constants/navMenu";

const NavigationMenu = () => {
  const location = useLocation();
  const containerRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});
  const linkRefs = useRef([]);

  useEffect(() => {
    const index = navMenu.findIndex((menu) => menu.route === location.pathname);
    const link = linkRefs.current[index];

    if (link) {
      const { offsetLeft, offsetWidth } = link;
      const extraPadding = 20;
      setSliderStyle({
        left: `${offsetLeft - extraPadding / 3}px`,
        width: `${offsetWidth + extraPadding}px`,
      });
    }
  }, [location.pathname]);

  return (
    <div className="w-full flex justify-center h-12 items-center relative z-30">
      <header>
        <nav className="text-[#1e714f] relative">
          <div
            ref={containerRef}
            className="relative flex justify-around gap-8"
          >
            {/* Glassmorphism slider */}
            <div
              className="absolute top-0 bottom-0 rounded-md transition-all duration-300 backdrop-blur-sm bg-[#6D9886]/10 shadow-inner z-0"
              style={sliderStyle}
            />

            {/* Navigation Links */}
            {navMenu.map((menu, i) => (      
              <NavLink
                ref={(el) => (linkRefs.current[i] = el)}
                key={menu.route}
                to={menu.route}
                className="relative z-10 px-2 py-1 text-[16px]"
              >
                {menu.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavigationMenu;
