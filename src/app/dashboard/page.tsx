"use client";
import { useRouter } from "next/navigation";

const games = [
	{
		name: "2048",
		description: "Slide and combine tiles to reach 2048!",
		image: "https://cdn-icons-png.flaticon.com/512/1040/1040231.png",
		route: "/2048/play",
	},
	{
		name: "Sudoku",
		description: "Fill the grid so every row, column, and box contains 1-9!",
		image: "https://cdn-icons-png.flaticon.com/512/1040/1040232.png",
		route: "/sudoku/play",
	},
	{
		name: "Snake",
		description: "Classic snake game with modern UI.",
		image: "https://cdn-icons-png.flaticon.com/512/616/616554.png", // reliable snake icon
		route: "/snake-game",
	},
	{
		name: "Tic Tac Toe",
		description: "Play Tic Tac Toe against a friend.",
		image: "https://cdn-icons-png.flaticon.com/512/616/616490.png",
		route: "/tic-tac-toe",
	},
	{
		name: "Memory Game",
		description:
			"Test your memory skills solo or with a friend. Flip cards and find all pairs!",
		image:
			"https://cdn-icons-png.flaticon.com/512/1055/1055687.png", // updated to a memory/brain icon
		route: "/memory-game",
	},
	{
		name: "Sliding Puzzle",
		description: "Arrange the tiles to complete a new random picture every time!",
		image: "https://cdn-icons-png.flaticon.com/512/1040/1040252.png", // puzzle icon
		route: "/sliding-puzzle",
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
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer"
						onClick={() => router.push(game.route)}
					>
						<img
							src={game.image}
							alt={game.name}
							className="w-20 h-20 mb-4"
						/>
						<h2 className="text-2xl font-semibold mb-2 text-green-700">
							{game.name}
						</h2>
						<p className="text-gray-600 mb-4 text-center">
							{game.description}
						</p>
						<button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
							Play
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
