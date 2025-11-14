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

export default function TicTacToeComputer() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const speedMap = { easy: 1000, medium: 700, hard: 400 };
  const winner = checkWinner(board);
  const status = winner ? `Winner: ${winner}` : board.every(Boolean) ? "Draw!" : `Next: ${xIsNext ? "X (You)" : "O (Computer)"}`;

  function handleClick(i: number) {
    if (board[i] || winner || !xIsNext) return;
    const newBoard = board.slice();
    newBoard[i] = "X";
    setBoard(newBoard);
    setXIsNext(false);
    setTimeout(() => {
      if (!checkWinner(newBoard) && newBoard.some(cell => !cell)) {
        const aiMove = getAIMove(newBoard, difficulty);
        if (aiMove !== null) {
          newBoard[aiMove] = "O";
          setBoard([...newBoard]);
          setXIsNext(true);
        }
      }
    }, speedMap[difficulty]);
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
      {/* Difficulty options: right side, further down below Back to Selection button */}
      <div className="absolute" style={{top: '200px', right: '74px'}}>
        <div className="flex flex-col items-center justify-center z-20">
          <h2 className="text-xl font-bold mb-4 text-pink-700">Difficulty</h2>
          <div className="flex flex-col gap-4">
            <button className={`px-4 py-2 rounded shadow font-semibold transition ${difficulty === 'easy' ? 'bg-green-400 text-white' : 'bg-white text-green-700 border border-green-400'}`} onClick={() => setDifficulty('easy')} disabled={winner === null && board.some(cell => !cell) && board.some(cell => cell !== null)}>Easy</button>
            <button className={`px-4 py-2 rounded shadow font-semibold transition ${difficulty === 'medium' ? 'bg-yellow-400 text-white' : 'bg-white text-yellow-700 border border-yellow-400'}`} onClick={() => setDifficulty('medium')} disabled={winner === null && board.some(cell => !cell) && board.some(cell => cell !== null)}>Medium</button>
            <button className={`px-4 py-2 rounded shadow font-semibold transition ${difficulty === 'hard' ? 'bg-red-400 text-white' : 'bg-white text-red-700 border border-red-400'}`} onClick={() => setDifficulty('hard')} disabled={winner === null && board.some(cell => !cell) && board.some(cell => cell !== null)}>Hard</button>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-yellow-700 drop-shadow-lg">Play with Computer</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">{status}</div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`w-20 h-20 text-3xl font-bold bg-white rounded shadow hover:bg-pink-100 transition ${cell === 'X' ? 'text-gray-800' : cell === 'O' ? 'text-gray-800' : ''}`}
            onClick={() => handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>
      <button className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition" onClick={handleRestart}>Restart</button>
    </div>
  );
}

function getAIMove(board: string[], difficulty: 'easy' | 'medium' | 'hard') {
  // Easy: pick random available
  if (difficulty === 'easy') {
    const available = board.map((cell, i) => cell ? null : i).filter(i => i !== null) as number[];
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }
  // Medium: block player win, else pick random
  if (difficulty === 'medium') {
    // Block if player can win next
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const copy = board.slice();
        copy[i] = 'X';
        if (checkWinner(copy) === 'X') return i;
      }
    }
    // Otherwise pick random
    const available = board.map((cell, i) => cell ? null : i).filter(i => i !== null) as number[];
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }
  // Hard: use minimax for optimal move
  if (difficulty === 'hard') {
    function minimax(newBoard: string[], isMaximizing: boolean): { score: number, move: number | null } {
      const winner = checkWinner(newBoard);
      if (winner === 'O') return { score: 1, move: null };
      if (winner === 'X') return { score: -1, move: null };
      if (newBoard.every(cell => cell)) return { score: 0, move: null };
      let bestMove: number | null = null;
      let bestScore = isMaximizing ? -Infinity : Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (!newBoard[i]) {
          newBoard[i] = isMaximizing ? 'O' : 'X';
          const result = minimax(newBoard, !isMaximizing);
          newBoard[i] = '';
          if (isMaximizing) {
            if (result.score > bestScore) {
              bestScore = result.score;
              bestMove = i;
            }
          } else {
            if (result.score < bestScore) {
              bestScore = result.score;
              bestMove = i;
            }
          }
        }
      }
      return { score: bestScore, move: bestMove };
    }
    const { move } = minimax(board.slice(), true);
    return move;
  }
  return null;
}
