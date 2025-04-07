
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ClipboardCopy, CheckCircle2 } from 'lucide-react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

const PGNExport = () => {
  const { 
    generatePGN, 
    tournamentName, 
    playerWhite, 
    playerBlack,
    setTournamentName,
    setPlayerWhite,
    setPlayerBlack 
  } = useChessScribe();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyPGN = () => {
    const pgn = generatePGN();
    navigator.clipboard.writeText(pgn);
    
    setCopied(true);
    toast({
      title: "Copiado al portapapeles",
      description: "El PGN ha sido copiado al portapapeles.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownloadPGN = () => {
    const pgn = generatePGN();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `ChessScribe_${new Date().toISOString().slice(0, 10)}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "PGN descargado",
      description: "El archivo PGN se ha descargado correctamente.",
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Exportar PGN</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tournament">Torneo</Label>
            <Input 
              id="tournament" 
              value={tournamentName} 
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="Nombre del torneo"
            />
          </div>
          
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="playerWhite">Jugador (Blancas)</Label>
              <Input 
                id="playerWhite" 
                value={playerWhite} 
                onChange={(e) => setPlayerWhite(e.target.value)}
                placeholder="Jugador con blancas"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="playerBlack">Jugador (Negras)</Label>
              <Input 
                id="playerBlack" 
                value={playerBlack} 
                onChange={(e) => setPlayerBlack(e.target.value)}
                placeholder="Jugador con negras"
              />
            </div>
          </div>
        </div>
        
        <pre className="bg-chess-cream/50 p-3 rounded text-sm overflow-auto max-h-40 shadow-inner whitespace-pre-wrap font-mono">
          {generatePGN()}
        </pre>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="flex gap-2 items-center"
          onClick={handleCopyPGN}
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Copiado
            </>
          ) : (
            <>
              <ClipboardCopy className="h-4 w-4" />
              Copiar PGN
            </>
          )}
        </Button>
        
        <Button
          className="bg-chess-burgundy hover:bg-chess-burgundy/90 text-white flex gap-2 items-center"
          onClick={handleDownloadPGN}
        >
          <Download className="h-4 w-4" />
          Descargar PGN
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PGNExport;
