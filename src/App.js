import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
	return (
		<button className={`square ${isWinning ? "winning" : ""}`} onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
	function handleClick(i) {
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		const nextSquares = squares.slice();
		nextSquares[i] = xIsNext ? "X" : "O";
		onPlay(nextSquares, i);
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else if (squares.every((square) => square !== null)) {
		status = "Draw! No winner.";
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	// Use loops to create the board instead of hardcoding
	const boardRows = [];
	for (let row = 0; row < 3; row++) {
		const squaresInRow = [];
		for (let col = 0; col < 3; col++) {
			const index = row * 3 + col;
			squaresInRow.push(
				<Square
					key={index}
					value={squares[index]}
					onSquareClick={() => handleClick(index)}
					isWinning={winningSquares && winningSquares.includes(index)}
				/>
			);
		}
		boardRows.push(
			<div key={row} className="board-row">
				{squaresInRow}
			</div>
		);
	}

	return (
		<>
			<div className="status">{status}</div>
			{boardRows}
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([{ squares: Array(9).fill(null), move: null }]);
	const [currentMove, setCurrentMove] = useState(0);
	const [isAscending, setIsAscending] = useState(true);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove].squares;

	function handlePlay(nextSquares, moveIndex) {
		const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, move: moveIndex }];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	function toggleSort() {
		setIsAscending(!isAscending);
	}

	const moves = history.map((step, move) => {
		let description;

		if (move === currentMove) {
			// For current move, show text instead of button
			description = move > 0 ? `You are at move #${move}` : "You are at game start";

			// Add location if not the first move
			if (move > 0 && step.move !== null) {
				const row = Math.floor(step.move / 3) + 1;
				const col = (step.move % 3) + 1;
				description += ` (${row}, ${col})`;
			}

			return (
				<li key={move}>
					<span className="current-move">{description}</span>
				</li>
			);
		} else {
			if (move > 0) {
				const row = Math.floor(step.move / 3) + 1;
				const col = (step.move % 3) + 1;
				description = `Go to move #${move} (${row}, ${col})`;
			} else {
				description = "Go to game start";
			}

			return (
				<li key={move}>
					<button onClick={() => jumpTo(move)}>{description}</button>
				</li>
			);
		}
	});

	// Sort moves based on isAscending
	const sortedMoves = isAscending ? moves : [...moves].reverse();

	const winningLine = calculateWinner(currentSquares);
	const winningSquares = winningLine ? getWinningSquares(currentSquares) : null;

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
			</div>
			<div className="game-info">
				<button onClick={toggleSort}>Sort moves: {isAscending ? "Ascending ↓" : "Descending ↑"}</button>
				<ol>{sortedMoves}</ol>
			</div>
		</div>
	);
}

function calculateWinner(squares) {
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
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

function getWinningSquares(squares) {
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
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [a, b, c];
		}
	}
	return null;
}
