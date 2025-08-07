import Board from "./src/components/Board";

function App() {
  return (
    // UPDATED:
    // - Changed min-h-full to min-h-screen to fill the entire viewport height.
    // - Added flexbox properties (flex, flex-col, justify-center, items-center) to center the content.
    // - Made padding responsive (smaller on small screens).
    <div className="min-h-screen bg-gradient-to-br from-[#e3cbb5] via-[#c9a97e] to-[#9b7b5a] text-white p-4 flex flex-col justify-center items-center">
      {/* UPDATED:
          - Removed max-w-screen-sm and mx-auto as centering is now handled by the parent.
          - Adjusted gap to be responsive. */}
      <div className="flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-[#442a1d] text-4xl font-bold drop-shadow-md">
          Capture the pawns!
        </h1>
        <Board />
      </div>
    </div>
  );
}

export default App;
