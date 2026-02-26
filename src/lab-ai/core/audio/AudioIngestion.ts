import type { AudioSignal } from '../../types';

/**
 * AudioFileReader - Handles loading and decoding audio files.
 * 
 * Supports common web audio formats (WAV, MP3, OGG, WebM) via the Web Audio API.
 * Outputs Float32Array normalized to [-1, 1] range.
 * 
 * @example
 * ```typescript
 * const reader = new AudioFileReader();
 * const signal = await reader.decodeAudioFile(audioFile);
 * // { sampleRate: 44100, channels: 2, data: Float32Array[...], duration: 3.5 }
 * ```
 */
export class AudioFileReader {
  private audioContext: AudioContext | null = null;

  /**
   * Decodes an audio file into an AudioSignal.
   * 
   * @param file - Audio file to decode
   * @returns AudioSignal with Float32Array channel data
   * @throws Error if file is empty, invalid, or cannot be decoded
   */
  async decodeAudioFile(file: File): Promise<AudioSignal> {
    if (!file || file.size === 0) {
      throw new Error('Invalid audio file: empty or null');
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const duration = audioBuffer.duration;
    
    return {
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      data: channelData,
      duration,
    };
  }

  /**
   * Resamples audio to a target sample rate using linear interpolation.
   * 
   * Uses a simple linear interpolation algorithm for downsampling/upsampling.
   * If the target sample rate equals the source, returns the original signal.
   * 
   * @param signal - Source AudioSignal
   * @param targetSampleRate - Desired sample rate in Hz (e.g., 16000)
   * @returns Resampled AudioSignal
   * @throws Error if signal is invalid or targetSampleRate is non-positive
   * 
   * @example
   * ```typescript
   * // Resample from 44.1kHz to 16kHz (required for TinyML model)
   * const resampled = await reader.resample(signal, 16000);
   * ```
   */
  async resample(signal: AudioSignal, targetSampleRate: number): Promise<AudioSignal> {
    if (!signal || signal.data.length === 0) {
      throw new Error('Invalid audio signal: empty or null');
    }

    if (targetSampleRate <= 0) {
      throw new Error('Invalid target sample rate');
    }

    if (signal.sampleRate === targetSampleRate) {
      return signal;
    }

    const ratio = signal.sampleRate / targetSampleRate;
    const newLength = Math.round(signal.data.length / ratio);
    const resampledData = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const leftIndex = Math.floor(srcIndex);
      const rightIndex = Math.min(leftIndex + 1, signal.data.length - 1);
      const fraction = srcIndex - leftIndex;
      resampledData[i] = signal.data[leftIndex] * (1 - fraction) + signal.data[rightIndex] * fraction;
    }

    return {
      sampleRate: targetSampleRate,
      channels: signal.channels,
      data: resampledData,
      duration: newLength / targetSampleRate,
    };
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

/**
 * MicrophoneRecorder - Handles real-time audio recording from user microphone.
 * 
 * Uses the MediaRecorder API to capture audio and Web Audio API to decode.
 * Records in WebM format internally, then decodes to Float32Array.
 * 
 * @example
 * ```typescript
 * const recorder = new MicrophoneRecorder();
 * await recorder.requestPermission();
 * recorder.startRecording();
 * // ... recording ...
 * const signal = await recorder.stopRecording();
 * recorder.dispose();
 * ```
 */
export class MicrophoneRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch {
      return false;
    }
  }

  startRecording(): void {
    if (!this.stream) {
      throw new Error('Microphone not initialized. Call requestPermission first.');
    }

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
  }

  async stopRecording(): Promise<AudioSignal> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();
          
          if (!this.audioContext) {
            this.audioContext = new AudioContext();
          }
          
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          const channelData = audioBuffer.getChannelData(0);
          
          resolve({
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
            data: channelData,
            duration: audioBuffer.duration,
          });
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      };

      this.mediaRecorder.stop();
    });
  }

  dispose(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}
