function Piece({ code, onDragStart }) {
  const isWhite = code.startsWith("w");

  return (
    <img
      src={`/pieces/${code}.svg`}
      alt={code}
      className={`w-[80%] h-[80%] object-contain select-none pointer-events-auto
        ${isWhite ? "invert brightness-[1.7]" : "brightness-[0.85]"}
        drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] transition-transform duration-3000 ease-in-out`}
      draggable
      onDragStart={onDragStart}
    />
  );
}

export default Piece;
