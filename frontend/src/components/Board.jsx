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
  const [lastMove, setLastMove] = useState(null);

  // ... (all the functions like handleDragStart, handleClick, etc. are unchanged)
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
    const moves = getLegalMoves(
      piece,
      { row: fr, col: fc },
      layout,
      missingMap
    );
    setLegalMoves(moves);
  };

  const handleDrop = (r, c) => {
    if (!draggedFrom) return;
    const { r: fr, c: fc } = draggedFrom;
    const moves = getLegalMoves(
      layout[fr][fc],
      { row: fr, col: fc },
      layout,
      missingMap
    );
    const valid = moves.some((m) => m.row === r && m.col === c);
    if (valid) {
      const next = layout.map((row) => [...row]);
      next[r][c] = layout[fr][fc];
      next[fr][fc] = null;
      setLayout(next);
      setLastMove({ from: { row: fr, col: fc }, to: { row: r, col: c } });
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
        setLastMove({ from: selected, to: { row: r, col: c } });
      }
      setSelected(null);
      setLegalMoves([]);
    } else if (piece) {
      const moves = getLegalMoves(
        piece,
        { row: r, col: c },
        layout,
        missingMap
      );
      setSelected({ row: r, col: c });
      setLegalMoves(moves);
    }
  };

  return (
    // FINAL FIX: This robustly handles both mobile (portrait) and desktop (landscape).
    // - `aspect-[4/6]`: Keeps the board shape correct.
    // - `portrait:w-[90vw]`: In portrait mode (phones), bases size on screen WIDTH.
    // - `landscape:h-[80vh]`: In landscape mode (laptops), bases size on screen HEIGHT.
    // - `max-w-md landscape:max-h-[650px]`: Sets sensible maximums for each orientation.
    <div className="aspect-[4/6] portrait:w-[90vw] landscape:h-[80vh] max-w-md landscape:max-h-[650px]">
      <div className="w-full h-full grid grid-cols-4 grid-rows-6 gap-[2px] bg-[#7e5d48] p-1 rounded-xl shadow-inner">
        {layout.map((rowArr, r) =>
          rowArr.map((pieceCode, c) => {
            const rank = 6 - r;
            const coord = `${String.fromCharCode(97 + c)}${rank}`;
            const isMissing = missingMap.has(`${r},${c}`);

            const isHighlighted = legalMoves.some(
              (m) => m.row === r && m.col === c
            );
            const isLastMoveFrom =
              lastMove?.from?.row === r && lastMove?.from?.col === c;
            const isLastMoveTo =
              lastMove?.to?.row === r && lastMove?.to?.col === c;

            const isKnight =
              selected && layout[selected.row][selected.col]?.[1] === "n";
            const isEnemy =
              pieceCode &&
              selected &&
              pieceCode[0] !== layout[selected.row][selected.col][0];
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
                isLastMoveFrom={isLastMoveFrom}
                isLastMoveTo={isLastMoveTo}
                onDragEnter={() => handleDragEnter(r, c)}
              >
                {!isMissing && pieceCode && (
                  <Piece
                    key={pieceCode + "-" + r + "-" + c}
                    code={pieceCode}
                    onDragStart={() => handleDragStart(r, c)}
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
