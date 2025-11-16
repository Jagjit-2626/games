"use client";
import React, { useState, useRef } from "react";

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

function checkWinner(board: number[][]) {
  // Horizontal, vertical, and diagonal checks
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c];
      if (player === EMPTY) continue;
      // Horizontal
      if (c + 3 < COLS && board[r][c + 1] === player && board[r][c + 2] === player && board[r][c + 3] === player) return player;
      // Vertical
      if (r + 3 < ROWS && board[r + 1][c] === player && board[r + 2][c] === player && board[r + 3][c] === player) return player;
      // Diagonal down-right
      if (r + 3 < ROWS && c + 3 < COLS && board[r + 1][c + 1] === player && board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) return player;
      // Diagonal up-right
      if (r - 3 >= 0 && c + 3 < COLS && board[r - 1][c + 1] === player && board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) return player;
    }
  }
  return null;
}

export default function ConnectFour() {
  const [board, setBoard] = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY)));
  const [current, setCurrent] = useState(PLAYER1);
  const [winner, setWinner] = useState<number | null>(null);
  const [animating, setAnimating] = useState<{ col: number; row: number; color: number; target: number } | null>(null);
  const animationRef = useRef<number | null>(null);

  function drop(col: number) {
    if (winner || animating) return;
    let targetRow = -1;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === EMPTY) {
        targetRow = row;
        break;
      }
    }
    if (targetRow === -1) return;
    setAnimating({ col, row: 0, color: current, target: targetRow });
  }

  // Animate the falling disc
  React.useEffect(() => {
    if (!animating) return;
    if (animating.row < animating.target) {
      animationRef.current = window.setTimeout(() => {
        setAnimating((a) => a && { ...a, row: a.row + 1 });
      }, 40);
    } else {
      // Place the disc in the board
      setBoard((prev) => {
        const newBoard = prev.map((r) => r.slice());
        newBoard[animating.target][animating.col] = animating.color;
        return newBoard;
      });
      setAnimating(null);
      setTimeout(() => {
        setWinner((prevWinner) => {
          const win = checkWinner(
            board.map((r, i) =>
              i === animating.target
                ? r.map((cell, j) =>
                    j === animating.col ? animating.color : cell
                  )
                : r
            )
          );
          if (win) return win;
          setCurrent((c) => (c === PLAYER1 ? PLAYER2 : PLAYER1));
          return prevWinner;
        });
      }, 10);
    }
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [animating]);

  function handleRestart() {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY)));
    setCurrent(PLAYER1);
    setWinner(null);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-blue-200 pt-12">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = "/dashboard"}
      >
        Back to Games
      </button>
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Connect Four</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">
        {winner ? `Player ${winner} wins!` : `Player ${current}'s turn`}
      </div>
      <div className="grid grid-cols-7 gap-2 bg-blue-700 p-3 rounded-xl shadow-lg" style={{ maxWidth: 420, maxHeight: 370, position: 'relative' }}>
        {/* Animated disc */}
        {animating && (
          <div
            className={`w-8 h-8 rounded-full border-2 border-blue-900 z-20 ${animating.color === PLAYER1 ? "bg-red-500" : "bg-yellow-300"}`}
            style={{
              position: 'absolute',
              left: `calc(${animating.col * 10 + animating.col * 2}px + 8px)`,
              top: `calc(${animating.row * 10 + animating.row * 2}px + 8px)`,
              transition: 'top 0.04s linear',
              pointerEvents: 'none',
            }}
          />
        )}
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="w-10 h-10 flex items-center justify-center"
              onClick={() => !winner && !animating && board[0][cIdx] === EMPTY ? drop(cIdx) : undefined}
              style={{ cursor: !winner && !animating && board[0][cIdx] === EMPTY ? "pointer" : "default" }}
            >
              <div className={`w-8 h-8 rounded-full border-2 border-blue-900 ${cell === EMPTY ? "bg-white" : cell === PLAYER1 ? "bg-red-500" : "bg-yellow-300"}`}></div>
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
        Click a column to drop your disc. First to connect four in a row wins!
      </p>
    </div>
  );
}
