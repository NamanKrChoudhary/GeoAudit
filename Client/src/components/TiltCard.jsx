import React, { useRef, useState } from "react";
import "./TiltCard.css";

const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate percentages (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    // Calculate rotation (Limit to 15 degrees for elegance)
    const x = yPct * -15; // Reverse sign for natural tilt (up/down)
    const y = xPct * 15; // Left/right tilt

    setRotation({ x, y });
    setOpacity(1); // Show the glossy reflection
  };

  const handleMouseLeave = () => {
    // Reset to flat when mouse leaves
    setRotation({ x: 0, y: 0 });
    setOpacity(0);
  };

  return (
    <div
      className={`tilt-wrapper ${className}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      <div className="tilt-content">{children}</div>

      {/* Glossy Reflection Gradient (Moves opposite to tilt) */}
      <div
        className="tilt-glare"
        style={{
          opacity: opacity,
          background: `radial-gradient(circle at ${50 - rotation.y * 3}% ${50 - rotation.x * 3}%, rgba(255,255,255,0.3), transparent 60%)`,
        }}
      />
    </div>
  );
};

export default TiltCard;
