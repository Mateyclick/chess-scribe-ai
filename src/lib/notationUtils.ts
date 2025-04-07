
// Utility functions for chess notation processing

// Define the Spanish chess notation mapping to standard PGN
const pieceMapping: Record<string, string> = {
  'R': 'K',  // Rey -> King
  'D': 'Q',  // Dama -> Queen
  'T': 'R',  // Torre -> Rook
  'A': 'B',  // Alfil -> Bishop
  'C': 'N',  // Caballo -> Knight
  // Peones (pawns) don't have a letter in either notation
};

/**
 * Converts Spanish algebraic notation to standard PGN format
 */
export const convertSpanishToStandard = (move: string): string => {
  if (!move) return '';
  
  // Handle special cases first
  if (move === '0-0' || move === 'O-O') return 'O-O'; // Kingside castling
  if (move === '0-0-0' || move === 'O-O-O') return 'O-O-O'; // Queenside castling
  
  // Replace Spanish piece symbols with standard
  let standardMove = move;
  for (const [spanish, standard] of Object.entries(pieceMapping)) {
    standardMove = standardMove.replace(new RegExp(`^${spanish}`), standard);
  }
  
  return standardMove;
};

/**
 * Validates if the move format is correct (without checking if it's legal)
 */
export const validateMoveFormat = (move: string): boolean => {
  if (!move) return false;
  
  // Check castling
  if (move === '0-0' || move === 'O-O' || move === '0-0-0' || move === 'O-O-O') {
    return true;
  }
  
  // Check basic move format with regex for Spanish notation
  // Allows formats like: Ae4, Cc3, Td1, Dh5, Re2, e4, dxe4, Axc6, Cxd5, etc.
  const moveRegex = /^([RADTC])?([a-h])?([1-8])?(x)?([a-h])([1-8])(=[RADTC])?[+#]?$/;
  return moveRegex.test(move);
};

/**
 * Parse a handwritten scoresheet
 * This would handle the format shown in the image with columns for white/black moves
 */
export const parseScoresheet = (text: string): { white: string, black: string }[] => {
  // Split text into lines and filter empty lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const moves: { white: string, black: string }[] = [];
  
  // Process lines that might contain move number, white move, and black move
  for (const line of lines) {
    // Look for patterns like "1. e4 e5" or "1 e4 e5"
    const moveMatch = line.match(/(\d+)(?:\.|\s+)?\s+([^\s]+)(?:\s+([^\s]+))?/);
    
    if (moveMatch) {
      const [, , whiteMoveText, blackMoveText] = moveMatch;
      moves.push({
        white: whiteMoveText || '',
        black: blackMoveText || ''
      });
    }
  }
  
  return moves;
};

/**
 * Simulates OCR processing for demo purposes
 * In a real app, this would connect to actual OCR service
 */
export const simulateOCR = (imageFile: File): Promise<string[]> => {
  // This would simulate detecting the scoresheet from the image
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample moves from the scoresheet in the image
      const sampleMoves = [
        "d4", "d5",
        "Cf3", "Cf6",
        "e3", "e6",
        "Ad3", "c5",
        "c3", "Ae7",
        "O-O", "c4",
        "Ac2", "Cd7",
        "Cd2", "Cf8",
        "e4", "c6",
        "Dc1", "Dc7",
        "e5", "Ch5",
        "g3", "Ch3",
        "Rg2", "Cg5",
        "Cxg5", "Cxg3",
        "Cxf3", "Axc1",
        "Cxg3", "Axf1",
        "Txc1", "Ad7",
        "Cg5", "f6",
        "exf6", "g6",
        "Cxh7", "Rf7",
        "Dg4", "Te8",
        "Cf5", "Rxf8",
        "Dxe6", "Dxg3",
        "Rxg3", "Axe6",
        "Cxe6", "Rf7",
        "Te1", "Te8",
        "Cg5", "Rf8",
        "Txe8", "Rxe8",
        "f7", "Re7",
        "Ce6", ""
      ];
      
      resolve(sampleMoves);
    }, 2000); // Simulate 2 second processing time
  });
};

/**
 * Processes the detected text into structured moves
 */
export const processDetectedText = (detectedText: string): { moveNumber: number, white?: string, black?: string }[] => {
  // Split text into lines and filter empty lines
  const lines = detectedText.split('\n').filter(line => line.trim() !== '');
  const moves: { moveNumber: number, white?: string, black?: string }[] = [];
  
  let currentMoveNumber = 1;
  let isParsingWhiteColumn = true;
  let currentWhiteMoves: string[] = [];
  let currentBlackMoves: string[] = [];
  
  // First identify if we have separate columns for white and black
  const hasColumns = lines.some(line => line.includes("Blancas") || line.includes("Negras"));
  
  if (hasColumns) {
    // Process columns separately (like in the image format)
    // This would need more complex parsing based on the exact format
    // For the specific image shown, we'd need to extract the move numbers and corresponding moves
    
    // Extract white moves with numbers (assuming they're in a specific format)
    const whiteMoveRegex = /(\d+)\s+([^\s]+)/g;
    const whiteMoveMatches = detectedText.matchAll(whiteMoveRegex);
    
    for (const match of whiteMoveMatches) {
      const [, numberStr, moveText] = match;
      const moveNumber = parseInt(numberStr);
      
      if (!isNaN(moveNumber)) {
        // Ensure we have an entry for this move number
        while (moves.length < moveNumber) {
          moves.push({ moveNumber: moves.length + 1 });
        }
        
        // Add white move
        moves[moveNumber - 1].white = moveText;
      }
    }
    
    // Now try to extract black moves and match them to move numbers
    // This is simplified and would need to be adjusted based on actual format
    const blackMoveRegex = /(\d+)\s+([^\s]+)/g;
    const blackSection = detectedText.split("Negras")[1] || "";
    const blackMoveMatches = blackSection.matchAll(blackMoveRegex);
    
    for (const match of blackMoveMatches) {
      const [, numberStr, moveText] = match;
      const moveNumber = parseInt(numberStr);
      
      if (!isNaN(moveNumber) && moveNumber <= moves.length) {
        // Add black move
        moves[moveNumber - 1].black = moveText;
      }
    }
  } else {
    // Process as standard notation like "1. e4 e5 2. Nf3 Nc6"
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line starts with move number like "1." or "1"
      if (/^\d+\.?\s/.test(line)) {
        const parts = line.split(/\s+/);
        let moveNumber = parseInt(parts[0]);
        
        if (isNaN(moveNumber) && parts.length > 1) {
          // Try parsing without the dot
          moveNumber = parseInt(parts[0].replace('.', ''));
        }
        
        if (!isNaN(moveNumber)) {
          let whiteMove = parts[1];
          let blackMove = parts[2];
          
          moves.push({
            moveNumber,
            white: whiteMove,
            black: blackMove
          });
        }
      }
    }
  }
  
  return moves;
};
