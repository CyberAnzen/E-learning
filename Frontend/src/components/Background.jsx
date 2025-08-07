import React, { useEffect, useState } from "react";

const Background = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Simulate the 'noisy' effect by applying a noise-like background
    const dot = document.getElementById("dot");
    if (dot && !isActive) {
      dot.style.backgroundColor = "#fff";
      dot.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Crect width='4' height='4' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`;
    }
  }, [isActive]);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-gray-800 cursor-pointer"
      onClick={handleClick}
    >
      <div
        id="dot"
        className={`transition-all duration-500 ease-in-out border ${
          isActive
            ? "border-white/80 border-[1000px] animate-background"
            : "border-transparent"
        }`}
        style={{
          backgroundColor: isActive ? "transparent" : "#fff",
          backgroundImage: isActive
            ? "none"
            : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Crect width='4' height='4' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export default Background;
