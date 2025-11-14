"use client";
import React, { useEffect, useState } from "react";

const SIZE = 4;
function getShuffledTiles() {
  const arr = Array.from({ length: SIZE * SIZE }, (_, i) => i);
  let n = arr.length;
  while (n > 1) {
    const k = Math.floor(Math.random() * n--);
    [arr[n], arr[k]] = [arr[k], arr[n]];
  }
  return arr;
}
function isSolvable(tiles: number[]) {
  let inv = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inv++;
    }
  }
  const emptyRow = Math.floor(tiles.indexOf(0) / SIZE);
  return (inv + emptyRow) % 2 === 0;
}
export default function SlidingPuzzleNumbers() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timerStarted && !won) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [timerStarted, won]);
  function startNewGame() {
    let shuffled = getShuffledTiles();
    while (!isSolvable(shuffled) || isSolved(shuffled)) {
      shuffled = getShuffledTiles();
    }
    setTiles(shuffled);
    setWon(false);
    setSeconds(0);
    setTimerStarted(false);
  }
  useEffect(() => { startNewGame(); }, []);
  function isSolved(arr: number[]) {
    return arr.every((v, i) => v === (i === arr.length - 1 ? 0 : i + 1));
  }
  function moveTile(idx: number) {
    if (won) return;
    if (!timerStarted) setTimerStarted(true);
    const empty = tiles.indexOf(0);
    const canMove = [
      empty - 1 === idx && empty % SIZE !== 0,
      empty + 1 === idx && idx % SIZE !== 0,
      empty - SIZE === idx,
      empty + SIZE === idx,
    ].some(Boolean);
    if (canMove) {
      const newTiles = [...tiles];
      [newTiles[empty], newTiles[idx]] = [newTiles[idx], newTiles[empty]];
      setTiles(newTiles);
      if (isSolved(newTiles)) setWon(true);
    }
  }
  function handleRestart() { startNewGame(); }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <button className="absolute top-6 right-6 px-6 py-3 bg-gray-400 text-white rounded shadow hover:bg-gray-500 text-lg font-bold transition z-20" onClick={() => window.location.href = '/sliding-puzzle/select-mode'}>Back to Selection</button>
      <div className="absolute top-20 right-6 z-20 w-48 flex justify-center">
        <div className="bg-white/80 rounded-lg px-4 py-2 shadow text-blue-700 font-bold text-lg">Timer: {seconds}s</div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Sliding Puzzle - Numbers</h1>
      <div className="grid grid-cols-4 gap-1 bg-white rounded-xl p-2 shadow-lg mb-6 w-full max-w-xs aspect-square relative">
        {tiles.map((tile, idx) => (
          tile === 0 ? (
            <div key={idx} className="bg-gray-200 rounded-lg aspect-square w-full h-full" />
          ) : (
            <div
              key={idx}
              className="cursor-pointer rounded-lg aspect-square w-full h-full flex items-center justify-center text-2xl font-bold bg-blue-100 border border-white shadow text-blue-700 select-none"
              onClick={() => moveTile(idx)}
            >
              {tile}
            </div>
          )
        ))}
      </div>
      <button className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition" onClick={handleRestart}>Restart</button>
      <div style={{ minHeight: 28 }} className="flex items-center justify-center w-full">
        {won && (
          <div className="text-2xl font-bold text-green-700">You solved it!</div>
        )}
      </div>
      <p className="text-gray-600 text-center max-w-md mt-2">Click tiles next to the empty space to move them. Try to arrange the numbers in order!</p>
    </div>
  );
}
