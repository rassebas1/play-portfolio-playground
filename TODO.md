# Project TODO List

This document tracks the features and tasks that need to be completed for the project.

## ✅ Completed Development Advances

### New Games
- [x] **Snake Game:** Fully implemented with core logic, state management (reducer), and integrated into the application.

### Refactoring & Component Extraction
- [x] **Tic Tac Toe:** Extracted `GameHeader`, `GameStatus`, and `GameRules` components.
- [x] **2048:** Extracted `GameHeader`, `Scoreboard`, `GameControls`, `MobileControls`, and `GameOverModal` components. Separated pure game logic, implemented reducer for state management, organized files into `utils` folder, created `constants.ts`, and fixed various bugs (tile spawning, game over, restart, undo).
- [x] **Flappy Bird:** Extracted `GameHeader`, `Scoreboard`, `GameControls`, `Instructions`, and `GameOverModal` components. Separated pure game logic and moved constants to a dedicated file.

### Hooks and Types Refactoring
- [x] **Tic Tac Toe:** Moved `initialState` outside the hook and refined game result determination.
- [x] **2048:** Implemented `useReducer` for comprehensive state management, centralized `GameState`, organized utility files, and ensured correct tile spawning, game over conditions, and restart logic.
- [x] **Flappy Bird:** Separated pure game logic and moved constants.

### UI/UX Improvements
- [x] Created an engaging landing page (`Index.tsx`).
- [x] Added a custom favicon.
- [x] Enhanced responsive design across devices (ongoing, initial steps completed).
- [x] Implemented a theme switcher.

### Main Page Content
- [x] Added "Developer Profile" section.
- [x] Added "Skills" section.
- [x] Added "Experience" section.

### SPA Refactoring
- [x] Restructured as a Single Page Application (SPA).
- [x] Created separate pages for Home, Games, and Experience.
- [x] Added a navigation bar.

### Documentation
- [x] Updated `README.md` with comprehensive details.
- [x] Added inline comments to clarify complex logic.

---

## 🚀 Future Features & Enhancements

### New Games
- [ ] Implement the "Memory" game.
- [ ] Implement the "Tetris" game.
- [ ] Implement the "Minesweeper" game.
- [x] Implement the "Brick Breaker" game.
- [ ] Implement the "Tower Defense" game.

### Mobile Enhancements (Touch Controls)
- [ ] **Snake:** Implement swipe gestures on the game board for direction control.
- [ ] **2048:** Implement swipe gestures on the game board for tile movement.
- [ ] **Flappy Bird:** Ensure tap input is robust and responsive for mobile devices.
- [ ] **Tic-Tac-Toe:** Ensure tap input is robust and responsive for mobile devices.
- [ ] **Brick Breaker:** Implement touch controls for paddle movement (e.g., drag or tap left/right halves of the screen).

### Internationalization (i18n)
- [ ] Identify all user-facing text and content for translation.
- [ ] Choose and integrate an i18n library (e.g., `react-i18next`, `formatjs`).
- [ ] Implement text extraction and translation workflows.
- [ ] Add language switching functionality (UI and logic).
- [ ] Ensure proper formatting for dates, times, numbers, and currencies across different locales.

### Game-specific Improvements

#### Tetris

##### Setup & State Management
    - [ ] Create initial game state structure (board grid, current piece, next piece, score, level, game status)
    - [ ] Set up useReducer with actions: START_GAME, MOVE_PIECE, ROTATE_PIECE, DROP_PIECE, CLEAR_LINES, GAME_OVER, PAUSE_GAME
    - [ ] Define tetromino shapes (I, O, T, S, Z, J, L pieces) with rotation states
    - [ ] Initialize 10x20 game board grid

 ##### Core Game Logic
    - [ ] Implement piece spawning logic (random piece generation)
    - [ ] Create collision detection system (walls, floor, other pieces)
    - [ ] Implement horizontal movement (left/right) with collision checks
    - [ ] Implement rotation logic with wall kicks
    - [ ] Add soft drop (faster fall) and hard drop (instant drop) mechanics
    - [ ] Implement line clearing detection and scoring
    - [ ] Create gravity system (automatic piece falling based on level)

##### Game Mechanics
    - [ ] Add scoring system (points for lines cleared, bonus for combos)
    - [ ] Implement level progression (speed increases)
    - [ ] Create "ghost piece" preview (shows where piece will land)
    - [ ] Add next piece preview display
    - [ ] Implement hold piece functionality (optional)
    - [ ] Add game over detection (piece can't spawn)

##### UI & Controls
    - [ ] Create keyboard controls (arrow keys, space, P for pause)
    - [ ] Build game board rendering component
    - [ ] Design score, level, and next piece display
    - [ ] Add pause/resume functionality
    - [ ] Create start screen and game over screen
    - [ ] Add restart button

##### Polish
    - [ ] Implement smooth animations for piece movement
    - [ ] Add visual feedback for line clears
    - [ ] Create sound effects (optional)
    - [ ] Add color schemes for different tetrominoes
    - [ ] Implement local high score storage 


#### Minesweeper

##### Setup & State Management
- [ ] Create initial game state (board, revealed cells, flagged cells, mine positions, game status, timer)
- [ ] Set up useReducer with actions: START_GAME, REVEAL_CELL, FLAG_CELL, GAME_WIN, GAME_LOSE, RESET_GAME
- [ ] Define difficulty levels (Beginner: 9x9/10 mines, Intermediate: 16x16/40 mines, Expert: 16x30/99 mines)
- [ ] Create cell data structure (isMine, isRevealed, isFlagged, adjacentMines)

##### Core Game Logic
- [ ] Implement mine placement algorithm (random, avoid first click)
- [ ] Create adjacent mines calculation for all cells
- [ ] Implement flood fill algorithm for revealing empty cells
- [ ] Add flag/unflag cell functionality
- [ ] Create win condition checker (all non-mine cells revealed)
- [ ] Implement lose condition (mine revealed)

##### Game Mechanics
- [ ] Add first-click safety (ensure first click is always safe)
- [ ] Implement chord/double-click reveal (reveal adjacent cells if flags match number)
- [ ] Create mine counter (total mines - flags placed)
- [ ] Add game timer (starts on first click)
- [ ] Prevent actions after game over

##### UI & Controls
- [ ] Handle left-click to reveal cells
- [ ] Handle right-click to flag cells
- [ ] Build board grid rendering component
- [ ] Create cell component with different states (hidden, revealed, flagged, mine, number)
- [ ] Design mine counter and timer display
- [ ] Add difficulty selector
- [ ] Create face button (reset game, shows emoji based on game state)

##### Polish
- [ ] Add number colors (1-8 different colors)
- [ ] Implement mine reveal animation on game over
- [ ] Add flag and mine icons/emojis
- [ ] Create victory and defeat screens
- [ ] Add local best time storage per difficulty
- [ ] Implement question mark flag option (optional)

#### Brick Breaker

##### Setup & State Management
- [x] Create initial game state (paddle, ball, bricks, score, lives, level, game status)
- [x] Set up useReducer with actions: START_GAME, UPDATE_PADDLE, UPDATE_BALL, BREAK_BRICK, LOSE_LIFE, LEVEL_UP, GAME_OVER, PAUSE_GAME
- [x] Define game constants (canvas size, paddle size, ball size, brick dimensions)
- [x] Initialize brick layout patterns for different levels

##### Core Game Logic
- [x] Implement paddle movement (follows mouse or keyboard)
- [x] Create ball physics (position, velocity, direction)
- [x] Implement ball-paddle collision detection and angle calculation
- [x] Add ball-brick collision detection (top, bottom, sides)
- [x] Create ball-wall collision (left, right, top)
- [x] Implement brick breaking and removal
- [x] Add ball-out-of-bounds detection (lose life)

##### Game Mechanics
- [x] Create game loop with requestAnimationFrame
- [x] Implement scoring system (different brick types = different points)
- [x] Add lives system (start with 3 lives)
- [x] Create level progression (clear all bricks = next level)
- [ ] Implement multiple brick types:
    - [ ] Normal bricks (1 hit)
    - [ ] Strong bricks (2 hits)
    - [ ] Unbreakable bricks
- [ ] Add power-ups:
    - [ ] Multi-ball
    - [ ] Wider paddle
    - [ ] Laser
    - [ ] Slow ball
- [ ] Increase ball speed gradually

##### UI & Controls
- [ ] Handle mouse movement for paddle control
- [x] Add keyboard controls (arrow keys or A/D)
- [x] Render paddle, ball, and bricks on canvas
- [x] Display score, lives, and level
- [x] Create start ball on paddle state (click/space to launch)
- [x] Add pause functionality
- [ ] Create game over screen
- [ ] Create level complete screen

##### Polish
- [ ] Add particle effects for brick breaking (e.g., small explosions, dust clouds)
- [ ] Implement trail effect for ball movement (e.g., a fading line behind the ball)
- [ ] Create color schemes for different brick types (e.g., different colors for 1-hit, 2-hit, unbreakable)
- [ ] Add sound effects for collisions (ball-paddle, ball-brick, ball-wall) and brick breaking
- [ ] Implement combo multiplier for consecutive brick breaks
- [ ] Add visual feedback for paddle hits (e.g., paddle flashes, ball changes color/speed temporarily)
- [ ] Create multiple level layouts with increasing difficulty


#### Tower Defense

##### Setup & State Management
- [ ] Create initial game state (towers, enemies, path, gold, lives, wave, game status)
- [ ] Set up useReducer with actions: PLACE_TOWER, UPGRADE_TOWER, SELL_TOWER, SPAWN_ENEMY, UPDATE_ENEMIES, DAMAGE_ENEMY, ENEMY_REACHED_END, START_WAVE, GAME_OVER
- [ ] Define tower types (basic gun, sniper, splash, slow, etc.)
- [ ] Define enemy types (normal, fast, tank, flying, etc.)
- [ ] Create game map/path structure

##### Core Game Logic
- [ ] Implement pathfinding for enemies (predefined path or A* algorithm)
- [ ] Create tower placement validation (can't block path, must be on valid tile)
- [ ] Implement tower range and targeting system (closest, first, last, strongest)
- [ ] Add projectile physics and movement
- [ ] Create collision detection (projectile hits enemy)
- [ ] Implement damage calculation and enemy health system
- [ ] Add gold/resource system (earn gold from kills)

##### Game Mechanics
- [ ] Create wave spawning system (increasing difficulty)
- [ ] Implement tower attack cooldown/fire rate
- [ ] Add tower upgrade system (increase damage, range, speed)
- [ ] Create tower selling functionality (refund partial cost)
- [ ] Implement lives system (lose life when enemy reaches end)
- [ ] Add wave completion bonus gold
- [ ] Create auto-start next wave or manual trigger

##### Tower Types
- [ ] Basic Tower: moderate damage, fire rate, and range
- [ ] Sniper Tower: high damage, long range, slow fire rate
- [ ] Splash Tower: area damage, moderate range
- [ ] Slow Tower: slows enemies, support tower
- [ ] Add unique abilities per tower type

##### UI & Controls
- [ ] Create grid-based map rendering
- [ ] Handle click to select tower placement location
- [ ] Build tower selection menu with costs
- [ ] Display tower range on hover/selection
- [ ] Create tower info panel (upgrade, sell options)
- [ ] Show enemy path on map
- [ ] Display gold, lives, and current wave
- [ ] Add start wave button
- [ ] Create game over and victory screens

##### Polish
- [ ] Animate enemy movement along path
- [ ] Add projectile animations and effects
- [ ] Create tower shooting animations
- [ ] Implement health bars for enemies
- [ ] Add visual effects for different tower types
- [ ] Create enemy spawn animations
- [ ] Design multiple maps/levels
- [ ] Add fast-forward button for gameplay speed
- [ ] Implement sound effects and background music
- [ ] Save/load game progress (optional)

- [ ] **2048:** Add a "You Win!" message that is more subtle and allows the user to continue playing without a modal.
- [ ] **Flappy Bird:** Add a "Ready, Set, Go!" countdown before the game starts.
- [ ] **Tic-Tac-Toe:** Add an AI opponent.

### Animations
- [ ] **Tic Tac Toe:** Animate 'X'/'O' appearance, winning line, and reset button.
- [ ] **2048:** Animate tile movement, merging, and new tile appearance.
- [ ] **Flappy Bird:** Animate bird's flapping, pipes' movement, and game over.
- [ ] **Brick Breaker:** Animate brick breaking, ball bounce, and paddle movement.

### General UI/UX Improvements
- [x] Add animations to page transitions.
- [x] Improve the styling of the navigation bar.
- [x] Add a footer to the layout.
- [x] **Loading States:** Implement subtle loading indicators (spinners, skeleton loaders) for content that takes time to load (e.g., page transitions, sequential loading for Experience page).
- [x] **Enhanced Hover Effects:** Go beyond simple color changes for interactive elements (implemented on ExperienceCard).
- [x] **Click/Tap Feedback:** Add visual feedback (e.g., ripple effect, slight press animation) when buttons or interactive elements are clicked/tapped, especially important for touch devices.
- [x] **Consistent Typography System:** Define and apply a consistent typography scale and usage (implemented on ExperienceCard and Skills).
- [x] **Categorized Skills with Staggered Animation:** Implemented categorized skills with staggered animation coming from the right.
- [ ] **Empty States Design:** Create user-friendly designs for sections where content might be missing (e.g., "No high scores yet," "No games found").
- [ ] **Reduced Motion Preference:** Implement support for `prefers-reduced-motion` to respect user preferences for less animation, enhancing accessibility and user comfort.

### Backend Features
- [ ] Add a backend to store high scores and user profiles.
- [ ] Implement user authentication.

### Code Quality and Maintenance
- [ ] Write unit tests for game logic.
- [ ] Develop integration tests for UI components.
- [ ] Set up a CI/CD pipeline for automated testing and deployment to GitHub Pages.

---

## 💡 Frontend Development TODOs (Senior Dev + UX/UI Expert Collaboration)

### UX/UI & Design System
- [ ] Conduct a comprehensive UX/UI audit.
- [ ] Collaborate with UX/UI designer for user research, personas, and user journeys.
- [ ] Establish and integrate a robust design system (e.g., Storybook, Figma tokens).
- [ ] Implement subtle animations and micro-interactions based on UX/UI specifications.

### Performance & Accessibility (a11y)
- [x] Perform an accessibility review (WCAG 2.1 AA) and implement necessary changes to ensure the application is usable by individuals with disabilities. *(Marked as [x] as a general goal, but specific tasks are added below)*
- [ ] Implement ARIA attributes for custom components and dynamic content.
- [ ] Ensure comprehensive keyboard navigation and focus management for all interactive elements.
- [ ] Verify sufficient color contrast ratios for all text and UI elements.
- [ ] Add screen reader support for game states, scores, instructions, and interactive UI elements.
- [ ] Conduct automated and manual accessibility testing with tools (e.g., Lighthouse, axe-core, screen readers).
- [ ] Analyze and optimize frontend performance metrics.

### Responsiveness & Compatibility
- [ ] Ensure full cross-browser compatibility.

### Testing & Iteration
- [ ] Set up and conduct A/B tests for new features or design changes.

### Code Quality & Architecture
- [ ] Review and potentially refactor the application's state management strategy.
