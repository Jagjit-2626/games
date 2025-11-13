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

export default function MemoryGameFriend() {
  const [cards, setCards] = useState(() => shuffle([...CARD_IMAGES, ...CARD_IMAGES]));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState({ 'Player 1': 0, 'Player 2': 0 });
  const [gameOver, setGameOver] = useState(false);
  const [turn, setTurn] = useState<'Player 1' | 'Player 2'>('Player 1');
  const [scores, setScores] = useState({ 'Player 1': 0, 'Player 2': 0 });

  function handleFlip(idx: number) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => ({ ...m, [turn]: m[turn] + 1 }));
      const [i, j] = newFlipped;
      if (cards[i] === cards[j]) {
        setTimeout(() => {
          setMatched(prev => [...prev, i, j]);
          setScores(s => ({ ...s, [turn]: s[turn] + 1 }));
          setFlipped([]);
          if (matched.length + 2 === cards.length) setGameOver(true);
        }, 700);
      } else {
        setTimeout(() => {
          setTurn(t => t === 'Player 1' ? 'Player 2' : 'Player 1');
          setFlipped([]);
        }, 900);
      }
    }
  }

  function handleRestart() {
    setCards(shuffle([...CARD_IMAGES, ...CARD_IMAGES]));
    setFlipped([]);
    setMatched([]);
    setMoves({ 'Player 1': 0, 'Player 2': 0 });
    setGameOver(false);
    setTurn('Player 1');
    setScores({ 'Player 1': 0, 'Player 2': 0 });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 relative">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = '/memory-game'}
      >
        Back to Selection
      </button>
      <h1 className="text-4xl font-bold mb-4 text-yellow-700 drop-shadow-lg">Memory Game: Play with Friend</h1>
      <div className="absolute top-55 right-8 flex flex-col items-end z-20 bg-white bg-opacity-80 rounded-xl p-4 shadow-lg min-w-[220px] text-justify">
        <div className="mb-2 text-lg font-bold text-pink-700 w-full text-center">Current Turn: <span className="text-blue-600">{turn === 'Player 1' ? 'P1' : 'P2'}</span></div>
        <div className="mb-2 text-base font-semibold text-gray-700 flex flex-row gap-2 items-center">
          <span className="text-green-700">P1</span>
          <span className="bg-green-100 px-2 py-1 rounded">Score: {scores['Player 1']}</span>
          <span className="bg-green-100 px-2 py-1 rounded">Moves: {moves['Player 1']}</span>
        </div>
        <div className="mb-2 text-base font-semibold text-gray-700 flex flex-row gap-2 items-center">
          <span className="text-yellow-700">P2</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">Score: {scores['Player 2']}</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">Moves: {moves['Player 2']}</span>
        </div>
      </div>
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
        <div className="mt-6 text-2xl font-bold text-green-700">
          Game Over! {scores['Player 1'] > scores['Player 2'] ? 'Player 1 Wins! 🎉' : scores['Player 2'] > scores['Player 1'] ? 'Player 2 Wins! 🎉' : 'Draw!'}
        </div>
      )}
    </div>
  );
}
