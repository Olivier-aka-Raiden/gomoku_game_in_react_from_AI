import React, { useState } from 'react';

const StartScreen = ({ onGameStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState('');

  const handleStart = () => {
    if (playerName && gameMode) {
      onGameStart(playerName, gameMode);
    }
  };

  return (
    <div className="start-screen">
      <h1>Gobang</h1>
      <div>
        <input
          type="text"
          placeholder="Entrez votre pseudo"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          data-testid="player-name-input"
        />
      </div>
      <div>
        <button 
          onClick={() => setGameMode('ai')}
          data-testid="ai-mode-button"
        >
          Jouer contre l'IA
        </button>
        <button 
          onClick={() => setGameMode('human')}
          data-testid="human-mode-button"
        >
          Jouer à 2
        </button>
      </div>
      {playerName && gameMode && (
        <button 
          onClick={handleStart}
          data-testid="start-game-button"
        >
          Commencer
        </button>
      )}
    </div>
  );
};
