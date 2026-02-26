import type { AudioSignal, SpectrogramData, MFCCData } from '../../types';

export class DSPEngine {
  private windowSize: number;
  private hopSize: number;
  private numCoefficients: number;
  private melLowHz: number;
  private melHighHz: number;
  private targetFrames: number = 55;
  private targetMelBins: number = 40;

  constructor(
    windowSize: number = 4096, 
    hopSize: number = 512, 
    numCoefficients: number = 40,
    melLowHz: number = 125,
    melHighHz: number = 7500
  ) {
    this.windowSize = windowSize;
    this.hopSize = hopSize;
    this.numCoefficients = numCoefficients;
    this.melLowHz = melLowHz;
    this.melHighHz = melHighHz;
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
    
    const magnitudes: number[][] = [];
    const frequencies: number[] = [];
    const times: number[] = [];
    
    const freqBins = Math.floor(this.windowSize / 2);
    for (let i = 0; i <= freqBins; i++) {
      frequencies.push(i * signal.sampleRate / this.windowSize);
    }
    
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
        const mag = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
        magnitude.push(mag);
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
    
    const melFilters = this.createMelFilterbank(numFilters, freqBins, signal.sampleRate);
    
    const mfcc: number[][] = [];
    
    for (let frame = 0; frame < numFrames; frame++) {
      const frameMagnitudes = stftResult.magnitudes[frame];
      
      const filterEnergies = melFilters.map(filter => {
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
    
    const melFilters = this.createMelFilterbank(this.numCoefficients, freqBins, signal.sampleRate);
    
    const melSpec: number[][] = [];
    
    for (let frame = 0; frame < numFrames; frame++) {
      const frameMagnitudes = stftResult.magnitudes[frame];
      
      const filterEnergies = melFilters.map(filter => {
        let sum = 0;
        for (let i = 0; i < filter.length; i++) {
          sum += filter[i] * frameMagnitudes[i];
        }
        return Math.max(1e-10, sum);
      });
      
      melSpec.push(filterEnergies);
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
    return result;
  }

  private createMelFilterbank(numFilters: number, numBins: number, sampleRate: number): number[][] {
    const melMin = this.frequencyToMel(this.melLowHz);
    const melMax = this.frequencyToMel(this.melHighHz);
    const melPoints = Array.from({ length: numFilters + 2 }, (_, i) =>
      melMin + (melMax - melMin) * i / (numFilters + 1)
    );
    
    const freqPoints = melPoints.map(m => this.melToFrequency(m));
    const binPoints = freqPoints.map(f => Math.round(f * this.windowSize / sampleRate));
    
    const filters: number[][] = [];
    
    for (let i = 0; i < numFilters; i++) {
      const filter = new Array(numBins).fill(0);
      const left = binPoints[i];
      const center = binPoints[i + 1];
      const right = binPoints[i + 2];
      
      for (let j = left; j < center; j++) {
        if (j >= 0 && j < numBins) {
          filter[j] = (j - left) / (center - left);
        }
      }
      
      for (let j = center; j < right; j++) {
        if (j >= 0 && j < numBins) {
          filter[j] = (right - j) / (right - center);
        }
      }
      
      filters.push(filter);
    }
    
    return filters;
  }

  private frequencyToMel(freq: number): number {
    return 2595 * Math.log10(1 + freq / 700);
  }

  private melToFrequency(mel: number): number {
    return 700 * (Math.pow(10, mel / 2595) - 1);
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
