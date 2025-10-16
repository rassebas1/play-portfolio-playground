import type { Board, Direction, MoveResult, Tile } from './types';

import { createEmptyBoard, getEmptyPositions } from './boardUtils';
import { addRandomTile } from './tileUtils';
import { moveAndMergeLine } from './lineProcessor';
import { processMove } from './moveProcessor';
import { canMove } from './moveProcessor2';

export { createEmptyBoard, getEmptyPositions, addRandomTile, moveAndMergeLine, processMove, canMove };