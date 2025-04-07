
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useChessScribe } from '@/context/ChessScribeContext';

const LichessAnalysisButton = () => {
  const { generatePGN } = useChessScribe();

  const openInLichess = () => {
    // Obtener el PGN actualizado
    const pgn = generatePGN();
    
    // Codificar el PGN para la URL
    const encodedPGN = encodeURIComponent(pgn);
    
    // Crear la URL de Lichess para análisis
    const lichessUrl = `https://lichess.org/analysis?pgn=${encodedPGN}`;
    
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
