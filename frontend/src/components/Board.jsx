import React, { useState } from "react";
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

  // Precompute missing squares for this layout
  const missingMap = new Set();
  layout.forEach((row, r) =>
    row.forEach((_, c) => {
      const rank = 6 - r;
      if (rank === 5 || (rank === 1 && c < 3)) {
        missingMap.add(`${r},${c}`);
      }
    })
  );

  const handleDragStart = (r, c) => {
    const piece = layout[r][c];
    if (!piece) return;
    setDraggedFrom({ r, c });
    const moves = getLegalMoves(piece, { row: r, col: c }, layout, missingMap);
    setSelected({ row: r, col: c });
    setLegalMoves(moves);
  };

  const handleDragEnter = (r, c) => {
    if (!draggedFrom) return;
    const { r: fr, c: fc } = draggedFrom;
    const piece = layout[fr][fc];
    const moves = getLegalMoves(piece, { row: fr, col: fc }, layout, missingMap);
    setLegalMoves(moves);
  };

  const handleDrop = (r, c) => {
    if (!draggedFrom) return;
    const { r: fr, c: fc } = draggedFrom;
    const moves = getLegalMoves(layout[fr][fc], { row: fr, col: fc }, layout, missingMap);
    const valid = moves.some((m) => m.row === r && m.col === c);
    if (valid) {
      const next = layout.map((row) => [...row]);
      next[r][c] = layout[fr][fc];
      next[fr][fc] = null;
      setLayout(next);
    }
    setDraggedFrom(null);
    setSelected(null);
    setLegalMoves([]);
  };

  const handleClick = (r, c) => {
    const piece = layout[r][c];
    if (selected) {
      const valid = legalMoves.some((m) => m.row === r && m.col === c);
      if (valid) {
        const next = layout.map((row) => [...row]);
        next[r][c] = layout[selected.row][selected.col];
        next[selected.row][selected.col] = null;
        setLayout(next);
      }
      setSelected(null);
      setLegalMoves([]);
    } else if (piece) {
      const moves = getLegalMoves(piece, { row: r, col: c }, layout, missingMap);
      setSelected({ row: r, col: c });
      setLegalMoves(moves);
    }
  };

  return (
    <div className="w-full max-w-[380px] sm:max-w-[420px] md:max-w-[500px] mx-auto">
      <div className="grid grid-cols-4 grid-rows-6 gap-[2px] bg-[#7e5d48] p-1 rounded-xl shadow-inner">
        {layout.map((rowArr, r) =>
          rowArr.map((pieceCode, c) => {
            const rank = 6 - r;
            const coord = `${String.fromCharCode(97 + c)}${rank}`;
            const isMissing = missingMap.has(`${r},${c}`);

            // is this square a legal move?
            const isHighlighted = legalMoves.some((m) => m.row === r && m.col === c);

            // is this a knight threat? (only if selected piece is a knight and target is enemy)
            const isKnight =
              selected && layout[selected.row][selected.col]?.[1] === "n";
            const isEnemy =
              pieceCode && selected && pieceCode[0] !== layout[selected.row][selected.col][0];
            const isThreat = isHighlighted && isKnight && isEnemy;

            return (
              <Tile
                key={coord}
                coord={coord}
                isMissing={isMissing}
                isHighlighted={isHighlighted}
                isThreat={isThreat}
                onClick={() => handleClick(r, c)}
                onDrop={() => handleDrop(r, c)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => handleDragEnter(r, c)}
              >
                {!isMissing && pieceCode && (
                  <Piece code={pieceCode} onDragStart={() => handleDragStart(r, c)} />
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
