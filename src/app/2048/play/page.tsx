"use client";
import React, { useState, useEffect } from "react";

const SIZE = 4;

function getEmptyBoard() {
  return Array(SIZE)
    .fill(0)
    .map(() => Array(SIZE).fill(0));
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function addRandomTile(board: number[][]) {
  const empty: [number, number][] = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === 0) empty.push([i, j]);
    }
  }
  if (empty.length === 0) return board;
  const [i, j] = empty[getRandomInt(empty.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function clone(board: number[][]) {
  return board.map((row) => row.slice());
}

function transpose(board: number[][]) {
  return board[0].map((_, i) => board.map((row) => row[i]));
}

function compress(row: number[]) {
  const newRow = row.filter((n) => n !== 0);
  while (newRow.length < SIZE) newRow.push(0);
  return newRow;
}

function merge(row: number[]) {
  let score = 0;
  for (let i = 0; i < SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return { row, score };
}

function moveLeft(board: number[][]) {
  let newBoard = [];
  let score = 0;
  for (let i = 0; i < SIZE; i++) {
    let row = compress(board[i]);
    const merged = merge(row);
    row = compress(merged.row);
    newBoard.push(row);
    score += merged.score;
  }
  return { board: newBoard, score };
}

function moveRight(board: number[][]) {
  let newBoard = [];
  let score = 0;
  for (let i = 0; i < SIZE; i++) {
    let row = compress(board[i].slice().reverse());
    const merged = merge(row);
    row = compress(merged.row);
    newBoard.push(row.reverse());
    score += merged.score;
  }
  return { board: newBoard, score };
}

function moveUp(board: number[][]) {
  let transposed = transpose(board);
  const { board: moved, score } = moveLeft(transposed);
  return { board: transpose(moved), score };
}

function moveDown(board: number[][]) {
  let transposed = transpose(board);
  const { board: moved, score } = moveRight(transposed);
  return { board: transpose(moved), score };
}

function hasMoves(board: number[][]) {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === 0) return true;
      if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return true;
      if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return true;
    }
  }
  return false;
}

export default function Game2048() {
  const [board, setBoard] = useState<number[][] | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize board only on client to avoid hydration mismatch
  useEffect(() => {
    if (board === null) {
      setBoard(addRandomTile(addRandomTile(getEmptyBoard())));
    }
  }, [board]);

  useEffect(() => {
    if (board && !hasMoves(board)) setGameOver(true);
  }, [board]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !board) return;
      let moved = false;
      let newBoard = clone(board);
      let addScore = 0;
      if (e.key === "ArrowLeft") {
        const res = moveLeft(newBoard);
        newBoard = res.board;
        addScore = res.score;
        moved = true;
      } else if (e.key === "ArrowRight") {
        const res = moveRight(newBoard);
        newBoard = res.board;
        addScore = res.score;
        moved = true;
      } else if (e.key === "ArrowUp") {
        const res = moveUp(newBoard);
        newBoard = res.board;
        addScore = res.score;
        moved = true;
      } else if (e.key === "ArrowDown") {
        const res = moveDown(newBoard);
        newBoard = res.board;
        addScore = res.score;
        moved = true;
      }
      if (moved) {
        if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
          setBoard(addRandomTile(newBoard));
          setScore((s) => s + addScore);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameOver]);

  function handleRestart() {
    setBoard(addRandomTile(addRandomTile(getEmptyBoard())));
    setScore(0);
    setGameOver(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 relative">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = '/dashboard'}
      >
        Back to Games
      </button>
      <h1 className="text-4xl font-bold mb-4 text-yellow-700 drop-shadow-lg">2048</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">Score: {score}</div>
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-xl p-4 shadow-lg mb-6 w-full max-w-xs aspect-square">
          {board ? board.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-200 w-full h-full aspect-square ${cell === 0 ? 'bg-gray-200 text-gray-200' : 'bg-yellow-300 text-yellow-900'}`}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          ) : null}
        </div>
      </div>
      <button className="px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition" onClick={handleRestart}>Restart</button>
      <div style={{ minHeight: 28 }} className="flex items-center justify-center w-full">
        {gameOver && (
          <div className="text-2xl font-bold text-red-700">Game Over!</div>
        )}
      </div>
      <p className="text-gray-600 text-center max-w-md mt-2">Use arrow keys to move the tiles. Combine numbers to reach 2048!</p>
    </div>
  );
}
