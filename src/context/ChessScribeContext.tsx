
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { parseScoresheet, convertSpanishToStandard } from '@/lib/notationUtils';
import { Chess } from 'chess.js';

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
  
  // Scoresheet metadata
  tournamentName: string;
  playerWhite: string;
  playerBlack: string;
  setTournamentName: (name: string) => void;
  setPlayerWhite: (name: string) => void;
  setPlayerBlack: (name: string) => void;
  
  // Move validation
  validateMoves: () => void;
};

export const ChessScribeContext = createContext<ChessScribeContextType | undefined>(undefined);

export const ChessScribeProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState<Move[]>([{ id: '1', moveNumber: 1, white: '', black: '' }]);
  const [currentPosition, setCurrentPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); // Initial position
  
  // Scoresheet metadata
  const [tournamentName, setTournamentName] = useState<string>('');
  const [playerWhite, setPlayerWhite] = useState<string>('');
  const [playerBlack, setPlayerBlack] = useState<string>('');

  // Set image and create URL
  const setImage = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Reset moves when a new image is loaded
      setMoves([{ id: '1', moveNumber: 1, white: '', black: '' }]);
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
    
    // Validar después de actualizar
    setTimeout(validateMoves, 0);
  };

  // Validate moves using chess.js
  const validateMoves = () => {
    const chess = new Chess();
    const updatedMoves = [...moves];
    
    // Reset the validation state
    updatedMoves.forEach(move => {
      move.whiteValid = undefined;
      move.blackValid = undefined;
    });
    
    let allValid = true;
    
    // Validate each move sequentially
    for (let i = 0; i < updatedMoves.length; i++) {
      const move = updatedMoves[i];
      
      // Validate white's move if present
      if (move.white && move.white.trim() !== '') {
        try {
          // Convertir notación española a estándar (inglés)
          const standardWhiteMove = convertSpanishToStandard(move.white);
          
          // Attempt to make the move
          chess.move(standardWhiteMove, { strict: true });
          move.whiteValid = true;
        } catch (error) {
          move.whiteValid = false;
          allValid = false;
          // If a move is invalid, all subsequent moves are potentially affected
          break;
        }
      }
      
      // Validate black's move if present
      if (move.black && move.black.trim() !== '') {
        try {
          // Convertir notación española a estándar (inglés)
          const standardBlackMove = convertSpanishToStandard(move.black);
          
          // Attempt to make the move
          chess.move(standardBlackMove, { strict: true });
          move.blackValid = true;
        } catch (error) {
          move.blackValid = false;
          allValid = false;
          // If a move is invalid, all subsequent moves are potentially affected
          break;
        }
      }
    }
    
    // Update moves with validation results
    setMoves(updatedMoves);
    
    return allValid;
  };

  // Generate PGN
  const generatePGN = () => {
    // Format date as YYYY.MM.DD
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    
    // Start with PGN headers
    let pgn = `[Event "${tournamentName || 'ChessScribe AI Generated Game'}"]
[Site "?"]
[Date "${date}"]
[Round "?"]
[White "${playerWhite || 'White'}"]
[Black "${playerBlack || 'Black'}"]
[Result "*"]

`;
    
    // Format moves
    moves.forEach(move => {
      if (move.white || move.black) {
        pgn += `${move.moveNumber}. ${move.white || ''} ${move.black || ''} `;
      }
    });
    
    // Add result if available (default to ongoing game)
    pgn += '*';
    
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
    generatePGN,
    tournamentName,
    playerWhite,
    playerBlack,
    setTournamentName,
    setPlayerWhite,
    setPlayerBlack,
    validateMoves
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
