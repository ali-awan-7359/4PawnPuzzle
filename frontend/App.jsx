import Board from "./src/components/Board";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3cbb5] via-[#c9a97e] to-[#9b7b5a] text-white p-6">
      <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-6">
        <h1 className="text-[#442a1d] text-3xl font-bold drop-shadow-md">
          Capture the pawns!
        </h1>
        <Board />
      </div>
    </div>
  );
}



export default App;
