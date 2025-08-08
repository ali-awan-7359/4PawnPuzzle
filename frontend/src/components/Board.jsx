import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import { getLegalMoves } from "./PieceUtils";
import confetti from "canvas-confetti";

/* --- small inline icons --- */
const UndoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      d="M3 7v6h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
const ResetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      d="M3 2v6h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M3 13a9 9 0 1 0 9 9c1.652-.086 3.2-.843 4.41-2.05"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 12v6h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/* --- decorative CSS confetti pieces  --- */
const ConfettiPiece = () => {
  const [style, setStyle] = useState({});
  useEffect(() => {
    const randomColor = `hsl(${Math.random() * 360}, 85%, 55%)`;
    const randomSize = `${Math.random() * 12 + 6}px`;
    const randomLeft = `${Math.random() * 100}vw`;
    const randomDuration = `${Math.random() * 1.4 + 1.0}s`;
    const randomDelay = `${Math.random() * 0.6}s`;
    setStyle({
      backgroundColor: randomColor,
      width: randomSize,
      height: randomSize,
      left: randomLeft,
      animationDuration: randomDuration,
      animationDelay: randomDelay,
      borderRadius: `${Math.random() * 6}px`,
    });
  }, []);
  return (
    <div className="absolute top-0 opacity-0 animate-confetti" style={style} />
  );
};

const Confetti = ({ pieces = 36 }) => {
  const arr = Array.from({ length: pieces });
  return (
    <>
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-120vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation-name: confetti; animation-timing-function: ease-in; animation-fill-mode: forwards; }
      `}</style>
      {arr.map((_, i) => (
        <ConfettiPiece key={i} />
      ))}
    </>
  );
};

/* ---------------
   initial layout 
   ---------------- */
const initialLayout = [
  ["bp", "bp", "bp", "bp"],
  [null, null, null, null],
  ["wb", "wb", "wb", "wb"],
  ["wr", "wr", "wr", "wr"],
  ["wp", "wp", "wp", null],
  [null, null, null, "wn"],
];

export default function Board() {
  const [layout, setLayout] = useState(initialLayout);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [confettiFired, setConfettiFired] = useState(false);
  const [showConfettiBurst, setShowConfettiBurst] = useState(false);

 
  const missingMap = new Set();
  layout.forEach((row, r) =>
    row.forEach((_, c) => {
      const rank = 6 - r;
      if (rank === 5 || (rank === 1 && c < 3)) {
        missingMap.add(`${r},${c}`);
      }
    })
  );

  // Trigger single confetti burst (canvas) + decorative confetti
  const triggerWin = () => {
    if (!confettiFired) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setConfettiFired(true);
      setShowConfettiBurst(true);
      setTimeout(() => setShowConfettiBurst(false), 2600);
    }
    setHasWon(true);
  };

  const checkWin = (newLayout) => {
    const allCaptured = !newLayout.some((row) => row.includes("bp"));
    if (allCaptured && !hasWon) triggerWin();
  };

  const movePiece = (from, to) => {
    setHistory((prev) => [...prev, layout.map((row) => [...row])]);
    const next = layout.map((row) => [...row]);
    next[to.row][to.col] = layout[from.row][from.col];
    next[from.row][from.col] = null;
    setLayout(next);
    setLastMove({ from, to });
    checkWin(next);
  };

  /* -------------------------
     Drag & click handlers 
     ------------------------- */
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
      movePiece({ row: fr, col: fc }, { row: r, col: c });
    }
    setDraggedFrom(null);
    setSelected(null);
    setLegalMoves([]);
  };

  const handleClick = (r, c) => {
    const piece = layout[r][c];
    if (selected) {
      const valid = legalMoves.some((m) => m.row === r && m.col === c);
      if (valid) movePiece(selected, { row: r, col: c });
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

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setLayout(prevState);
      setHistory(history.slice(0, -1));
      if (hasWon) {
        const anyBP = prevState.some((row) => row.includes("bp"));
        if (anyBP) setHasWon(false);
      }
    }
  };

  const handleReset = () => {
    setLayout(initialLayout);
    setHistory([]);
    setSelected(null);
    setLegalMoves([]);
    setDraggedFrom(null);
    setLastMove(null);
    setHasWon(false);
    setConfettiFired(false);
    setShowConfettiBurst(false);
  };

  // block body scroll when modal open
  useEffect(() => {
    if (hasWon) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [hasWon]);

  return (
    <>
      {/* MAIN CONTENT: when modal open, we blur via inline style and disable pointer events */}
      <div
        style={{
          filter: hasWon ? "blur(10px)" : "none",
          transition: "filter 180ms ease",
          pointerEvents: hasWon ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-3 justify-center">
            <button
              onClick={handleUndo}
              disabled={history.length === 0 || hasWon}
              aria-label="Undo"
              className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-md font-semibold transition-all text-base
                ${
                  history.length > 0 && !hasWon
                    ? "bg-gradient-to-b from-[#d4b184] to-[#b8905e] text-[#442a1d] hover:from-[#c9a97e]"
                    : "bg-slate-400 text-white cursor-not-allowed"
                }
              `}
            >
              <UndoIcon />
              <span>Undo</span>
            </button>

            <button
              onClick={handleReset}
              aria-label="Reset"
              className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-md font-semibold transition-all text-base bg-gradient-to-b from-[#a17c5a] to-[#7e5d48] hover:from-[#8b654f] hover:to-[#644736] text-white"
            >
              <ResetIcon />
              <span>Reset</span>
            </button>
          </div>

          {/* Board */}
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
        </div>
      </div>

      {/* WIN MODAL (centered): overlay provides transparent strong blur via backdrop-filter and modal is centered using grid place-items-center */}
      {hasWon && (
        <div
          // fixed full-screen overlay container centered (highest z-index)
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 99999,
          }}
        >
          {/* Transparent blur overlay that captures clicks and blurs the page via backdrop-filter */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              // strong transparent blur (no tint). WebKit prefixed for Safari.
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              backgroundColor: "transparent",
            }}
          />

          {/* decorative confetti */}
          {showConfettiBurst && <Confetti pieces={48} />}

          {/* Modal card */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              zIndex: 100000,
              width: "min(640px,94%)",
              maxWidth: "640px",
              borderRadius: "24px",
              padding: "1.25rem 1.5rem",
              boxShadow: "0 18px 40px rgba(12,12,12,0.35)",
              background:
                "linear-gradient(135deg,#e3cbb5 0%,#c9a97e 50%,#9b7b5a 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                color: "#2b180f",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.75)",
                  padding: 12,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#166534"
                  strokeWidth="1.8"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 style={{ fontSize: "1.7rem", fontWeight: 800, margin: 0 }}>
                🎉 Victory!
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.975rem",
                  maxWidth: 544,
                  color: "#442a1d",
                }}
              >
                All black pawns have been captured — nice! Restart to play
                again.
              </p>

              <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                {/* Restart button: green, auto width */}
                <button
                  onClick={handleReset}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 18px",
                    borderRadius: 9999,
                    backgroundColor: "#16a34a", // solid green
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 8px 20px rgba(22,163,74,0.22)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Restart Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
