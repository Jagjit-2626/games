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
function getRandomImageUrl() {
  return `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 10000)}`;
}
export default function SlidingPuzzlePicture() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [won, setWon] = useState(false);
  const [showImage, setShowImage] = useState(false);
  function startNewGame() {
    let shuffled = getShuffledTiles();
    while (!isSolvable(shuffled) || isSolved(shuffled)) {
      shuffled = getShuffledTiles();
    }
    setTiles(shuffled);
    setImgUrl(getRandomImageUrl());
    setWon(false);
  }
  useEffect(() => { startNewGame(); }, []);
  function isSolved(arr: number[]) {
    return arr.every((v, i) => v === (i === arr.length - 1 ? 0 : i + 1));
  }
  function moveTile(idx: number) {
    if (won) return;
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
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Sliding Puzzle - Picture</h1>
      <div className="flex flex-row items-start justify-center w-full max-w-4xl gap-8">
        <div className="flex flex-col items-center flex-shrink-0 w-full max-w-xs">
          <div className="grid grid-cols-4 gap-1 bg-white rounded-xl p-2 shadow-lg mb-6 aspect-square w-full">
            {tiles.map((tile, idx) => (
              tile === 0 ? (
                <div key={idx} className="bg-gray-200 rounded-lg aspect-square w-full h-full" />
              ) : (
                <div
                  key={idx}
                  className="cursor-pointer rounded-lg aspect-square w-full h-full overflow-hidden border border-white shadow"
                  style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                    backgroundPosition: `${(tile % SIZE) * (100 / (SIZE - 1))}% ${Math.floor((tile - 1) / SIZE) * (100 / (SIZE - 1))}%`,
                    backgroundRepeat: 'no-repeat',
                    transition: 'box-shadow 0.2s',
                  }}
                  onClick={() => moveTile(idx)}
                />
              )
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center min-w-[18rem]">
          <button
            className={`px-4 py-2 rounded shadow font-semibold mb-2 transition-colors ${showImage ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white text-blue-700 border border-blue-500 hover:bg-blue-100'}`}
            onClick={() => setShowImage(v => !v)}
          >
            {showImage ? 'Hide Image' : 'Show Image'}
          </button>
          {showImage && (
            <>
              <img src={imgUrl} alt="Full" className="rounded-xl shadow-lg w-64 h-64 object-cover border-4 border-blue-200" />
              <div className="text-center text-gray-500 mt-2 text-sm">Reference Image</div>
            </>
          )}
        </div>
      </div>
      <button className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition mt-4" onClick={handleRestart}>Restart</button>
      <div style={{ minHeight: 28 }} className="flex items-center justify-center w-full">
        {won && (
          <div className="text-2xl font-bold text-green-700">You solved it!</div>
        )}
      </div>
      <p className="text-gray-600 text-center max-w-md mt-2">Click tiles next to the empty space to move them. Each restart gives you a new random image!</p>
    </div>
  );
}
