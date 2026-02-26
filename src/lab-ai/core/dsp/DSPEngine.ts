import type { AudioSignal, SpectrogramData, MFCCData } from '../../types';

interface FilterBankData {
  fftStartIndex: number;
  fftEndIndex: number;
  nChannels: number;
  chFreqStarts: number[];
  chWidths: number[];
}

export class DSPEngine {
  private windowSize: number;
  private hopSize: number;
  private numCoefficients: number;
  private melLowHz: number;
  private melHighHz: number;
  private targetFrames: number = 55;
  private targetMelBins: number = 40;
  private windowScalingBits: number;
  private melPostScalingBits: number;
  private WEIGHT_SCALING_BITS = 12;  // 2^12 = 4096
  private weights: Float32Array[] = [];   // Quantized weights
  private unweights: Float32Array[] = []; // Quantized unweights
  private filterBankData: FilterBankData | null = null;

  constructor(
    windowSize: number = 4096, 
    hopSize: number = 512, 
    numCoefficients: number = 40,
    melLowHz: number = 125,
    melHighHz: number = 7500,
    windowScalingBits: number = 12,
    melPostScalingBits: number = 6
  ) {
    this.windowSize = windowSize;
    this.hopSize = hopSize;
    this.numCoefficients = numCoefficients;
    this.melLowHz = melLowHz;
    this.melHighHz = melHighHz;
    this.windowScalingBits = windowScalingBits;
    this.melPostScalingBits = melPostScalingBits;
  }

  extractLoudestSlice(audioData: Float32Array, sampleRate: number, durationMs: number): Float32Array {
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

    console.log(`[DSPEngine] extractLoudestSlice: maxIndex=${maxIndex}, slice from ${startIndex} to ${endIndex}`);
    return slice;
  }

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

  computeMelSpectrogram(signal: AudioSignal): number[][] {
    const stftResult = this.computeSTFT(signal);
    const numFrames = stftResult.magnitudes.length;
    const freqBins = stftResult.frequencies.length;
    
    console.log(`[DSPEngine] STFT: ${numFrames} frames, ${freqBins} freq bins`);
    
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
      // Using natural log approximation
      const logEnergies = sqrtEnergies.map(e => {
        if (e <= 0) return 0;
        // log32 approximation: log(e) * scale
        const scaled = Math.log(e) * melPostScale;
        return scaled;
      });
      
      // Debug: log first frame values
      if (frame === 0) {
        const rawBeforeLog = filterEnergies.slice(0, 5).map(e => e.toExponential(2));
        const sqrtVals = sqrtEnergies.slice(0, 5).map(e => e.toFixed(2));
        const logVals = logEnergies.slice(0, 5).map(e => e.toFixed(2));
        console.log(`[DSPEngine] Raw mel before log: ${rawBeforeLog}`);
        console.log(`[DSPEngine] After sqrt: ${sqrtVals}`);
        console.log(`[DSPEngine] After log: ${logVals}`);
      }
      
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
    
    console.log(`[DSPEngine] Mel spectrogram shape: ${result.length} x ${result[0]?.length}`);
    const flat = result.flat();
    console.log(`[DSPEngine] Mel range: min=${Math.min(...flat).toFixed(2)}, max=${Math.max(...flat).toFixed(2)}`);
    return result;
  }

  private createMelFilterbank(numFilters: number, numBins: number, sampleRate: number): void {
    const FILTER_BANK_WEIGHT_SCALING_BITS = 12;
    
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
    
    console.log(`[DSPEngine] Creating filterbank: numFilters=${numFilters}, fftStart=${fftStartIndex}, hzPerBin=${hzPerBin.toFixed(2)}`);
    
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
        const quantWeight = Math.round(weight * (1 << FILTER_BANK_WEIGHT_SCALING_BITS));
        const quantUnweight = Math.round(unweight * (1 << FILTER_BANK_WEIGHT_SCALING_BITS));
        
        channelWeights[freqStart + j] = quantWeight;
        channelUnweights[freqStart + j] = quantUnweight;
      }
      
      this.weights.push(channelWeights);
      this.unweights.push(channelUnweights);
    }
    
    // Debug: log first channel weights
    const firstChanWeights = this.weights[0] ? Array.from(this.weights[0]).slice(fftStartIndex, fftStartIndex + 5) : [];
    console.log(`[DSPEngine] First channel quantized weights at bins ${fftStartIndex}-${fftStartIndex+4}: ${firstChanWeights.map(v => v.toFixed(0))}`);
  }

  private frequencyToMel(freq: number): number {
    // HTK formula - matches BioDCASE pipeline exactly
    // Uses log1p instead of log10, and coefficient 1127 instead of 2595
    return 1127.0 * Math.log1p(freq / 700.0);
  }

  private melToFrequency(mel: number): number {
    // Inverse of HTK formula
    return 700.0 * (Math.expm1(mel / 1127.0));
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
