import { useState, useEffect } from "react";

const BlurText = ({
  text,
  delay = 150,
  animateBy = "words",
  direction = "top",
  className = "",
}) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const items = animateBy === "words" ? text.split(" ") : text.split("");

    const timers = items.map((_, index) =>
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [text, delay, animateBy]);

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  const getTranslateClass = () => {
    switch (direction) {
      case "top":
        return "translate-y-4";
      case "bottom":
        return "-translate-y-4";
      case "left":
        return "translate-x-4";
      case "right":
        return "-translate-x-4";
      default:
        return "translate-y-4";
    }
  };

  return (
    <div className={className}>
      {items.map((item, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-700 ease-out will-change-transform ${
            visibleItems.includes(index)
              ? "opacity-100 blur-0 transform translate-y-0"
              : `opacity-0 blur-sm transform ${getTranslateClass()}`
          }`}
        >
          {item}
          {animateBy === "words" && index < items.length - 1 && " "}
        </span>
      ))}
    </div>
  );
};

export default BlurText;
