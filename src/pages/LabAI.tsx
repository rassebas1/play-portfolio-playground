import React, { useCallback, useRef, useState } from 'react';
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

  const initializeComponents = useCallback(() => {
    if (!audioReaderRef.current) {
      audioReaderRef.current = new AudioFileReader();
    }
    if (!dspEngineRef.current) {
      dspEngineRef.current = new DSPEngine(2048, 512, 13);
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    initializeComponents();
    setIsProcessing(true);
    setProcessingProgress({ stage: 'loading', progress: 10, message: 'Loading audio file...' });

    try {
      const signal = await audioReaderRef.current!.decodeAudioFile(file);
      const resampled = await audioReaderRef.current!.resample(signal, 16000);
      
      setAudioSignal(resampled);
      setProcessingProgress({ stage: 'audio', progress: 30, message: 'Processing audio...' });

      const spectrogram = dspEngineRef.current!.computeSpectrogram(resampled);
      setSpectrogramData(spectrogram);
      setProcessingProgress({ stage: 'dsp', progress: 60, message: 'Computing features...' });

      await runInference(spectrogram, resampled);
    } catch (error) {
      console.error('Error processing audio:', error);
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Error processing audio' });
      setIsProcessing(false);
    }
  }, [initializeComponents, setAudioSignal, setIsProcessing, setProcessingProgress, setSpectrogramData]);

  const runInference = async (spectrogram: SpectrogramData, signal: AudioSignal) => {
    setProcessingProgress({ stage: 'inference', progress: 80, message: 'Running inference...' });

    await inferenceEngine.loadModel(selectedModel);

    const inputData = spectrogram.magnitudes.slice(0, 64).map(row => 
      row.slice(0, 64).map(val => val / 80)
    );

    const results: ClassificationResult[] = await inferenceEngine.infer(inputData);
    
    setInferenceResults(results);
    setProcessingProgress({ stage: 'complete', progress: 100, message: 'Inference complete!' });
    setIsProcessing(false);
  };

  const handleStartRecording = useCallback(async () => {
    initializeComponents();
    
    micRecorderRef.current = new MicrophoneRecorder();
    const hasPermission = await micRecorderRef.current.requestPermission();
    
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
    setRecordingProgress({ stage: 'audio', progress: 50, message: 'Recording...' });
    micRecorderRef.current.startRecording();

    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, [initializeComponents, setIsRecording, setProcessingProgress]);

  const handleStopRecording = useCallback(async () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (!micRecorderRef.current) return;

    setIsRecording(false);
    setIsProcessing(true);
    setProcessingProgress({ stage: 'audio', progress: 30, message: 'Processing recording...' });

    try {
      const signal = await micRecorderRef.current.stopRecording();
      const resampled = await audioReaderRef.current!.resample(signal, 16000);
      
      setAudioSignal(resampled);
      setRecordingDuration(recordingTime);
      
      const spectrogram = dspEngineRef.current!.computeSpectrogram(resampled);
      setSpectrogramData(spectrogram);
      setProcessingProgress({ stage: 'dsp', progress: 60, message: 'Computing features...' });

      await runInference(spectrogram, resampled);
    } catch (error) {
      console.error('Error processing recording:', error);
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Error processing recording' });
      setIsProcessing(false);
    }

    setRecordingTime(0);
  }, [setIsRecording, setIsProcessing, setProcessingProgress, setAudioSignal, setRecordingDuration, setSpectrogramData, recordingTime]);

  const handleModelSelect = useCallback((model: ModelType) => {
    setSelectedModel(model);
  }, [setSelectedModel]);

  // Helper for recording progress
  const setRecordingProgress = (progress: { stage: 'idle' | 'loading' | 'audio' | 'dsp' | 'inference' | 'complete' | 'error'; progress: number; message: string }) => {
    setProcessingProgress(progress);
  };

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
