import { useState, useEffect } from "react";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import BlurText from "./BlurText";
import { slides } from "../constants/slides.js";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-[80vh] bg-[#f8f5f2] overflow-hidden rounded-tr-2xl transition-colors duration-500 -top-15">
      {/* Left Content */}
      <div className="absolute top-12 left-0 w-[50%] h-full flex flex-col justify-center items-start px-12 space-y-8 transition-opacity duration-500 ease-in-out">
        {/* ... Left Content remains the same ... */}
        <div
          className={`space-y-4 transform transition-all duration-700 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <BlurText
            key={currentSlide}
            text={currentSlideData.title}
            delay={100}
            animateBy="words"
            direction="top"
            className="text-5xl font-playfair font-extrabold text-[#486e40] leading-tight"
          />
          <p className="text-2xl font-roboto text-[#8F9779] mt-6 max-w-lg">
            {currentSlideData.subtitle}
          </p>
        </div>
        <button className="flex items-center bg-[#64973f] hover:bg-[#688d4f] text-white font-bold px-8 py-4 text-lg rounded-lg group transition-all duration-300 transform hover:scale-105 mt-6 shadow-lg">
          <FiShoppingBag className="mr-2 h-5 w-5" />
          Shop Now
          <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Right Static Image */}
      <div
        className="absolute top-0 right-0 h-full w-[60%] bg-[#a3b18a] transition-colors duration-500"
        style={{
          clipPath: "polygon(61% 0%, 97.25% 0%, 100% 0%, 100% 100%, 10% 100%)",
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            // Use a fixed image here (replace with your static image path)
            src="/static-image.jpg"
            alt="Static Slide Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-8 right-8 z-30">
            <span className="text-3xl font-bold text-white">
              {String(currentSlide + 1).padStart(2, "0")}{" "}
              <span className="text-white/60">/ {currentSlideData.total}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
