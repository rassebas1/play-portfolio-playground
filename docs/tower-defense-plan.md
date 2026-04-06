# Tower Defense Game - Design & Implementation Plan

## Overview
A tower defense game where players place towers on a grid to stop waves of enemies from reaching a base. This is the most complex game in the portfolio, featuring real-time gameplay, pathfinding, and strategic resource management.

## Game Architecture

### Core Concepts
- **Grid-based map**: 2D grid where towers can be placed
- **Enemy waves**: Enemies follow predefined paths toward the base
- **Towers**: Different types with unique abilities (damage, range, fire rate)
- **Resources**: Earned by defeating enemies, spent on towers/upgrades
- **Lives**: Base health, game over when depleted

### Technical Architecture
Following the established pattern from 2048/brick-breaker:

```
tower-defense/
├── TowerDefense.tsx          # Main component
├── types.ts                  # Game-specific types
├── constants.ts              # Grid size, tower stats, enemy stats
├── gameLogic.ts              # Pure game logic functions
├── GameReducer.ts            # State management with useReducer
├── hooks/
│   └── useTowerDefense.ts    # Main game hook
├── components/
│   ├── GameBoard.tsx         # Grid rendering
│   ├── Tower.tsx             # Tower component
│   ├── Enemy.tsx             # Enemy component
│   ├── TowerSelector.tsx     # Tower placement UI
│   ├── WaveIndicator.tsx     # Wave progress display
│   └── UpgradePanel.tsx      # Tower upgrade interface
├── utils/
│   ├── pathfinding.ts        # Enemy path calculation
│   ├── collision.ts          # Tower-enemy collision detection
│   └── waveGenerator.ts      # Enemy wave generation
└── TowerDefense.test.ts      # Unit tests
```

## Tower Types

### 1. Basic Tower
- **Cost**: 50 resources
- **Damage**: 10 per shot
- **Range**: 2 cells
- **Fire Rate**: 1 shot/second
- **Special**: None

### 2. Sniper Tower
- **Cost**: 100 resources
- **Damage**: 50 per shot
- **Range**: 5 cells
- **Fire Rate**: 1 shot/3 seconds
- **Special**: High damage, long range

### 3. Slow Tower
- **Cost**: 75 resources
- **Damage**: 5 per shot
- **Range**: 3 cells
- **Fire Rate**: 1 shot/second
- **Special**: Slows enemies by 50%

### 4. Splash Tower
- **Cost**: 125 resources
- **Damage**: 20 per shot
- **Range**: 2 cells
- **Fire Rate**: 1 shot/2 seconds
- **Special**: Area damage to nearby enemies

## Enemy Types

### 1. Basic Enemy
- **Health**: 50
- **Speed**: 1 cell/second
- **Reward**: 10 resources

### 2. Fast Enemy
- **Health**: 30
- **Speed**: 2 cells/second
- **Reward**: 15 resources

### 3. Tank Enemy
- **Health**: 150
- **Speed**: 0.5 cells/second
- **Reward**: 25 resources

### 4. Boss Enemy
- **Health**: 500
- **Speed**: 0.3 cells/second
- **Reward**: 100 resources

## Wave System

### Wave Progression
- Waves increase in difficulty
- Each wave has more enemies and stronger types
- Boss enemies appear every 5 waves
- Resources earned scale with wave number

### Wave Composition Example
- **Wave 1**: 5 Basic enemies
- **Wave 2**: 8 Basic enemies
- **Wave 3**: 5 Basic + 3 Fast enemies
- **Wave 4**: 10 Basic + 5 Fast enemies
- **Wave 5**: 10 Basic + 5 Fast + 1 Boss enemy

## Game States

```typescript
type GamePhase = 'planning' | 'playing' | 'waveComplete' | 'gameOver' | 'victory';
```

- **Planning**: Place/upgrade towers between waves
- **Playing**: Wave is active, enemies are moving
- **WaveComplete**: Wave finished, prepare for next
- **GameOver**: Base lives depleted
- **Victory**: All waves completed

## State Management

### GameState Interface
```typescript
interface GameState {
  phase: GamePhase;
  grid: Cell[][];
  enemies: Enemy[];
  towers: Tower[];
  projectiles: Projectile[];
  resources: number;
  lives: number;
  wave: number;
  score: number;
  selectedTower: TowerType | null;
  selectedCell: Cell | null;
  gameSpeed: number;
}
```

### Key Actions
- `PLACE_TOWER`: Place a tower on the grid
- `UPGRADE_TOWER`: Upgrade an existing tower
- `SELL_TOWER`: Remove a tower for partial refund
- `START_WAVE`: Begin the next wave
- `TICK`: Game loop update (enemy movement, tower firing)
- `REMOVE_ENEMY`: Enemy defeated or reached base
- `SET_PHASE`: Change game phase

## Rendering Strategy

### Canvas vs DOM
- **Grid**: DOM-based (div grid) for easy interaction
- **Enemies/Towers**: DOM with CSS animations for simplicity
- **Projectiles**: CSS transitions or requestAnimationFrame
- **Alternative**: Full canvas rendering for better performance

### Performance Considerations
- Use `requestAnimationFrame` for game loop
- Implement spatial partitioning for collision detection
- Limit projectile count with pooling
- Optimize re-renders with React.memo

## i18n Translation Keys

### Namespace: `games/tower-defense`

```json
{
  "title": "Tower Defense",
  "description": "Defend your base from waves of enemies!",
  "instructions": {
    "title": "How to Play",
    "placement": "Click a tower type, then click a cell to place it",
    "upgrades": "Click an existing tower to upgrade or sell it",
    "waves": "Press Start Wave to begin the next wave",
    "goal": "Prevent enemies from reaching your base"
  },
  "towers": {
    "basic": "Basic Tower",
    "sniper": "Sniper Tower",
    "slow": "Slow Tower",
    "splash": "Splash Tower"
  },
  "enemies": {
    "basic": "Basic Enemy",
    "fast": "Fast Enemy",
    "tank": "Tank Enemy",
    "boss": "Boss Enemy"
  },
  "ui": {
    "resources": "Resources: {{count}}",
    "lives": "Lives: {{count}}",
    "wave": "Wave {{count}}",
    "score": "Score: {{count}}",
    "start_wave": "Start Wave",
    "next_wave": "Next Wave",
    "upgrade": "Upgrade",
    "sell": "Sell",
    "cost": "Cost: {{count}}"
  },
  "status": {
    "planning": "Planning Phase",
    "wave_active": "Wave in Progress",
    "wave_complete": "Wave Complete!",
    "game_over": "Game Over",
    "victory": "Victory!"
  }
}
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create folder structure
- [ ] Define types and constants
- [ ] Set up i18n translations
- [ ] Create basic grid component
- [ ] Implement game reducer skeleton

### Phase 2: Core Mechanics (Week 2)
- [ ] Implement tower placement
- [ ] Create enemy pathfinding
- [ ] Add enemy movement
- [ ] Implement basic tower targeting
- [ ] Add projectile system

### Phase 3: Wave System (Week 3)
- [ ] Create wave generator
- [ ] Implement wave progression
- [ ] Add different enemy types
- [ ] Create tower upgrade system
- [ ] Add game over/victory conditions

### Phase 4: Polish (Week 4)
- [ ] Add animations
- [ ] Implement sound effects (optional)
- [ ] Add difficulty levels
- [ ] Create tower selector UI
- [ ] Add high score integration
- [ ] Write tests
- [ ] Performance optimization

## Leaderboard Metrics

```typescript
// Primary metric: score (highest)
// Secondary metrics:
// - waves survived (highest)
// - towers placed (informational)
```

## Technical Decisions

### Why useReducer over useState?
Complex state with multiple interdependent values (enemies, towers, projectiles, resources) benefits from centralized state management with predictable transitions.

### Why DOM over Canvas?
- Easier integration with React ecosystem
- Simpler event handling for tower placement
- CSS animations are performant enough for this scale
- Can switch to canvas later if performance becomes an issue

### Pathfinding Algorithm
Use A* algorithm for dynamic path recalculation when towers block paths, or predefine paths for simplicity and performance.

## File Dependencies

### Files to Modify
1. `src/types/global.ts` - Add 'tower-defense' to GameType
2. `src/types/highScores.ts` - Add to GameName and ALLOWED_GAMES
3. `src/types/games.ts` - Add to GAME_METRICS
4. `src/games/index.ts` - Add to GAME_REGISTRY
5. `src/pages/Games.tsx` - Add game card
6. `src/i18n.ts` - Add namespace 'games/tower-defense'
7. `src/i18n.d.ts` - Add type definitions
8. `public/locales/{en,es,fr,it}/games.json` - Add game info
9. `public/locales/{en,es,fr,it}/games/tower-defense.json` - Game translations

## Testing Strategy

### Unit Tests
- `gameLogic.test.ts` - Pure function tests
- `GameReducer.test.ts` - State transition tests
- `pathfinding.test.ts` - Path calculation tests
- `waveGenerator.test.ts` - Wave composition tests

### Integration Tests
- Tower placement flow
- Wave progression
- Game over conditions
- Upgrade/sell mechanics

## Performance Targets
- 60 FPS game loop
- Handle 50+ enemies simultaneously
- Smooth animations on mobile devices
- < 100ms response time for tower placement
