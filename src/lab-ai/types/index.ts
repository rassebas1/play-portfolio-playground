export interface AudioSignal {
  sampleRate: number;
  channels: number;
  data: Float32Array;
  duration: number;
}

export interface SpectrogramData {
  frequencies: number[];
  times: number[];
  magnitudes: number[][];
  sampleRate: number;
  windowSize: number;
  hopSize: number;
}

export interface MFCCData {
  coefficients: number[][];
  times: number[];
  numCoefficients: number;
  sampleRate: number;
}

export interface ClassificationResult {
  species: string;
  confidence: number;
  inferenceTime: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  accuracy: number;
  memoryKB: number;
  inputShape: number[];
  labels: string[];
}

export interface ProcessingProgress {
  stage: 'idle' | 'loading' | 'audio' | 'dsp' | 'inference' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface LabAIError {
  code: string;
  message: string;
  details?: string;
}

export type ModelType = 'precision' | 'efficiency';

export interface AudioInputSource {
  type: 'file' | 'microphone';
  file?: File;
  isRecording?: boolean;
}

export interface WaveformState {
  data: Float32Array | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
