
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
 * Simulates OCR processing for demo purposes
 * In a real app, this would connect to actual OCR service
 */
export const simulateOCR = (imageFile: File): Promise<string[]> => {
  // This is just a placeholder that returns some sample chess moves
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample Spanish chess notation
      const sampleMoves = [
        "e4", "e5",
        "Cf3", "Cc6",
        "Ab5", "a6",
        "Axc6", "dxc6",
        "0-0", "Ad6",
        "d4", "exd4",
        "Dxd4", "f6",
        "Cc3", "Ce7",
        "Td1", "De6",
        "Dxe6+", "Axe6",
        "Ad2", "0-0-0"
      ];
      
      resolve(sampleMoves);
    }, 2000); // Simulate 2 second processing time
  });
};

/**
 * Processes the detected text into structured moves
 */
export const processDetectedText = (detectedText: string): { moveNumber: number, white?: string, black?: string }[] => {
  // Simple processing for demo purposes
  // A real implementation would need more robust parsing
  
  const lines = detectedText.split('\n').filter(line => line.trim() !== '');
  const moves: { moveNumber: number, white?: string, black?: string }[] = [];
  
  let currentMoveNumber = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const moveParts = line.split(/\s+/);
    
    // If line starts with a move number (e.g. "1.")
    if (moveParts[0].endsWith('.') && !isNaN(parseInt(moveParts[0]))) {
      const moveNumber = parseInt(moveParts[0]);
      const white = moveParts[1];
      const black = moveParts[2];
      
      moves.push({
        moveNumber,
        white: white || '',
        black: black || ''
      });
      
      currentMoveNumber = moveNumber + 1;
    } else {
      // If line doesn't start with a move number, try to parse it as continuation
      if (moves.length > 0) {
        const lastMove = moves[moves.length - 1];
        if (!lastMove.black && moveParts[0]) {
          lastMove.black = moveParts[0];
        } else {
          moves.push({
            moveNumber: currentMoveNumber,
            white: moveParts[0] || '',
            black: moveParts[1] || ''
          });
          currentMoveNumber++;
        }
      } else {
        // First move without number
        moves.push({
          moveNumber: currentMoveNumber,
          white: moveParts[0] || '',
          black: moveParts[1] || ''
        });
        currentMoveNumber++;
      }
    }
  }
  
  return moves;
};
