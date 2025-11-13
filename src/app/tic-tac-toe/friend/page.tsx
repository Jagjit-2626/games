"use client";
import { useState } from "react";

const initialBoard = Array(9).fill(null);

function checkWinner(board: (string | null)[]): string | null {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export default function TicTacToeFriend() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const winner = checkWinner(board);
  const status = winner ? `Winner: ${winner}` : board.every(Boolean) ? "Draw!" : `Next: ${xIsNext ? "X" : "O"}`;

  function handleClick(i: number) {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function handleRestart() {
    setBoard(initialBoard);
    setXIsNext(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 relative">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = '/tic-tac-toe'}
      >
        Back to Selection
      </button>
      <h1 className="text-4xl font-bold mb-4 text-yellow-700 drop-shadow-lg">Play with Friend</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">{status}</div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`w-20 h-20 text-3xl font-bold bg-white rounded shadow hover:bg-yellow-100 transition ${cell === 'X' ? 'text-gray-800' : cell === 'O' ? 'text-gray-800' : ''}`}
            onClick={() => handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>
      <button className="px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition" onClick={handleRestart}>Restart</button>
    </div>
  );
}
