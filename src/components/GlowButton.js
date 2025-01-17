import React, { useRef } from "react";
import "./GlowButton.css";

const AddTransactionButton = ({ text, onClick }) => {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left; // Позиция курсора относительно кнопки по X
    const y = e.clientY - rect.top; // Позиция курсора относительно кнопки по Y

    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  };

  return (
    <div className="button-container">
      <button
        ref={buttonRef}
        className="glow-button"
        onMouseMove={handleMouseMove}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default AddTransactionButton;
