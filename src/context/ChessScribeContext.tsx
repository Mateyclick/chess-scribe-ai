
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Move = {
  id: string;
  moveNumber: number;
  white?: string;
  black?: string;
  whiteValid?: boolean;
  blackValid?: boolean;
};

export type ChessScribeContextType = {
  // Image handling
  image: File | null;
  imageUrl: string | null;
  setImage: (file: File | null) => void;
  
  // OCR processing
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  // Detected moves
  moves: Move[];
  setMoves: (moves: Move[]) => void;
  addMove: () => void;
  updateMove: (id: string, whiteMove?: string, blackMove?: string) => void;
  
  // Board state
  currentPosition: string;
  setCurrentPosition: (fen: string) => void;
  
  // PGN export
  generatePGN: () => string;
};

export const ChessScribeContext = createContext<ChessScribeContextType | undefined>(undefined);

export const ChessScribeProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState<Move[]>([{ id: '1', moveNumber: 1, white: '', black: '' }]);
  const [currentPosition, setCurrentPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); // Initial position

  // Set image and create URL
  const setImage = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  // Add empty move
  const addMove = () => {
    const newMoveNumber = moves.length + 1;
    setMoves([...moves, { id: newMoveNumber.toString(), moveNumber: newMoveNumber, white: '', black: '' }]);
  };

  // Update move
  const updateMove = (id: string, whiteMove?: string, blackMove?: string) => {
    setMoves(moves.map(move => {
      if (move.id === id) {
        return {
          ...move,
          white: whiteMove !== undefined ? whiteMove : move.white,
          black: blackMove !== undefined ? blackMove : move.black
        };
      }
      return move;
    }));
  };

  // Generate PGN
  const generatePGN = () => {
    let pgn = `[Event "ChessScribe AI Generated Game"]
[Date "${new Date().toISOString().split('T')[0]}"]
[White "White"]
[Black "Black"]
[Result "*"]

`;
    
    // Format moves
    moves.forEach(move => {
      pgn += `${move.moveNumber}. ${move.white || ''} ${move.black || ''} `;
    });
    
    return pgn.trim();
  };

  const value = {
    image,
    imageUrl,
    setImage,
    isProcessing,
    setIsProcessing,
    moves,
    setMoves,
    addMove,
    updateMove,
    currentPosition,
    setCurrentPosition,
    generatePGN
  };

  return (
    <ChessScribeContext.Provider value={value}>
      {children}
    </ChessScribeContext.Provider>
  );
};

export const useChessScribe = () => {
  const context = useContext(ChessScribeContext);
  if (context === undefined) {
    throw new Error('useChessScribe must be used within a ChessScribeProvider');
  }
  return context;
};
