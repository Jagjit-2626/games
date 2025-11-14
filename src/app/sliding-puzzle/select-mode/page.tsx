"use client";
import { useRouter } from "next/navigation";

export default function SlidingPuzzleSelect() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => router.push('/dashboard')}
      >
        Back to Games
      </button>
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Sliding Puzzle</h1>
      <div className="mb-8 text-lg font-semibold text-gray-700">Choose your mode:</div>
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <button
          className="px-6 py-4 bg-blue-500 text-white rounded-xl shadow-lg text-2xl font-bold hover:bg-blue-600 transition"
          onClick={() => router.push('/sliding-puzzle/picture')}
        >
          Picture Mode
        </button>
        <button
          className="px-6 py-4 bg-green-500 text-white rounded-xl shadow-lg text-2xl font-bold hover:bg-green-600 transition"
          onClick={() => router.push('/sliding-puzzle/numbers')}
        >
          Numbers Mode
        </button>
      </div>
    </div>
  );
}
