import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Mic, MicOff, X, AudioWaveform } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { ModelType, AudioSignal } from '../../types';

interface InputBayProps {
  onFileSelect: (file: File | null) => void;
  onFileClear?: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onModelSelect: (model: ModelType) => void;
  selectedModel: ModelType;
  isRecording: boolean;
  audioSignal: AudioSignal | null;
  isProcessing: boolean;
}

export const InputBay: React.FC<InputBayProps> = ({
  onFileSelect,
  onFileClear,
  onStartRecording,
  onStopRecording,
  onModelSelect,
  selectedModel,
  isRecording,
  audioSignal,
  isProcessing,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/wav': ['.wav'],
      'audio/mp3': ['.mp3'],
      'audio/ogg': ['.ogg'],
      'audio/webm': ['.webm'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 overflow-visible">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" style={{ zIndex: 0 }} />
      
      <CardHeader className="relative pb-4" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <AudioWaveform className="w-4 h-4 text-primary" />
            </div>
            Input Bay
          </CardTitle>
          <Badge variant="outline" className="text-xs font-mono">
            {selectedModel === 'precision' ? '98% ACC' : '94% EFF'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4" style={{ zIndex: 1 }}>
        {/* Model Selector */}
        <div className="space-y-2 pointer-events-auto">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Model Selection
          </label>
          <Select
            value={selectedModel}
            onValueChange={(value) => onModelSelect(value as ModelType)}
            disabled={isProcessing}
          >
            <SelectTrigger className="bg-background/50 border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="precision">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  High Precision (98%)
                </div>
              </SelectItem>
              <SelectItem value="efficiency">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  High Efficiency (94%)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer pointer-events-auto
            ${isDragActive 
              ? 'border-primary bg-primary/10 scale-[1.02]' 
              : 'border-primary/30 hover:border-primary/50 bg-background/30'
            }
            ${audioSignal ? 'border-green-500/50 bg-green-500/5' : ''}
            ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="p-6 text-center">
            <AnimatePresence mode="wait">
              {audioSignal ? (
                <motion.div
                  key="audio-info"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-2"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <AudioWaveform className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-sm font-medium text-green-400">
                    {formatDuration(audioSignal.duration)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {audioSignal.sampleRate}Hz • {audioSignal.channels}ch
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileClear?.();
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="drop-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop audio here' : 'Drag & drop audio'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      WAV, MP3, OGG, WebM
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recording Button */}
        <div className="relative pointer-events-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0" />
          <Button
            variant={isRecording ? 'destructive' : 'outline'}
            className="w-full relative overflow-hidden group"
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={isProcessing || !!audioSignal}
          >
            <motion.div
              className="flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/50 animate-ping rounded-full" />
                    <MicOff className="w-4 h-4" />
                  </div>
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </>
              )}
            </motion.div>
          </Button>
          
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">REC</span>
            </motion.div>
          )}
        </div>

        {/* Tech specs */}
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-background/50">
              <p className="text-muted-foreground">Memory</p>
              <p className="font-mono font-semibold text-primary">
                {selectedModel === 'precision' ? '16 KB' : '12 KB'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-background/50">
              <p className="text-muted-foreground">Inference</p>
              <p className="font-mono font-semibold text-primary">~27ms</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputBay;
