// 游戏工具函数

// 创建空的游戏板
export const createBoard = (width, height) => {
  return Array(height).fill(null).map(() => Array(width).fill(null));
};

// 旋转方块矩阵
export const rotateMatrix = (matrix) => {
  const N = matrix.length;
  const rotated = Array(N).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[j][N - 1 - i] = matrix[i][j];
    }
  }
  
  return rotated;
};

// 检查位置是否有效（不重叠、不越界）
export const isValidPosition = (board, tetromino, position) => {
  const { shape } = tetromino;
  const { x, y } = position;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        
        // 检查是否越界
        if (newX < 0 || newX >= board[0].length || newY >= board.length) {
          return false;
        }
        
        // 检查是否在顶部之上
        if (newY < 0) {
          continue;
        }
        
        // 检查是否与已有方块重叠
        if (board[newY][newX]) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// 将方块固定到游戏板上
export const placeTetromino = (board, tetromino, position) => {
  const newBoard = board.map(row => [...row]);
  const { shape, color } = tetromino;
  const { x, y } = position;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = color;
        }
      }
    }
  }
  
  return newBoard;
};

// 清除已填满的行
export const clearLines = (board) => {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isFull = row.every(cell => cell !== null);
    if (isFull) {
      linesCleared++;
      return false;
    }
    return true;
  });
  
  // 在顶部添加空行
  while (newBoard.length < board.length) {
    newBoard.unshift(Array(board[0].length).fill(null));
  }
  
  return { board: newBoard, linesCleared };
};

// 随机获取方块类型
export const getRandomTetromino = (tetrominos) => {
  const keys = Object.keys(tetrominos);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { type: randomKey, ...tetrominos[randomKey] };
};

// 计算分数
export const calculateScore = (linesCleared, level) => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};

// 计算下落速度
export const calculateSpeed = (level, initialSpeed) => {
  return Math.max(50, initialSpeed - (level * 100));
};