
import React, { useState } from 'react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Chess piece Unicode symbols
const pieces: Record<string, string> = {
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
};

const ChessBoard = () => {
  const { currentPosition, moves } = useChessScribe();
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  
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
  
  // Navigate through moves
  const goToPreviousMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      // In a real implementation, this would update the board position
    }
  };
  
  const goToNextMove = () => {
    if (currentMoveIndex < totalMoves - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      // In a real implementation, this would update the board position
    }
  };
  
  // Calculate total moves (each white+black pair counts as 1 move)
  const totalMoves = moves.reduce((count, move) => {
    if (move.white) count++;
    if (move.black) count++;
    return count;
  }, 0);
  
  // Generate chessboard squares
  const renderBoard = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const squares = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const squareClass = isLight ? 'bg-chess-cream' : 'bg-chess-burgundy';
        const textClass = isLight ? 'text-chess-burgundy' : 'text-chess-cream';
        const index = row * 8 + col;
        const piece = boardPositions[index];
        
        // Show coordinates only for outer squares
        const showFileLabel = row === 7;
        const showRankLabel = col === 0;
        
        squares.push(
          <div 
            key={`${row}-${col}`} 
            className={`chess-square ${squareClass} relative w-full h-full flex items-center justify-center`}
          >
            {piece && (
              <span className="piece text-3xl">{pieces[piece]}</span>
            )}
            {showFileLabel && (
              <span className={`chess-coordinate file-label absolute bottom-0 right-1 text-xs ${textClass}`}>
                {files[col]}
              </span>
            )}
            {showRankLabel && (
              <span className={`chess-coordinate rank-label absolute top-0 left-1 text-xs ${textClass}`}>
                {ranks[row]}
              </span>
            )}
          </div>
        );
      }
    }
    
    return squares;
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="chess-board shadow-lg rounded-md overflow-hidden grid grid-cols-8 aspect-square">
        {renderBoard()}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMove}
          disabled={currentMoveIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        
        <div className="text-sm font-medium">
          Movimiento {currentMoveIndex} de {totalMoves}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMove}
          disabled={currentMoveIndex === totalMoves - 1}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ChessBoard;
