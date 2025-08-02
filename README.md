 
# ♟️ 6x4 Chess Puzzle App

A fully custom-built **React-based chess puzzle app** with a compact **6x4 chessboard**, piece movement logic, threat visualization, and dynamic blocked square messaging. Inspired by the interactivity of Chess.com, this project is built for puzzle creation, move validation, and creative experimentation with custom board layouts.




---

## 🔥 Features

- ✅ Fully interactive 6x4 chessboard
- 🧠 Custom move validation logic for:
  - Knights
  - Bishops
  - Rooks
  - Pawns
- 🟥 Blocked/disabled tiles for unique board layouts
- 🟢 Highlighted legal moves (green)
- 🔴 Threat indicators (red), e.g., knight attacking enemy pieces
- 🖱 Click-and-drag piece movement
- ✍️ Simple UI with wood-styled board coloring
- ⚡ Fully responsive (mobile and desktop)

---

## 📸 Preview

<img width="938" height="866" alt="image" src="https://github.com/user-attachments/assets/1929f975-3649-4bd8-8564-63961272298b" />

<img width="929" height="864" alt="image" src="https://github.com/user-attachments/assets/50081715-1ce0-4184-a2c5-55c8fc10c14c" />




---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| `React` | Frontend Framework |
| `Tailwind CSS` | Utility-first styling |
| `JavaScript` | Logic for move rules |
| `SVG Assets` | Custom chess pieces |
| `Vite / Create React App` | Local development server |

---

## 📁 File Structure

```bash
src/
├── components/
│ ├── Board.jsx # Main board layout and gameplay logic
│ ├── Tile.jsx # Individual tile with color + highlighting
│ ├── Piece.jsx # Renders piece images, click-drag support
│ └── PieceUtils.js # Core logic for each piece's legal moves
├── public/
│ └── pieces/ # SVGs for all chess pieces
├── App.jsx # Root component
└── main.jsx # Entry point with ReactDOM
````

---

## 🧩 Gameplay Logic

### ♘ Knight Threat Detection

When a knight is selected, any enemy piece within a valid move is highlighted in **red** to show a threat.

### 🟩 Legal Move Indicators

All valid moves are highlighted in **green**.


### ⬜ Blocked / Merged Squares

---

## 🚀 Setup Instructions

1. Clone the repository:

```bash
git clone [https://github.com/ali-awan-7350/4PawnPuzzle.git](https://github.com/ali-awan-7350/4PawnPuzzle.git)
cd 4PawnPuzzle
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm start
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to view it.


---

## ✨ Inspiration

Inspired by **@Puzzleguy** on YouTube and the desire to experiment with reduced-board chess tactics for puzzle solving and coaching.

---

## 🧑‍💻 Author

Made with ❤️ by [@ali-awan-7359](https://github.com/ali-awan-7359)
Feel free to fork, contribute, or suggest improvements!

---

## 📜 License

This project is open-source and available under the [MIT License](./LICENSE).

---

> *“Chess is the gymnasium of the mind.” – Blaise Pascal*

```

