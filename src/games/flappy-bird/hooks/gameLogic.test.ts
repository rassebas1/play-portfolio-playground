/**
 * src/games/flappy-bird/hooks/gameLogic.test.ts
 */
import { describe, it, expect, vi } from 'vitest';
import {
  createInitialBird,
  createPipe,
  checkCollision,
  updateBirdPhysics,
  birdJump,
  updatePipes,
  generatePipesIfNeeded,
} from './gameLogic';
import { GAME_DIMENSIONS, PHYSICS } from '../constants';
import type { Bird, Pipe } from '../types';

describe('Flappy Bird gameLogic', () => {
  describe('createInitialBird', () => {
    it('should create bird with correct initial properties', () => {
      const bird = createInitialBird();
      
      expect(bird.x).toBe(100);
      expect(bird.y).toBe(GAME_DIMENSIONS.height / 2);
      expect(bird.velocity).toBe(0);
      expect(bird.rotation).toBe(0);
      expect(bird.isFlapping).toBe(false);
    });

    it('should create independent bird objects', () => {
      const bird1 = createInitialBird();
      const bird2 = createInitialBird();
      bird1.velocity = 10;
      expect(bird2.velocity).toBe(0);
    });
  });

  describe('createPipe', () => {
    it('should create pipe with valid properties', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const pipe = createPipe(400);
      
      expect(pipe.x).toBe(400);
      expect(pipe.width).toBe(PHYSICS.pipeWidth);
      expect(pipe.passed).toBe(false);
      expect(pipe.topHeight).toBeGreaterThan(0);
    });

    it('should set bottomY based on topHeight and gap', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const pipe = createPipe(0);
      
      expect(pipe.bottomY).toBe(pipe.topHeight + PHYSICS.pipeGap);
    });

    it('should generate different top heights with different random values', () => {
      const heights: number[] = [];
      for (let i = 0; i < 5; i++) {
        vi.spyOn(Math, 'random').mockReturnValue(i / 5);
        heights.push(createPipe(0).topHeight);
      }
      
      const uniqueHeights = new Set(heights);
      expect(uniqueHeights.size).toBeGreaterThan(1);
    });

    it('should have id property', () => {
      const pipe = createPipe(0);
      expect(pipe.id).toBeDefined();
      expect(typeof pipe.id).toBe('string');
      expect(pipe.id.length).toBeGreaterThan(0);
    });
  });

  describe('checkCollision', () => {
    it('should return no collision for bird in safe position', () => {
      const bird: Bird = {
        x: 100,
        y: GAME_DIMENSIONS.height / 2,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      const pipes: Pipe[] = [];
      
      const result = checkCollision(bird, pipes);
      
      expect(result.hasCollision).toBe(false);
    });

    it('should detect collision with ground', () => {
      const groundY = GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight;
      const bird: Bird = {
        x: 100,
        y: groundY,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const result = checkCollision(bird, []);
      
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('ground');
    });

    it('should detect collision with ceiling', () => {
      const bird: Bird = {
        x: 100,
        y: -10,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const result = checkCollision(bird, []);
      
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('ceiling');
    });

    it('should detect collision with top pipe', () => {
      const bird: Bird = {
        x: 100,
        y: 50,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const pipes: Pipe[] = [{
        id: 'test',
        x: 80,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = checkCollision(bird, pipes);
      
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('pipe');
    });

    it('should detect collision with bottom pipe', () => {
      const bird: Bird = {
        x: 100,
        y: 250,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const pipes: Pipe[] = [{
        id: 'test',
        x: 80,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = checkCollision(bird, pipes);
      
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('pipe');
    });

    it('should not detect collision when bird is between pipes', () => {
      const bird: Bird = {
        x: 100,
        y: 150,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const pipes: Pipe[] = [{
        id: 'test',
        x: 80,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = checkCollision(bird, pipes);
      
      expect(result.hasCollision).toBe(false);
    });

    it('should not detect collision with distant pipe', () => {
      const bird: Bird = {
        x: 100,
        y: GAME_DIMENSIONS.height / 2,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const pipes: Pipe[] = [{
        id: 'test',
        x: 300,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = checkCollision(bird, pipes);
      
      expect(result.hasCollision).toBe(false);
    });
  });

  describe('updateBirdPhysics', () => {
    it('should apply gravity to velocity', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.velocity).toBe(PHYSICS.gravity);
    });

    it('should clamp velocity at terminal velocity', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 1000,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.velocity).toBeLessThanOrEqual(PHYSICS.terminalVelocity);
    });

    it('should update y position based on velocity', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.y).toBe(200 + PHYSICS.gravity);
    });

    it('should calculate rotation based on velocity', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 10,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.rotation).toBeGreaterThan(0);
    });

    it('should clamp rotation at minimum -30', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: -20,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.rotation).toBeGreaterThanOrEqual(-30);
    });

    it('should clamp rotation at maximum 90', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 50,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.rotation).toBeLessThanOrEqual(90);
    });

    it('should preserve bird x position', () => {
      const bird: Bird = {
        x: 150,
        y: 200,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const updated = updateBirdPhysics(bird);
      
      expect(updated.x).toBe(150);
    });
  });

  describe('birdJump', () => {
    it('should set velocity to jump velocity', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const jumped = birdJump(bird);
      
      expect(jumped.velocity).toBe(PHYSICS.jumpVelocity);
    });

    it('should set isFlapping to true', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      };
      
      const jumped = birdJump(bird);
      
      expect(jumped.isFlapping).toBe(true);
    });

    it('should preserve other bird properties', () => {
      const bird: Bird = {
        x: 100,
        y: 200,
        velocity: 50,
        rotation: 45,
        isFlapping: false,
      };
      
      const jumped = birdJump(bird);
      
      expect(jumped.x).toBe(100);
      expect(jumped.y).toBe(200);
      expect(jumped.rotation).toBe(45);
    });
  });

  describe('updatePipes', () => {
    it('should move pipes to the left', () => {
      const pipes: Pipe[] = [{
        id: 'test',
        x: 100,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = updatePipes(pipes, 50);
      
      expect(result.pipes[0].x).toBe(100 - PHYSICS.pipeSpeed);
    });

    it('should not increase score for already passed pipes', () => {
      const pipes: Pipe[] = [{
        id: 'test',
        x: 40,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: true,
      }];
      
      const result = updatePipes(pipes, 200);
      
      expect(result.scoreIncrease).toBe(0);
    });

    it('should filter out pipes that are off-screen left', () => {
      const pipes: Pipe[] = [{
        id: 'test',
        x: -100,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = updatePipes(pipes, 0);
      
      expect(result.pipes).toHaveLength(0);
    });

    it('should handle empty pipes array', () => {
      const result = updatePipes([], 100);
      
      expect(result.pipes).toHaveLength(0);
      expect(result.scoreIncrease).toBe(0);
    });
  });

  describe('generatePipesIfNeeded', () => {
    it('should add new pipe when enough time has passed', () => {
      const pipes: Pipe[] = [];
      
      const result = generatePipesIfNeeded(pipes, 500, 0);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should not add pipe when not enough time has passed', () => {
      const pipes: Pipe[] = [{
        id: 'test',
        x: 100,
        topHeight: 100,
        bottomY: 200,
        width: PHYSICS.pipeWidth,
        passed: false,
      }];
      
      const result = generatePipesIfNeeded(pipes, 100, 0);
      
      expect(result.length).toBe(1);
    });

    it('should place new pipe at right edge of game', () => {
      const result = generatePipesIfNeeded([], 500, 0);
      
      expect(result[0].x).toBe(GAME_DIMENSIONS.width);
    });
  });
});