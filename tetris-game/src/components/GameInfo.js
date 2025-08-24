import React from 'react';
import './GameInfo.css';

const GameInfo = ({ score, lines, level, gameTime }) => {
  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-info">
      <div className="info-box">
        <h3>分数</h3>
        <p className="info-value">{score}</p>
      </div>
      
      <div className="info-box">
        <h3>行数</h3>
        <p className="info-value">{lines}</p>
      </div>
      
      <div className="info-box">
        <h3>关卡</h3>
        <p className="info-value">{level + 1}</p>
      </div>
      
      <div className="info-box">
        <h3>时间</h3>
        <p className="info-value">{formatTime(gameTime)}</p>
      </div>
    </div>
  );
};

export default GameInfo;