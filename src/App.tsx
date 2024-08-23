import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import Leaderboard from './components/LeaderBoard';
import './App.css';

const App: React.FC = () => {
	const [playerName, setPlayerName] = useState('');
	const [isXNext, setIsXNext] = useState(true);
	const [gameStarted, setGameStarted] = useState(false);
	const [stats, setStats] = useState({
		games: 0,
		wins: 0,
		losses: 0,
		ties: 0,
	});

	const updateStats = useCallback((result: 'win' | 'loss' | 'tie') => {
		setStats((prevStats) => ({
			games: prevStats.games + 1,
			wins: result === 'win' ? prevStats.wins + 1 : prevStats.wins,
			losses: result === 'loss' ? prevStats.losses + 1 : prevStats.losses,
			ties: result === 'tie' ? prevStats.ties + 1 : prevStats.ties,
		}));
	}, []);

	const resetGame = () => {
		setIsXNext(Math.random() < 0.5); // Randomly decide who starts
		setGameStarted(true);
	};

	return (
		<div className="app">
			{!gameStarted ? (
				<div>
					<input
						type="text"
						placeholder="Enter your name"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
					/>
					<button onClick={resetGame} disabled={!playerName}>
						Start Game
					</button>
				</div>
			) : (
				<div>
					<Board
						playerName={playerName}
						isXNext={isXNext}
						setIsXNext={setIsXNext}
						setSquares={() => {}}
						updateStats={updateStats}
					/>
					<Leaderboard stats={stats} />
				</div>
			)}
		</div>
	);
};

export default App;
