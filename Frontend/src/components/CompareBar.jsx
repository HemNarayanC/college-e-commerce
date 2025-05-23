// ProductComparison.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const products = [
  {
    id: 1,
    name: "Chair 1",
    image:
      "https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 100,
    material: "Wood",
  },
  {
    id: 2,
    name: "Chair 2",
    image:
      "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 120,
    material: "Metal",
  },
  {
    id: 3,
    name: "Chair 3",
    image:
      "https://images.pexels.com/photos/31698135/pexels-photo-31698135/free-photo-of-elegant-aroma-diffuser-and-scented-sticks-setup.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 90,
    material: "Plastic",
  },
];

export default function ProductComparison() {
  const [compareList, setCompareList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const barRef = useRef(null);
  const hideTimeout = useRef(null);

  const addToCompare = (product) => {
    if (!compareList.find((p) => p.id === product.id)) {
      setCompareList([...compareList, product]);
      setShowBar(true);
      startHideTimer();
    }
  };

  const removeFromCompare = (id) => {
    const newList = compareList.filter((p) => p.id !== id);
    setCompareList(newList);
    if (newList.length === 0) {
      setShowBar(false);
      clearTimeout(hideTimeout.current);
    }
  };

  const startHideTimer = () => {
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowBar(false);
    }, 5000);
  };

  const handleBarInteraction = () => {
    if (showBar) {
      startHideTimer();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(hideTimeout.current);
    };
  }, []);

  const openCompareModal = () => {
    if (compareList.length > 1) setIsModalOpen(true);
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      {/* Product List */}
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow-sm bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto mb-2 h-64 w-full object-cover rounded"
              />
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <button
                className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                onClick={() => addToCompare(product)}
              >
                + Compare
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Bar */}
      {compareList.length > 0 && (
        <>
          <div
            ref={barRef}
            onMouseEnter={handleBarInteraction}
            onMouseMove={handleBarInteraction}
            className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg p-4 flex justify-center items-center space-x-6 z-50 transition-all duration-500 ${
              showBar ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
              onMouseEnter={handleBarInteraction}
            >
              <span className="text-lg">+</span>
              <span>Add Product</span>
            </button>

            {compareList.map((product) => (
              <div
                key={product.id}
                className="text-center relative group"
                onMouseEnter={handleBarInteraction}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-2 -right-2 text-xs bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-400"
                  >
                    <IoMdClose />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 truncate max-w-[100px]">
                  {product.name}
                </p>
              </div>
            ))}

            <button
              onClick={openCompareModal}
              className="px-6 py-2 bg-teal-800 text-white rounded-lg flex items-center gap-2 hover:bg-teal-600 transition-colors duration-200 shadow-md hover:shadow-lg"
              onMouseEnter={handleBarInteraction}
            >
              <FaEye className="text-lg" />
              <span>| Compare</span>
            </button>
          </div>

          {/* Floating Icon to Show Bar */}
          <div
            className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
              !showBar ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <button
              onClick={() => {
                setShowBar(true);
                startHideTimer();
              }}
              className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 group relative"
            >
              <FaEye className="text-xl" />
              <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Show Comparison
              </span>
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white max-w-4xl w-full p-8 rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-lg bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <IoMdClose />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Product Comparison
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {compareList.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 p-6 rounded-xl text-center bg-white hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 mx-auto mb-6 object-fit rounded-lg"
                  />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    Price: <strong className="text-blue-600">${product.price}</strong>
                  </p>
                  <p className="text-gray-600">
                    Material: <strong className="text-blue-600">{product.material}</strong>
                  </p>
                  <button
                    className="mt-4 text-red-500 hover:text-red-600 font-medium"
                    onClick={() => removeFromCompare(product.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
