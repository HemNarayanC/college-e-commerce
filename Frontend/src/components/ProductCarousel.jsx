import { useState, useRef, useEffect } from "react"
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"
import { FaEye, FaHeart } from "react-icons/fa"
import { CgArrowsExchangeAlt } from "react-icons/cg"

const ProductCarousel = () => {
  const [showControls, setShowControls] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const carouselRef = useRef(null)

  const products = [
    {
      id: 1,
      name: "Mauris elit magna, aliquet",
      category: "Interior",
      price: 50.0,
      image: "https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      name: "Suspendisse vehicula at dui",
      category: "Interior",
      price: 56.0,
      image: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 3,
      name: "Elegant wooden chair",
      category: "Interior",
      price: 45.0,
      image: "https://images.pexels.com/photos/31698135/pexels-photo-31698135/free-photo-of-elegant-aroma-diffuser-and-scented-sticks-setup.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 4,
      name: "Modern coffee table",
      category: "Interior",
      price: 75.0,
      image: "https://images.pexels.com/photos/10566513/pexels-photo-10566513.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ]

  const maxIndex = products.length - 2

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  const handleNext = () => {
    if (activeIndex < maxIndex) {
      setActiveIndex(activeIndex + 1)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.querySelector(".carousel-item").offsetWidth
      carouselRef.current.style.transform = `translateX(-${activeIndex * itemWidth}px)`
    }
  }, [activeIndex])

  return (
    <div
      className="relative bg-white p-8 rounded-lg shadow-sm overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="overflow-hidden">
        <div ref={carouselRef} className="flex transition-transform duration-500 ease-in-out">
          {products.map((product) => (
            <div
              key={product.id}
              className="carousel-item w-1/2 flex-shrink-0 px-4"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="flex flex-col items-center relative bg-white p-4 rounded-lg shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <span className="text-gray-500 text-sm mb-2">{product.category}</span>
                <h3 className="font-medium text-center mb-2">{product.name}</h3>
                <span className="text-orange-500 font-medium mb-4">${product.price.toFixed(2)}</span>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-full transition-colors">
                  Add to cart
                </button>

                {hoveredProduct === product.id && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm">
                      <FaEye />
                    </button>
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm">
                      <FaHeart />
                    </button>
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm">
                      <CgArrowsExchangeAlt />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md transition-opacity ${
          showControls && activeIndex > 0 ? "opacity-100" : "opacity-0"
        } ${activeIndex === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
        disabled={activeIndex === 0}
      >
        <BiChevronLeft />
      </button>

      <button
        onClick={handleNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md transition-opacity ${
          showControls && activeIndex < maxIndex ? "opacity-100" : "opacity-0"
        } ${activeIndex >= maxIndex ? "cursor-not-allowed" : "cursor-pointer"}`}
        disabled={activeIndex >= maxIndex}
      >
        <BiChevronRight />
      </button>
    </div>
  )
}

export default ProductCarousel