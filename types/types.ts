export type MineSweeperGame = {
	width: number;
	height: number;
	mineCount: number;
	board: Board;
	status: "won" | "lost" | "playing" | "not started";
	// revealedCount: number;
};

export type Board = Cell[][];

export type Cell = {
	isMine: boolean;
	isRevealed: boolean;
	isFlagged: boolean;
	neighbourBombs: number;
};
