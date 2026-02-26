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

/**
 * Processing stages for the audio classification pipeline.
 * Used to track progress through loading, DSP, and inference phases.
 */
export type ProcessingStage = 'idle' | 'loading' | 'audio' | 'dsp' | 'inference' | 'complete' | 'error';

/**
 * Error codes for the LabAI feature.
 * Provides specific error categorization for better error handling.
 */
export type LabAIErrorCode = 
  | 'AUDIO_DECODE_ERROR'    // Failed to decode audio file
  | 'RESAMPLE_ERROR'         // Failed to resample audio
  | 'DSP_ERROR'              // DSP processing failed
  | 'MODEL_LOAD_ERROR'       // Failed to load TensorFlow.js model
  | 'INFERENCE_ERROR'       // Model inference failed
  | 'MICROPHONE_ERROR'      // Microphone access denied or failed
  | 'UNKNOWN_ERROR';        // Unclassified error

/**
 * Error object for LabAI feature.
 * Contains error code, message, and optional details for debugging.
 */
export interface LabAIError {
  code: LabAIErrorCode;
  message: string;
  details?: string;
}

/**
 * Progress tracking for the processing pipeline.
 * @property stage - Current processing stage
 * @property progress - Progress percentage (0-100)
 * @property message - Human-readable status message
 */
export interface ProcessingProgress {
  stage: ProcessingStage;
  progress: number;
  message: string;
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

/**
 * Type alias for mel spectrogram data.
 * Represents a 2D array of shape [frames, mel_bins] = [55, 40]
 * where each value is the log-mel energy for that time-frequency bin.
 */
export type MelSpectrogram = readonly (readonly number[])[];
