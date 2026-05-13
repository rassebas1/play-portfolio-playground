import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/tests/utils/render';
import LabAI from './LabAI';

const mockTrackPage = vi.fn();

let mockStore: ReturnType<typeof createStoreState>;

function createStoreState(overrides: Record<string, unknown> = {}) {
  return {
    audioSignal: null,
    isRecording: false,
    recordingDuration: 0,
    spectrogramData: null,
    isProcessing: false,
    processingProgress: { stage: 'idle' as const, progress: 0, message: 'Ready to process audio' },
    selectedModel: 'precision' as const,
    modelLoading: false,
    inferenceResults: [],
    error: null,
    setAudioSignal: vi.fn(),
    setIsRecording: vi.fn(),
    setRecordingDuration: vi.fn(),
    setSpectrogramData: vi.fn(),
    setIsProcessing: vi.fn(),
    setProcessingProgress: vi.fn(),
    setSelectedModel: vi.fn(),
    setModelLoading: vi.fn(),
    setInferenceResults: vi.fn(),
    setError: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  };
}

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  I18nextProvider: ({ children }: any) => children,
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('@/hooks/useAnalytics', () => ({
  usePageView: (pageName: string) => { mockTrackPage(pageName); },
  useAnalytics: () => ({ trackPageView: mockTrackPage }),
}));

vi.mock('@/lab-ai/store/labAIStore', () => ({
  useLabAIStore: vi.fn((selector?: any) => {
    const state = mockStore;
    return selector ? selector(state) : state;
  }),
}));

vi.mock('@/lab-ai/components/input/InputBay', () => ({
  InputBay: ({ onFileSelect, onFileClear, onStartRecording, onStopRecording, onModelSelect, ...props }: any) => (
    <div data-testid="input-bay">
      <button data-testid="action-model-select" onClick={() => onModelSelect('efficiency')}>
        Switch to Efficiency
      </button>
      <button data-testid="action-start-recording" onClick={onStartRecording}>
        Start Recording
      </button>
      <button data-testid="action-stop-recording" onClick={onStopRecording}>
        Stop Recording
      </button>
      <button data-testid="action-file-clear" onClick={onFileClear}>
        Clear File
      </button>
      <button data-testid="action-file-select" onClick={() => onFileSelect(new File([''], 'test.wav'))}>
        Select Audio File
      </button>
      <span data-testid="prop-selectedModel">{props.selectedModel}</span>
      <span data-testid="prop-isRecording">{String(props.isRecording)}</span>
      <span data-testid="prop-hasAudioSignal">{String(props.audioSignal !== null)}</span>
    </div>
  ),
}));

vi.mock('@/lab-ai/components/processing/ProcessingTunnel', () => ({
  ProcessingTunnel: ({ processingProgress, spectrogramData, audioData }: any) => (
    <div data-testid="processing-tunnel">
      <span data-testid="prop-stage">{processingProgress.stage}</span>
      <span data-testid="prop-progress">{processingProgress.progress}</span>
      <span data-testid="prop-message">{processingProgress.message}</span>
      <span data-testid="prop-hasSpectrogram">{String(spectrogramData !== null)}</span>
      <span data-testid="prop-hasAudioData">{String(audioData !== null)}</span>
    </div>
  ),
}));

vi.mock('@/lab-ai/components/results/ResultInsight', () => ({
  ResultInsight: ({ results, modelType, isProcessing }: any) => (
    <div data-testid="result-insight">
      <span data-testid="prop-resultsCount">{results.length}</span>
      <span data-testid="prop-modelType">{modelType}</span>
      <span data-testid="prop-isProcessing">{String(isProcessing)}</span>
    </div>
  ),
}));

vi.mock('@/lab-ai/core/audio/AudioIngestion', () => ({
  AudioFileReader: vi.fn().mockImplementation(function () {
    return {
      decodeAudioFile: vi.fn().mockResolvedValue({ data: new Float32Array(), sampleRate: 44100, channels: 1, duration: 2 }),
      resample: vi.fn().mockResolvedValue({
        data: new Float32Array(),
        sampleRate: 16000,
        channels: 1,
        duration: 2,
      }),
    };
  }),
  MicrophoneRecorder: vi.fn().mockImplementation(function () {
    return {
      requestPermission: vi.fn().mockResolvedValue(true),
      startRecording: vi.fn(),
      stopRecording: vi.fn().mockResolvedValue({ data: new Float32Array(), sampleRate: 44100, channels: 1, duration: 2 }),
    };
  }),
}));

vi.mock('@/lab-ai/core/dsp/DSPEngine', () => ({
  DSPEngine: vi.fn().mockImplementation(function () {
    return {
      extractLoudestSlice: vi.fn().mockReturnValue(new Float32Array()),
      convertToInt16: vi.fn().mockReturnValue(new Int16Array()),
      computeMelSpectrogram: vi.fn().mockReturnValue([[0]]),
    };
  }),
}));

vi.mock('@/lab-ai/core/model/InferenceEngine', () => ({
  inferenceEngine: {
    loadModel: vi.fn().mockResolvedValue(undefined),
    infer: vi.fn().mockResolvedValue([
      { species: 'Yellowhammer', confidence: 0.85, inferenceTime: 27 },
      { species: 'Other', confidence: 0.15, inferenceTime: 27 },
    ]),
  },
}));

import { inferenceEngine } from '@/lab-ai/core/model/InferenceEngine';
import { useLabAIStore } from '@/lab-ai/store/labAIStore';

describe('LabAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = createStoreState();
    vi.mocked(useLabAIStore).mockImplementation((selector?: any) => {
      const state = mockStore;
      return selector ? selector(state) : state;
    });
  });

  describe('Static Rendering', () => {
    it('renders the page heading', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByText('Big Data & AI Lab')).toBeInTheDocument();
    });

    it('renders the description', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByText(/TinyML Bird Classifier/)).toBeInTheDocument();
    });

    it('renders the BioDCASE badge', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByText('BioDCASE 2025 Project')).toBeInTheDocument();
    });

    it('renders all three tech tags', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByText('TinyML')).toBeInTheDocument();
      expect(screen.getByText('TensorFlow.js')).toBeInTheDocument();
      expect(screen.getByText('D3.js Visualization')).toBeInTheDocument();
    });

    it('renders all three child panels', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('input-bay')).toBeInTheDocument();
      expect(screen.getByTestId('processing-tunnel')).toBeInTheDocument();
      expect(screen.getByTestId('result-insight')).toBeInTheDocument();
    });
  });

  describe('Analytics', () => {
    it('tracks page view on mount', () => {
      renderWithProviders(<LabAI />);
      expect(mockTrackPage).toHaveBeenCalledWith('lab-ai');
    });
  });

  describe('Default State', () => {
    it('passes idle progress to ProcessingTunnel', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-stage')).toHaveTextContent('idle');
      expect(screen.getByTestId('prop-progress')).toHaveTextContent('0');
      expect(screen.getByTestId('prop-message')).toHaveTextContent('Ready to process audio');
    });

    it('passes default precision model to InputBay', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-selectedModel')).toHaveTextContent('precision');
    });

    it('passes empty results and not processing to ResultInsight', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-resultsCount')).toHaveTextContent('0');
      expect(screen.getByTestId('prop-isProcessing')).toHaveTextContent('false');
    });

    it('passes null audio/spectrogram when nothing loaded', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-hasAudioSignal')).toHaveTextContent('false');
      expect(screen.getByTestId('prop-hasSpectrogram')).toHaveTextContent('false');
      expect(screen.getByTestId('prop-hasAudioData')).toHaveTextContent('false');
    });
  });

  describe('State: Processing / Pipeline', () => {
    it('passes isProcessing to ResultInsight', () => {
      mockStore = createStoreState({ isProcessing: true });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-isProcessing')).toHaveTextContent('true');
    });

    it('passes processing progress through the pipeline stages', () => {
      const stages = [
        { stage: 'loading', progress: 10, message: 'Loading audio file...' },
        { stage: 'audio', progress: 30, message: 'Processing audio...' },
        { stage: 'dsp', progress: 60, message: 'Computing features...' },
        { stage: 'inference', progress: 80, message: 'Running inference...' },
        { stage: 'complete', progress: 100, message: 'Inference complete!' },
      ] as const;

      for (const progress of stages) {
        vi.clearAllMocks();
        mockStore = createStoreState({ processingProgress: progress });
        vi.mocked(useLabAIStore).mockImplementation((selector?: any) => {
          const state = mockStore;
          return selector ? selector(state) : state;
        });

        const { unmount } = renderWithProviders(<LabAI />);

        expect(screen.getByTestId('prop-stage')).toHaveTextContent(progress.stage);
        expect(screen.getByTestId('prop-progress')).toHaveTextContent(String(progress.progress));
        expect(screen.getByTestId('prop-message')).toHaveTextContent(progress.message);

        unmount();
      }
    });

    it('passes error state to ProcessingTunnel', () => {
      mockStore = createStoreState({
        processingProgress: { stage: 'error', progress: 0, message: 'Error processing audio' },
      });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-stage')).toHaveTextContent('error');
      expect(screen.getByTestId('prop-message')).toHaveTextContent('Error processing audio');
    });
  });

  describe('State: Audio Signal', () => {
    it('passes audioSignal presence to InputBay when available', () => {
      mockStore = createStoreState({
        audioSignal: { sampleRate: 16000, channels: 1, data: new Float32Array(32000), duration: 2 },
      });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-hasAudioSignal')).toHaveTextContent('true');
    });

    it('passes audioData to ProcessingTunnel when audioSignal exists', () => {
      mockStore = createStoreState({
        audioSignal: { sampleRate: 16000, channels: 1, data: new Float32Array(32000), duration: 2 },
      });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-hasAudioData')).toHaveTextContent('true');
    });
  });

  describe('State: Spectrogram Data', () => {
    it('passes spectrogramData to ProcessingTunnel when available', () => {
      mockStore = createStoreState({
        spectrogramData: {
          frequencies: [0, 1000, 2000],
          times: [0, 0.5, 1],
          magnitudes: [[1, 2, 3], [4, 5, 6]],
          sampleRate: 16000,
          windowSize: 4096,
          hopSize: 512,
        },
      });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-hasSpectrogram')).toHaveTextContent('true');
    });
  });

  describe('State: Recording', () => {
    it('passes isRecording=true to InputBay during recording', () => {
      mockStore = createStoreState({ isRecording: true });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-isRecording')).toHaveTextContent('true');
    });
  });

  describe('State: Results', () => {
    it('passes results count and model type to ResultInsight when inference completes', () => {
      mockStore = createStoreState({
        inferenceResults: [
          { species: 'Yellowhammer', confidence: 0.98, inferenceTime: 27 },
          { species: 'Other', confidence: 0.02, inferenceTime: 27 },
        ],
        selectedModel: 'efficiency',
      });
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-resultsCount')).toHaveTextContent('2');
      expect(screen.getByTestId('prop-modelType')).toHaveTextContent('efficiency');
    });

    it('passes empty array for inference results by default', () => {
      renderWithProviders(<LabAI />);
      expect(screen.getByTestId('prop-resultsCount')).toHaveTextContent('0');
    });
  });

  describe('Interactions', () => {
    it('handles model selection via InputBay callback', () => {
      renderWithProviders(<LabAI />);
      fireEvent.click(screen.getByTestId('action-model-select'));
      expect(mockStore.setSelectedModel).toHaveBeenCalledWith('efficiency');
    });

    it('handles file clear via InputBay callback', () => {
      renderWithProviders(<LabAI />);
      fireEvent.click(screen.getByTestId('action-file-clear'));
      expect(mockStore.setAudioSignal).toHaveBeenCalledWith(null);
      expect(mockStore.setSpectrogramData).toHaveBeenCalledWith(null);
      expect(mockStore.setInferenceResults).toHaveBeenCalledWith([]);
    });

    it('handles start recording via InputBay callback (async)', async () => {
      renderWithProviders(<LabAI />);
      fireEvent.click(screen.getByTestId('action-start-recording'));
      await waitFor(() => {
        expect(mockStore.setIsRecording).toHaveBeenCalledWith(true);
      });
    });

    it('handles file select via InputBay callback (async)', async () => {
      renderWithProviders(<LabAI />);
      fireEvent.click(screen.getByTestId('action-file-select'));
      await waitFor(() => {
        expect(mockStore.setIsProcessing).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Model Preloading', () => {
    it('pre-loads both precision and efficiency models on mount', () => {
      renderWithProviders(<LabAI />);
      expect(inferenceEngine.loadModel).toHaveBeenCalledWith('precision');
      expect(inferenceEngine.loadModel).toHaveBeenCalledWith('efficiency');
    });
  });

  describe('Full Pipeline State', () => {
    it('renders correctly with all state populated simultaneously', () => {
      mockStore = createStoreState({
        isProcessing: true,
        isRecording: false,
        processingProgress: { stage: 'complete', progress: 100, message: 'Inference complete!' },
        inferenceResults: [
          { species: 'Yellowhammer', confidence: 0.98, inferenceTime: 27 },
        ],
        spectrogramData: {
          frequencies: [0, 1, 2],
          times: [0, 1, 2],
          magnitudes: [[1, 2, 3]],
          sampleRate: 16000,
          windowSize: 4096,
          hopSize: 512,
        },
        audioSignal: { sampleRate: 16000, channels: 1, data: new Float32Array(32000), duration: 2 },
        selectedModel: 'efficiency',
      });
      vi.mocked(useLabAIStore).mockImplementation((selector?: any) => {
        const state = mockStore;
        return selector ? selector(state) : state;
      });

      renderWithProviders(<LabAI />);

      expect(screen.getByTestId('prop-stage')).toHaveTextContent('complete');
      expect(screen.getByTestId('prop-progress')).toHaveTextContent('100');
      expect(screen.getByTestId('prop-resultsCount')).toHaveTextContent('1');
      expect(screen.getByTestId('prop-hasSpectrogram')).toHaveTextContent('true');
      expect(screen.getByTestId('prop-hasAudioData')).toHaveTextContent('true');
      expect(screen.getByTestId('prop-modelType')).toHaveTextContent('efficiency');
    });
  });
});
