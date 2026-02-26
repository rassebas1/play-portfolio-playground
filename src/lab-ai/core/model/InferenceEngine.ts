import * as tf from '@tensorflow/tfjs';
import type { ClassificationResult, ModelConfig, ModelType } from '../../types';

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  precision: {
    id: 'E_model_tfjs',
    name: 'High Precision',
    accuracy: 0.98,
    memoryKB: 16,
    inputShape: [1, 1, 64, 64],
    labels: ['Robin', 'Sparrow', 'Wren', 'Blackbird', 'Blue Tit', 'Chaffinch', 'Dunnock', 'Great Tit'],
  },
  efficiency: {
    id: 'N_Enrich_model',
    name: 'High Efficiency',
    accuracy: 0.94,
    memoryKB: 12,
    inputShape: [1, 1, 32, 32],
    labels: ['Robin', 'Sparrow', 'Wren', 'Blackbird', 'Blue Tit', 'Chaffinch', 'Dunnock', 'Great Tit'],
  },
};

const BASE_PATH = '/play-portfolio-playground';

export class InferenceEngine {
  private model: tf.GraphModel | tf.LayersModel | null = null;
  private currentModelType: ModelType | null = null;
  private isLoaded: boolean = false;

  async loadModel(modelType: ModelType): Promise<void> {
    if (this.currentModelType === modelType && this.isLoaded) {
      console.log(`[InferenceEngine] Model ${modelType} already loaded`);
      return;
    }

    // Clean up previous model
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }

    await tf.ready();
    
    const config = MODEL_CONFIGS[modelType];
    const modelPath = `${BASE_PATH}/models/${config.id}/model.json`;
    
    console.log(`[InferenceEngine] Loading model from: ${modelPath}`);
    
    try {
      this.model = await tf.loadGraphModel(modelPath);
      this.currentModelType = modelType;
      this.isLoaded = true;
      console.log(`[InferenceEngine] ✅ Successfully loaded ${config.name} (TensorFlow.js format)`);
      
      // Log model info
      console.log(`[InferenceEngine] Model inputs:`, this.model.inputs);
      console.log(`[InferenceEngine] Model outputs:`, this.model.outputs);
      
    } catch (error) {
      console.error(`[InferenceEngine] ❌ Failed to load model:`, error);
      this.isLoaded = false;
    }
  }

  async infer(inputData: number[][] | number[][][]): Promise<ClassificationResult[]> {
    const startTime = performance.now();
    
    let predictions: number[];
    
    if (this.model && this.isLoaded) {
      console.log(`[InferenceEngine] Running inference with input:`, 
        Array.isArray(inputData) ? `${inputData.length} x ${(inputData[0] as number[])?.length}` : 'unknown');
      
      try {
        // Input should be [55, 40] - mel spectrogram
        let normalizedInput: number[][];
        
        if (Array.isArray(inputData) && inputData.length > 0) {
          if (Array.isArray(inputData[0]) && inputData[0].length > 0) {
            // It's already 2D [55, 40], normalize to 0-1 range
            const arr2d = inputData as number[][];
            // Find max value for normalization
            let maxVal = 0;
            for (const row of arr2d) {
              for (const v of row) {
                if (v > maxVal) maxVal = v;
              }
            }
            const scale = maxVal > 0 ? maxVal : 1;
            normalizedInput = arr2d.map(row => row.map(v => v / scale));
          } else {
            normalizedInput = [[0]];
          }
        } else {
          normalizedInput = [[0]];
        }
        
        console.log(`[InferenceEngine] Normalized input shape:`, normalizedInput.length, 'x', normalizedInput[0]?.length);
        
        // Reshape to [batch, height, width, channels] = [1, 55, 40, 1]
        // TensorFlow.js uses [batch, H, W, channels] format
        const batchSize = 1;
        const height = normalizedInput.length;
        const width = normalizedInput[0]?.length || 40;
        
        // Create 4D tensor: [1, 55, 40, 1]
        const input4D: number[][][][] = [];
        for (let b = 0; b < batchSize; b++) {
          const heightSlice: number[][][] = [];
          for (let h = 0; h < height; h++) {
            const widthSlice: number[][] = [];
            for (let w = 0; w < width; w++) {
              widthSlice.push([normalizedInput[h][w]]);
            }
            heightSlice.push(widthSlice);
          }
          input4D.push(heightSlice);
        }
        
        const inputTensor = tf.tensor(input4D, [1, height, width, 1]);
        
        console.log(`[InferenceEngine] Input tensor shape:`, inputTensor.shape);
        
        // Run inference
        const result = this.model.predict(inputTensor) as tf.Tensor;
        console.log(`[InferenceEngine] Output tensor shape:`, result.shape);
        
        const probabilities = await result.data();
        predictions = Array.from(probabilities);
        
        // Cleanup
        inputTensor.dispose();
        result.dispose();
        
        console.log(`[InferenceEngine] Raw predictions:`, predictions);
        
      } catch (error) {
        console.error(`[InferenceEngine] Inference error:`, error);
        predictions = this.mockInference();
      }
    } else {
      console.log(`[InferenceEngine] Using mock inference (model not loaded)`);
      predictions = this.mockInference();
    }
    
    const inferenceTime = performance.now() - startTime;
    const config = MODEL_CONFIGS[this.currentModelType || 'precision'];
    
    const results: ClassificationResult[] = predictions
      .map((prob, index) => ({
        species: config.labels[index] || `Species ${index}`,
        confidence: prob,
        inferenceTime,
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
    
    console.log(`[InferenceEngine] Sorted results:`, results);
    return results;
  }

  private mockInference(): number[] {
    // Mock probabilities for demo
    const mockProbabilities = [0.85, 0.07, 0.03, 0.02, 0.01, 0.01, 0.005, 0.005];
    const sum = mockProbabilities.reduce((a, b) => a + b, 0);
    return mockProbabilities.map(p => p / sum);
  }

  getModelConfig(modelType: ModelType): ModelConfig {
    return MODEL_CONFIGS[modelType];
  }

  getAvailableModels(): ModelConfig[] {
    return Object.values(MODEL_CONFIGS);
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isLoaded = false;
    this.currentModelType = null;
  }
}

export const inferenceEngine = new InferenceEngine();
