import { Board, Cell, MineSweeperGame } from "../types/types";
const MIN_WIDTH_AND_HEIGHT = 5;
export function createMineSweeperGame(
	width: number,
	height: number,
	mineCount: number,
): MineSweeperGame {
	// input check
	if (width < MIN_WIDTH_AND_HEIGHT || height < MIN_WIDTH_AND_HEIGHT) {
		throw new Error(
			`Board size should be at least ${MIN_WIDTH_AND_HEIGHT}x${MIN_WIDTH_AND_HEIGHT}`,
		);
	}
	if (mineCount < 1) {
		throw new Error(`Mine count should be at least 1`);
	} else if (mineCount > width * height) {
		throw new Error(`Mine count should be less than ${width * height}`);
	}
	// check wether both width, height and minecount are integers
	if (
		!Number.isSafeInteger(width) ||
		!Number.isSafeInteger(height) ||
		!Number.isSafeInteger(mineCount)
	) {
		{
			throw new Error(`Width, height and minecount should be integers`);
		}
	}

	// create grid
	const board: Board = [];
	let cells: Cell[] = Array.from({ length: width * height }, (_, i) => ({
		isMine: false,
		isRevealed: false,
		isFlagged: false,
		neighbourBombs: 0,
	}));

	for (let i = 0; i < height; i++) {
		board.push(cells.slice(i * width, (i + 1) * width));
	}

	return {
		width,
		height,
		mineCount,
		board,
		status: "not started",
	};
}
function isInputValid(game: MineSweeperGame, x: number, y: number): boolean {
	if (x < 0 || x >= game.board.length || y < 0 || y >= game.board[0].length) {
		console.log("Invalid cell coordinates");
		return false;
	}
	return true;
}
function isGameOver(game: MineSweeperGame): boolean {
	if (game.status === "won" || game.status === "lost") {
		console.log("Game is over");
		return true;
	} else {
		return false;
	}
}

function checkIsWon(game: MineSweeperGame): MineSweeperGame {
	const { board, width, height } = game;
	let isWon = true;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			let cell = board[i][j];
			if (!cell.isMine && !cell.isRevealed) {
				isWon = false;
				break;
			}
		}
	}
	if (isWon) {
		game.status = "won";
	}
	return game;
}
export function clickCell(
	game: MineSweeperGame,
	x: number,
	y: number,
): MineSweeperGame {
	if (isGameOver(game)) return game;
	if (!isInputValid(game, x, y)) {
		return game;
	}
	if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
		console.log("Coordinates should be integers");
		return game;
	}
	const { board, mineCount, width, height } = game;

	let cell = board[x][y];
	if (cell.isRevealed) {
		console.log("Cell already revealed");
		return game;
	}
	if (cell.isFlagged) {
		console.log("Cell is flagged");
		return game;
	}
	// if game has not started, place mines and count neighbour bombs
	if (game.status === "not started") {
		// place mines
		let minesPlaced = 0;
		while (minesPlaced < mineCount) {
			let randX = Math.floor(Math.random() * width);
			let randY = Math.floor(Math.random() * height);
			// check if mine is not placed on the clicked cell
			if (randX === x && randY === y) continue;
			if (!board[randX][randY].isMine) {
				board[randX][randY].isMine = true;
				minesPlaced++;
			}
		}
		// count neighbour bombs
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				let cell = board[i][j];
				if (!cell.isMine) {
					let count = 0;
					for (let x = -1; x <= 1; x++) {
						for (let y = -1; y <= 1; y++) {
							// check if neighbour is not out of bounds
							if (i + x >= 0 && i + x < height && j + y >= 0 && j + y < width) {
								if (board[i + x][j + y].isMine) {
									count++;
								}
							}
						}
					}
					cell.neighbourBombs = count;
				}
			}
		}
		game.status = "playing";
		return game;
	}

	if (cell.isMine) {
		console.log("Game over");
		game.status = "lost";
		cell.isRevealed = true;
		return game;
	} else {
		// cell.isRevealed = true;
		// check all neighbours
		if (cell.neighbourBombs === 0) {
			revealAllCellWithNoNeighbourBombs(game, x, y);
		}
	}
	return checkIsWon(game);
}

function revealAllCellWithNoNeighbourBombs(
	game: MineSweeperGame,
	x: number,
	y: number,
): void {
	const { board, width, height } = game;
	let cell = board[x][y];
	if (cell.isRevealed) return;
	cell.isRevealed = true;
	if (cell.neighbourBombs === 0) {
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				// check if neighbour is not out of bounds
				if (x + i >= 0 && x + i < height && y + j >= 0 && y + j < width) {
					revealAllCellWithNoNeighbourBombs(game, x + i, y + j);
				}
			}
		}
	}
}

// export function flagCell(
// 	game: MineSweeperGame,
// 	x: number,
// 	y: number,
// ): MineSweeperGame {
// 	if (isGameOver(game)) return game;

// 	if (!isInputValid(game, x, y)) {
// 		return game;
// 	}

// 	const { board } = game;
// 	let cell = board[x][y];
// 	cell.isFlagged = !cell.isFlagged;
// 	return game;
// }
