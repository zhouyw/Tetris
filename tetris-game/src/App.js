import React from 'react';
import './App.css';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import Controls from './components/Controls';
import { useGameState } from './hooks/useGameState';
import { useKeyPress } from './hooks/useKeyPress';

function App() {
  const {
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
  } = useGameState();

  // 键盘控制
  useKeyPress({
    ArrowLeft: () => movePiece(-1, 0),
    ArrowRight: () => movePiece(1, 0),
    ArrowDown: () => movePiece(0, 1),
    ArrowUp: () => rotatePiece(),
    ' ': () => hardDrop(),
    p: () => togglePause(),
    P: () => togglePause()
  }, [movePiece, rotatePiece, hardDrop, togglePause]);

  return (
    <div className="App">
      <h1 className="game-title">俄罗斯方块</h1>
      
      <div className="game-container">
        <div className="game-area">
          <Board 
            board={board} 
            currentPiece={currentPiece}
            position={position}
          />
          
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>游戏结束</h2>
                <p>最终得分: {score}</p>
              </div>
            </div>
          )}
          
          {isPaused && !gameOver && (
            <div className="pause-overlay">
              <div className="pause-content">
                <h2>暂停中</h2>
              </div>
            </div>
          )}
        </div>
        
        <div className="side-panel">
          <GameInfo 
            score={score}
            lines={lines}
            level={level}
            gameTime={gameTime}
          />
          
          <Controls 
            isPlaying={isPlaying}
            isPaused={isPaused}
            gameOver={gameOver}
            onStart={startGame}
            onPause={togglePause}
          />
        </div>
      </div>
    </div>
  );
}

export default App;