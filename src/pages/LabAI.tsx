import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { InputBay } from '@/lab-ai/components/input/InputBay';
import { ProcessingTunnel } from '@/lab-ai/components/processing/ProcessingTunnel';
import { ResultInsight } from '@/lab-ai/components/results/ResultInsight';
import { AudioFileReader, MicrophoneRecorder } from '@/lab-ai/core/audio/AudioIngestion';
import { DSPEngine } from '@/lab-ai/core/dsp/DSPEngine';
import { inferenceEngine } from '@/lab-ai/core/model/InferenceEngine';
import { useLabAIStore } from '@/lab-ai/store/labAIStore';
import type { ModelType, AudioSignal, SpectrogramData, ClassificationResult } from '@/lab-ai/types';
import { Sparkles, FlaskConical, Binary } from 'lucide-react';

const LabAI: React.FC = () => {
  const { t } = useTranslation('common');
  
  const {
    audioSignal,
    isRecording,
    spectrogramData,
    isProcessing,
    processingProgress,
    selectedModel,
    inferenceResults,
    setAudioSignal,
    setIsRecording,
    setRecordingDuration,
    setSpectrogramData,
    setIsProcessing,
    setProcessingProgress,
    setSelectedModel,
    setInferenceResults,
    reset,
  } = useLabAIStore();

  const audioReaderRef = useRef<AudioFileReader | null>(null);
  const micRecorderRef = useRef<MicrophoneRecorder | null>(null);
  const dspEngineRef = useRef<DSPEngine | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Debug: Log state changes
  useEffect(() => {
    console.log('[LabAI] State changed:', {
      isProcessing,
      isRecording,
      selectedModel,
      progressStage: processingProgress.stage,
      hasAudioSignal: !!audioSignal,
      hasSpectrogram: !!spectrogramData,
      resultsCount: inferenceResults.length,
    });
  }, [isProcessing, isRecording, selectedModel, processingProgress.stage, audioSignal, spectrogramData, inferenceResults]);

  const initializeComponents = useCallback(() => {
    console.log('[LabAI] Initializing components...');
    if (!audioReaderRef.current) {
      console.log('[LabAI] Creating AudioFileReader');
      audioReaderRef.current = new AudioFileReader();
    }
    if (!dspEngineRef.current) {
      console.log('[LabAI] Creating DSPEngine with params: window=4096, hop=512, mel=40, melLow=125, melHigh=7500');
      dspEngineRef.current = new DSPEngine(4096, 512, 40, 125, 7500);
    }
  }, []);

  const runInference = useCallback(async (melSpectrogram: number[][]) => {
    console.log('[LabAI] Starting inference with model:', selectedModel);
    setProcessingProgress({ stage: 'inference', progress: 80, message: 'Running inference...' });

    try {
      console.log('[LabAI] Loading model...');
      await inferenceEngine.loadModel(selectedModel);
      console.log('[LabAI] Model loaded, preparing input...');

      // Use the mel spectrogram directly - already has shape [55, 40]
      console.log('[LabAI] Mel spectrogram shape:', melSpectrogram.length, 'x', melSpectrogram[0]?.length);

      console.log('[LabAI] Running inference...');
      const results: ClassificationResult[] = await inferenceEngine.infer(melSpectrogram);
      console.log('[LabAI] Inference results:', results);

      setInferenceResults(results);
      setProcessingProgress({ stage: 'complete', progress: 100, message: 'Inference complete!' });
    } catch (error) {
      console.error('[LabAI] Inference error:', error);
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Inference failed' });
    } finally {
      console.log('[LabAI] Setting isProcessing to false');
      setIsProcessing(false);
    }
  }, [selectedModel, setProcessingProgress, setInferenceResults, setIsProcessing]);

  const handleFileSelect = useCallback(async (file: File) => {
    console.log('[LabAI] File selected:', file?.name, file?.type, file?.size);
    
    if (!file) {
      console.log('[LabAI] Clearing audio signal');
      setAudioSignal(null);
      setSpectrogramData(null);
      setInferenceResults([]);
      setProcessingProgress({ stage: 'idle', progress: 0, message: 'Ready to process audio' });
      return;
    }

    initializeComponents();
    setIsProcessing(true);
    setProcessingProgress({ stage: 'loading', progress: 10, message: 'Loading audio file...' });

    try {
      console.log('[LabAI] Decoding audio file...');
      const signal = await audioReaderRef.current!.decodeAudioFile(file);
      console.log('[LabAI] Audio decoded:', signal.sampleRate, signal.channels, signal.duration);
      
      console.log('[LabAI] Resampling to 16kHz...');
      const resampled = await audioReaderRef.current!.resample(signal, 16000);
      console.log('[LabAI] Resampled:', resampled.sampleRate, resampled.channels, resampled.duration);
      
      // Use extractLoudestSlice to match training pipeline (center on max amplitude)
      console.log('[LabAI] Extracting loudest 2000ms slice...');
      const loudestSlice = dspEngineRef.current!.extractLoudestSlice(resampled.data, resampled.sampleRate, 2000);
      
      // Convert to int16 to match training pipeline
      console.log('[LabAI] Converting to int16...');
      const int16Data = dspEngineRef.current!.convertToInt16(loudestSlice);
      
      // Convert back to Float32 for DSP processing (librosa does this internally)
      const floatData = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        floatData[i] = int16Data[i] / 32767;
      }
      
      const slicedAudio: AudioSignal = {
        sampleRate: resampled.sampleRate,
        channels: resampled.channels,
        data: floatData,
        duration: 2000 / 1000,
      };
      console.log('[LabAI] Audio sliced:', slicedAudio.data.length, 'samples,', slicedAudio.duration, 's');
      
      setAudioSignal(slicedAudio);
      setProcessingProgress({ stage: 'audio', progress: 30, message: 'Processing audio...' });

      console.log('[LabAI] Computing mel spectrogram...');
      const melSpectrogram = dspEngineRef.current!.computeMelSpectrogram(slicedAudio);
      console.log('[LabAI] Mel spectrogram computed:', melSpectrogram.length, 'x', melSpectrogram[0]?.length);
      
      // Create spectrogram data for visualization
      const spectrogram = {
        frequencies: Array.from({ length: melSpectrogram[0]?.length || 40 }, (_, i) => i),
        times: Array.from({ length: melSpectrogram.length }, (_, i) => i * 512 / 16000),
        magnitudes: melSpectrogram,
        sampleRate: slicedAudio.sampleRate,
        windowSize: 4096,
        hopSize: 512,
      };
      setSpectrogramData(spectrogram);
      setProcessingProgress({ stage: 'dsp', progress: 60, message: 'Computing features...' });

      await runInference(melSpectrogram);
    } catch (error) {
      console.error('[LabAI] Error processing audio:', error);
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Error processing audio' });
      setIsProcessing(false);
    }
  }, [initializeComponents, setAudioSignal, setIsProcessing, setProcessingProgress, setSpectrogramData, runInference]);

  const handleStartRecording = useCallback(async () => {
    console.log('[LabAI] Starting recording...');
    initializeComponents();
    
    micRecorderRef.current = new MicrophoneRecorder();
    const hasPermission = await micRecorderRef.current.requestPermission();
    console.log('[LabAI] Mic permission:', hasPermission);
    
    if (!hasPermission) {
      setProcessingProgress({ 
        stage: 'error', 
        progress: 0, 
        message: 'Microphone permission denied' 
      });
      return;
    }

    setIsRecording(true);
    setRecordingTime(0);
    setProcessingProgress({ stage: 'audio', progress: 50, message: 'Recording...' });
    micRecorderRef.current.startRecording();
    console.log('[LabAI] Recording started');

    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, [initializeComponents, setIsRecording, setProcessingProgress]);

  const handleStopRecording = useCallback(async () => {
    console.log('[LabAI] Stopping recording...');
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (!micRecorderRef.current) {
      console.log('[LabAI] No mic recorder instance');
      return;
    }

    setIsRecording(false);
    setIsProcessing(true);
    setProcessingProgress({ stage: 'audio', progress: 30, message: 'Processing recording...' });

    try {
      console.log('[LabAI] Processing recorded audio...');
      const signal = await micRecorderRef.current.stopRecording();
      console.log('[LabAI] Recording processed:', signal.sampleRate, signal.channels, signal.duration);
      
      const resampled = await audioReaderRef.current!.resample(signal, 16000);
      
      // Slice to 2000ms
      const targetSamples = 2000 * 16;
      let slicedAudio = resampled;
      if (resampled.data.length > targetSamples) {
        slicedAudio = {
          ...resampled,
          data: resampled.data.slice(0, targetSamples),
          duration: 2,
        };
      }
      
      setAudioSignal(slicedAudio);
      setRecordingDuration(recordingTime);
      
      const melSpectrogram = dspEngineRef.current!.computeMelSpectrogram(slicedAudio);
      
      const spectrogram = {
        frequencies: Array.from({ length: melSpectrogram[0]?.length || 40 }, (_, i) => i),
        times: Array.from({ length: melSpectrogram.length }, (_, i) => i * 512 / 16000),
        magnitudes: melSpectrogram,
        sampleRate: slicedAudio.sampleRate,
        windowSize: 4096,
        hopSize: 512,
      };
      setSpectrogramData(spectrogram);
      setProcessingProgress({ stage: 'dsp', progress: 60, message: 'Computing features...' });

      await runInference(melSpectrogram);
    } catch (error) {
      console.error('[LabAI] Error processing recording:', error);
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Error processing recording' });
      setIsProcessing(false);
    }

    setRecordingTime(0);
  }, [setIsRecording, setIsProcessing, setProcessingProgress, setAudioSignal, setRecordingDuration, setSpectrogramData, runInference, recordingTime]);

  const handleModelSelect = useCallback((model: ModelType) => {
    console.log('[LabAI] Model selected:', model);
    setSelectedModel(model);
  }, [setSelectedModel]);

  // Debug: Log model loading on mount
  useEffect(() => {
    console.log('[LabAI] Pre-loading models in background...');
    inferenceEngine.loadModel('precision').catch(e => console.log('[LabAI] Precision model pre-load:', e.message));
    inferenceEngine.loadModel('efficiency').catch(e => console.log('[LabAI] Efficiency model pre-load:', e.message));
  }, []);

  return (
    <motion.div
      key="lab-ai-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute inset-0 bg-radial-glow" />
        
        <div className="container relative mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>BioDCASE 2025 Project</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Big Data & AI Lab
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TinyML Bird Classifier — Run 98% accurate inference directly in your browser
            </p>
          </motion.div>

          {/* Tech badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
              <FlaskConical className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">TinyML</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
              <Binary className="w-4 h-4 text-secondary-foreground" />
              <span className="text-sm font-medium">TensorFlow.js</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
              <span className="text-sm font-medium">D3.js Visualization</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content - 3 Zone Layout */}
      <div className="container mx-auto px-4 pb-16">
        {/* Debug info - remove in production */}
        <div className="mb-4 p-2 bg-muted/50 rounded text-xs font-mono">
          DEBUG: isProcessing={String(isProcessing)} | isRecording={String(isRecording)} | model={selectedModel}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Zone 1: Input Bay */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-[600px]"
          >
            <InputBay
              onFileSelect={handleFileSelect}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onModelSelect={handleModelSelect}
              selectedModel={selectedModel}
              isRecording={isRecording}
              audioSignal={audioSignal}
              isProcessing={isProcessing}
            />
          </motion.div>

          {/* Zone 2: Processing Tunnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-[600px]"
          >
            <ProcessingTunnel
              spectrogramData={spectrogramData}
              processingProgress={processingProgress}
              audioData={audioSignal?.data || null}
            />
          </motion.div>

          {/* Zone 3: Result Insight */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="h-[600px]"
          >
            <ResultInsight
              results={inferenceResults}
              modelType={selectedModel}
              isProcessing={isProcessing}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LabAI;
