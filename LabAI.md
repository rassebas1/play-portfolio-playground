# LabAI.md

## 🧪 Big Data & AI Lab: TinyML Bird Classifier

This module serves as an interactive showcase of the **BioDCASE 2025** international project, where I achieved **2nd and 4th place** in bird species identification using extremely optimized computational intelligence models. The lab demonstrates the feasibility of running high-precision inference (up to 98% accuracy) directly in the browser with minimal resource consumption.

## 🛠️ Core Technologies

- **Frontend Framework:** React 18 with TypeScript 5 for robust type safety and component-based architecture.
- **Inference Engine:** **TensorFlow.js** – Used to load and execute the pre-trained TinyML models (converted from PyTorch/TensorFlow) directly on the client side.
- **Data Visualization:** **D3.js** – Utilized for real-time digital signal processing (DSP) rendering and complex data transformations.
- **State Management:** Zustand (for lightweight, framework-agnostic state) or Redux.
- **Backend (Serverless):** Vercel Functions for API orchestration and Firebase for historical data storage.

## 📋 Relevant Tasks & Subtasks

### 1. Digital Signal Processing (DSP) Pipeline

- **Audio Signal Ingestion:** Implement a handler for `.wav` file uploads and real-time microphone stream capturing.
- **Signal Transformation:**
  - Apply Short-Time Fourier Transform (STFT) to convert raw audio into the frequency domain.
  - Generate Mel-Frequency Cepstral Coefficients (MFCC) or Spectrograms as input features for the model.
- **Data Normalization:** Ensure input signals match the pre-processing parameters used during model training in PyTorch.

### 2. Model Orchestration & Inference

- **Model Optimization:** Load the ultra-lightweight models (16 KB memory footprint) as static assets.
- **Inference Execution:**
  - Bridge the processed signal arrays into TensorFlow.js tensors.
  - Manage asynchronous execution to prevent UI blocking during the 27 KB inference process.
- **Accuracy Validation:** Map model output indices to specific bird species labels with confidence percentages.

### 3. Interactive Visualization Engine

- **Dynamic Waveform Rendering:** Use **D3.js** to create a responsive time-domain visualization of the input audio.
- **Spectrogram Heatmaps:** Develop an interactive heatmap showing the frequency transformations the model "sees" before classification.
- **Performance Metrics:** Visualize the 98% vs 94% accuracy benchmarks through comparison charts.

### 4. Architecture & Clean Code

- **Hexagonal Implementation:** Decouple the DSP logic from React components to ensure the engine is framework-agnostic.
- **Pattern Application:** Use the **Factory Pattern** for switching between different model versions and the **Chain of Responsibility** for the signal transformation stages.
- **Automated Quality:** Integration of unit tests using Vitest or Jest to validate transformation mathematical accuracy.

## 🖥️ Interactive UI Reference (Layout)

To provide a "Lab" experience, the UI is divided into three functional zones:

1. **The Input Bay (Left/Top):** A drag-and-drop zone for audio files or a "Record" button. Includes a selector to choose between the 98% (High Precision) and 94% (High Efficiency) models.
2. **The Processing Tunnel (Center):** An animated flow powered by **D3.js**. As the audio is processed, the user sees the raw wave morphing into a spectrogram in real-time. This validates your background in **Electronics Engineering** and signal processing.
3. **The Result Insight (Right/Bottom):** A high-impact display of the classification result. It features a "Confidence Gauge" and a brief technical breakdown of the architecture used (e.g., memory usage vs. inference speed).

---

## 📐 Detailed Implementation Plan

### Phase 1: Foundation & Infrastructure (Week 1-2)

#### 1.1 Project Setup
- [ ] Initialize React 18 + TypeScript project with Vite
- [ ] Install dependencies: TensorFlow.js, D3.js, Zustand, react-dropzone
- [ ] Configure ESLint/Prettier for consistent code style
- [ ] Set up folder structure following hexagonal architecture:

```
src/
├── components/           # React UI components
│   ├── input/          # Input Bay components
│   ├── processing/    # Processing Tunnel components
│   └── results/       # Result Insight components
├── core/               # Domain logic (framework-agnostic)
│   ├── dsp/           # DSP engine (STFT, MFCC, normalization)
│   ├── model/         # Model loading and inference
│   └── audio/         # Audio ingestion utilities
├── infrastructure/    # External integrations
│   ├── storage/       # Firebase/LocalStorage adapters
│   └── api/           # Vercel Functions adapters
├── store/             # Zustand state management
├── types/             # TypeScript interfaces
└── utils/             # Helper functions
```

#### 1.2 Core Type Definitions
- [ ] Define `AudioSignal` interface (sampleRate, channels, data[])
- [ ] Define `SpectrogramData` interface (frequencies[], times[], magnitudes[])
- [ ] Define `ClassificationResult` interface (species, confidence, inferenceTime)
- [ ] Define `ModelConfig` interface (name, accuracy, memoryKB, inputShape)

---

### Phase 2: DSP Engine (Week 2-3)

#### 2.1 Audio Signal Ingestion
- [ ] **T2.1.1** - Implement `AudioFileReader` class
  - Accept `.wav`, `.mp3`, `.ogg` file inputs
  - Decode to Float32Array using Web Audio API
  - Validate sample rate (resample to 16kHz if needed)
- [ ] **T2.1.2** - Implement `MicrophoneRecorder` class
  - Request microphone permission via `navigator.mediaDevices`
  - Capture audio chunks using MediaRecorder API
  - Buffer management for continuous recording
- [ ] **T2.1.3** - Add drag-and-drop zone component using react-dropzone

#### 2.2 Signal Transformation
- [ ] **T2.2.1** - Implement STFT (Short-Time Fourier Transform)
  - Window size: 2048 samples (configurable)
  - Hop size: 512 samples (50% overlap)
  - Window function: Hann window
  - Output: complex-valued 2D array (frequency bins × time frames)
- [ ] **T2.2.2** - Implement Spectrogram generator
  - Convert STFT magnitude to dB scale: `20 * log10(magnitude)`
  - Apply min/max normalization for display
- [ ] **T2.2.3** - Implement MFCC generator (optional, based on model input)
  - Number of coefficients: 13-40 (match model input)
  - Mel filterbank: 26 filters
  - Apply DCT (Discrete Cosine Transform)
- [ ] **T2.2.4** - Implement signal normalization
  - Match mean/variance to training data
  - Apply per-channel mean subtraction
  - Clip outliers to ±3 standard deviations

#### 2.3 DSP Testing
- [ ] Write unit tests for STFT (compare against numpy reference)
- [ ] Write unit tests for MFCC coefficients
- [ ] Test edge cases: silent audio, clipping, different sample rates

---

### Phase 3: Model Integration (Week 3-4)

#### 3.1 Model Pipeline Setup
- [ ] **T3.1.1** - Export PyTorch model to ONNX format
  - Use `torch.onnx.export()` with dynamic axes for variable input
  - Quantize to INT8 for size reduction
- [ ] **T3.1.2** - Convert ONNX to TensorFlow.js format
  - Use `onnx-tf` converter
  - Apply additional quantization if needed
  - Target size: < 30KB
- [ ] **T3.1.3** - Create model manifest JSON
  ```json
  {
    "models": [
      {
        "id": "bird classifier-precision",
        "name": "High Precision",
        "accuracy": 0.98,
        "memoryKB": 16,
        "inputShape": [1, 1, 64, 64],
        "labels": ["species1", "species2", ...]
      },
      {
        "id": "bird-classifier-efficiency",
        "name": "High Efficiency",
        "accuracy": 0.94,
        "memoryKB": 12,
        "inputShape": [1, 1, 32, 32],
        "labels": [...]
      }
    ]
  }
  ```

#### 3.2 TensorFlow.js Integration
- [ ] **T3.2.1** - Implement `ModelLoader` class
  - Load model from static JSON + binary files
  - Implement caching with IndexedDB for faster reload
  - Show loading progress indicator
- [ ] **T3.2.2** - Implement `InferenceEngine` class
  - Convert input tensor to TensorFlow.js tensor
  - Run inference asynchronously (use `tf.tidy()` for memory management)
  - Extract top-k predictions with softmax probabilities
  - Clean up tensors after inference
- [ ] **T3.2.3** - Add model switching logic (Precision ↔ Efficiency)

#### 3.3 Performance Optimization
- [ ] Implement WebGL backend for TensorFlow.js (faster than WASM)
- [ ] Add warm-up inference on first load (avoid cold start latency)
- [ ] Implement result caching for repeated audio

---

### Phase 4: Visualization Engine (Week 4-5)

#### 4.1 Waveform Display
- [ ] **T4.1.1** - Create `WaveformVisualizer` component using D3.js
  - Render time-domain audio as SVG path
  - Add zoom/pan controls
  - Show playhead position during playback
- [ ] **T4.1.2** - Add audio playback controls (play, pause, seek)
- [ ] **T4.1.3** - Implement real-time waveform updates during recording

#### 4.2 Spectrogram Display
- [ ] **T4.2.1** - Create `SpectrogramVisualizer` component
  - Render frequency × time heatmap using D3 color scales
  - Y-axis: Frequency (0-8kHz, logarithmic scale option)
  - X-axis: Time
  - Color scale: Viridis or custom gradient (black → blue → yellow)
- [ ] **T4.2.2** - Add interactive features
  - Hover to show frequency/time values
  - Click to highlight region
  - Overlay model attention if available
- [ ] **T4.2.3** - Implement animated transition from waveform to spectrogram

#### 4.3 Results Dashboard
- [ ] **T4.3.1** - Create `ConfidenceGauge` component
  - Animated radial gauge (0-100%)
  - Color coding: green (>80%), yellow (50-80%), red (<50%)
- [ ] **T4.3.2** - Create `SpeciesCard` component
  - Display top prediction with confidence
  - Show alternate species suggestions
- [ ] **T4.3.3** - Create `MetricsChart` component
  - Compare Precision vs Efficiency model stats
  - Memory usage, inference time, accuracy
  - Use D3.js bar/line charts

---

### Phase 5: State Management & Integration (Week 5-6)

#### 5.1 Zustand Store Setup
- [ ] Define store slices:
  ```typescript
  interface LabStore {
    // Audio State
    audioBuffer: AudioBuffer | null;
    isRecording: boolean;
    recordingDuration: number;
    
    // DSP State
    spectrogramData: SpectrogramData | null;
    isProcessing: boolean;
    processingProgress: number;
    
    // Model State
    selectedModelId: string;
    modelLoading: boolean;
    inferenceResults: ClassificationResult[];
    
    // UI State
    error: string | null;
    
    // Actions
    setAudioBuffer: (buffer: AudioBuffer) => void;
    startRecording: () => void;
    stopRecording: () => void;
    runInference: () => Promise<void>;
    selectModel: (modelId: string) => void;
  }
  ```

#### 5.2 Component Integration
- [ ] **T5.2.1** - Wire Input Bay to Zustand store
  - Connect file upload to `setAudioBuffer`
  - Connect record button to recording actions
- [ ] **T5.2.2** - Wire Processing Tunnel to DSP engine
  - Connect audio buffer to STFT/MFCC pipeline
  - Show real-time progress updates
- [ ] **T5.2.3** - Wire Result Insight to inference results
  - Display classification output
  - Update confidence gauge

#### 5.3 Error Handling
- [ ] Implement global error boundary
- [ ] Add user-friendly error messages (mic denied, model load failure, etc.)
- [ ] Implement retry logic for failed inference

---

### Phase 6: Backend & Persistence (Week 6-7) *(Optional)*

#### 6.1 Firebase Integration
- [ ] Set up Firebase project with Firestore
- [ ] Create Vercel API route for logging predictions
- [ ] Store: timestamp, audio duration, species predicted, confidence, model used

#### 6.2 History Feature
- [ ] Implement history view in UI
- [ ] Display past predictions with filters
- [ ] Add share functionality (generate link to result)

---

### Phase 7: Polish & Deployment (Week 7-8)

#### 7.1 UI/UX Improvements
- [ ] Add loading skeletons for async operations
- [ ] Implement animations using Framer Motion
- [ ] Add responsive layout for mobile/tablet
- [ ] Implement dark mode

#### 7.2 Performance & Testing
- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Add Vitest integration tests for full pipeline
- [ ] Test on real devices (Chrome, Firefox, Safari, mobile)
- [ ] Measure actual memory usage in browser DevTools

#### 7.3 Deployment
- [ ] Configure Vercel deployment
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Configure environment variables
- [ ] Deploy to production

---

### 📊 Milestone Summary

| Milestone | Target | Deliverables |
|-----------|--------|--------------|
| **M1: Foundation** | Week 2 | Project scaffold, folder structure, type definitions |
| **M2: DSP Engine** | Week 3 | Audio ingestion, STFT/MFCC transforms, unit tests |
| **M3: Model Integration** | Week 4 | TensorFlow.js inference, model switching |
| **M4: Visualizations** | Week 5 | Waveform, spectrogram, confidence gauge |
| **M5: Integration** | Week 6 | Full pipeline wired, Zustand store complete |
| **M6: Backend** | Week 7 *(Optional)* | Firebase logging, history feature |
| **M7: Polish** | Week 8 | Testing, optimization, deployment |

---

### 🔧 Technical Dependencies

```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.x",
    "@tensorflow/tfjs-backend-webgl": "^4.x",
    "d3": "^7.x",
    "zustand": "^4.x",
    "react-dropzone": "^14.x",
    "framer-motion": "^10.x"
  },
  "devDependencies": {
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "@types/d3": "^7.x"
  }
}
```

---

### ⚠️ Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| Model file too large for browser | Medium | High | Aggressive quantization, switch to smaller architecture |
| DSP computation blocks UI | Medium | Medium | Use Web Workers for heavy computation |
| Browser mic permission denied | Low | Medium | Graceful fallback to file upload only |
| TensorFlow.js memory leaks | Medium | Medium | Strict `tf.tidy()` usage, memory profiling |
| Cross-browser compatibility | Low | Medium | Test in Chrome, Firefox, Safari early |

---

This documentation highlights your unique ability to bridge the gap between **embedded systems** (TinyML) and **modern web architectures**. If you'd like to adjust any subtasks or add a section regarding **Azure/AWS** integration for data logging, let me know!
