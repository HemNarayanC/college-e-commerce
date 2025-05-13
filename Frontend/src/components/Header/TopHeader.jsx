import React from "react";
import { FaPhone } from "react-icons/fa";

const TopHeader = () => {
  return (
    <div className="container mx-auto px-4 py-2 flex justify-between items-center">
      <div className="flex -center space-x-2 text-xs text-gray-600">
        <span className="flex gap-0.5 items-center justify-center">
          <FaPhone />
          <p> +1 (800) 123-4567</p>
        </span>
      </div>
    </div>
  );
};

export default TopHeader;
