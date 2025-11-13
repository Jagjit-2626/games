"use client";
import { useState } from "react";

const CARD_IMAGES = [
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍋", "🍑", "🍍"
];

function shuffle(array: string[]): string[] {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryGameSingle() {
  const [cards, setCards] = useState(() => shuffle([...CARD_IMAGES, ...CARD_IMAGES]));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function handleFlip(idx: number) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [i, j] = newFlipped;
      if (cards[i] === cards[j]) {
        setTimeout(() => {
          setMatched(prev => [...prev, i, j]);
          setFlipped([]);
          if (matched.length + 2 === cards.length) setGameOver(true);
        }, 700);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }

  function handleRestart() {
    setCards(shuffle([...CARD_IMAGES, ...CARD_IMAGES]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 relative">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = '/memory-game'}
      >
        Back to Selection
      </button>
      <h1 className="text-4xl font-bold mb-4 text-yellow-700 drop-shadow-lg">Memory Game: Solo</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card, idx) => (
          <button
            key={idx}
            className={`w-20 h-20 text-3xl font-bold bg-white rounded shadow flex items-center justify-center transition duration-300 ${flipped.includes(idx) || matched.includes(idx) ? '' : 'bg-gray-300 text-gray-300'}`}
            onClick={() => handleFlip(idx)}
            disabled={flipped.length === 2 || matched.includes(idx)}
          >
            {flipped.includes(idx) || matched.includes(idx) ? card : "?"}
          </button>
        ))}
      </div>
      <button className="px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition" onClick={handleRestart}>Restart</button>
      {gameOver && (
        <div className="mt-6 text-2xl font-bold text-green-700">You Win! 🎉</div>
      )}
    </div>
  );
}
