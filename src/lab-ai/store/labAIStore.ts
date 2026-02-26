import { create } from 'zustand';
import type {
  AudioSignal,
  SpectrogramData,
  ClassificationResult,
  ProcessingProgress,
  ModelType,
  LabAIError,
} from '../types';

interface LabAIStore {
  // Audio State
  audioSignal: AudioSignal | null;
  isRecording: boolean;
  recordingDuration: number;
  
  // DSP State
  spectrogramData: SpectrogramData | null;
  isProcessing: boolean;
  processingProgress: ProcessingProgress;
  
  // Model State
  selectedModel: ModelType;
  modelLoading: boolean;
  inferenceResults: ClassificationResult[];
  
  // UI State
  error: LabAIError | null;
  
  // Actions
  setAudioSignal: (signal: AudioSignal | null) => void;
  setIsRecording: (isRecording: boolean) => void;
  setRecordingDuration: (duration: number) => void;
  setSpectrogramData: (data: SpectrogramData | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProcessingProgress: (progress: ProcessingProgress) => void;
  setSelectedModel: (model: ModelType) => void;
  setModelLoading: (loading: boolean) => void;
  setInferenceResults: (results: ClassificationResult[]) => void;
  setError: (error: LabAIError | null) => void;
  reset: () => void;
}

const initialProgress: ProcessingProgress = {
  stage: 'idle',
  progress: 0,
  message: 'Ready to process audio',
};

export const useLabAIStore = create<LabAIStore>((set) => ({
  // Initial State
  audioSignal: null,
  isRecording: false,
  recordingDuration: 0,
  spectrogramData: null,
  isProcessing: false,
  processingProgress: initialProgress,
  selectedModel: 'precision',
  modelLoading: false,
  inferenceResults: [],
  error: null,
  
  // Actions
  setAudioSignal: (signal) => set({ audioSignal: signal }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setRecordingDuration: (duration) => set({ recordingDuration: duration }),
  setSpectrogramData: (data) => set({ spectrogramData: data }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setProcessingProgress: (progress) => set({ processingProgress: progress }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setModelLoading: (loading) => set({ modelLoading: loading }),
  setInferenceResults: (results) => set({ inferenceResults: results }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    audioSignal: null,
    isRecording: false,
    recordingDuration: 0,
    spectrogramData: null,
    isProcessing: false,
    processingProgress: initialProgress,
    inferenceResults: [],
    error: null,
  }),
}));
