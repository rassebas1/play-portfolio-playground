import type { Bird, Pipe, CollisionResult, FlappyBirdState } from './types';
import { GAME_DIMENSIONS, PHYSICS } from './constants';

export const createInitialBird = (): Bird => ({
  x: 100,
  y: GAME_DIMENSIONS.height / 2,
  velocity: 0,
  rotation: 0,
});

export const createPipe = (x: number): Pipe => {
  const minTopHeight = 100;
  const maxTopHeight = GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight - PHYSICS.pipeGap - 100;
  const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
  
  return {
    id: `pipe-${Date.now()}-${Math.random()}`,
    x,
    topHeight,
    bottomY: topHeight + PHYSICS.pipeGap,
    width: PHYSICS.pipeWidth,
    passed: false,
  };
};

export const checkCollision = (bird: Bird, pipes: Pipe[]): CollisionResult => {
  const birdLeft = bird.x - GAME_DIMENSIONS.birdSize / 2;
  const birdRight = bird.x + GAME_DIMENSIONS.birdSize / 2;
  const birdTop = bird.y - GAME_DIMENSIONS.birdSize / 2;
  const birdBottom = bird.y + GAME_DIMENSIONS.birdSize / 2;

  if (birdBottom >= GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight) {
    return { hasCollision: true, collisionType: 'ground' };
  }

  if (birdTop <= 0) {
    return { hasCollision: true, collisionType: 'ceiling' };
  }

  for (const pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipe.width;

    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      if (birdTop < pipe.topHeight) {
        return { hasCollision: true, collisionType: 'pipe' };
      }
      if (birdBottom > pipe.bottomY) {
        return { hasCollision: true, collisionType: 'pipe' };
      }
    }
  }

  return { hasCollision: false };
};

export const updateBirdPhysics = (bird: Bird): Bird => {
  const newVelocity = Math.min(bird.velocity + PHYSICS.gravity, PHYSICS.terminalVelocity);
  const newY = bird.y + newVelocity;
  const rotation = Math.max(-30, Math.min(90, newVelocity * 3));

  return {
    ...bird,
    y: newY,
    velocity: newVelocity,
    rotation,
  };
};

export const updatePipes = (pipes: Pipe[], birdX: number): { pipes: Pipe[]; scoreIncrease: number } => {
  let scoreIncrease = 0;
  
  const updatedPipes = pipes
    .map(pipe => {
      const newPipe = { ...pipe, x: pipe.x - PHYSICS.pipeSpeed };
      
      if (!pipe.passed && newPipe.x + newPipe.width < birdX) {
        newPipe.passed = true;
        scoreIncrease += 1;
      }
      
      return newPipe;
    })
    .filter(pipe => pipe.x + pipe.width > -50);

  return { pipes: updatedPipes, scoreIncrease };
};

export const generatePipesIfNeeded = (pipes: Pipe[], currentTime: number, lastPipeTime: number): Pipe[] => {
  const pipeSpacing = 300;
  
  if (currentTime - lastPipeTime > pipeSpacing) {
    return [...pipes, createPipe(GAME_DIMENSIONS.width)];
  }
  
  return pipes;
};

export const updateGameState = (prevState: FlappyBirdState, lastPipeTime: React.MutableRefObject<number>): FlappyBirdState => {
  const updatedBird = updateBirdPhysics(prevState.bird);
  const { pipes: updatedPipes, scoreIncrease } = updatePipes(prevState.pipes, prevState.bird.x);
  
  const currentTime = Date.now();
  let pipesWithNew = generatePipesIfNeeded(updatedPipes, currentTime, lastPipeTime.current);
  if (pipesWithNew.length > updatedPipes.length) {
    lastPipeTime.current = currentTime;
  }

  const collision = checkCollision(updatedBird, pipesWithNew);
  
  const newScore = prevState.score + scoreIncrease;
  const newBestScore = Math.max(prevState.bestScore, newScore);
  
  if (newBestScore > prevState.bestScore) {
    localStorage.setItem('flappy-bird-best-score', newBestScore.toString());
  }

  return {
    ...prevState,
    bird: updatedBird,
    pipes: pipesWithNew,
    score: newScore,
    bestScore: newBestScore,
    isGameOver: collision.hasCollision,
    isPlaying: !collision.hasCollision,
  };
};