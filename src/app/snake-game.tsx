"use client";
import React, { useState, useEffect, useRef } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 100;

function getRandomFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  let food: { x: number; y: number };
  while (true) {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
      return food;
    }
  }
}

export default function SnakeGame() {
  const [started, setStarted] = useState(false);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState<{ x: number; y: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const moveRef = useRef(direction);
  const speedMap = { easy: 200, medium: 100, hard: 50 };

  useEffect(() => {
    if (food === null) {
      setFood(getRandomFood(INITIAL_SNAKE));
    }
  }, [food]);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!started || gameOver || food === null) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };
        // Check collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake = [newHead, ...prev];
        if (food && newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speedMap[difficulty]);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, started, difficulty]);

  useEffect(() => {
    if (!started || gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (moveRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (moveRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (moveRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (moveRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver, started]);

  const handleStart = () => {
    setStarted(true);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  const handleRestart = () => {
    setStarted(false);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  // Add router for navigation
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-blue-300 overflow-hidden relative">
      {/* Go to Games button top right - always visible */}
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => router && router.push('/dashboard')}
      >
        Go to Games
      </button>
      {/* Difficulty options: right side, further down below Go to Games button */}
      <div className="absolute" style={{top: '180px', right: '64px'}}>
        <div className="flex flex-col items-center justify-center z-20">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Difficulty</h2>
          <div className="flex flex-col gap-4">
            <button
              className={`px-4 py-2 rounded shadow font-semibold transition ${difficulty === 'easy' ? 'bg-green-400 text-white' : 'bg-white text-green-700 border border-green-400'}`}
              onClick={() => setDifficulty('easy')}
              disabled={started && !gameOver}
            >
              Easy
            </button>
            <button
              className={`px-4 py-2 rounded shadow font-semibold transition ${difficulty === 'medium' ? 'bg-yellow-400 text-white' : 'bg-white text-yellow-700 border border-yellow-400'}`}
              onClick={() => setDifficulty('medium')}
              disabled={started && !gameOver}
            >
              Medium
            </button>
            <button
              className={`px-4 py-2 rounded shadow font-semibold transition ${difficulty === 'hard' ? 'bg-red-400 text-white' : 'bg-white text-red-700 border border-red-400'}`}
              onClick={() => setDifficulty('hard')}
              disabled={started && !gameOver}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full md:w-auto">
        <h1 className="text-4xl font-bold mb-4 text-green-700 drop-shadow-lg">Snake Game</h1>
        <div className="mb-2 text-lg font-semibold text-gray-700">Score: {score}</div>
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 'min(90vw, 90vh)',
            height: 'min(90vw, 90vh)',
            maxWidth: 800,
            maxHeight: 420,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            overflow: 'hidden',
          }}
        >
          {/* Show Start button before game starts */}
          {!started && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-xl z-10">
              <button
                className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 text-xl font-bold transition"
                onClick={handleStart}
              >
                Start Game
              </button>
            </div>
          )}
          {/* Snake */}
          {started && snake.map((segment, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full ${idx === 0 ? "bg-green-600" : "bg-green-400"}`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                boxShadow: idx === 0 ? "0 0 8px 2px #16a34a" : "none",
                zIndex: idx === 0 ? 2 : 1,
              }}
            />
          ))}
          {/* Food */}
          {started && food && (
            <div
              className="absolute bg-red-500 rounded-full border-2 border-white"
              style={{
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                zIndex: 3,
                boxShadow: "0 0 8px 2px #ef4444",
              }}
            />
          )}
          {/* Overlay for Game Over */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-xl z-10">
              <div className="text-2xl font-bold text-white mb-2">Game Over</div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition mb-2"
                onClick={handleStart}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
        <p className="mt-6 text-gray-600 text-center max-w-md">Use arrow keys to control the snake. Eat the red food to grow and score points. Avoid hitting the walls or yourself!</p>
      </div>
    </div>
  );
}
