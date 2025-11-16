"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const WORDS = [
  "javascript", "hangman", "nextjs", "vercel", "tailwind", "react", "typescript", "modern", "deploy", "github"
];

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

const MAX_WRONG = 6;

// Use a random word and clue from an online API or a large set
// For demo, use a random word API and a fallback clue
const FALLBACK_WORDS = [
  { word: "javascript", clue: "A popular programming language for the web" },
  { word: "hangman", clue: "The name of this classic guessing game" },
  { word: "nextjs", clue: "A React framework for server-side rendering" },
  { word: "vercel", clue: "The company behind Next.js and a popular hosting platform" },
  { word: "tailwind", clue: "A utility-first CSS framework" },
  { word: "react", clue: "A JavaScript library for building UIs" },
  { word: "typescript", clue: "A superset of JavaScript with static typing" },
  { word: "modern", clue: "Opposite of old-fashioned" },
  { word: "deploy", clue: "To launch an app to production" },
  { word: "github", clue: "A platform for hosting and collaborating on code" },
];

function getRandomFallback() {
  return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
}

// Fetch a random word and clue from APIs, retry until a clue is found (max 5 tries), fallback to local
async function fetchWordAndClueWithRetry(setWord: (w: string) => void, setClue: (c: string) => void, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch("https://random-word-api.herokuapp.com/word?number=1");
      const data = await res.json();
      const randomWord = data[0].toUpperCase();
      // Fetch definition as clue
      try {
        const defRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord.toLowerCase()}`);
        const defData = await defRes.json();
        if (Array.isArray(defData) && defData[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
          setWord(randomWord);
          setClue(defData[0].meanings[0].definitions[0].definition);
          return;
        }
      } catch {}
    } catch {}
  }
  // Fallback to local list
  const fallback = getRandomFallback();
  setWord(fallback.word.toUpperCase());
  setClue(fallback.clue);
}

export default function Hangman() {
  const [word, setWord] = useState("");
  const [clue, setClue] = useState("");
  const [guessed, setGuessed] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  useEffect(() => {
    fetchWordAndClueWithRetry(setWord, setClue);
  }, []);

  function guess(letter: string) {
    if (status !== "playing" || guessed.includes(letter)) return;
    setGuessed((g) => [...g, letter]);
    if (!word.includes(letter)) {
      setWrong((w) => {
        const newWrong = w + 1;
        if (newWrong >= MAX_WRONG) setStatus("lost");
        return newWrong;
      });
    } else {
      const allGuessed = word.split("").every((l) => guessed.includes(l) || l === letter);
      if (allGuessed) setStatus("won");
    }
  }

  function reset() {
    setGuessed([]);
    setWrong(0);
    setStatus("playing");
    fetchWordAndClueWithRetry(setWord, setClue);
  }

  // Always show first and last letter, show underscore for others
  const displayWord = word.split("").map((l, i, arr) => (
    <span
      key={i}
      className="inline-block w-8 border-b-2 border-blue-500 text-2xl mx-1 text-center text-blue-700 bg-blue-100 rounded"
      style={{ minHeight: 40 }}
    >
      {(i === 0 || i === arr.length - 1 || guessed.includes(l) || status === "lost") ? l : "_"}
    </span>
  ));

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100 pt-12 relative">
      <Link href="/dashboard">
        <button className="absolute top-6 right-8 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 font-semibold z-10">
          Back to games
        </button>
      </Link>
      {/* Clue container absolutely positioned below back button on right for md+ */}
      <div className="hidden md:flex flex-col items-start min-w-[160px] max-w-[200px] min-h-[110px] absolute top-55 right-8 z-10">
        <div className="text-md font-semibold text-blue-700 mb-2">Clue:</div>
        <div className="text-gray-800 text-lg bg-blue-50 rounded px-3 py-3 shadow border border-blue-200 w-full h-full flex items-start">
          {clue === "No clue available for this word. Try your best!" ? (
            <span className="italic text-gray-500">No clue available for this word. Try your best!</span>
          ) : clue}
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-blue-700 drop-shadow-lg">Hangman</h1>
      <div className="mb-2 text-lg text-gray-700">Guess the word, one letter at a time!</div>
      {/* Centered main game area below title */}
      <div className="w-full flex flex-col items-center justify-center max-w-2xl mx-auto">
        <svg width="120" height="120" className="mb-4">
          {/* Gallows and hangman SVG */}
          <line x1="10" y1="120" x2="110" y2="120" stroke="#888" strokeWidth="6" />
          <line x1="40" y1="120" x2="40" y2="20" stroke="#888" strokeWidth="6" />
          <line x1="40" y1="20" x2="90" y2="20" stroke="#888" strokeWidth="6" />
          <line x1="90" y1="20" x2="90" y2="48" stroke="#888" strokeWidth="6" />
          {/* Head */}
          {wrong > 0 && <circle cx="90" cy="60" r="12" stroke="#333" strokeWidth="3" fill="#fff" />}
          {/* Body */}
          {wrong > 1 && <line x1="90" y1="72" x2="90" y2="100" stroke="#333" strokeWidth="3" />}
          {/* Left Arm */}
          {wrong > 2 && <line x1="90" y1="78" x2="75" y2="98" stroke="#333" strokeWidth="3" />}
          {/* Right Arm */}
          {wrong > 3 && <line x1="90" y1="78" x2="105" y2="98" stroke="#333" strokeWidth="3" />}
          {/* Left Leg */}
          {wrong > 4 && <line x1="90" y1="100" x2="80" y2="115" stroke="#333" strokeWidth="3" />}
          {/* Right Leg */}
          {wrong > 5 && <line x1="90" y1="100" x2="100" y2="115" stroke="#333" strokeWidth="3" />}
        </svg>
        <div className="mb-4 flex flex-row justify-center w-full">{displayWord}</div>
        {/* Centered keyboard, reduced gap */}
        <div className="mb-2 flex flex-col items-center w-full gap-1">
          <div className="flex flex-row justify-center gap-1">
            {alphabet.slice(0, 9).map((l) => (
              <button
                key={l}
                className={`w-8 h-8 rounded text-lg font-bold border border-gray-400 transition text-black ${guessed.includes(l) ? "bg-gray-300" : "bg-white hover:bg-blue-200"}`}
                onClick={() => guess(l)}
                disabled={guessed.includes(l) || status !== "playing"}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-row justify-center gap-1">
            {alphabet.slice(9, 18).map((l) => (
              <button
                key={l}
                className={`w-8 h-8 rounded text-lg font-bold border border-gray-400 transition text-black ${guessed.includes(l) ? "bg-gray-300" : "bg-white hover:bg-blue-200"}`}
                onClick={() => guess(l)}
                disabled={guessed.includes(l) || status !== "playing"}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-row justify-center gap-1">
            {alphabet.slice(18).map((l) => (
              <button
                key={l}
                className={`w-8 h-8 rounded text-lg font-bold border border-gray-400 transition text-black ${guessed.includes(l) ? "bg-gray-300" : "bg-white hover:bg-blue-200"}`}
                onClick={() => guess(l)}
                disabled={guessed.includes(l) || status !== "playing"}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-2 text-lg font-semibold text-gray-700">
          Wrong guesses: <span className="text-black">{wrong}</span> / <span className="text-black">{MAX_WRONG}</span>
        </div>
        {status === "won" && <div className="text-green-600 font-bold text-xl">You won! 🎉</div>}
        {status === "lost" && <div className="text-red-600 font-bold text-xl">You lost! The word was: {word}</div>}
        <button className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 font-bold" onClick={reset}>
          Restart
        </button>
      </div>
      {/* Remove clue from here, now absolutely positioned above */}
    </div>
  );
}
