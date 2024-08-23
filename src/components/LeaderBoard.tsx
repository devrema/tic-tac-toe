// Leaderboard.tsx
import React from 'react';

interface LeaderboardProps {
	stats: {
		games: number;
		wins: number;
		losses: number;
		ties: number;
	};
}

const Leaderboard: React.FC<LeaderboardProps> = ({ stats }) => (
	<div className="leaderboard">
		<h2>Leaderboard</h2>
		<p>Games Played: {stats.games}</p>
		<p>Wins: {stats.wins}</p>
		<p>Losses: {stats.losses}</p>
		<p>Ties: {stats.ties}</p>
	</div>
);

export default Leaderboard;
