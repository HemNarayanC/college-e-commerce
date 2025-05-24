import React from "react";

const HeroSection = () => {
  return (
    <section className="relative h-[75vh] bg-gray-100 overflow-hidden right-1">
      {/* Clipped Shape */}
      <div
        className="absolute top-0 right-0 h-full w-[60%] bg-[#6D9886]"
        style={{
          clipPath:
            "polygon(61% 0%, 97.25% 0%, 100% 0%, 100% 100%, 10% 100%)",
        }}
      >
        <h1 className="text-center pt-20 text-xl font-bold text-white">
          Clipped Section
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
