import React from "react";

function Tile({
  coord,
  isMissing,
  children,
  onClick,
  onDrop,
  onDragOver,
  onDragEnter,
  isHighlighted,
  isThreat,
}) {
  if (isMissing) return <div className="w-full aspect-square opacity-0" />;
  // if (isMissing) {
  //   return (
  //     <div className="w-full aspect-square flex items-center justify-center bg-[#333] text-white text-sm font-semibold select-none">
  //       ✖
  //     </div>
  //   );
  // }
  // Determine default wood color
  const isDark = (coord.charCodeAt(0) + parseInt(coord[1], 10)) % 2 === 1;
  const woodColor = isDark ? "#6b4226" : "#d8b083";

  // Decide overlay color
  const overlayColor = isThreat
    ? "rgba(248,113,113,0.8)" // red
    : isHighlighted
    ? "rgba(164,230,53,0.6)" // green
    : null;

  // Build inline style for background
  const style = {
    backgroundColor: overlayColor || woodColor,
  };

  return (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      style={style}
      className={`
        relative w-full aspect-square flex items-center justify-center
        border border-black rounded-[4px] cursor-pointer overflow-hidden
        transition-all
      `}
    >
      {/* subtle sheen on top */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none rounded-[4px]" />

      {/* piece/content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default Tile;
