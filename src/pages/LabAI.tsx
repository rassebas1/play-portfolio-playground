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
import type { ModelType, AudioSignal, SpectrogramData, ClassificationResult, MelSpectrogram } from '@/lab-ai/types';
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
      dspEngineRef.current = new DSPEngine(4096, 512, 40, 125, 7500);
    }
  }, []);

  const runInference = useCallback(async (melSpectrogram: MelSpectrogram) => {
    setProcessingProgress({ stage: 'inference', progress: 80, message: 'Running inference...' });

    try {
      await inferenceEngine.loadModel(selectedModel);
      const results: ClassificationResult[] = await inferenceEngine.infer(melSpectrogram);

      setInferenceResults(results);
      setProcessingProgress({ stage: 'complete', progress: 100, message: 'Inference complete!' });
    } catch {
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Inference failed' });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedModel, setProcessingProgress, setInferenceResults, setIsProcessing]);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
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
      const reader = audioReaderRef.current;
      const dsp = dspEngineRef.current;
      if (!reader || !dsp) {
        throw new Error('Components not initialized');
      }

      const signal = await reader.decodeAudioFile(file);
      const resampled = await reader.resample(signal, 16000);
      
      const loudestSlice = dsp.extractLoudestSlice(resampled.data, resampled.sampleRate, 2000);
      const int16Data = dsp.convertToInt16(loudestSlice);
      
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
      
      setAudioSignal(slicedAudio);
      setProcessingProgress({ stage: 'audio', progress: 30, message: 'Processing audio...' });

      const melSpectrogram = dsp.computeMelSpectrogram(slicedAudio);
      
      const spectrogram: SpectrogramData = {
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
    } catch {
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Error processing audio' });
      setIsProcessing(false);
    }
  }, [initializeComponents, setAudioSignal, setIsProcessing, setProcessingProgress, setSpectrogramData, runInference]);

  const handleFileClear = useCallback(() => {
    setAudioSignal(null);
    setSpectrogramData(null);
    setInferenceResults([]);
    setProcessingProgress({ stage: 'idle', progress: 0, message: 'Ready to process audio' });
  }, [setAudioSignal, setSpectrogramData, setInferenceResults, setProcessingProgress]);

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
    setProcessingProgress({ stage: 'audio', progress: 50, message: 'Recording...' });
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

    const recorder = micRecorderRef.current;
    if (!recorder) {
      return;
    }

    setIsRecording(false);
    setIsProcessing(true);
    setProcessingProgress({ stage: 'audio', progress: 30, message: 'Processing recording...' });

    try {
      const signal = await recorder.stopRecording();
      
      const reader = audioReaderRef.current;
      const dsp = dspEngineRef.current;
      if (!reader || !dsp) {
        throw new Error('Components not initialized');
      }

      const resampled = await reader.resample(signal, 16000);
      
      const targetSamples = 2000 * 16;
      let slicedAudio: AudioSignal;
      if (resampled.data.length > targetSamples) {
        slicedAudio = {
          ...resampled,
          data: resampled.data.slice(0, targetSamples),
          duration: 2,
        };
      } else {
        slicedAudio = resampled;
      }
      
      setAudioSignal(slicedAudio);
      setRecordingDuration(recordingTime);
      
      const melSpectrogram = dsp.computeMelSpectrogram(slicedAudio);
      
      const spectrogram: SpectrogramData = {
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
    } catch {
      setProcessingProgress({ stage: 'error', progress: 0, message: 'Error processing recording' });
      setIsProcessing(false);
    }

    setRecordingTime(0);
  }, [setIsRecording, setIsProcessing, setProcessingProgress, setAudioSignal, setRecordingDuration, setSpectrogramData, runInference, recordingTime]);

  const handleModelSelect = useCallback((model: ModelType) => {
    setSelectedModel(model);
  }, [setSelectedModel]);

  useEffect(() => {
    inferenceEngine.loadModel('precision').catch(() => {});
    inferenceEngine.loadModel('efficiency').catch(() => {});
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

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-[600px]"
          >
            <InputBay
              onFileSelect={handleFileSelect}
              onFileClear={handleFileClear}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onModelSelect={handleModelSelect}
              selectedModel={selectedModel}
              isRecording={isRecording}
              audioSignal={audioSignal}
              isProcessing={isProcessing}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-[600px]"
          >
            <ProcessingTunnel
              spectrogramData={spectrogramData}
              processingProgress={processingProgress}
              audioData={audioSignal?.data ?? null}
            />
          </motion.div>

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
