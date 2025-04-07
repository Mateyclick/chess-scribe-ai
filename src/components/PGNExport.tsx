
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ClipboardCopy, CheckCircle2 } from 'lucide-react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const PGNExport = () => {
  const { generatePGN } = useChessScribe();
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
      
      <CardContent>
        <pre className="bg-chess-cream/50 p-3 rounded text-sm overflow-auto max-h-40 shadow-inner">
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
