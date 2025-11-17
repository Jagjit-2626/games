"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Tetris constants
const ROWS = 15; // 420px height
const COLS = 15; // square, wide look
const BLOCK_SIZE = 28; // px
const COLORS = [
  "bg-gray-200", // empty
  "bg-cyan-400", // I
  "bg-yellow-300", // O
  "bg-purple-500", // T
  "bg-green-500", // S
  "bg-red-500", // Z
  "bg-blue-500", // J
  "bg-orange-400", // L
];

// Tetromino shapes (I, O, T, S, Z, J, L)
const SHAPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ],
];

function randomPiece() {
  const type = Math.floor(Math.random() * 7) + 1;
  // Center spawn for 4-wide pieces
  return { type, shape: SHAPES[type], row: 0, col: Math.floor(COLS / 2) - 2 };
}

function rotate(shape: number[][]) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function checkCollision(board: number[][], shape: number[][], row: number, col: number) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const br = row + r;
        const bc = col + c;
        if (br < 0 || br >= ROWS || bc < 0 || bc >= COLS || board[br][bc]) {
          return true;
        }
      }
    }
  }
  return false;
}

function placePiece(board: number[][], shape: number[][], row: number, col: number, type: number) {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        newBoard[row + r][col + c] = type;
      }
    }
  }
  return newBoard;
}

function clearLines(board: number[][]) {
  let lines = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== 0)) {
      lines++;
      return false;
    }
    return true;
  });
  while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(0));
  return { newBoard, lines };
}

export default function Tetris() {
  // State initialization (do not use Math.random() directly)
  const [board, setBoard] = useState<number[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState<any>(null);
  const [next, setNext] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const dropTime = Math.max(100, 600 - (level - 1) * 60);
  const requestRef = useRef<number | null>(null);
  const lastDrop = useRef(Date.now());

  // Initialize random pieces only on client
  useEffect(() => {
    if (piece === null && next === null) {
      const first = randomPiece();
      const second = randomPiece();
      setPiece(first);
      setNext(second);
    }
    // eslint-disable-next-line
  }, []);

  // Handle keyboard
  useEffect(() => {
    if (!started || gameOver) return;
    function handle(e: KeyboardEvent) {
      if (gameOver) return;
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "Space"].includes(e.key)) e.preventDefault();
      let { row, col, shape, type } = piece;
      if (e.key === "ArrowLeft") {
        if (!checkCollision(board, shape, row, col - 1)) setPiece((p: typeof piece) => ({ ...p, col: p.col - 1 }));
      } else if (e.key === "ArrowRight") {
        if (!checkCollision(board, shape, row, col + 1)) setPiece((p: typeof piece) => ({ ...p, col: p.col + 1 }));
      } else if (e.key === "ArrowDown") {
        if (!checkCollision(board, shape, row + 1, col)) setPiece((p: typeof piece) => ({ ...p, row: p.row + 1 }));
      } else if (e.key === "ArrowUp") {
        const rotated = rotate(shape);
        if (!checkCollision(board, rotated, row, col)) setPiece((p: typeof piece) => ({ ...p, shape: rotated }));
      } else if (e.key === " " || e.key === "Space") {
        // Hard drop
        let dropRow = row;
        while (!checkCollision(board, shape, dropRow + 1, col)) dropRow++;
        setPiece((p: typeof piece) => ({ ...p, row: dropRow }));
      }
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [piece, board, gameOver, started]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;
    function loop() {
      if (Date.now() - lastDrop.current > dropTime) {
        let { row, col, shape, type } = piece;
        if (!checkCollision(board, shape, row + 1, col)) {
          setPiece((p: typeof piece) => ({ ...p, row: p.row + 1 }));
        } else {
          // Place piece
          const newBoard = placePiece(board, shape, row, col, type);
          const { newBoard: cleared, lines: clearedLines } = clearLines(newBoard);
          setBoard(cleared);
          setScore(s => s + [0, 40, 100, 300, 1200][clearedLines] * level);
          setLines(l => l + clearedLines);
          if (lines + clearedLines >= level * 10) setLevel(l => l + 1);
          // New piece
          const newPiece = { ...next, row: 0, col: Math.floor(COLS / 2) - 2 };
          if (checkCollision(cleared, newPiece.shape, newPiece.row, newPiece.col)) {
            setGameOver(true);
            setStarted(false);
          } else {
            setPiece(newPiece);
            setNext(randomPiece());
          }
        }
        lastDrop.current = Date.now();
      }
      requestRef.current = requestAnimationFrame(loop);
    }
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
    // eslint-disable-next-line
  }, [piece, board, next, gameOver, level, started]);

  function startGame() {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    const first = randomPiece();
    const second = randomPiece();
    setPiece(first);
    setNext(second);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setStarted(true);
  }

  function restart() {
    startGame();
  }

  // Render board with current piece
  if (!piece || !next) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">Loading...</div>;
  }

  const display = board.map((row: number[], r: number) =>
    row.map((cell: number, c: number) => {
      let val = cell;
      // Overlay current piece
      if (!gameOver) {
        for (let pr = 0; pr < piece.shape.length; pr++) {
          for (let pc = 0; pc < piece.shape[pr].length; pc++) {
            if (
              piece.shape[pr][pc] &&
              r === piece.row + pr &&
              c === piece.col + pc
            ) {
              val = piece.type;
            }
          }
        }
      }
      return (
        <div
          key={`${r}-${c}`}
          className={`w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] ${COLORS[val]} rounded-sm ${val !== 0 ? 'border border-black/30' : 'border border-blue-100'}`}
        />
      );
    })
  );

  // Render next piece in a 4x4 grid, centered
  const PREVIEW_SIZE = 4;
  const previewGrid = Array.from({ length: PREVIEW_SIZE }, (_, r) =>
    Array.from({ length: PREVIEW_SIZE }, (_, c) => 0)
  );
  // Place the next.shape in the previewGrid, centered
  if (next && next.shape) {
    const shapeRows = next.shape.length;
    const shapeCols = next.shape[0].length;
    const rowOffset = Math.floor((PREVIEW_SIZE - shapeRows) / 2);
    const colOffset = Math.floor((PREVIEW_SIZE - shapeCols) / 2);
    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (next.shape[r][c]) {
          previewGrid[rowOffset + r][colOffset + c] = next.type;
        }
      }
    }
  }

  const nextPreview = (
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(${PREVIEW_SIZE}, ${BLOCK_SIZE}px)`,
        gridTemplateColumns: `repeat(${PREVIEW_SIZE}, ${BLOCK_SIZE}px)`,
        gap: "1px",
        backgroundColor: "#e0e7ff",
        borderRadius: "0.375rem",
        overflow: "hidden",
      }}
    >
      {previewGrid.flatMap((row: number[], r: number) =>
        row.map((value: number, c: number) =>
          value ? (
            <div
              key={`next-${r}-${c}`}
              className={`w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] ${COLORS[value]} rounded-sm border border-black/30`}
            />
          ) : (
            <div
              key={`next-${r}-${c}`}
              className={`w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] bg-transparent`}
            />
          )
        )
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 pt-12 relative">
      <button
        className="absolute top-6 left-8 px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 text-lg font-bold transition z-10"
        onClick={startGame}
      >
        {started ? 'New Game' : 'Start'}
      </button>
      <Link href="/dashboard">
        <button className="absolute top-6 right-8 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-10">
          Back to games
        </button>
      </Link>
      {/* Info panel absolutely positioned below back button on right for md+ */}
      <div className="hidden md:flex flex-col items-start min-w-[140px] max-w-[200px] min-h-[220px] absolute top-30 right-12 z-10 bg-white bg-opacity-80 rounded-xl shadow-lg p-4 gap-2 border border-purple-200">
        <div className="text-lg font-semibold text-purple-700">Next</div>
        <div className="flex flex-col items-center">{nextPreview}</div>
        <div className="mt-2 text-lg font-semibold text-purple-700">Score</div>
        <div className="text-2xl font-bold text-gray-800">{score}</div>
        <div className="mt-2 text-lg font-semibold text-purple-700">Level</div>
        <div className="text-xl font-bold text-gray-800">{level}</div>
        <div className="mt-2 text-lg font-semibold text-purple-700">Lines</div>
        <div className="text-xl font-bold text-gray-800">{lines}</div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-purple-700 drop-shadow-lg">Tetris</h1>
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full max-w-4xl">
        <div className="flex flex-col items-center">
          <div
            className="grid relative"
            style={{
              gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`,
              gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
              background: "#e0e7ff",
              borderRadius: 12,
              boxShadow: "0 2px 16px #141313",
              height: '420px',
              width: `${COLS * BLOCK_SIZE}px`,
              maxWidth: '100%',
            }}
          >
            {display.flat()}
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                <div className="text-4xl md:text-5xl font-extrabold text-red-600 drop-shadow-lg bg-white/80 rounded-xl px-8 py-6 border-2 border-red-300">Game Over</div>
              </div>
            )}
          </div>
        </div>
        {/* Info panel removed from here, now absolutely positioned above */}
      </div>
      <div className="mt-8 text-gray-500 text-center text-sm max-w-xl">
        Controls: <b>←</b> left, <b>→</b> right, <b>↓</b> down, <b>↑</b> rotate, <b>Space</b> hard drop
      </div>
    </div>
  );
}
