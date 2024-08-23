import React, { useState } from 'react';

interface MenuProps {
	onReset: () => void;
	onNameChange: (name: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onReset, onNameChange }) => {
	const [name, setName] = useState<string>('Player');

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		onNameChange(e.target.value);
	};

	return (
		<div className="menu">
			<input
				type="text"
				className="name-input"
				value={name}
				onChange={handleNameChange}
				placeholder="Enter your name"
			/>
			<button className="reset-button" onClick={onReset}>
				Restart Game
			</button>
		</div>
	);
};

export default Menu;
