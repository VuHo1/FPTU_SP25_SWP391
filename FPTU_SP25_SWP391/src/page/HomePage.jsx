import React from "react";

const HomePage = () => {
  return (
    <div>
      <h1>
        {Array.from("Beautishop").map((letter, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              fontSize: 200,
              opacity: 0,
              transform: "translateY(10px)",
              animation: `fadeUp 0.8s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </h1>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
