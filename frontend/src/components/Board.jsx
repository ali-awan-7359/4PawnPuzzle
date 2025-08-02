import { useState } from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import { getLegalMoves } from "./PieceUtils";

const initialLayout = [
  ["bp", "bp", "bp", "bp"],
  [null, null, null, null],
  ["wb", "wb", "wb", "wb"],
  ["wr", "wr", "wr", "wr"],
  ["wp", "wp", "wp", null],
  [null, null, null, "wn"],
];

function Board() {
  const [layout, setLayout] = useState(initialLayout);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [draggedFrom, setDraggedFrom] = useState(null);

  const handleDragStart = (row, col) => {
    const piece = layout[row][col];
    if (!piece) return;

    setDraggedFrom({ row, col });
    const moves = getLegalMoves(piece, { row, col }, layout);
    setSelected({ row, col });
    setLegalMoves(moves);
  };

  const handleDrop = (row, col) => {
    if (!draggedFrom) return;
    const legal = getLegalMoves(
      layout[draggedFrom.row][draggedFrom.col],
      draggedFrom,
      layout
    );
    const isLegal = legal.some((m) => m.row === row && m.col === col);
    if (isLegal) {
      const newLayout = layout.map((r) => [...r]);
      newLayout[row][col] = layout[draggedFrom.row][draggedFrom.col];
      newLayout[draggedFrom.row][draggedFrom.col] = null;
      setLayout(newLayout);
    }
    setDraggedFrom(null);
    setSelected(null);
    setLegalMoves([]);
  };

  const handleClick = (row, col) => {
    const clickedPiece = layout[row][col];

    if (selected) {
      const isLegal = legalMoves.some((m) => m.row === row && m.col === col);
      if (isLegal) {
        const newLayout = layout.map((r) => [...r]);
        newLayout[row][col] = layout[selected.row][selected.col];
        newLayout[selected.row][selected.col] = null;
        setLayout(newLayout);
      }
      setSelected(null);
      setLegalMoves([]);
    } else if (clickedPiece) {
      const moves = getLegalMoves(clickedPiece, { row, col }, layout);
      setSelected({ row, col });
      setLegalMoves(moves);
    }
  };

  return (
    <div className="w-full max-w-[380px] sm:max-w-[420px] md:max-w-[500px] mx-auto">
      <div className="grid grid-cols-4 grid-rows-6 gap-[2px] bg-[#7e5d48] p-[4px] rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),_0_4px_16px_rgba(0,0,0,0.5)]">
        {layout.flatMap((rowArr, rowIndex) =>
          rowArr.map((pieceCode, colIndex) => {
            const rank = 6 - rowIndex;
            const file = String.fromCharCode(97 + colIndex);
            const coord = `${file}${rank}`;
            const isMissing = rank === 5 || (rank === 1 && colIndex < 3);
            const isHighlighted = legalMoves.some(
              (m) => m.row === rowIndex && m.col === colIndex
            );

            return (
              <Tile
                key={coord}
                coord={coord}
                isMissing={isMissing}
                isHighlighted={isHighlighted}
                onClick={() => handleClick(rowIndex, colIndex)}
                onDrop={() => handleDrop(rowIndex, colIndex)}
                onDragOver={(e) => e.preventDefault()}
              >
                {!isMissing && pieceCode && (
                  <Piece
                    code={pieceCode}
                    onDragStart={() => handleDragStart(rowIndex, colIndex)}
                  />
                )}
              </Tile>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Board;
