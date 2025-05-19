
const IconBadge = ({ icon, label, count, badgePosition = "right-2" }) => {
  return (
    <div className="relative group">
      <button className="flex flex-col items-center cursor-pointer">
        <span>{icon}</span>
        <span
          className={`absolute -top-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${badgePosition}`}
        >
          {count}
        </span>
        <span className="text-xs mt-1">{label}</span>
      </button>
    </div>
  );
};

export default IconBadge;
