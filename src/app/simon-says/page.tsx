"use client";
import React, { useState, useEffect } from "react";

const COLORS = [
  { name: "green", className: "bg-green-400" },
  { name: "red", className: "bg-red-400" },
  { name: "yellow", className: "bg-yellow-300" },
  { name: "blue", className: "bg-blue-400" },
];

export default function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started && !isUserTurn) {
      showSequence();
    }
    // eslint-disable-next-line
  }, [sequence, started]);

  function startGame() {
    setSequence([Math.floor(Math.random() * 4)]);
    setUserStep(0);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setIsUserTurn(false);
  }

  function showSequence() {
    let i = 0;
    setIsUserTurn(false);
    const interval = setInterval(() => {
      setActive(sequence[i]);
      setTimeout(() => setActive(null), 400);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => setIsUserTurn(true), 500);
      }
    }, 700);
  }

  function handleColorClick(idx: number) {
    if (!isUserTurn || gameOver) return;
    setActive(idx);
    setTimeout(() => setActive(null), 200);
    if (sequence[userStep] === idx) {
      if (userStep + 1 === sequence.length) {
        setScore(sequence.length);
        setTimeout(() => {
          setSequence([...sequence, Math.floor(Math.random() * 4)]);
          setUserStep(0);
          setIsUserTurn(false);
        }, 600);
      } else {
        setUserStep(userStep + 1);
      }
    } else {
      setGameOver(true);
      setStarted(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 pt-12 pb-4 overflow-hidden">
      <button className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20" onClick={() => window.location.href = '/dashboard'}>Back to Games</button>
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Simon Says</h1>
      <div className="mb-2 text-lg font-semibold text-gray-700">Repeat the sequence. How far can you go?</div>
      <div className="mb-4 text-xl font-bold text-green-700">Score: {score}</div>
      <div
        className="grid grid-cols-2 grid-rows-2 gap-2 mb-8 w-full max-w-[180px] aspect-square"
      >
        {COLORS.map((color, idx) => (
          <button
            key={color.name}
            className={`w-full h-full rounded-2xl shadow-lg border-4 border-white focus:outline-none transition-all duration-150 ${color.className} ${active === idx ? 'brightness-150 scale-105 ring-4 ring-blue-300' : ''}`}
            style={{ aspectRatio: '1 / 1', minWidth: 0, minHeight: 0 }}
            onClick={() => handleColorClick(idx)}
            aria-label={color.name}
          />
        ))}
      </div>
      <button className="px-3 py-2 bg-green-500 text-white rounded-xl shadow-lg text-base font-bold hover:bg-green-600 transition mb-2" onClick={startGame}>
        {started ? 'Restart' : 'Start'}
      </button>
      {gameOver && (
        <div className="text-2xl font-bold text-red-600 mb-2">Game Over!</div>
      )}
      <p className="text-gray-600 text-center max-w-md mt-4">Watch the sequence, then repeat it by clicking the colored buttons. Each round adds a new color. Try to beat your high score!</p>
    </div>
  );
}
