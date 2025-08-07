import React from "react";

export default function Piece({ code, onDragStart }) {
  const isWhite = code.startsWith("w");

  const imageUrl = `/pieces/${code}.svg`; // Assuming images are in public/pieces folder

  return (
    <img
      src={imageUrl}
      alt={code}
      className={`w-[80%] h-[80%] object-contain select-none pointer-events-auto
        ${isWhite ? "invert brightness-[1.7]" : "brightness-[0.85]"}
        drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-in-out`}
      draggable
      onDragStart={onDragStart}
      // Optional: Fallback for image loading errors if the image path is incorrect
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/50x50/ff0000/ffffff?text=ERR`;
      }}
    />
  );
}
