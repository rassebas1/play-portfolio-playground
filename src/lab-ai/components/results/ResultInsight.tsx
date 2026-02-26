import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Clock, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/display/progress';
import type { ClassificationResult, ModelConfig, ModelType } from '../../types';

interface ResultInsightProps {
  results: ClassificationResult[];
  modelType: ModelType;
  isProcessing: boolean;
}

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  precision: {
    id: 'bird-classifier-precision',
    name: 'High Precision',
    accuracy: 0.98,
    memoryKB: 16,
    inputShape: [1, 1, 64, 64],
    labels: [],
  },
  efficiency: {
    id: 'bird-classifier-efficiency',
    name: 'High Efficiency',
    accuracy: 0.94,
    memoryKB: 12,
    inputShape: [1, 1, 32, 32],
    labels: [],
  },
};

export const ResultInsight: React.FC<ResultInsightProps> = ({
  results,
  modelType,
  isProcessing,
}) => {
  const config = MODEL_CONFIGS[modelType];
  const topResult = results[0];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-accent/5 border-primary/20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          Result Insight
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono text-primary">...</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Running inference...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Main Result - Confidence Gauge */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  {/* Background circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="hsl(var(--muted) / 0.2)"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={351.86}
                      initial={{ strokeDashoffset: 351.86 }}
                      animate={{
                        strokeDashoffset: 351.86 * (1 - topResult.confidence),
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={getConfidenceColor(topResult.confidence)}
                    />
                  </svg>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-3xl font-bold ${getConfidenceColor(topResult.confidence)}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {Math.round(topResult.confidence * 100)}%
                    </motion.span>
                    <span className="text-xs text-muted-foreground">confidence</span>
                  </div>
                </div>
                
                {/* Species label */}
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-lg font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {topResult.species}
                  </p>
                  <p className="text-sm text-muted-foreground">Top prediction</p>
                </motion.div>
              </div>
            </div>

            {/* Alternative predictions */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Other Predictions
              </label>
              {results.slice(1).map((result, index) => (
                <motion.div
                  key={result.species}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{result.species}</span>
                      <span className={`text-xs font-mono ${getConfidenceColor(result.confidence)}`}>
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={result.confidence * 100}
                      className="h-1"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <div className="p-3 rounded-lg bg-background/50 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Inference
                </div>
                <p className="font-mono text-sm font-semibold text-primary">
                  {topResult.inferenceTime.toFixed(1)}ms
                </p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HardDrive className="w-3 h-3" />
                  Memory
                </div>
                <p className="font-mono text-sm font-semibold text-primary">
                  {config.memoryKB} KB
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Upload audio or record<br />to see classification results
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultInsight;
