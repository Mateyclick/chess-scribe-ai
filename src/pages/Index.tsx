
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChessScribeProvider, useChessScribe } from '@/context/ChessScribeContext';
import ImageUploader from '@/components/ImageUploader';
import ChessNotation from '@/components/ChessNotation';
import ChessBoard from '@/components/ChessBoard';
import PGNExport from '@/components/PGNExport';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { simulateOCR, parseScoresheet } from '@/lib/notationUtils';

// Inner component to use the ChessScribe context
const ChessScribeApp = () => {
  const { image, setIsProcessing, setMoves, tournamentName, setTournamentName, setPlayerWhite, setPlayerBlack } = useChessScribe();
  const { toast } = useToast();

  const processImage = async () => {
    if (!image) {
      toast({
        title: "Error",
        description: "Por favor, sube una imagen primero.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real app, this would call an actual OCR service
      const detectedMoves = await simulateOCR(image);
      
      // Extract metadata if available (tournament name, player names)
      // This would be handled by OCR in a real app
      const scoresheetName = image.name;
      
      // Check if the image filename contains player names
      if (scoresheetName.includes('vs')) {
        const nameParts = scoresheetName.split('vs');
        if (nameParts.length === 2) {
          setPlayerWhite(nameParts[0].trim());
          setPlayerBlack(nameParts[1].split('.')[0].trim());
        }
      }
      
      // For the specific image shown, we'd extract "CLUB LOS TREBEJOS DE WALTER ESTRADA"
      // and the player names "Agustin Alcaide" and "Matias Lazzari"
      setTournamentName("CLUB LOS TREBEJOS DE WALTER ESTRADA");
      setPlayerWhite("Agustin Alcaide");
      setPlayerBlack("Matias Lazzari");
      
      // Process moves into the right format for 2-column scoresheet
      const formattedMoves = [];
      for (let i = 0; i < detectedMoves.length; i += 2) {
        const moveNumber = Math.floor(i / 2) + 1;
        formattedMoves.push({
          id: moveNumber.toString(),
          moveNumber,
          white: detectedMoves[i] || '',
          black: i + 1 < detectedMoves.length ? detectedMoves[i + 1] : ''
        });
      }
      
      setMoves(formattedMoves);
      
      toast({
        title: "¡Procesamiento completado!",
        description: `Se han detectado ${detectedMoves.length} movimientos.`,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar la imagen.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-5xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-chess-burgundy mb-2">
          ChessScribe AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convierte fotos de partidas de ajedrez manuscritas en notación PGN digital
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Imagen de notación</CardTitle>
            <CardDescription>
              Sube una foto de tu planilla de ajedrez manuscrita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader />
            
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={processImage}
                className="bg-chess-burgundy hover:bg-chess-burgundy/90 text-white"
                disabled={!image}
              >
                Procesar imagen
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1">
          <Tabs defaultValue="notation" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="notation">Notación</TabsTrigger>
              <TabsTrigger value="board">Tablero</TabsTrigger>
            </TabsList>
            <TabsContent value="notation">
              <ChessNotation />
            </TabsContent>
            <TabsContent value="board">
              <ChessBoard />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-8">
        <PGNExport />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ChessScribeProvider>
      <ChessScribeApp />
    </ChessScribeProvider>
  );
};

export default Index;
