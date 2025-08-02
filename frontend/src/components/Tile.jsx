function Tile({
  coord,
  isMissing,
  children,
  onClick,
  isHighlighted,
  onDrop,
  onDragOver,
}) {
  if (isMissing) return <div className="w-full aspect-square opacity-0" />;

  const isDark = (coord.charCodeAt(0) + parseInt(coord[1])) % 2 === 1;
  const baseColor = isDark ? "bg-[#6b4226]" : "bg-[#d8b083]";

  return (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={`w-full aspect-square relative overflow-hidden
        flex items-center justify-center border border-black rounded-[4px] cursor-pointer transition-all
        ${baseColor} ${isHighlighted ? "bg-[#a3e635]/60" : ""}`}
    >
      {/* background sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none z-0 rounded-[4px]" />

      {/* circle in center */}
      {isHighlighted && (
        <div className="absolute w-5 h-5 rounded-full bg-gray-700/70 z-10" />
      )}

      {/* piece or content */}
      <div className="z-20 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default Tile;
