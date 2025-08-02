export function getLegalMoves(pieceCode, from, board) {
  const type = pieceCode[1];
  const isWhite = pieceCode[0] === "w";

  const directions = {
    n: [
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ],
    b: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    r: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    p: isWhite
      ? [
          [-1, 0],
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, 0],
          [1, -1],
          [1, 1],
        ],
  };

  const legal = [];
  const inside = (r, c) => r >= 0 && r < 6 && c >= 0 && c < 4;

  // Define missing tiles based on rule
  const isMissing = (r, c) => {
    const rank = 6 - r;
    return rank === 5 || (rank === 1 && c < 3);
  };

  const at = (r, c) => (inside(r, c) && !isMissing(r, c) ? board[r][c] : null);

  const addMove = (r, c) => {
    if (!inside(r, c) || isMissing(r, c)) return;
    const target = at(r, c);
    if (type === "p") {
      if (c === from.col && !target) {
        legal.push({ row: r, col: c });
      } else if (c !== from.col && target && target[0] !== pieceCode[0]) {
        legal.push({ row: r, col: c });
      }
    } else if (!target) {
      legal.push({ row: r, col: c });
    } else if (target[0] !== pieceCode[0]) {
      legal.push({ row: r, col: c });
    }
  };

  if (type === "n") {
    for (const [dr, dc] of directions.n) {
      const r = from.row + dr;
      const c = from.col + dc;
      addMove(r, c); // Knights can jump over gaps
    }
  } else if (type === "b" || type === "r") {
    for (const [dr, dc] of directions[type]) {
      let r = from.row + dr;
      let c = from.col + dc;
      while (inside(r, c)) {
        if (isMissing(r, c)) break; // Block path on missing tile
        const target = at(r, c);
        if (!target) {
          legal.push({ row: r, col: c });
        } else {
          if (target[0] !== pieceCode[0]) legal.push({ row: r, col: c });
          break;
        }
        r += dr;
        c += dc;
      }
    }
  } else if (type === "p") {
    for (const [dr, dc] of directions.p) {
      const r = from.row + dr;
      const c = from.col + dc;
      addMove(r, c);
    }
  }

  return legal;
}
