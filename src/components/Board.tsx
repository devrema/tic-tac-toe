// Board.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Square from './Square';

interface BoardProps {
	playerName: string;
	isXNext: boolean;
	setIsXNext: React.Dispatch<React.SetStateAction<boolean>>;
	setSquares: React.Dispatch<React.SetStateAction<(string | null)[]>>;
	updateStats: (result: 'win' | 'loss' | 'tie') => void;
}

const Board: React.FC<BoardProps> = ({
	playerName,
	isXNext,
	setIsXNext,
	setSquares,
	updateStats,
}) => {
	const [squares, setLocalSquares] = useState<(string | null)[]>(
		Array(9).fill(null)
	);

	const calculateWinner = useCallback(
		(squares: (string | null)[]): string | null => {
			const lines = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6],
			];

			for (let i = 0; i < lines.length; i++) {
				const [a, b, c] = lines[i];
				if (
					squares[a] &&
					squares[a] === squares[b] &&
					squares[a] === squares[c]
				) {
					return squares[a];
				}
			}

			return null;
		},
		[]
	);

	const minimax = useCallback(
		(
			board: (string | null)[],
			depth: number,
			isMaximizing: boolean
		): number => {
			const winner = calculateWinner(board);
			if (winner === 'O') return 10 - depth; // Favor CPU
			if (winner === 'X') return depth - 10; // Favor player
			if (board.every((square) => square !== null)) return 0; // Draw

			let bestScore = isMaximizing ? -Infinity : Infinity;
			for (let i = 0; i < board.length; i++) {
				if (board[i] === null) {
					const newBoard = [...board];
					newBoard[i] = isMaximizing ? 'O' : 'X';
					const score = minimax(newBoard, depth + 1, !isMaximizing);
					bestScore = isMaximizing
						? Math.max(score, bestScore)
						: Math.min(score, bestScore);
				}
			}
			return bestScore;
		},
		[calculateWinner]
	);

	const bestMove = useCallback(
		(board: (string | null)[]): number => {
			let bestScore = -Infinity;
			let move = -1;
			for (let i = 0; i < board.length; i++) {
				if (board[i] === null) {
					const newBoard = [...board];
					newBoard[i] = 'O';
					const score = minimax(newBoard, 0, false);
					if (score > bestScore) {
						bestScore = score;
						move = i;
					}
				}
			}
			return move;
		},
		[minimax]
	);

	const makeComputerMove = useCallback(
		(board: (string | null)[]) => {
			const move = bestMove(board);
			if (move !== -1) {
				const newBoard = [...board];
				newBoard[move] = 'O';
				setTimeout(() => {
					setLocalSquares(newBoard);
					setIsXNext(true); // After CPU move, it should be player’s turn
				}, 500);
			}
		},
		[bestMove, setIsXNext]
	);

	const handleClick = (index: number) => {
		if (calculateWinner(squares) || squares[index] || !isXNext) {
			return;
		}

		const newBoard = [...squares];
		newBoard[index] = 'X';
		setLocalSquares(newBoard);
		setIsXNext(false);
	};

	useEffect(() => {
		setSquares(squares);
	}, [squares, setSquares]);

	useEffect(() => {
		const winner = calculateWinner(squares);
		const isBoardFull = squares.every((square) => square !== null);
		if (winner) {
			updateStats(winner === 'X' ? 'win' : 'loss');
		} else if (isBoardFull) {
			updateStats('tie');
		}
	}, [squares, calculateWinner, updateStats]);

	useEffect(() => {
		if (!isXNext && !calculateWinner(squares)) {
			makeComputerMove(squares);
		}
	}, [isXNext, squares, makeComputerMove, calculateWinner]);

	const winner = calculateWinner(squares);
	const isBoardFull = squares.every((square) => square !== null);
	const status = winner
		? `Winner: ${winner === 'X' ? playerName : 'CPU'}`
		: isBoardFull
		? 'TIE'
		: `Next player: ${isXNext ? playerName : 'CPU'}`;

	return (
		<div className="board">
			<div className="status">{status}</div>
			<div className="board-row">
				{Array(3)
					.fill(null)
					.map((_, i) => (
						<Square key={i} value={squares[i]} onClick={() => handleClick(i)} />
					))}
			</div>
			<div className="board-row">
				{Array(3)
					.fill(null)
					.map((_, i) => (
						<Square
							key={i + 3}
							value={squares[i + 3]}
							onClick={() => handleClick(i + 3)}
						/>
					))}
			</div>
			<div className="board-row">
				{Array(3)
					.fill(null)
					.map((_, i) => (
						<Square
							key={i + 6}
							value={squares[i + 6]}
							onClick={() => handleClick(i + 6)}
						/>
					))}
			</div>
		</div>
	);
};

export default Board;
