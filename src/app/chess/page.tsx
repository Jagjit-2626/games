"use client";
import React, { useState } from "react";

const BOARD_SIZE = 8;
const EMPTY = null;

// Piece representation: { type: 'K'|'Q'|'R'|'B'|'N'|'P', color: 'w'|'b' }
type PieceType = "k" | "q" | "r" | "b" | "n" | "p";
type Piece = { type: PieceType; color: "w" | "b" } | null;
type Board = Piece[][];

function getInitialBoard(): Board {
  // Rotated board: white starts at left, black at right
  const types: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  return Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => {
      if (c === 0) {
        return { type: types[r], color: "w" };
      }
      if (c === 1) {
        return { type: "p", color: "w" };
      }
      if (c === 6) {
        return { type: "p", color: "b" };
      }
      if (c === 7) {
        return { type: types[r], color: "b" };
      }
      return EMPTY;
    })
  );
}

const PIECE_UNICODE = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

function getPieceSymbol(piece: Piece): string {
  if (!piece) return "";
  return PIECE_UNICODE[piece.color][piece.type];
}

function isSameColor(a: Piece, b: Piece): boolean {
  return a !== null && b !== null && a.color === b.color;
}

function isOpponent(a: Piece, b: Piece): boolean {
  return a !== null && b !== null && a.color !== b.color;
}

function getValidMoves(board: Board, from: [number, number], turnColor: "w" | "b"): [number, number][] {
  // Returns array of [row, col] for valid moves for piece at from
  const [r, c] = from;
  const piece = board[r][c];
  if (!piece || piece.color !== turnColor) return [];
  const moves: [number, number][] = [];
  const directions = {
    n: [
      [
        [r - 1, c - 2],
        [r + 1, c - 2],
        [r - 2, c - 1],
        [r + 2, c - 1],
        [r - 2, c + 1],
        [r + 2, c + 1],
        [r - 1, c + 2],
        [r + 1, c + 2],
      ],
    ],
    k: [
      [
        [r - 1, c - 1],
        [r, c - 1],
        [r + 1, c - 1],
        [r - 1, c],
        [r + 1, c],
        [r - 1, c + 1],
        [r, c + 1],
        [r + 1, c + 1],
      ],
    ],
    b: [
      [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ],
    ],
    r: [
      [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ],
    ],
    q: [
      [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ],
    ],
  };
  if (piece.type === "n") {
    for (const [nr, nc] of directions.n[0]) {
      if (
        nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || isOpponent(piece, board[nr][nc]))
      ) {
        moves.push([nr, nc]);
      }
    }
  } else if (piece.type === "k") {
    for (const [nr, nc] of directions.k[0]) {
      if (
        nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || isOpponent(piece, board[nr][nc]))
      ) {
        moves.push([nr, nc]);
      }
    }
  } else if (piece.type === "b" || piece.type === "r" || piece.type === "q") {
    const dirs = directions[piece.type][0];
    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!board[nr][nc]) {
          moves.push([nr, nc]);
        } else {
          if (isOpponent(piece, board[nr][nc])) moves.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  } else if (piece.type === "p") {
    const dir = piece.color === "w" ? 1 : -1; // white moves right, black moves left
    // Forward
    if (c + dir >= 0 && c + dir < 8 && !board[r][c + dir]) moves.push([r, c + dir]);
    // Double move from start
    if (
      (piece.color === "w" && c === 1) || (piece.color === "b" && c === 6)
    ) {
      if (
        c + dir >= 0 && c + dir < 8 && !board[r][c + dir] &&
        c + 2 * dir >= 0 && c + 2 * dir < 8 && !board[r][c + 2 * dir]
      ) {
        moves.push([r, c + 2 * dir]);
      }
    }
    // Captures (diagonal up/down)
    for (const dr of [-1, 1]) {
      if (
        r + dr >= 0 && r + dr < 8 && c + dir >= 0 && c + dir < 8 &&
        board[r + dr][c + dir] &&
        isOpponent(piece, board[r + dr][c + dir])
      ) {
        moves.push([r + dr, c + dir]);
      }
    }
  }
  // TODO: Add castling, en passant, check/checkmate detection
  // Filter out any moves that are not [number, number] (should always be, but for safety)
  return moves.filter((m): m is [number, number] => Array.isArray(m) && m.length === 2 && typeof m[0] === "number" && typeof m[1] === "number");
}

export default function Chess() {
  const [board, setBoard] = useState<Board>(getInitialBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [whiteTurn, setWhiteTurn] = useState(true);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

  function handleCellClick(row: number, col: number) {
    if (selected) {
      const [fromRow, fromCol] = selected;
      const piece = board[fromRow][fromCol];
      if (!piece || piece.color !== (whiteTurn ? "w" : "b")) {
        setSelected(null);
        setValidMoves([]);
        return;
      }
      const moves = getValidMoves(board, [fromRow, fromCol], whiteTurn ? "w" : "b");
      if (moves.some(([mr, mc]) => mr === row && mc === col)) {
        const newBoard = board.map((r) => r.slice());
        const captured = board[row][col];
        if (captured && captured.color !== piece.color) {
          if (captured.color === "w") setCapturedWhite((prev) => [...prev, captured.type]);
          else setCapturedBlack((prev) => [...prev, captured.type]);
        }
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = EMPTY;
        setBoard(newBoard);
        setWhiteTurn(!whiteTurn);
        setSelected(null);
        setValidMoves([]);
        return;
      }
      setSelected(null);
      setValidMoves([]);
    } else {
      const piece = board[row][col];
      if (piece && piece.color === (whiteTurn ? "w" : "b")) {
        setSelected([row, col]);
        setValidMoves(getValidMoves(board, [row, col], whiteTurn ? "w" : "b"));
      }
    }
  }

  function handleRestart() {
    setBoard(getInitialBoard());
    setSelected(null);
    setWhiteTurn(true);
    setValidMoves([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-green-200 pt-12">
      <button
        className="absolute top-6 right-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-lg font-bold transition z-20"
        onClick={() => window.location.href = "/dashboard"}
      >
        Back to Games
      </button>
      <button
        className="absolute right-80 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition z-20"
        style={{ top: 336 }}
        onClick={handleRestart}
      >
        Restart
      </button>
      <h1 className="text-4xl font-bold mb-4 text-green-700 drop-shadow-lg">Chess</h1>
      <div className="mb-4 text-lg font-semibold text-gray-700">
        {whiteTurn ? "White's turn" : "Black's turn"}
      </div>
      <div className="relative w-full flex justify-center items-start">
        {/* Captured pieces absolutely positioned on the left, always two horizontal rows if more than one */}
        <div className="absolute left-45 top-1/2 -translate-y-1/2 flex flex-col items-end min-w-[60px] z-10" style={{height: 150}}>
          {capturedWhite.length > 0 && (
            <div className="mb-2 flex flex-col items-end">
              <div className="flex flex-row">
                {capturedWhite.slice(0, Math.ceil(capturedWhite.length/2)).map((type, idx) => (
                  <span key={idx} className="text-2xl text-gray-400 mr-1 mb-1">{PIECE_UNICODE.w[type]}</span>
                ))}
              </div>
              {capturedWhite.length > 1 && (
                <div className="flex flex-row mt-1">
                  {capturedWhite.slice(Math.ceil(capturedWhite.length/2)).map((type, idx) => (
                    <span key={idx} className="text-2xl text-gray-400 mr-1 mb-1">{PIECE_UNICODE.w[type]}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {capturedBlack.length > 0 && (
            <div className="flex flex-col items-end">
              <div className="flex flex-row">
                {capturedBlack.slice(0, Math.ceil(capturedBlack.length/2)).map((type, idx) => (
                  <span key={idx} className="text-2xl text-black mr-1 mb-1">{PIECE_UNICODE.b[type]}</span>
                ))}
              </div>
              {capturedBlack.length > 1 && (
                <div className="flex flex-row mt-1">
                  {capturedBlack.slice(Math.ceil(capturedBlack.length/2)).map((type, idx) => (
                    <span key={idx} className="text-2xl text-black mr-1 mb-1">{PIECE_UNICODE.b[type]}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative z-20">
          <div className="grid grid-cols-8 grid-rows-8 gap-0.5 bg-gray-700 p-2 rounded-2xl shadow-2xl border-4 border-green-400 aspect-square mx-auto" style={{ width: 420, height: 420 }}>
            {Array.from({ length: 8 }).map((_, cIdx) =>
              Array.from({ length: 8 }).map((_, rIdx) => {
                const cell = board[rIdx][cIdx];
                const isSelected = selected && selected[0] === rIdx && selected[1] === cIdx;
                const isValid = validMoves.some(([mr, mc]) => mr === rIdx && mc === cIdx);
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`flex items-center justify-center text-2xl sm:text-3xl font-bold select-none border border-gray-500 cursor-pointer transition-all duration-150 aspect-square w-full h-full
                      ${isSelected ? "bg-yellow-300" : isValid ? "bg-green-200" : (rIdx + cIdx) % 2 === 0 ? "bg-green-100" : "bg-white"}
                      ${isValid ? "ring-2 ring-green-500" : ""}
                    `}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                  >
                    {getPieceSymbol(cell) && (
                      <span
                        className={
                          cell && cell.color === "b"
                            ? "text-black"
                            : cell && cell.color === "w"
                            ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                            : ""
                        }
                      >
                        {getPieceSymbol(cell)}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 text-center max-w-md">
        {/* Description removed as requested */}
      </p>
    </div>
  );
}
