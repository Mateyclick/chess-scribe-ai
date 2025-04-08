
import React, { useState, useEffect } from 'react';
import { useChessScribe } from '@/context/ChessScribeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit2, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { convertSpanishToStandard } from '@/lib/notationUtils';

const ChessNotation = () => {
  const { moves, updateMove, addMove, validateMoves } = useChessScribe();
  const [editingMove, setEditingMove] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<'white' | 'black' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Validate moves on component mount
  useEffect(() => {
    validateMoves();
  }, []);

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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-serif">Notación detectada</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={validateMoves}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Validar
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={addMove}
          >
            <Plus className="h-3 w-3 mr-1" />
            Añadir
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="notation-text p-3 bg-chess-cream/50 rounded shadow-inner max-h-[350px] overflow-y-auto">
          {moves.length === 0 ? (
            <p className="text-muted-foreground text-center italic">
              No se ha detectado ninguna notación todavía. Sube una imagen para comenzar.
            </p>
          ) : (
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1.5 text-sm">
              {/* Header */}
              <div className="font-semibold text-xs text-center">#</div>
              <div className="font-semibold text-xs">Blancas</div>
              <div className="font-semibold text-xs">Negras</div>
              
              {/* Moves */}
              {moves.map((move) => (
                <React.Fragment key={move.id}>
                  <div className="text-center text-xs text-muted-foreground py-1">{move.moveNumber}.</div>
                  
                  {/* White move */}
                  <div>
                    {editingMove === move.id && editingColor === 'white' ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="h-7 text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={handleEditSave}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className={`py-1 px-2 rounded hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                          move.whiteValid === false ? 'bg-red-100 text-red-500' : ''
                        }`}
                        onClick={() => handleEditClick(move.id, 'white', move.white)}
                      >
                        <span>{move.white || '—'}</span>
                        {move.whiteValid === false && <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />}
                        <Edit2 className="h-3 w-3 opacity-30 hover:opacity-100" />
                      </div>
                    )}
                  </div>
                  
                  {/* Black move */}
                  <div>
                    {editingMove === move.id && editingColor === 'black' ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="h-7 text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={handleEditSave}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className={`py-1 px-2 rounded hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                          move.blackValid === false ? 'bg-red-100 text-red-500' : ''
                        }`}
                        onClick={() => handleEditClick(move.id, 'black', move.black)}
                      >
                        <span>{move.black || '—'}</span>
                        {move.blackValid === false && <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />}
                        <Edit2 className="h-3 w-3 opacity-30 hover:opacity-100" />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChessNotation;
