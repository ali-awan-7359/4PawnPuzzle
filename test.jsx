import React, { useState, useEffect } from "react";

// Inline SVG icons for the buttons
const UndoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const ResetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M3 2v6h6" />
    <path d="M3 13a9 9 0 1 0 9 9c1.652-.086 3.2-.843 4.41-2.05" />
    <path d="M12 12v6h6" />
  </svg>
);

const ConfettiPiece = () => {
  const [style, setStyle] = useState({});

  // Generate random styles for each confetti piece
  useEffect(() => {
    const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const randomSize = `${Math.random() * 10 + 5}px`;
    const randomLeft = `${Math.random() * 100}vw`;
    const randomDuration = `${Math.random() * 2 + 1}s`;
    const randomDelay = `${Math.random() * 1}s`;
    setStyle({
      backgroundColor: randomColor,
      width: randomSize,
      height: randomSize,
      left: randomLeft,
      animationDuration: randomDuration,
      animationDelay: randomDelay,
    });
  }, []);

  return (
    <div className="absolute top-0 opacity-0 animate-confetti" style={style} />
  );
};

const Confetti = () => {
  const pieces = Array.from({ length: 50 });
  return (
    <>
      <style>
        {`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti;
          animation-fill-mode: forwards;
        }
        `}
      </style>
      {pieces.map((_, i) => (
        <ConfettiPiece key={i} />
      ))}
    </>
  );
};

// PieceUtils: Utility functions for legal moves
const getLegalMoves = (pieceCode, from, layout, missingMap) => {
  if (!pieceCode) return [];
  const moves = [];
  const color = pieceCode[0];
  const type = pieceCode[1];

  const getTargetPiece = (r, c) => {
    if (r < 0 || r >= layout.length || c < 0 || c >= layout[0].length) {
      return null;
    }
    return layout[r][c];
  };

  const isWithinBoard = (r, c) =>
    r >= 0 &&
    r < layout.length &&
    c >= 0 &&
    c < layout[0].length &&
    !missingMap.has(`${r},${c}`);

  const isTargetValid = (r, c) => {
    const targetPiece = getTargetPiece(r, c);
    return isWithinBoard(r, c) && (!targetPiece || targetPiece[0] !== color);
  };

  if (type === "p") {
    const direction = color === "w" ? -1 : 1;
    const initialRank = color === "w" ? 4 : 1;

    // Normal move
    const newR = from.row + direction;
    if (isWithinBoard(newR, from.col) && !layout[newR][from.col]) {
      moves.push({ row: newR, col: from.col });
    }

    // Capture moves
    if (
      isTargetValid(from.row + direction, from.col - 1) &&
      getTargetPiece(from.row + direction, from.col - 1)
    ) {
      moves.push({ row: from.row + direction, col: from.col - 1 });
    }
    if (
      isTargetValid(from.row + direction, from.col + 1) &&
      getTargetPiece(from.row + direction, from.col + 1)
    ) {
      moves.push({ row: from.row + direction, col: from.col + 1 });
    }
  }

  if (type === "r") {
    // Up, Down, Left, Right
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of directions) {
      for (let i = 1; i < layout.length; i++) {
        const newR = from.row + dr * i;
        const newC = from.col + dc * i;
        if (!isWithinBoard(newR, newC)) break;
        if (layout[newR][newC]) {
          if (layout[newR][newC][0] !== color) {
            moves.push({ row: newR, col: newC });
          }
          break;
        }
        moves.push({ row: newR, col: newC });
      }
    }
  }

  if (type === "b") {
    // Diagonal moves
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    for (const [dr, dc] of directions) {
      for (let i = 1; i < layout.length; i++) {
        const newR = from.row + dr * i;
        const newC = from.col + dc * i;
        if (!isWithinBoard(newR, newC)) break;
        if (layout[newR][newC]) {
          if (layout[newR][newC][0] !== color) {
            moves.push({ row: newR, col: newC });
          }
          break;
        }
        moves.push({ row: newR, col: newC });
      }
    }
  }

  if (type === "n") {
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of knightMoves) {
      const newR = from.row + dr;
      const newC = from.col + dc;
      if (isTargetValid(newR, newC)) {
        moves.push({ row: newR, col: newC });
      }
    }
  }

  return moves;
};

// Initial layout of the chess board
const initialLayout = [
  ["bp", "bp", "bp", "bp"],
  [null, null, null, null],
  ["wb", "wb", "wb", "wb"],
  ["wr", "wr", "wr", "wr"],
  ["wp", "wp", "wp", null],
  [null, null, null, "wn"],
];

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
  isLastMoveFrom,
  isLastMoveTo,
}) {
  if (isMissing) {
    return <div className="w-full aspect-square opacity-0" />;
  }
  const isDark = (coord.charCodeAt(0) + parseInt(coord[1], 10)) % 2 === 1;
  const woodColor = isDark ? "#6b4226" : "#d8b083";

  let highlightColor = null;
  if (isThreat) {
    highlightColor = "rgba(248,113,113,0.8)"; // red for threats
  } else if (isHighlighted) {
    highlightColor = "rgba(164,230,53,0.6)"; // green for legal moves
  }

  const lastMoveHighlight =
    isLastMoveFrom || isLastMoveTo ? "bg-yellow-300/40" : "";

  return (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      style={{ backgroundColor: highlightColor || woodColor }}
      className={`
        relative w-full aspect-square flex items-center justify-center
        border border-black rounded-[4px] cursor-pointer overflow-hidden
        transition-all
        ${lastMoveHighlight}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none rounded-[4px]" />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function Piece({ code, onDragStart }) {
  const isWhite = code.startsWith("w");
  // Inline SVGs for pieces to avoid external image dependencies
  const getPieceSVG = (pieceCode) => {
    const color = pieceCode[0];
    const type = pieceCode[1];
    const fill = color === "w" ? "white" : "black";
    const stroke = color === "w" ? "black" : "white";

    switch (type) {
      case "p": // Pawn
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" stroke="${stroke}" fill="${fill}"><g><path d="M22.5 9c2.21 0 4 2.124 4 4.5 0 2.376-1.79 4.5-4 4.5s-4-2.124-4-4.5c0-2.376 1.79-4.5 4-4.5zm-5.666 12.333c-2.334 0-4.667 1.167-4.667 3.5v7h1.667v1.667h16.667V31h1.667v-7c0-2.333-2.333-3.5-4.667-3.5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M22.5 10.5c1.385 0 2.5 1.115 2.5 2.5s-1.115 2.5-2.5 2.5-2.5-1.115-2.5-2.5 1.115-2.5 2.5-2.5z" fill="${stroke}" /><path d="M16.833 21.333c-2 0-3.333 1.333-3.333 3.333v5.5h1.667v1.667h16.667V30.167h1.667v-5.5c0-2-1.333-3.333-3.333-3.333H16.833z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M12.5 29.5v12h20v-12H12.5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></g></svg>`;
      case "b": // Bishop
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" stroke="${stroke}" fill="${fill}"><g><path d="M9 36c3.39-1.37 7.2-1.87 12.5-1.87 5.31 0 9.11.5 12.5 1.87A2 2 0 1 1 34 40H11a2 2 0 1 1-2-4z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M15 32c2.5-2 10.5-1.5 13 0M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M17.5 26h10.5M19 28.5L18 29.5M26.5 28.5L27.5 29.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M22.5 11.63V16c0 1.25.83 2 2 3a8 8 0 0 0 2.5 5.5s1.21.39 1.45.62c.79.79.46 1.94-.49 2.55-.26.16-5.5-1.63-7.5-1.5-2.25.13-7 1.5-7.5 1.5-.95-.6-1.24-1.75-.45-2.54.23-.23 1.45-.61 1.45-.61A8 8 0 0 0 20.5 19c1.17-.85 2-2.18 2-3.37V11.62z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></g></svg>`;
      case "r": // Rook
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" stroke="${stroke}" fill="${fill}"><g><path d="M9 39h27v-3.5H9v3.5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M12.5 32h20v-16h-20v16z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M11 36v-2h23v2H11z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M12.5 32c.5 1 1.5 1 2.5 1h16c1 0 2 0 2.5-1m-21 0h22" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M13.5 25.5h18v-7h-18v7zM14 18h17" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M14.5 18v-2.5h16.5V18" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M14.5 15.5h16.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M15 15.5V13c0-1.5-1-2.5-2-2.5h-1c-1 0-2 1-2 2.5v2.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M30 15.5V13c0-1.5 1-2.5 2-2.5h1c1 0 2 1 2 2.5v2.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M12.5 12h20M12.5 10.5h20M12.5 9h20M12.5 7.5h20" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M17 10h11" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M18 8h9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></g></svg>`;
      case "n": // Knight
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" stroke="${stroke}" fill="${fill}"><g><path d="M 22.5, 10 C 22.5, 10 11.5, 23 15.5, 25 C 19.5, 27 22.5, 28 22.5, 30 L 22.5, 35 L 29.5, 35 C 29.5, 35 29.5, 27 27.5, 25 C 25.5, 23 23.5, 22 22.5, 10 z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M 22.5, 10 C 22.5, 10 26.5, 13 26.5, 15 C 26.5, 17 25.5, 18 24.5, 18 C 23.5, 18 22.5, 17 22.5, 15 L 22.5, 10 z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M 22.5, 10 C 22.5, 10 23.5, 15 25.5, 17 C 27.5, 19 28.5, 20 28.5, 22 L 28.5, 25 C 28.5, 25 31.5, 25 31.5, 27 C 31.5, 29 30.5, 30 28.5, 30 L 22.5, 30 L 22.5, 35 L 18.5, 35 C 18.5, 35 15.5, 35 15.5, 35" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M 25.5, 25 C 25.5, 25 24.5, 25.5 23.5, 25.5 C 22.5, 25.5 21.5, 25 21.5, 25" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></g></svg>`;
      default:
        return `<div class="text-sm font-bold text-black dark:text-white">?</div>`;
    }
  };

  const svgContent = getPieceSVG(code);
  const invertClass = isWhite ? "invert brightness-[1.7]" : "brightness-[0.85]";

  return (
    <div
      className={`
        w-[80%] h-[80%] object-contain select-none pointer-events-auto
        drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-in-out
        ${invertClass}
      `}
      draggable
      onDragStart={onDragStart}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

function Board({ boardHistory, setBoardHistory, setGameWon }) {
  const [layout, setLayout] = useState(boardHistory[boardHistory.length - 1]);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // Sync layout with the latest history entry
  useEffect(() => {
    setLayout(boardHistory[boardHistory.length - 1]);
  }, [boardHistory]);

  const checkWinCondition = (currentLayout) => {
    const hasBlackPawns = currentLayout.some((row) =>
      row.some((piece) => piece === "bp")
    );
    if (!hasBlackPawns) {
      setGameWon(true);
    }
  };

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
      setBoardHistory((prev) => [...prev, next]);
      setLastMove({ from: { row: fr, col: fc }, to: { row: r, col: c } });
      checkWinCondition(next);
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
        setBoardHistory((prev) => [...prev, next]);
        setLastMove({ from: selected, to: { row: r, col: c } });
        checkWinCondition(next);
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

function App() {
  const [boardHistory, setBoardHistory] = useState([initialLayout]);
  const [gameWon, setGameWon] = useState(false);

  const handleUndo = () => {
    if (boardHistory.length > 1) {
      setBoardHistory((prev) => prev.slice(0, prev.length - 1));
      setGameWon(false);
    }
  };

  const handleReset = () => {
    setBoardHistory([initialLayout]);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3cbb5] via-[#c9a97e] to-[#9b7b5a] text-white p-4 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-[#442a1d] text-4xl font-bold drop-shadow-md">
          Capture the pawns!
        </h1>
        <Board
          boardHistory={boardHistory}
          setBoardHistory={setBoardHistory}
          setGameWon={setGameWon}
        />
        <div className="flex gap-4">
          <button
            onClick={handleUndo}
            disabled={boardHistory.length <= 1 || gameWon}
            className={`
              flex items-center gap-1 rounded-full px-4 py-2 text-white font-semibold transition-all shadow-lg
              ${
                boardHistory.length > 1 && !gameWon
                  ? "bg-slate-700 hover:bg-slate-600 active:scale-95"
                  : "bg-slate-400 cursor-not-allowed"
              }
            `}
          >
            <UndoIcon /> Undo
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-full px-4 py-2 bg-red-600 text-white font-semibold shadow-lg transition-all hover:bg-red-500 active:scale-95"
          >
            <ResetIcon /> Reset
          </button>
        </div>
      </div>

      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Confetti />
          <div className="relative bg-white text-black p-8 rounded-xl shadow-2xl text-center max-w-sm w-full animate-pulse-once">
            <h2 className="text-4xl font-extrabold text-green-600 mb-4 drop-shadow-lg">
              You Won! 🎉
            </h2>
            <p className="text-lg font-medium text-gray-800 mb-6">
              All black pawns have been captured!
            </p>
            <button
              onClick={handleReset}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-green-500 transition-all active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
