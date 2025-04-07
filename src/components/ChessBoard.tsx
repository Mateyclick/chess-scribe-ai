
import React from 'react';
import { useChessScribe } from '@/context/ChessScribeContext';

// Chess piece Unicode symbols
const pieces: Record<string, string> = {
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
};

const ChessBoard = () => {
  const { currentPosition } = useChessScribe();
  
  // Parse FEN to get piece positions
  const getPiecePositions = () => {
    const board = Array(64).fill(null);
    const rows = currentPosition.split(' ')[0].split('/');
    
    let index = 0;
    for (let row = 0; row < 8; row++) {
      let col = 0;
      for (let i = 0; i < rows[row].length; i++) {
        const char = rows[row][i];
        if (isNaN(parseInt(char))) {
          board[index + col] = char;
          col++;
        } else {
          col += parseInt(char);
        }
      }
      index += 8;
    }
    
    return board;
  };
  
  const boardPositions = getPiecePositions();
  
  // Generate chessboard squares
  const renderBoard = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const squares = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const squareClass = isLight ? 'light-square' : 'dark-square';
        const index = row * 8 + col;
        const piece = boardPositions[index];
        
        // Show coordinates only for outer squares
        const showFileLabel = row === 7;
        const showRankLabel = col === 0;
        
        squares.push(
          <div key={`${row}-${col}`} className={`chess-square ${squareClass}`}>
            {piece && (
              <span className="piece">{pieces[piece]}</span>
            )}
            {showFileLabel && (
              <span className="chess-coordinate file-label">{files[col]}</span>
            )}
            {showRankLabel && (
              <span className="chess-coordinate rank-label">{ranks[row]}</span>
            )}
          </div>
        );
      }
    }
    
    return squares;
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="chess-board shadow-lg rounded-md overflow-hidden">
        {renderBoard()}
      </div>
    </div>
  );
};

export default ChessBoard;
