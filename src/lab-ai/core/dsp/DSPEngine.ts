import type { AudioSignal, SpectrogramData, MFCCData } from '../../types';

interface FilterBankData {
  fftStartIndex: number;
  fftEndIndex: number;
  nChannels: number;
  chFreqStarts: number[];
  chWidths: number[];
}

export class DSPEngine {
  // ==================== Constants ====================
  // These match the Python BioDCASE preprocessing pipeline
  
  /** Scaling factor for quantized mel filterbank weights (2^12 = 4096) */
  private static readonly WEIGHT_SCALING_BITS = 12;
  
  /** Scaling factor for post-mel log transform (2^6 = 64) */
  private static readonly MEL_POST_SCALING_BITS = 6;
  
  /** Target number of time frames in output mel spectrogram (matches model input) */
  private static readonly DEFAULT_TARGET_FRAMES = 55;
  
  /** Number of mel frequency bins (matches model input) */
  private static readonly DEFAULT_MEL_BINS = 40;
  
  /** Default duration in milliseconds for audio slice extraction */
  private static readonly DEFAULT_SLICE_DURATION_MS = 2000;

  // ==================== Instance Properties ====================
  private windowSize: number;
  private hopSize: number;
  private numCoefficients: number;
  private melLowHz: number;
  private melHighHz: number;
  private targetFrames: number;
  private targetMelBins: number;
  private windowScalingBits: number;
  private melPostScalingBits: number;
  private weights: Float32Array[] = [];   // Quantized weights
  private unweights: Float32Array[] = []; // Quantized unweights
  private filterBankData: FilterBankData | null = null;

  /**
   * Creates a new DSPEngine instance.
   * @param windowSize - FFT window size (default: 4096)
   * @param hopSize - Hop size for STFT (default: 512)
   * @param numCoefficients - Number of mel coefficients (default: 40)
   * @param melLowHz - Low frequency bound for mel filterbank (default: 125)
   * @param melHighHz - High frequency bound for mel filterbank (default: 7500)
   * @param windowScalingBits - Window scaling bits (default: 12)
   * @param melPostScalingBits - Mel post scaling bits (default: 6)
   */
  constructor(
    windowSize: number = 4096, 
    hopSize: number = 512, 
    numCoefficients: number = DSPEngine.DEFAULT_MEL_BINS,
    melLowHz: number = 125,
    melHighHz: number = 7500,
    windowScalingBits: number = DSPEngine.WEIGHT_SCALING_BITS,
    melPostScalingBits: number = DSPEngine.MEL_POST_SCALING_BITS
  ) {
    this.windowSize = windowSize;
    this.hopSize = hopSize;
    this.numCoefficients = numCoefficients;
    this.melLowHz = melLowHz;
    this.melHighHz = melHighHz;
    this.windowScalingBits = windowScalingBits;
    this.melPostScalingBits = melPostScalingBits;
    this.targetFrames = DSPEngine.DEFAULT_TARGET_FRAMES;
    this.targetMelBins = DSPEngine.DEFAULT_MEL_BINS;
  }

  /**
   * Extracts the loudest slice from an audio signal.
   * This matches the Python training pipeline which centers the extraction
   * on the point of maximum amplitude rather than using the first N seconds.
   * 
   * @param audioData - Input audio samples (Float32Array)
   * @param sampleRate - Audio sample rate in Hz
   * @param durationMs - Duration of slice to extract in milliseconds (default: 2000ms)
   * @returns Float32Array containing the extracted slice
   * 
   * @example
   * // Extract 2-second slice centered on loudest point
   * const slice = dsp.extractLoudestSlice(audioData, 16000, 2000);
   */
  extractLoudestSlice(
    audioData: Float32Array, 
    sampleRate: number, 
    durationMs: number = DSPEngine.DEFAULT_SLICE_DURATION_MS
  ): Float32Array {
    if (!audioData || audioData.length === 0) {
      return new Float32Array(0);
    }
    
    if (sampleRate <= 0) {
      return new Float32Array(0);
    }

    const sliceNSamples = Math.floor(durationMs / 1000 * sampleRate);
    const audioNSamples = audioData.length;
    const leftEdge = Math.floor(sliceNSamples / 2);
    const rightEdge = sliceNSamples - leftEdge;

    // Find max amplitude index (use absolute value)
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < audioNSamples; i++) {
      const absValue = Math.abs(audioData[i]);
      if (absValue > maxValue) {
        maxValue = absValue;
        maxIndex = i;
      }
    }

    // Calculate start and end indices centered on max
    let startIndex = maxIndex - leftEdge;
    let endIndex = maxIndex + rightEdge;

    // Handle edge cases
    if (startIndex < 0) {
      startIndex = 0;
      endIndex = sliceNSamples;
    } else if (endIndex > audioNSamples) {
      endIndex = audioNSamples;
      startIndex = audioNSamples - sliceNSamples;
    }

    // Extract the slice
    const slice = new Float32Array(sliceNSamples);
    for (let i = 0; i < sliceNSamples; i++) {
      if (startIndex + i < endIndex) {
        slice[i] = audioData[startIndex + i];
      }
    }

    return slice;
  }

  /**
   * Converts float audio data to int16 format.
   * This matches the Python training pipeline which processes audio as int16
   * before feature extraction (librosa does this internally).
   * 
   * @param audioData - Input audio samples normalized to [-1, 1]
   * @returns Int16Array with values in range [-32767, 32767]
   */
  convertToInt16(audioData: Float32Array): Int16Array {
    const INT16_MAX = 32767;
    const int16Data = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      // Clip to [-1, 1] range first
      const clipped = Math.max(-1, Math.min(1, audioData[i]));
      // Convert to int16
      int16Data[i] = Math.round(clipped * INT16_MAX);
    }
    return int16Data;
  }

  private createHannWindow(size: number): Float32Array {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (size - 1)));
    }
    return window;
  }

  private fft(input: Float32Array): Float32Array[] {
    const n = input.length;
    if (n === 1) return [input, new Float32Array(1)];
    
    const half = n / 2;
    const evenReal = new Float32Array(half);
    const evenImag = new Float32Array(half);
    const oddReal = new Float32Array(half);
    const oddImag = new Float32Array(half);
    
    for (let i = 0; i < half; i++) {
      evenReal[i] = input[2 * i];
      evenImag[i] = 0;
      oddReal[i] = input[2 * i + 1];
      oddImag[i] = 0;
    }
    
    const [evenRealOut, evenImagOut] = this.fft(evenReal);
    const [oddRealOut, oddImagOut] = this.fft(oddReal);
    
    const realOut = new Float32Array(n);
    const imagOut = new Float32Array(n);
    
    for (let k = 0; k < half; k++) {
      const angle = -2 * Math.PI * k / n;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const oddRealTerm = cos * oddRealOut[k] - sin * oddImagOut[k];
      const oddImagTerm = sin * oddRealOut[k] + cos * oddImagOut[k];
      
      realOut[k] = evenRealOut[k] + oddRealTerm;
      imagOut[k] = evenImagOut[k] + oddImagTerm;
      realOut[k + half] = evenRealOut[k] - oddRealTerm;
      imagOut[k + half] = evenImagOut[k] - oddImagTerm;
    }
    
    return [realOut, imagOut];
  }

  computeSTFT(signal: AudioSignal): SpectrogramData {
    const window = this.createHannWindow(this.windowSize);
    const numFrames = Math.floor((signal.data.length - this.windowSize) / this.hopSize) + 1;
    
    const magnitudes: number[][] = [];  // Actually power spectrum (magnitude²)
    const frequencies: number[] = [];
    const times: number[] = [];
    
    const freqBins = Math.floor(this.windowSize / 2);
    for (let i = 0; i <= freqBins; i++) {
      frequencies.push(i * signal.sampleRate / this.windowSize);
    }
    
    // Remove window scaling - Python pipeline doesn't use it the same way
    // The window scaling is applied differently in the mel filterbank
    
    for (let frame = 0; frame < numFrames; frame++) {
      const start = frame * this.hopSize;
      const frameData = new Float32Array(this.windowSize);
      
      for (let i = 0; i < this.windowSize; i++) {
        if (start + i < signal.data.length) {
          frameData[i] = signal.data[start + i] * window[i];
        }
      }
      
      const [real, imag] = this.fft(frameData);
      const magnitude: number[] = [];
      
      for (let i = 0; i <= freqBins; i++) {
        // Use POWER SPECTRUM (magnitude²) instead of magnitude - this is key!
        // Python librosa uses power by default
        const power = real[i] * real[i] + imag[i] * imag[i];
        magnitude.push(power);
      }
      
      magnitudes.push(magnitude);
      times.push(start / signal.sampleRate);
    }
    
    return {
      frequencies,
      times,
      magnitudes,
      sampleRate: signal.sampleRate,
      windowSize: this.windowSize,
      hopSize: this.hopSize,
    };
  }

  computeSpectrogram(signal: AudioSignal): SpectrogramData {
    const stftResult = this.computeSTFT(signal);
    
    const minMag = 1e-10;
    const magnitudesInDB = stftResult.magnitudes.map(row =>
      row.map(mag => {
        const db = 20 * Math.log10(Math.max(mag, minMag));
        return Math.max(0, db + 80);
      })
    );
    
    return {
      ...stftResult,
      magnitudes: magnitudesInDB,
    };
  }

  computeMFCC(signal: AudioSignal, numFilters: number = 26): MFCCData {
    const stftResult = this.computeSTFT(signal);
    const numFrames = stftResult.magnitudes.length;
    const freqBins = stftResult.frequencies.length;
    
    // Create filterbank (populates this.weights)
    this.createMelFilterbank(numFilters, freqBins, signal.sampleRate);
    
    const mfcc: number[][] = [];
    
    for (let frame = 0; frame < numFrames; frame++) {
      const frameMagnitudes = stftResult.magnitudes[frame];
      
      const filterEnergies = this.weights.map(filter => {
        let sum = 0;
        for (let i = 0; i < filter.length; i++) {
          sum += filter[i] * frameMagnitudes[i];
        }
        return Math.max(1e-10, sum);
      });
      
      const logEnergies = filterEnergies.map(e => Math.log(e));
      
      const mfccFrame = this.dct(logEnergies, this.numCoefficients);
      mfcc.push(mfccFrame);
    }
    
    return {
      coefficients: mfcc,
      times: stftResult.times,
      numCoefficients: this.numCoefficients,
      sampleRate: signal.sampleRate,
    };
  }

  /**
   * Computes mel spectrogram from audio signal.
   * 
   * This implements the full BioDCASE preprocessing pipeline:
   * 1. Compute STFT (Short-Time Fourier Transform) with Hann window
   * 2. Compute power spectrum (magnitude²)
   * 3. Apply quantized mel filterbank with HTK scaling
   * 4. Apply square root to filterbank energies
   * 5. Apply log transform with mel_post_scaling
   * 6. Zero FFT bins outside mel frequency range (125-7500 Hz)
   * 7. Pad/truncate to exactly 55 frames
   * 
   * @param signal - AudioSignal containing audio data and sample rate
   * @returns 2D array of shape [55, 40] - log mel spectrogram
   * 
   * @remarks
   * The output shape [55, 40] matches the TensorFlow.js model input:
   * - 55 time frames (derived from 2000ms audio with 512 hop, 4096 window)
   * - 40 mel frequency bins
   */
  computeMelSpectrogram(signal: AudioSignal): number[][] {
    if (!signal || !signal.data || signal.data.length === 0 || signal.sampleRate <= 0) {
      return Array.from({ length: this.targetFrames }, () => 
        Array(this.targetMelBins).fill(0)
      );
    }

    const stftResult = this.computeSTFT(signal);
    const numFrames = stftResult.magnitudes.length;
    const freqBins = stftResult.frequencies.length;
    
    // Create filterbank with quantized weight/unweight system
    this.createMelFilterbank(this.numCoefficients, freqBins, signal.sampleRate);
    
    const melSpec: number[][] = [];
    const melPostScale = 1 << this.melPostScalingBits; // 2^6 = 64
    
    for (let frame = 0; frame < numFrames; frame++) {
      const framePower = stftResult.magnitudes[frame];
      
      // Zero FFT bins outside mel frequency range
      const fb = this.filterBankData;
      const paddedPower = new Float64Array(freqBins).fill(0);
      for (let i = 0; i < freqBins; i++) {
        if (i >= fb.fftStartIndex && i < fb.fftEndIndex) {
          paddedPower[i] = framePower[i];
        }
      }
      
      // Apply weight/unweight cumulative filterbank (from Python _filter_bank)
      const filterEnergies: number[] = [];
      let weightAccumulator = 0;
      let unweightAccumulator = 0;
      
      for (let ch = 0; ch < this.weights.length; ch++) {
        const weightFilter = this.weights[ch];
        const unweightFilter = this.unweights[ch];
        const freqStart = fb.chFreqStarts[ch];
        const width = fb.chWidths[ch];
        
        for (let j = 0; j < width; j++) {
          const fftIdx = freqStart + j;
          if (fftIdx < freqBins) {
            weightAccumulator += weightFilter[fftIdx] * paddedPower[fftIdx];
            unweightAccumulator += unweightFilter[fftIdx] * paddedPower[fftIdx];
          }
        }
        
        // Cumulative: output = weightAccumulator, then reset
        const output = weightAccumulator;
        filterEnergies.push(output);
        
        weightAccumulator = unweightAccumulator;
        unweightAccumulator = 0;
      }
      
      // Apply square root (like Python: vec_sqrt64)
      const sqrtEnergies = filterEnergies.map(e => Math.sqrt(Math.max(e, 0)));
      
      // Apply log transform and scaling (like Python: vec_log32 with mel_post_scaling_bits)
      const logEnergies = sqrtEnergies.map(e => {
        if (e <= 0) return 0;
        const scaled = Math.log(e) * melPostScale;
        return scaled;
      });
      
      melSpec.push(logEnergies);
    }
    
    // Pad or truncate to exactly 55 frames
    let result: number[][];
    if (melSpec.length < this.targetFrames) {
      // Pad with zeros
      const padding = this.targetFrames - melSpec.length;
      result = [...melSpec];
      for (let i = 0; i < padding; i++) {
        result.push(new Array(this.numCoefficients).fill(0));
      }
    } else if (melSpec.length > this.targetFrames) {
      // Truncate
      result = melSpec.slice(0, this.targetFrames);
    } else {
      result = melSpec;
    }
    
    return result;
  }

  private createMelFilterbank(numFilters: number, numBins: number, sampleRate: number): void {
    // Use float32 precision to match Python
    const freqToMel = (freq: number): number => {
      const f = Float32Array.from([freq])[0];
      return 1127.0 * Math.log1p(f / 700.0);
    };
    
    const melToFreq = (mel: number): number => {
      return 700.0 * (Math.expm1(mel / 1127.0));
    };
    
    // Calculate center frequencies for mel channels
    const melLow = freqToMel(this.melLowHz);
    const melHigh = freqToMel(this.melHighHz);
    const melSpan = melHigh - melLow;
    const melSpacing = melSpan / numFilters;
    
    const centerFreqs: number[] = [];
    for (let i = 1; i <= numFilters; i++) {
      centerFreqs.push(melLow + melSpacing * i);
    }
    
    // Calculate FFT bin parameters
    const spectrumSize = numBins;  // n_fft/2 + 1
    const hzPerBin = sampleRate / (this.windowSize);
    const fftStartIndex = Math.round(1 + this.melLowHz / hzPerBin);
    
    // Calculate channel frequency starts and widths
    const chFreqStarts: number[] = [];
    const chWidths: number[] = [];
    let chanFreqIndex = fftStartIndex;
    
    for (let chan = 0; chan < numFilters; chan++) {
      const centerMel = centerFreqs[chan];
      let freqIndex = chanFreqIndex;
      
      // Find the frequency where mel exceeds center frequency
      while (freqToMel(freqIndex * hzPerBin) <= centerMel && freqIndex < spectrumSize) {
        freqIndex++;
      }
      
      const width = freqIndex - chanFreqIndex;
      chFreqStarts.push(chanFreqIndex);
      chWidths.push(width);
      chanFreqIndex = freqIndex;
    }
    
    // Store for use in mel spectrogram
    this.filterBankData = {
      fftStartIndex,
      fftEndIndex: chanFreqIndex,
      nChannels: numFilters,
      chFreqStarts,
      chWidths,
    };
    
    // Create weight/unweight arrays for each channel
    this.weights = [];
    this.unweights = [];
    
    for (let chan = 0; chan < numFilters; chan++) {
      const freqStart = chFreqStarts[chan];
      const width = chWidths[chan];
      const centerMel = centerFreqs[chan];
      const prevCenterMel = chan === 0 ? melLow : centerFreqs[chan - 1];
      
      const channelWeights = new Float32Array(numBins).fill(0);
      const channelUnweights = new Float32Array(numBins).fill(0);
      
      for (let j = 0; j < width; j++) {
        const freq = (freqStart + j) * hzPerBin;
        const mel = freqToMel(freq);
        
        // Triangular weight
        const weight = (centerMel - mel) / (centerMel - prevCenterMel);
        const unweight = 1 - weight;
        
        // Quantize weights (like Python: weight * 2^12)
        const quantWeight = Math.round(weight * (1 << DSPEngine.WEIGHT_SCALING_BITS));
        const quantUnweight = Math.round(unweight * (1 << DSPEngine.WEIGHT_SCALING_BITS));
        
        channelWeights[freqStart + j] = quantWeight;
        channelUnweights[freqStart + j] = quantUnweight;
      }
      
      this.weights.push(channelWeights);
      this.unweights.push(channelUnweights);
    }
  }

  private dct(input: number[], numCoeffs: number): number[] {
    const n = input.length;
    const output: number[] = [];
    
    for (let k = 0; k < numCoeffs; k++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += input[i] * Math.cos(Math.PI * k * (2 * i + 1) / (2 * n));
      }
      output.push(sum);
    }
    
    return output;
  }

  normalize(signal: AudioSignal, mean?: number, std?: number): AudioSignal {
    const dataMean = mean ?? this.computeMean(signal.data);
    const dataStd = std ?? this.computeStd(signal.data, dataMean);
    
    const normalizedData = new Float32Array(signal.data.length);
    for (let i = 0; i < signal.data.length; i++) {
      normalizedData[i] = (signal.data[i] - dataStd) / (dataStd + 1e-8);
    }
    
    return {
      ...signal,
      data: normalizedData,
    };
  }

  private computeMean(data: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length;
  }

  private computeStd(data: Float32Array, mean: number): number {
    let sumSq = 0;
    for (let i = 0; i < data.length; i++) {
      sumSq += (data[i] - mean) ** 2;
    }
    return Math.sqrt(sumSq / data.length);
  }
}
