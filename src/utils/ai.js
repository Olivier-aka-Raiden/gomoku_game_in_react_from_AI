// Constantes pour les scores
const FIVE = 100000;    // 5 pierres alignées
const OPEN_FOUR = 10000;  // 4 alignées avec espace pour gagner
const FOUR = 1000;      // 4 alignées bloquées
const OPEN_THREE = 1000; // 3 alignées avec espaces
const THREE = 100;      // 3 alignées bloquées
const OPEN_TWO = 100;   // 2 alignées avec espaces
const TWO = 10;         // 2 alignées bloquées

const evaluateDirection = (board, row, col, player, dx, dy) => {
  let count = 1;
  let openEnds = 0;
  let forward = 0;
  let backward = 0;

  // Vérifier vers l'avant
  for (let i = 1; i < 5; i++) {
    const newRow = row + (dx * i);
    const newCol = col + (dy * i);
    
    if (newRow < 0 || newRow >= 19 || newCol < 0 || newCol >= 19) break;
    
    if (board[newRow][newCol] === player) {
      count++;
      forward++;
    } else if (board[newRow][newCol] === null) {
      openEnds++;
      break;
    } else {
      break;
    }
  }

  // Vérifier vers l'arrière
  for (let i = 1; i < 5; i++) {
    const newRow = row - (dx * i);
    const newCol = col - (dy * i);
    
    if (newRow < 0 || newRow >= 19 || newCol < 0 || newCol >= 19) break;
    
    if (board[newRow][newCol] === player) {
      count++;
      backward++;
    } else if (board[newRow][newCol] === null) {
      openEnds++;
      break;
    } else {
      break;
    }
  }

  // Évaluer la configuration
  if (count >= 5) return FIVE;
  if (count === 4) {
    if (openEnds === 2) return OPEN_FOUR;
    if (openEnds === 1) return FOUR;
  }
  if (count === 3) {
    if (openEnds === 2) return OPEN_THREE;
    if (openEnds === 1) return THREE;
  }
  if (count === 2) {
    if (openEnds === 2) return OPEN_TWO;
    if (openEnds === 1) return TWO;
  }
  
  return 0;
};

const evaluatePosition = (board, row, col, player) => {
  const directions = [
    [1, 0],   // horizontal
    [0, 1],   // vertical
    [1, 1],   // diagonal
    [1, -1]   // anti-diagonal
  ];

  let score = 0;
  
  for (const [dx, dy] of directions) {
    score += evaluateDirection(board, row, col, player, dx, dy);
  }

  return score;
};

const evaluateBoard = (board, row, col, aiPlayer, humanPlayer) => {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = aiPlayer;

  const aiScore = evaluatePosition(newBoard, row, col, aiPlayer);
  
  newBoard[row][col] = humanPlayer;
  const humanScore = evaluatePosition(newBoard, row, col, humanPlayer);
  
  newBoard[row][col] = null;

  if (humanScore >= OPEN_THREE) {
    return humanScore * 1.1;
  }

  return Math.max(aiScore, humanScore);
};

export const findBestMove = (board, aiPlayer = 'W', humanPlayer = 'B') => {
  let bestScore = -1;
  let bestMove = null;
  
  const shouldConsider = (row, col) => {
    if (board[row][col]) return false;
    
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < 19 && newCol >= 0 && newCol < 19) {
          if (board[newRow][newCol]) return true;
        }
      }
    }
    return false;
  };

  let hasStones = false;
  for (let i = 0; i < 19; i++) {
    for (let j = 0; j < 19; j++) {
      if (board[i][j]) {
        hasStones = true;
        break;
      }
    }
    if (hasStones) break;
  }
  
  if (!hasStones) {
    return { row: 9, col: 9 };
  }

  for (let i = 0; i < 19; i++) {
    for (let j = 0; j < 19; j++) {
      if (shouldConsider(i, j)) {
        const score = evaluateBoard(board, i, j, aiPlayer, humanPlayer);
        if (score > bestScore) {
          bestScore = score;
          bestMove = { row: i, col: j };
        }
      }
    }
  }

  return bestMove;
};
