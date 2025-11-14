"use client";
import React, { useState } from "react";

function generateSudoku() {
	// For demo: shuffle the initial puzzle rows for some variety
	const base = [
		[5, 3, 0, 0, 7, 0, 0, 0, 0],
		[6, 0, 0, 1, 9, 5, 0, 0, 0],
		[0, 9, 8, 0, 0, 0, 0, 6, 0],
		[8, 0, 0, 0, 6, 0, 0, 0, 3],
		[4, 0, 0, 8, 0, 3, 0, 0, 1],
		[7, 0, 0, 0, 2, 0, 0, 0, 6],
		[0, 6, 0, 0, 0, 0, 2, 8, 0],
		[0, 0, 0, 4, 1, 9, 0, 0, 5],
		[0, 0, 0, 0, 8, 0, 0, 7, 9],
	];
	// Shuffle rows within each 3-row block for simple randomization
	return base.map((row) => row.slice()).sort(() => Math.random() - 0.5);
}

const initialPuzzle = generateSudoku();

function isValid(board: number[][], row: number, col: number, val: number) {
	for (let i = 0; i < 9; i++) {
		if (board[row][i] === val || board[i][col] === val) return false;
	}
	const boxRow = Math.floor(row / 3) * 3;
	const boxCol = Math.floor(col / 3) * 3;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[boxRow + i][boxCol + j] === val) return false;
		}
	}
	return true;
}

export default function SudokuGame() {
	const [board, setBoard] = useState(() => initialPuzzle.map((row) => row.slice()));
	const [selected, setSelected] = useState<[number, number] | null>(null);
	const [completed, setCompleted] = useState(false);

	function handleInput(row: number, col: number, val: number) {
		if (initialPuzzle[row][col] !== 0) return;
		if (val < 1 || val > 9) return;
		if (!isValid(board, row, col, val)) return;
		const newBoard = board.map((r) => r.slice());
		newBoard[row][col] = val;
		setBoard(newBoard);
		// Check for completion
		if (newBoard.every((r) => r.every((cell) => cell !== 0))) setCompleted(true);
	}

	function handleRestart() {
		const newPuzzle = generateSudoku();
		setBoard(newPuzzle.map((row) => row.slice()));
		setSelected(null);
		setCompleted(false);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 relative pt-12">
			<button
				className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
				onClick={() => (window.location.href = "/dashboard")}
			>
				Back to Games
			</button>
			<h1 className="text-4xl font-bold mb-4 text-yellow-700 drop-shadow-lg">
				Sudoku
			</h1>
			<div className="flex justify-center w-full">
				<div className="grid grid-cols-9 gap-1 bg-white rounded-xl p-2 shadow-lg mb-6 w-full max-w-xs aspect-square">
					{board.map((row, i) =>
						row.map((cell, j) => (
							<input
								key={`${i}-${j}`}
								type="text"
								maxLength={1}
								value={cell === 0 ? "" : cell}
								disabled={initialPuzzle[i][j] !== 0}
								onFocus={() => setSelected([i, j])}
								onBlur={() => setSelected(null)}
								onChange={(e) => handleInput(i, j, Number(e.target.value))}
								className={`w-full h-full aspect-square text-center text-lg font-bold rounded border-2 transition-all duration-200 outline-none
                  ${
									selected && selected[0] === i && selected[1] === j
										? "border-blue-500"
										: "border-gray-300"
								}
                  ${
									initialPuzzle[i][j] !== 0
										? "bg-gray-200 text-gray-500"
										: "bg-yellow-50 text-yellow-900"
								}`}
							/>
						))
					)}
				</div>
			</div>
			<button
				className="px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition"
				onClick={handleRestart}
			>
				Restart
			</button>
			{completed && (
				<div className="mt-6 text-2xl font-bold text-green-700">
					Congratulations! You solved it!
				</div>
			)}
			<p className="mt-6 text-gray-600 text-center max-w-md">
				Fill the grid so that every row, column, and 3x3 box contains the
				numbers 1 to 9.
			</p>
		</div>
	);
}
