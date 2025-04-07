
import React, { useState } from 'react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit2, CheckCircle, AlertTriangle } from 'lucide-react';

const ChessNotation = () => {
  const { moves, updateMove, addMove } = useChessScribe();
  const [editingMove, setEditingMove] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<'white' | 'black' | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditClick = (moveId: string, color: 'white' | 'black', value: string = '') => {
    setEditingMove(moveId);
    setEditingColor(color);
    setEditValue(value);
  };

  const handleEditSave = () => {
    if (editingMove && editingColor) {
      if (editingColor === 'white') {
        updateMove(editingMove, editValue);
      } else {
        updateMove(editingMove, undefined, editValue);
      }
      setEditingMove(null);
      setEditingColor(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditingMove(null);
      setEditingColor(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-serif">Notación detectada</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="notation-text p-3 bg-chess-cream/50 rounded shadow-inner min-h-[150px]">
          {moves.length === 0 ? (
            <p className="text-muted-foreground text-center italic">
              No se ha detectado ninguna notación todavía. Sube una imagen para comenzar.
            </p>
          ) : (
            <div className="space-y-2">
              {moves.map((move) => (
                <div key={move.id} className="flex items-start">
                  <span className="move-number mr-2">{move.moveNumber}.</span>
                  
                  <div className="flex-1 flex gap-2">
                    {editingMove === move.id && editingColor === 'white' ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="h-8 w-20"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={handleEditSave}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className={`move-text flex-1 ${move.whiteValid === false ? 'line-through text-red-500' : ''}`}
                        onClick={() => handleEditClick(move.id, 'white', move.white)}
                      >
                        {move.white || '_____'}
                        <button className="ml-1 opacity-30 hover:opacity-100">
                          <Edit2 className="h-3 w-3 inline" />
                        </button>
                        {move.whiteValid === false && (
                          <AlertTriangle className="h-3 w-3 inline ml-1 text-yellow-500" />
                        )}
                      </span>
                    )}
                    
                    {editingMove === move.id && editingColor === 'black' ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="h-8 w-20"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={handleEditSave}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className={`move-text flex-1 ${move.blackValid === false ? 'line-through text-red-500' : ''}`}
                        onClick={() => handleEditClick(move.id, 'black', move.black)}
                      >
                        {move.black || '_____'}
                        <button className="ml-1 opacity-30 hover:opacity-100">
                          <Edit2 className="h-3 w-3 inline" />
                        </button>
                        {move.blackValid === false && (
                          <AlertTriangle className="h-3 w-3 inline ml-1 text-yellow-500" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline"
            className="text-sm"
            onClick={addMove}
          >
            Añadir movimiento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChessNotation;
