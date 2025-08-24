import React from 'react';
import './Board.css';

const Board = ({ board, currentPiece, position }) => {
  // 创建显示板，包含当前移动的方块
  const displayBoard = board.map((row, y) => 
    row.map((cell, x) => {
      // 检查当前位置是否是活动方块的一部分
      if (currentPiece && position) {
        const pieceY = y - position.y;
        const pieceX = x - position.x;
        
        if (
          pieceY >= 0 && 
          pieceY < currentPiece.shape.length &&
          pieceX >= 0 && 
          pieceX < currentPiece.shape[pieceY].length &&
          currentPiece.shape[pieceY][pieceX]
        ) {
          return currentPiece.color;
        }
      }
      
      return cell;
    })
  );

  return (
    <div className="board">
      {displayBoard.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => (
            <div 
              key={`${y}-${x}`} 
              className="cell"
              style={{ backgroundColor: cell || '#222' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;