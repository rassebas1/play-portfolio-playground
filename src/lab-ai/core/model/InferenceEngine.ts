import * as tf from '@tensorflow/tfjs';
import type { ClassificationResult, ModelConfig, ModelType } from '../../types';

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  precision: {
    id: 'E_model',
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
      return;
    }

    await tf.ready();
    
    const config = MODEL_CONFIGS[modelType];
    
    try {
      console.log(`[InferenceEngine] Loading TFLite from: ${BASE_PATH}/models/${config.id}.tflite`);
      this.model = await tf.loadGraphModel(`${BASE_PATH}/models/${config.id}.tflite`);
      this.currentModelType = modelType;
      this.isLoaded = true;
      console.log(`Loaded ${config.name} (TFLite) model successfully`);
    } catch {
      try {
        console.log(`[InferenceEngine] Loading JSON from: ${BASE_PATH}/models/${config.id}/model.json`);
        this.model = await tf.loadLayersModel(`${BASE_PATH}/models/${config.id}/model.json`);
        this.currentModelType = modelType;
        this.isLoaded = true;
        console.log(`Loaded ${config.name} (JSON) model successfully`);
      } catch (error) {
        console.warn(`Could not load model, using mock inference:`, error);
        this.isLoaded = false;
      }
    }
  }

  async infer(inputData: number[][] | number[][][]): Promise<ClassificationResult[]> {
    const startTime = performance.now();
    
    let predictions: number[];
    
    if (this.model && this.isLoaded) {
      const inputTensor = tf.tensor(inputData);
      
      const result = this.model.predict(inputTensor) as tf.Tensor;
      const probabilities = await result.data();
      
      inputTensor.dispose();
      result.dispose();
      
      predictions = Array.from(probabilities);
    } else {
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
    
    return results;
  }

  private mockInference(): number[] {
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
