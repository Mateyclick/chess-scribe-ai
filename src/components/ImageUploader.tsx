
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useChessScribe } from '@/context/ChessScribeContext';
import { useToast } from '@/components/ui/use-toast';

const ImageUploader = () => {
  const { image, imageUrl, setImage, isProcessing } = useChessScribe();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "El archivo debe ser una imagen (JPG, PNG).",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen es demasiado grande. Tamaño máximo: 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setImage(file);
    
    toast({
      title: "Imagen subida",
      description: "La imagen se ha cargado correctamente.",
    });
  }, [setImage, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    disabled: isProcessing
  });
  
  const clearImage = () => {
    setImage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mb-4 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Subir imagen de notación</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Arrastra y suelta una foto de tu notación de ajedrez manuscrita, o haz clic para seleccionar
          </p>
          <Button className="bg-chess-burgundy hover:bg-chess-burgundy/90">
            Seleccionar imagen
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            JPG, JPEG, PNG • Tamaño máximo 5MB
          </p>
        </div>
      ) : (
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
            onClick={clearImage}
            disabled={isProcessing}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardContent className="p-4">
            {imageUrl && (
              <div className="relative rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Notación de ajedrez"
                  className="w-full h-auto object-contain max-h-[400px]"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent w-10 h-10 animate-spin mb-2"></div>
                      <p className="text-sm">Procesando imagen...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;
