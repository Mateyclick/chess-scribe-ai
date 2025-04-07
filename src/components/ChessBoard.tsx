
import React, { useState, useEffect } from 'react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Chess } from 'chess.js';

// Chess piece Unicode symbols with improved styling
const pieces: Record<string, string> = {
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
};

const ChessBoard = () => {
  const { moves } = useChessScribe();
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [chessInstance] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  
  // Update the board when move index changes
  useEffect(() => {
    // Reset to initial position
    chessInstance.reset();
    
    // Apply moves up to currentMoveIndex
    const flatMoves = [];
    for (let i = 0; i <= currentMoveIndex && i < moves.length; i++) {
      if (moves[i].white) flatMoves.push(moves[i].white);
      if (i === currentMoveIndex && !moves[i].black) break;
      if (moves[i].black) flatMoves.push(moves[i].black);
    }
    
    try {
      // Apply each move
      flatMoves.forEach(move => {
        try {
          chessInstance.move(move);
        } catch (err) {
          console.log(`Invalid move: ${move}`);
        }
      });
      
      // Update position
      setCurrentPosition(chessInstance.fen());
    } catch (error) {
      console.error('Error applying moves:', error);
    }
  }, [currentMoveIndex, moves]);
  
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
  const goToFirstMove = () => {
    setCurrentMoveIndex(0);
  };
  
  const goToPreviousMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };
  
  const goToNextMove = () => {
    if (currentMoveIndex < moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  };
  
  const goToLastMove = () => {
    setCurrentMoveIndex(moves.length - 1);
  };
  
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
              <span className="piece text-3xl md:text-4xl transition-transform hover:scale-110 select-none">
                {pieces[piece]}
              </span>
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
  
  // Get current half-move and color to move
  const getCurrentMoveInfo = () => {
    const moveInfo = {
      moveNumber: Math.floor(currentMoveIndex / 2) + 1,
      colorToMove: currentMoveIndex % 2 === 0 ? 'blancas' : 'negras'
    };
    
    // For display, we'll show the actual move being viewed
    if (currentMoveIndex < moves.length) {
      const move = moves[currentMoveIndex];
      moveInfo.moveNumber = move.moveNumber;
      moveInfo.colorToMove = move.black ? 'negras' : 'blancas';
    }
    
    return moveInfo;
  };
  
  const moveInfo = getCurrentMoveInfo();
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="chess-board shadow-lg rounded-md overflow-hidden grid grid-cols-8 aspect-square border-2 border-gray-800">
        {renderBoard()}
      </div>
      
      <div className="flex justify-between items-center mt-4 gap-2">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToFirstMove}
            disabled={currentMoveIndex === 0}
            title="Primer movimiento"
            className="h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMove}
            disabled={currentMoveIndex === 0}
            title="Movimiento anterior"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm font-medium">
          {moveInfo.moveNumber}.{moveInfo.colorToMove === 'negras' ? '..' : ''} {moveInfo.colorToMove}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMove}
            disabled={currentMoveIndex === moves.length - 1}
            title="Siguiente movimiento"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToLastMove}
            disabled={currentMoveIndex === moves.length - 1}
            title="Último movimiento"
            className="h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
