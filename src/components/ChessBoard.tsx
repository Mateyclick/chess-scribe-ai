
import React, { useState, useEffect } from 'react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Chess } from 'chess.js';

// Improved SVG-based chess pieces for better visuals
const pieces: Record<string, React.ReactNode> = {
  'p': (
    <svg viewBox="0 0 45 45" className="chess-piece black pawn">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C16.41 16.21 15 18.55 15 21.5c0 2.38.85 3.5 1.56 4.67.71 1.26 1.44 2.53 1.44 5.08 0 .56 0 1.25-.4 1.75h10.8c-.4-.5-.4-1.19-.4-1.75 0-2.55.73-3.82 1.44-5.08.71-1.17 1.56-2.29 1.56-4.67 0-2.95-1.41-5.29-4.28-6.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'n': (
    <svg viewBox="0 0 45 45" className="chess-piece black knight">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/>
        <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#fff" stroke="#fff"/>
        <path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/>
      </g>
    </svg>
  ),
  'b': (
    <svg viewBox="0 0 45 45" className="chess-piece black bishop">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" fill="#000"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#000"/>
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#000"/>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  'r': (
    <svg viewBox="0 0 45 45" className="chess-piece black rook">
      <g fill="#000" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM12 5h21v7H12V5z" strokeLinecap="butt"/>
        <path d="M14 14l-2 2v16h21V16l-2-2H14z" strokeLinecap="butt"/>
        <path d="M11 14h23" fill="none" strokeLinejoin="miter"/>
        <path d="M18 11v-4M25 11v-4" strokeLinecap="square"/>
      </g>
    </svg>
  ),
  'q': (
    <svg viewBox="0 0 45 45" className="chess-piece black queen">
      <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM24.5 7.5a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM41 12a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM16 8.5a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM33 9a2 2 0 1 1 4 0 2 2 0 1 1-4 0z" fill="#000"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" fill="#000"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1 2.5-1 2.5-1.5 1.5 0 2.5 0 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="#fff"/>
      </g>
    </svg>
  ),
  'k': (
    <svg viewBox="0 0 45 45" className="chess-piece black king">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/>
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/>
      </g>
    </svg>
  ),
  'P': (
    <svg viewBox="0 0 45 45" className="chess-piece white pawn">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C16.41 16.21 15 18.55 15 21.5c0 2.38.85 3.5 1.56 4.67.71 1.26 1.44 2.53 1.44 5.08 0 .56 0 1.25-.4 1.75h10.8c-.4-.5-.4-1.19-.4-1.75 0-2.55.73-3.82 1.44-5.08.71-1.17 1.56-2.29 1.56-4.67 0-2.95-1.41-5.29-4.28-6.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'N': (
    <svg viewBox="0 0 45 45" className="chess-piece white knight">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
        <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#000"/>
        <path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/>
      </g>
    </svg>
  ),
  'B': (
    <svg viewBox="0 0 45 45" className="chess-piece white bishop">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g fill="#fff" strokeLinecap="butt">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
        </g>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/>
      </g>
    </svg>
  ),
  'R': (
    <svg viewBox="0 0 45 45" className="chess-piece white rook">
      <g fill="#fff" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM12 5h21v7H12V5z" strokeLinecap="butt"/>
        <path d="M14 14l-2 2v16h21V16l-2-2H14z" strokeLinecap="butt"/>
        <path d="M11 14h23" fill="none" strokeLinejoin="miter"/>
        <path d="M18 11v-4M25 11v-4" strokeLinecap="square"/>
      </g>
    </svg>
  ),
  'Q': (
    <svg viewBox="0 0 45 45" className="chess-piece white queen">
      <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM24.5 7.5a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM41 12a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM16 8.5a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM33 9a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
        <path d="M11 38.5a35 35 1 0 0 23 0" fill="none"/>
        <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0" fill="none" stroke="#000"/>
      </g>
    </svg>
  ),
  'K': (
    <svg viewBox="0 0 45 45" className="chess-piece white king">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter"/>
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/>
      </g>
    </svg>
  ),
};

const ChessBoard = () => {
  const { moves } = useChessScribe();
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [chessInstance] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [stockfishEval, setStockfishEval] = useState<string | null>(null);
  
  // Update the board when move index changes
  useEffect(() => {
    // Reset to initial position
    chessInstance.reset();
    
    // Apply moves up to currentMoveIndex
    const flatMoves = [];
    let lastMoveFrom = '';
    let lastMoveTo = '';
    
    for (let i = 0; i <= currentMoveIndex && i < moves.length; i++) {
      if (moves[i].white) {
        flatMoves.push(moves[i].white);
        if (i === currentMoveIndex) {
          try {
            const moveInfo = chessInstance.move(moves[i].white, { sloppy: true });
            if (moveInfo) {
              lastMoveFrom = moveInfo.from;
              lastMoveTo = moveInfo.to;
            }
          } catch (err) {
            console.log(`Could not get move info for: ${moves[i].white}`);
          }
        }
      }
      
      if (i === currentMoveIndex && !moves[i].black) break;
      
      if (moves[i].black) {
        flatMoves.push(moves[i].black);
        if (i === currentMoveIndex) {
          try {
            const moveInfo = chessInstance.move(moves[i].black, { sloppy: true });
            if (moveInfo) {
              lastMoveFrom = moveInfo.from;
              lastMoveTo = moveInfo.to;
            }
          } catch (err) {
            console.log(`Could not get move info for: ${moves[i].black}`);
          }
        }
      }
    }
    
    try {
      // Reset and apply all moves except the last one
      chessInstance.reset();
      for (let i = 0; i < flatMoves.length - 1; i++) {
        try {
          chessInstance.move(flatMoves[i], { sloppy: true });
        } catch (err) {
          console.log(`Invalid move: ${flatMoves[i]}`);
        }
      }
      
      // Apply the last move to capture the from/to squares
      if (flatMoves.length > 0) {
        try {
          const moveInfo = chessInstance.move(flatMoves[flatMoves.length - 1], { sloppy: true });
          if (moveInfo) {
            lastMoveFrom = moveInfo.from;
            lastMoveTo = moveInfo.to;
            setLastMove([lastMoveFrom, lastMoveTo]);
          }
        } catch (err) {
          console.log(`Invalid last move: ${flatMoves[flatMoves.length - 1]}`);
          setLastMove(null);
        }
      } else {
        setLastMove(null);
      }
      
      // Update position
      setCurrentPosition(chessInstance.fen());
      
      // Simulate Stockfish evaluation (this would be replaced with actual Stockfish)
      const randomEval = (Math.random() * 2 - 1).toFixed(1);
      setStockfishEval(randomEval);
      
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
        const squareClass = isLight ? 'bg-[#e8d9b5]' : 'bg-[#b58863]';
        const textClass = isLight ? 'text-[#b58863]' : 'text-[#e8d9b5]';
        const index = row * 8 + col;
        const piece = boardPositions[index];
        
        // Generate algebraic notation for the square
        const squareName = `${files[col]}${ranks[row]}`;
        
        // Check if this square is part of the last move
        const isLastMoveFrom = lastMove && lastMove[0] === squareName;
        const isLastMoveTo = lastMove && lastMove[1] === squareName;
        
        // Highlight classes for last move
        const highlightClass = isLastMoveFrom 
          ? 'bg-[#f7d26e50]' 
          : isLastMoveTo 
            ? 'bg-[#f7d26e80]' 
            : '';
        
        // Show coordinates only for outer squares
        const showFileLabel = row === 7;
        const showRankLabel = col === 0;
        
        squares.push(
          <div 
            key={`${row}-${col}`} 
            className={`chess-square ${squareClass} ${highlightClass} relative w-full h-full flex items-center justify-center`}
            data-square={squareName}
          >
            {piece && (
              <div className="piece w-full h-full flex items-center justify-center transition-transform hover:scale-110 select-none">
                {pieces[piece]}
              </div>
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
  
  // Render Stockfish analysis panel
  const renderStockfishPanel = () => {
    const evalClass = stockfishEval && parseFloat(stockfishEval) > 0 
      ? 'text-green-600' 
      : stockfishEval && parseFloat(stockfishEval) < 0 
        ? 'text-red-600' 
        : 'text-gray-600';
    
    return (
      <div className="bg-[#333] text-white p-2 rounded-md mt-4 text-left text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className={evalClass}>{stockfishEval && `${stockfishEval > 0 ? '+' : ''}${stockfishEval}`}</span>
          <span className="text-gray-300 text-xs ml-auto">SF 11 HCE</span>
        </div>
        <div className="text-xs space-y-1">
          <div className="bg-[#3a3a3a] p-1 rounded flex justify-between">
            <span>1. d4</span>
            <span className="text-gray-300">+0.1</span>
          </div>
          <div className="bg-[#2a5785] p-1 rounded flex justify-between">
            <span>1... e5</span>
            <span className="text-gray-300">+1.1</span>
          </div>
          <div className="p-1 flex justify-between">
            <span>2. dxe5</span>
            <span className="text-gray-300">+1.1</span>
          </div>
        </div>
      </div>
    );
  };
  
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
      
      {renderStockfishPanel()}
    </div>
  );
};

export default ChessBoard;
