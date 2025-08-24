import { useState, useCallback, useEffect, useRef } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS, INITIAL_SPEED } from '../constants';
import {
  createBoard,
  isValidPosition,
  placeTetromino,
  clearLines,
  getRandomTetromino,
  rotateMatrix,
  calculateScore,
  calculateSpeed
} from '../utils';

export const useGameState = () => {
  const [board, setBoard] = useState(createBoard(BOARD_WIDTH, BOARD_HEIGHT));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  
  const dropInterval = useRef(null);
  const gameTimeInterval = useRef(null);

  // 生成新方块
  const spawnPiece = useCallback(() => {
    const piece = getRandomTetromino(TETROMINOS);
    const startX = Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2);
    const startY = 0;
    
    if (!isValidPosition(board, piece, { x: startX, y: startY })) {
      setGameOver(true);
      setIsPlaying(false);
      return false;
    }
    
    setCurrentPiece(piece);
    setPosition({ x: startX, y: startY });
    return true;
  }, [board]);

  // 移动方块
  const movePiece = useCallback((deltaX, deltaY) => {
    if (!currentPiece || gameOver || isPaused) return false;
    
    const newPosition = { x: position.x + deltaX, y: position.y + deltaY };
    
    if (isValidPosition(board, currentPiece, newPosition)) {
      setPosition(newPosition);
      return true;
    }
    
    // 如果是向下移动且无法继续，则固定方块
    if (deltaY > 0) {
      const newBoard = placeTetromino(board, currentPiece, position);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      
      if (linesCleared > 0) {
        setLines(prev => prev + linesCleared);
        setScore(prev => prev + calculateScore(linesCleared, level));
        
        // 每10行升一级
        const newTotalLines = lines + linesCleared;
        const newLevel = Math.floor(newTotalLines / 10);
        if (newLevel > level) {
          setLevel(newLevel);
        }
      }
      
      spawnPiece();
    }
    
    return false;
  }, [currentPiece, position, board, gameOver, isPaused, level, lines, spawnPiece]);

  // 旋转方块
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotatedShape = rotateMatrix(currentPiece.shape);
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };
    
    if (isValidPosition(board, rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position, board, gameOver, isPaused]);

  // 硬降（直接降到底部）
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    let dropDistance = 0;
    while (movePiece(0, 1)) {
      dropDistance++;
    }
    
    // 硬降奖励分数
    setScore(prev => prev + dropDistance * 2);
  }, [currentPiece, gameOver, isPaused, movePiece]);

  // 开始游戏
  const startGame = useCallback(() => {
    setBoard(createBoard(BOARD_WIDTH, BOARD_HEIGHT));
    setScore(0);
    setLines(0);
    setLevel(0);
    setGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setGameTime(0);
    spawnPiece();
  }, [spawnPiece]);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    if (!isPlaying || gameOver) return;
    setIsPaused(prev => !prev);
  }, [isPlaying, gameOver]);

  // 自动下落
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) {
      if (dropInterval.current) {
        clearInterval(dropInterval.current);
      }
      return;
    }

    const speed = calculateSpeed(level, INITIAL_SPEED);
    
    dropInterval.current = setInterval(() => {
      movePiece(0, 1);
    }, speed);

    return () => {
      if (dropInterval.current) {
        clearInterval(dropInterval.current);
      }
    };
  }, [isPlaying, isPaused, gameOver, level, movePiece]);

  // 游戏计时器
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) {
      if (gameTimeInterval.current) {
        clearInterval(gameTimeInterval.current);
      }
      return;
    }

    gameTimeInterval.current = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (gameTimeInterval.current) {
        clearInterval(gameTimeInterval.current);
      }
    };
  }, [isPlaying, isPaused, gameOver]);

  return {
    board,
    currentPiece,
    position,
    gameOver,
    score,
    lines,
    level,
    isPlaying,
    isPaused,
    gameTime,
    movePiece,
    rotatePiece,
    hardDrop,
    startGame,
    togglePause
  };
};