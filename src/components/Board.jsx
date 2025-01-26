import React from 'react';
import { checkWinner } from '../utils/gameLogic';

const Board = ({ board, currentPlayer, onCellClick, gameMode }) => {
  return (
    <div className="board">
      {board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className="cell"
              onClick={() => onCellClick(i, j)}
              data-testid={`cell-${i}-${j}`}
            >
              {cell && (
                <div className={`stone ${cell === 'B' ? 'black' : 'white'}`} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
