import React, { useState, useEffect } from 'react';
import { findBestMove } from './utils/ai';

function App() {
  const [theme, setTheme] = useState('light');
  const [gameState, setGameState] = useState({
    started: false,
    playerName: '',
    playerColor: 'B',
    opponent: '',
    board: Array(19).fill().map(() => Array(19).fill(null)),
    currentPlayer: 'B',
    winner: null
  });

  useEffect(() => {
    document.body.className = `${theme}-mode`;
  }, [theme]);

  useEffect(() => {
    if (gameState.started && 
        gameState.opponent === 'ai' && 
        gameState.currentPlayer !== gameState.playerColor && 
        !gameState.winner) {
      setTimeout(() => {
        const aiMove = findBestMove(gameState.board, 
          gameState.playerColor === 'B' ? 'W' : 'B', 
          gameState.playerColor);
        if (aiMove) {
          makeMove(aiMove.row, aiMove.col);
        }
      }, 500);
    }
  }, [gameState.currentPlayer, gameState.started]);

  const checkWinner = (board, row, col, player) => {
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      
      for (let i = 1; i < 5; i++) {
        const newRow = row + (dx * i);
        const newCol = col + (dy * i);
        if (newRow < 0 || newRow >= 19 || newCol < 0 || newCol >= 19 || board[newRow][newCol] !== player) break;
        count++;
      }
      
      for (let i = 1; i < 5; i++) {
        const newRow = row - (dx * i);
        const newCol = col - (dy * i);
        if (newRow < 0 || newRow >= 19 || newCol < 0 || newCol >= 19 || board[newRow][newCol] !== player) break;
        count++;
      }
      
      if (count >= 5) return true;
    }
    return false;
  };

  const makeMove = (row, col) => {
    if (!gameState.started || gameState.winner || gameState.board[row][col]) return;

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;

    if (checkWinner(newBoard, row, col, gameState.currentPlayer)) {
      setGameState(prev => ({ ...prev, board: newBoard, winner: gameState.currentPlayer }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'B' ? 'W' : 'B'
    }));
  };

  const handleIntersectionClick = (row, col) => {
    if (gameState.currentPlayer === gameState.playerColor) {
      makeMove(row, col);
    }
  };

  const startGame = () => {
    if (!gameState.playerName || !gameState.opponent) return;
    setGameState(prev => ({
      ...prev,
      started: true,
      board: Array(19).fill().map(() => Array(19).fill(null)),
      currentPlayer: 'B',
      winner: null
    }));
  };

  const getCurrentPlayerName = () => {
    if (gameState.currentPlayer === gameState.playerColor) {
      return gameState.playerName;
    }
    return gameState.opponent === 'ai' ? 'IA' : 'Joueur 2';
  };

  const renderBoard = () => {
    const intersections = [];
    const horizontalLines = [];
    const verticalLines = [];

    // Créer les lignes horizontales
    for (let i = 0; i < 19; i++) {
      horizontalLines.push(
        <div
          key={`h${i}`}
          className="horizontal-line"
          style={{ top: `${(i * 100/18)}%` }}
        />
      );
    }

    // Créer les lignes verticales
    for (let i = 0; i < 19; i++) {
      verticalLines.push(
        <div
          key={`v${i}`}
          className="vertical-line"
          style={{ left: `${(i * 100/18)}%` }}
        />
      );
    }

    // Créer les intersections
    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 19; j++) {
        intersections.push(
          <div
            key={`${i}-${j}`}
            className="intersection"
            style={{
              left: `${(j * 100/18)}%`,
              top: `${(i * 100/18)}%`
            }}
            onClick={() => handleIntersectionClick(i, j)}
          >
            {gameState.board[i][j] && (
              <div className={`stone ${gameState.board[i][j] === 'B' ? 'black' : 'white'}`} />
            )}
          </div>
        );
      }
    }

    return (
      <div className="board">
        <div className="board-grid">
          {horizontalLines}
          {verticalLines}
          {intersections}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <button 
        className="theme-toggle" 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {!gameState.started ? (
  <div className="dialog visible">
    <h2>Gobang</h2>
    <div className="form-group">
      <label>Votre pseudo</label>
      <input
        type="text"
        value={gameState.playerName}
        onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
      />
    </div>
    <div className="form-group">
      <label>Votre couleur</label>
      <div className="color-choice" role="radiogroup" aria-label="Sélection de la couleur">
        <button
          type="button"
          role="radio"
          aria-checked={gameState.playerColor === 'B'}
          className={`color-button black ${gameState.playerColor === 'B' ? 'selected' : ''}`}
          onClick={() => setGameState(prev => ({ ...prev, playerColor: 'B' }))}
          onKeyPress={(e) => e.key === 'Enter' && setGameState(prev => ({ ...prev, playerColor: 'B' }))}
          tabIndex={0}
        />
        <button
          type="button"
          role="radio"
          aria-checked={gameState.playerColor === 'W'}
          className={`color-button white ${gameState.playerColor === 'W' ? 'selected' : ''}`}
          onClick={() => setGameState(prev => ({ ...prev, playerColor: 'W' }))}
          onKeyPress={(e) => e.key === 'Enter' && setGameState(prev => ({ ...prev, playerColor: 'W' }))}
          tabIndex={0}
        />
      </div>
    </div>
          <div className="form-group">
            <label>Adversaire</label>
            <select
              value={gameState.opponent}
              onChange={(e) => setGameState(prev => ({ ...prev, opponent: e.target.value }))}
            >
              <option value="">Choisir...</option>
              <option value="human">Joueur humain</option>
              <option value="ai">IA</option>
            </select>
          </div>
          <button 
            onClick={startGame}
            disabled={!gameState.playerName || !gameState.opponent}
          >
            Commencer la partie
          </button>
        </div>
      ) : (
        <div className="board-container">
    <div className="status">
      {gameState.winner ? 
        `${gameState.winner === gameState.playerColor ? gameState.playerName : (gameState.opponent === 'ai' ? 'IA' : 'Joueur 2')} a gagné !` : 
        `Au tour de ${getCurrentPlayerName()}`}
    </div>

    {renderBoard()}

    {gameState.winner && (
      <>
        <div className="overlay" />
        <div className="dialog visible">
          <h3>{gameState.winner === gameState.playerColor ? gameState.playerName : (gameState.opponent === 'ai' ? 'IA' : 'Joueur 2')} a gagné !</h3>
          <button onClick={() => setGameState(prev => ({ ...prev, started: false }))}>
            Nouvelle partie
          </button>
	        </div>
	      </>
	    )}
	  </div>
	)}
    </div>
  );
}

export default App;
