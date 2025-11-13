"use client";
import { useRouter } from "next/navigation";

export default function TicTacToeSelect() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 relative">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => router.push('/dashboard')}
      >
        Back to Games
      </button>
      <h1 className="text-4xl font-bold mb-8 text-yellow-700 drop-shadow-lg text-center">Tic Tac Toe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
        <div
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition cursor-pointer text-justify"
          onClick={() => router.push("/tic-tac-toe/computer")}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png" alt="Computer" className="w-20 h-20 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-pink-700 text-center">Play with Computer</h2>
        </div>
        <div
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition cursor-pointer text-justify"
          onClick={() => router.push("/tic-tac-toe/friend")}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="Friend" className="w-20 h-20 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-yellow-700 text-center">Play with Friend</h2>
        </div>
      </div>
    </div>
  );
}
