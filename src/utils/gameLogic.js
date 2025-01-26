export const checkWinner = (board, row, col, player) => {
  const directions = [
    [1, 0],   // horizontal
    [0, 1],   // vertical
    [1, 1],   // diagonal
    [1, -1]   // anti-diagonal
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    
    // Check in positive direction
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (
        newRow < 0 || newRow >= 19 ||
        newCol < 0 || newCol >= 19 ||
        board[newRow][newCol] !== player
      ) break;
      count++;
    }
    
    // Check in negative direction
    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (
        newRow < 0 || newRow >= 19 ||
        newCol < 0 || newCol >= 19 ||
        board[newRow][newCol] !== player
      ) break;
      count++;
    }

    if (count >= 5) return true;
  }
  return false;
};

export const evaluatePosition = (board, row, col) => {
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];
  let score = 0;

  for (const [dx, dy] of directions) {
    let blackCount = 0;
    let whiteCount = 0;
    let empty = 0;

    for (let i = -4; i <= 4; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      
      if (newRow >= 0 && newRow < 19 && newCol >= 0 && newCol < 19) {
        if (board[newRow][newCol] === 'B') blackCount++;
        else if (board[newRow][newCol] === 'W') whiteCount++;
        else empty++;
      }
    }

    // Scoring based on stone patterns
    if (blackCount === 4 && empty >= 1) score += 1000;
    if (whiteCount === 4 && empty >= 1) score += 800;
    if (blackCount === 3 && empty >= 2) score += 100;
    if (whiteCount === 3 && empty >= 2) score += 80;
    if (blackCount === 2 && empty >= 3) score += 10;
    if (whiteCount === 2 && empty >= 3) score += 8;
  }

  return score;
};
