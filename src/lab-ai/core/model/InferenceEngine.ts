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
        // Normalize input to [0,1] range and ensure proper shape
        let normalizedInput: number[][];
        
        if (Array.isArray(inputData) && inputData.length > 0) {
          if (Array.isArray(inputData[0]) && Array.isArray(inputData[0][0])) {
            // It's already 2D array, normalize
            const arr2d = inputData as number[][];
            normalizedInput = arr2d.slice(0, 64).map(row => 
              row.slice(0, 64).map((v: unknown) => {
                const num = typeof v === 'number' ? v : 0;
                return Math.max(0, Math.min(1, num / 80));
              })
            );
          } else {
            normalizedInput = [[0]];
          }
        } else {
          normalizedInput = [[0]];
        }
        
        // Add batch and channel dimensions: [1, 1, H, W]
        const inputWithDims = [[[normalizedInput]]];
        const inputTensor = tf.tensor(inputWithDims);
        
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
