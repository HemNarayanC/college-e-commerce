

const HeroSection = () => {
  return (
    <div>
      {" "}
      <section className="relative overflow-hidden flex flex-row-reverse w-full">
        <div className="w-[50%]">
          {/* <img
            src="https://img.freepik.com/free-photo/laptop-shopping-bags-online-shopping-concept_1423-189.jpg?ga=GA1.1.338286829.1745501069&semt=ais_hybrid&w=740"
            alt="Hero Banner"
            className="w-full h-full object-cover object-top"
          /> */}
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 bg-[url('https://img.freepik.com/free-photo/3d-illustration-smartphone-with-products-coming-out-screen-online-shopping-e-commerce-concept_58466-14529.jpg?ga=GA1.1.338286829.1745501069&semt=ais_hybrid&w=740')]">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Shop With Confidence
            </h1>
            <p className="text-lg text-gray-900 mb-8">
              Discover thousands of products from hundreds of trusted vendors,
              all in one place.
            </p>
            <div className="flex space-x-4">
              <button className="bg-[#ff0000] hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors !rounded-button cursor-pointer whitespace-nowrap">
                Shop Now
              </button>
              <button className="bg-white hover:bg-gray-100 text-red-600 px-6 py-3 rounded-md font-medium transition-colors border border-red-600 !rounded-button cursor-pointer whitespace-nowrap">
                Become a Vendor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
