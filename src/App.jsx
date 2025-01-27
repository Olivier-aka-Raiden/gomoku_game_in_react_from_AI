import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { findBestMove } from './utils/ai';

function App() {
  const { t } = useTranslation();
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
    if (gameState.opponent === 'ai' && gameState.currentPlayer !== gameState.playerColor) {
      return;
    }

    if (!gameState.board[row][col]) {
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
    if (gameState.opponent === 'ai') {
      return gameState.currentPlayer === gameState.playerColor ? gameState.playerName : t('game.ai');
    } else {
      return gameState.currentPlayer === 'B' ? gameState.playerName : t('game.player2');
    }
  };

  const renderBoard = () => {
    const intersections = [];
    const horizontalLines = [];
    const verticalLines = [];

    for (let i = 0; i < 19; i++) {
      horizontalLines.push(
          <div
              key={`h${i}`}
              className="horizontal-line"
              style={{ top: `${(i * 100/18)}%` }}
          />
      );
    }

    for (let i = 0; i < 19; i++) {
      verticalLines.push(
          <div
              key={`v${i}`}
              className="vertical-line"
              style={{ left: `${(i * 100/18)}%` }}
          />
      );
    }

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
              <h2>{t('game.title')}</h2>
              <div className="form-group">
                <label>{t('game.yourNickname')}</label>
                <input
                    type="text"
                    value={gameState.playerName}
                    onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>{t('game.yourColor')}</label>
                <div className="color-choice" role="radiogroup" aria-label={t('colorSelection.label')}>
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
                <label>{t('game.opponent')}</label>
                <select
                    value={gameState.opponent}
                    onChange={(e) => setGameState(prev => ({ ...prev, opponent: e.target.value }))}
                >
                  <option value="">{t('game.chooseOpponent')}</option>
                  <option value="human">{t('game.humanPlayer')}</option>
                  <option value="ai">{t('game.ai')}</option>
                </select>
              </div>
              <button
                  onClick={startGame}
                  disabled={!gameState.playerName || !gameState.opponent}
              >
                {t('game.startGame')}
              </button>
            </div>
        ) : (
            <div className="board-container">
              <div className="status">
                {gameState.winner ?
                    t('game.winner', { playerName: getCurrentPlayerName() }) :
                    t('game.turn', { playerName: getCurrentPlayerName() })}
              </div>

              {renderBoard()}

              {gameState.winner && (
                  <>
                    <div className="overlay" />
                    <div className="dialog visible">
                      <h3>{t('game.winner', { playerName: getCurrentPlayerName() })}</h3>
                      <button onClick={() => setGameState(prev => ({ ...prev, started: false }))}>
                        {t('game.newGame')}
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
