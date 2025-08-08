import React from "react";
import Board from "./src/components/Board";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3cbb5] via-[#c9a97e] to-[#9b7b5a] text-white p-4 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
        <h1 className="text-[#442a1d] text-5xl sm:text-6xl md:text-7xl font-extrabold drop-shadow-lg tracking-tight uppercase text-center leading-tight px-2">
          Capture the Pawns!
        </h1>

        <Board />
      </div>
    </div>
  );
}
