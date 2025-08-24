import React from 'react';
import './Controls.css';

const Controls = ({ isPlaying, isPaused, gameOver, onStart, onPause }) => {
  return (
    <div className="controls">
      {!isPlaying || gameOver ? (
        <button className="control-btn start-btn" onClick={onStart}>
          {gameOver ? '重新开始' : '开始游戏'}
        </button>
      ) : (
        <button className="control-btn pause-btn" onClick={onPause}>
          {isPaused ? '继续' : '暂停'}
        </button>
      )}
      
      <div className="instructions">
        <h3>操作说明</h3>
        <p>← → : 左右移动</p>
        <p>↓ : 加速下落</p>
        <p>↑ : 旋转方块</p>
        <p>空格 : 直接降落</p>
        <p>P : 暂停/继续</p>
      </div>
    </div>
  );
};

export default Controls;