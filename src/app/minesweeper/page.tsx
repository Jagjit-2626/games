"use client";
import React, { useState } from "react";

const ROWS = 6;
const COLS = 6;
const MINES = 6;

function createBoard() {
  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  );
  // Place mines
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) {
      board[r][c] = { ...board[r][c], mine: true };
      placed++;
    }
  }
  // Calculate counts
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
        }
      }
      board[r][c] = { ...board[r][c], count };
    }
  }
  return board;
}

function reveal(board: any[][], r: number, c: number) {
  const newBoard = board.map((row: any[]) => row.map((cell: any) => ({ ...cell })));
  function dfs(x: number, y: number) {
    if (x < 0 || x >= ROWS || y < 0 || y >= COLS) return;
    if (newBoard[x][y].revealed || newBoard[x][y].flagged) return;
    newBoard[x][y].revealed = true;
    if (newBoard[x][y].count === 0 && !newBoard[x][y].mine) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) dfs(x + dx, y + dy);
        }
      }
    }
  }
  dfs(r, c);
  return newBoard;
}

export default function Minesweeper() {
  const [board, setBoard] = useState(() => createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function handleCellClick(r: number, c: number) {
    if (gameOver || board[r][c].flagged) return;
    if (board[r][c].mine) {
      setGameOver(true);
      const newBoard = board.map(row => row.map(cell => ({ ...cell, revealed: true })));
      setBoard(newBoard);
      return;
    }
    const newBoard = reveal(board, r, c);
    setBoard(newBoard);
    // Check win
    const allSafeRevealed = newBoard.flat().filter(cell => !cell.mine).every(cell => cell.revealed);
    if (allSafeRevealed) {
      setWon(true);
      setGameOver(true);
    }
  }

  function handleRightClick(e: React.MouseEvent, r: number, c: number) {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
  }

  function handleRestart() {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 pt-12">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = "/dashboard"}
      >
        Back to Games
      </button>
      {/* Instructions panel on the right side below Back to Games button */}
      <div className="absolute right-6 top-32 w-64 bg-white bg-opacity-90 rounded-xl shadow-lg p-4 z-10 border border-blue-200 flex flex-col justify-between">
        <h2 className="text-xl font-bold mb-2 text-blue-700">How to Play</h2>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-1 text-left">
          <li>Left click a cell to reveal it.</li>
          <li>If you reveal a mine (💣), you lose.</li>
          <li>Numbers show how many mines are in the 8 surrounding cells.</li>
          <li>Right click a cell to flag it as a suspected mine (🚩).</li>
          <li>Reveal all safe cells to win.</li>
        </ul>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Minesweeper</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">
        {gameOver ? (won ? "You Win!" : "Game Over!") : "Left click to reveal, right click to flag."}
      </div>
      <div className="grid grid-cols-6 gap-1 bg-gray-400 p-2 rounded-xl shadow-lg">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`w-10 h-10 flex items-center justify-center rounded bg-gray-200 text-lg font-bold select-none border-2 border-gray-500 cursor-pointer ${cell.revealed ? "bg-white" : cell.flagged ? "bg-yellow-200" : "bg-gray-200"}`}
              onClick={() => handleCellClick(rIdx, cIdx)}
              onContextMenu={e => handleRightClick(e, rIdx, cIdx)}
            >
              {cell.revealed && cell.mine ? "💣" : cell.revealed && cell.count > 0 ? <span style={{ color: 'black' }}>{cell.count}</span> : cell.flagged ? "🚩" : ""}
            </div>
          ))
        )}
      </div>
      <button
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
        onClick={handleRestart}
      >
        Restart
      </button>
      <p className="mt-6 text-gray-600 text-center max-w-md">
        Reveal all safe cells to win. Right click to flag suspected mines.
      </p>
    </div>
  );
}
