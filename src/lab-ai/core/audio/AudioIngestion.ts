import type { AudioSignal } from '../../types';

export class AudioFileReader {
  private audioContext: AudioContext | null = null;

  async decodeAudioFile(file: File): Promise<AudioSignal> {
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

  async resample(signal: AudioSignal, targetSampleRate: number): Promise<AudioSignal> {
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
        } catch (error) {
          reject(error);
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
