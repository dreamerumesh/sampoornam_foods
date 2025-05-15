import React, { use, useEffect, useState } from "react";
import { useProduct } from "../contexts/ProductContext";

const IntroAnimation = ({ onAnimationComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const {fetchProducts} = useProduct();
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchProducts({ page, limit: 12 });
  }, [page]);
  
  // Run the entire animation sequence in one controlled useEffect
  useEffect(() => {
    
    const timeouts = [];

    // Stage 0: Initial delay
    timeouts.push(
      setTimeout(() => {
        setOpacity(0);
        setAnimationStage(1);

        // Stage 1: Fade in
        timeouts.push(
          setTimeout(() => {
            setOpacity(1);
            setAnimationStage(2);

            // Stage 2: Hold
            timeouts.push(
              setTimeout(() => {
                setAnimationStage(3);

                // Stage 3: Fade out
                timeouts.push(
                  setTimeout(() => {
                    setOpacity(0);
                    setAnimationStage(4);

                    // Stage 4: Complete
                    timeouts.push(
                      setTimeout(() => {
                        onAnimationComplete?.();
                      }, 1000)
                    ); // After fade out
                  }, 1000)
                ); // Fade out duration
              }, 2000)
            ); // Hold duration
          }, 1000)
        ); // Fade in duration
      }, 10)
    ); // Initial delay

    // Cleanup all timeouts
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onAnimationComplete]);

  const transitionStyle = {
    transition: "opacity 0.9s ease-in-out, transform 0.9s ease-in-out",
    opacity: opacity,
    transform: animationStage === 1 ? "scale(1)" : "scale(0.95)",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50 z-50">
      <div
        className="flex flex-col items-center justify-center px-6 w-4/5 sm:w-4/5 md:w-3/5 lg:w-2/5 absolute top-1/4  -translate-y-1/4"
        style={transitionStyle}
      >
        {/* Logo SVG - responsive sizing with percentage-based width on mobile/tablet */}
        <div className="w-4/5 aspect-square sm:w-4/5 md:w-40 lg:w-48 mb-4 md:mb-6">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="95" fill="#E8F5E9" />
            <circle cx="100" cy="100" r="85" stroke="#2E7D32" strokeWidth="4" />

            {/* Abstract leaf shape */}
            <path
              d="M120 60C150 80 130 130 90 120C50 110 60 60 90 70C120 80 100 100 90 90"
              stroke="#388E3C"
              strokeWidth="5"
              fill="#C8E6C9"
              strokeLinecap="round"
            />

            {/* Second leaf shape */}
            <path
              d="M70 60C40 80 60 130 100 120C140 110 130 60 100 70C70 80 90 100 100 90"
              stroke="#1B5E20"
              strokeWidth="5"
              fill="#A5D6A7"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Brand Name - responsive text sizes */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 tracking-wider mb-1 md:mb-2 text-center">
          SAMPOORNAM
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium text-green-600 text-center">
          FOODS
        </h2>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-green-700 mt-2 italic text-center">
          Pure.. Natural..
        </p>
      </div>
    </div>
  );
};

export default IntroAnimation;
