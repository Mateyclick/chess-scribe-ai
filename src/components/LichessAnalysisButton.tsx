
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useChessScribe } from '@/context/ChessScribeContext';

const LichessAnalysisButton = () => {
  const { generatePGN } = useChessScribe();

  const openInLichess = () => {
    // Obtener el PGN actualizado
    const pgn = generatePGN();
    
    // Extraer solo los movimientos del PGN (eliminar los metadatos)
    const movesText = pgn.split('\n\n')[1] || '';
    
    // Limpiar los números de movimiento y espacios extra
    const cleanedMoves = movesText
      .replace(/\d+\.\s+/g, '') // Eliminar números de movimiento como "1. "
      .replace(/\s+/g, ' ')     // Normalizar espacios
      .trim();
    
    // Convertir espacios a guiones bajos para el formato requerido
    const formattedMoves = cleanedMoves.split(' ').join('_');
    
    // Crear la URL de Lichess con el formato /analysis/pgn/
    const lichessUrl = `https://lichess.org/analysis/pgn/${formattedMoves}`;
    
    // Abrir en una nueva pestaña
    window.open(lichessUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={openInLichess}
      className="bg-chess-burgundy hover:bg-chess-burgundy/90 text-white"
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      Analizar en Lichess
    </Button>
  );
};

export default LichessAnalysisButton;
