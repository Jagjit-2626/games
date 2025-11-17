"use client";
import { useRouter } from "next/navigation";

const games = [
	{
		name: "Chess",
		description: "Classic chess with full rules and a modern UI!",
		image: "emoji",
		route: "/chess",
	},
	{
		name: "Sliding Puzzle",
		description: "Choose picture or numbers mode for the sliding puzzle!",
		image: "emoji", // use emoji instead of image URL
		route: "/sliding-puzzle/select-mode",
	},
	{
		name: "2048",
		description: "Slide and combine tiles to reach 2048!",
		image: "emoji", // use emoji instead of image URL
		route: "/2048/play",
	},
	{
		name: "Snake",
		description: "Classic snake game with modern UI.",
		image: "emoji", // use emoji instead of image URL
		route: "/snake-game",
	},
	{
		name: "Tic Tac Toe",
		description: "Play Tic Tac Toe against a friend.",
		image: "emoji", // use emoji instead of image URL
		route: "/tic-tac-toe",
	},
	{
		name: "Memory Game",
		description:
			"Test your memory skills solo or with a friend. Flip cards and find all pairs!",
		image: "emoji", // use emoji instead of image URL
		route: "/memory-game",
	},
	{
		name: "Simon Says",
		description: "Repeat the color sequence. Test your memory!",
		image: "emoji", // use emoji instead of image URL
		route: "/simon-says",
	},
	{
		name: "Connect Four",
		description: "Drop discs to connect four in a row before your opponent!",
		image: "emoji",
		route: "/connect-four",
	},
	{
		name: "Minesweeper",
		description: "Reveal all safe cells and avoid the mines! Flag suspected bombs.",
		image: "emoji",
		route: "/minesweeper",
	},
	{
		name: "Hangman",
		description: "Guess the word, one letter at a time. Can you save the stick figure?",
		image: "emoji",
		route: "/hangman",
	},
	{
		name: "Tetris",
		description: "Stack falling blocks and clear lines in this classic puzzle game!",
		image: "emoji",
		route: "/tetris",
	},
	// Add more games here
];

export default function Dashboard() {
	const router = useRouter();
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-green-200 pt-12 pb-12">
			<h1 className="text-5xl font-bold mb-2 text-blue-700 drop-shadow-lg">
				Welcome Aboard
			</h1>
			<div className="text-xl font-medium mb-8 text-blue-600 text-center">
				Your personal game arena
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
				{games.map((game) => (
					<div
						key={game.name}
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer h-80"
						onClick={() => router.push(game.route)}
					>
						{game.name === "Snake" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="snake"
							>
								🐍
							</span>
						) : game.name === "Tic Tac Toe" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="tic tac toe"
							>
								❌⭕
							</span>
						) : game.name === "Memory Game" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="memory"
							>
								🧠
							</span>
						) : game.name === "Sliding Puzzle" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="sliding puzzle"
							>
								🧩
							</span>
						) : game.name === "2048" ? (
							<span className="text-6xl mb-4" role="img" aria-label="2048">
								🔢
							</span>
						) : game.name === "Simon Says" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="simon says"
							>
								🟩
							</span>
						) : game.name === "Connect Four" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="connect four"
							>
								🟡🔴
							</span>
						) : game.name === "Minesweeper" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="minesweeper"
							>
								💣
							</span>
						) : game.name === "Chess" ? (
							<span
								className="text-6xl mb-4 text-black"
								role="img"
								aria-label="chess"
							>
								♔♛
							</span>
						) : game.name === "Hangman" ? (
							<span
								className="text-6xl mb-4"
								role="img"
								aria-label="hangman"
							>
								🪢
							</span>
						) : game.name === "Tetris" ? (
							<span
								className="flex flex-row gap-0 justify-center items-center mb-4"
								role="img"
								aria-label="tetris"
								style={{
									fontSize: "2.2rem",
									letterSpacing: "-0.3rem",
									width: "fit-content",
									margin: "0 auto",
								}}
							>
								🟦🟦🟦🟦
							</span>
						) : (
							<img
								src={game.image}
								alt={game.name}
								className="w-20 h-20 mb-4"
							/>
						)}
						<h2 className="text-2xl font-semibold mb-2 text-green-700">
							{game.name}
						</h2>
						<p className="text-gray-600 mb-4 text-center flex-1">
							{game.description}
						</p>
						<div className="mt-auto w-full flex justify-center">
							<button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
								Play
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
