import { Link } from "react-router-dom";
import { FaRegSadTear } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-300">
        <h1 className="text-red-600 text-7xl font-bold">404</h1>
        <FaRegSadTear className="text-6xl mt-3 text-yellow-500" />
        <h3 className="text-gray-600 mt-3 text-xl">Oops! Page Not Found.</h3>
        <p className="text-gray-600">The page you're looking for is not available</p>
        <Link to="/">
            <button className="bg-red-600 mt-3 py-3 px-8 text-white text-[16px] rounded-md cursor-pointer">Back To Home</button>
        </Link>
    </div>
  );
};

export default PageNotFound;
