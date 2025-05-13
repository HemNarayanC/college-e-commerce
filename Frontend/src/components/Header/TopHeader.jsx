import React, { useState } from "react";
import { FaPhone } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const TopHeader = () => {
  const currencies = ["USD", "EUR", "GBP"];
  const languages = ["English", "Español", "Français"];
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);


  const handleCurrencyClick = (currency) => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);
  };

    const handleLanguageClick = (lang) => {
    setSelectedLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-2 text-xs text-gray-600">
        <span className="flex gap-0.5 items-center">
          <FaPhone />
          <p> +1 (800) 123-4567</p>
        </span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">
          <i className="fas fa-envelope"></i> support@multivendor.com
        </span>
      </div>

      <div className="flex items-center space-x-4 text-xs">
        {/* Currency dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <span>{selectedCurrency}</span>
            <IoMdArrowDropdown className="text-xl" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-md z-10">
              <div className="py-1 flex flex-col">
                {currencies.map((currency) => (
                  <button
                    key={currency}
                    onClick={() => handleCurrencyClick(currency)}
                    className="text-left block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <span>{selectedLanguage}</span>
            <IoMdArrowDropdown className="text-xl" />
          </button>

          {isLangDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-md z-10">
              <div className="py-1 flex flex-col">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageClick(lang)}
                    className="text-left block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
