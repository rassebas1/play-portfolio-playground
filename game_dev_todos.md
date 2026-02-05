# Game Development Todo Lists

## 2048

### Setup & State Management
- [x] Create initial game state structure (4x4 grid, score, best score, game status)
- [x] Set up useReducer with actions: START_GAME, MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, ADD_TILE, GAME_OVER, GAME_WON, RESET_GAME
- [x] Initialize empty 4x4 board grid
- [x] Create tile data structure (value, position, id for animations)

### Core Game Logic
- [x] Implement tile sliding logic in all four directions
- [x] Create tile merging algorithm (combine same values)
- [x] Add new tile generation (2 or 4 in random empty cell)
- [x] Implement move validation (check if move is possible)
- [x] Create win condition checker (tile reaches 2048)
- [x] Add game over detection (no valid moves remaining)
- [x] Calculate score updates (add merged tile values)

### Game Mechanics
- [x] Start game with two random tiles
- [x] Add tile after each valid move
- [x] Implement score tracking and best score
- [x] Allow continue playing after reaching 2048
- [x] Prevent invalid moves (no changes to board)

### UI & Controls
- [x] Handle keyboard arrow keys for movement
- [x] Add touch swipe support for mobile
- [x] Build grid rendering component
- [x] Create tile component with different colors per value
- [x] Display current score and best score
- [x] Add new game button
- [x] Create win and game over overlays
- [x] Show undo button (optional)

### Polish
- [x] Implement smooth tile sliding animations
- [x] Add tile merge animations (pop effect)
- [x] Create new tile spawn animation
- [x] Design color scheme for different tile values
- [x] Store best score in localStorage
- [ ] Add slide sound effects (optional)

---

## Flappy Bird

### Setup & State Management
- [x] Create initial game state (bird position/velocity, pipes, score, game status)
- [x] Set up useReducer with actions: START_GAME, FLAP, UPDATE_GAME, ADD_PIPE, REMOVE_PIPE, COLLISION, SCORE_POINT, RESET_GAME
- [x] Define game constants (gravity, jump strength, pipe gap, pipe speed)
- [x] Initialize bird starting position

### Core Game Logic
- [x] Implement gravity physics (bird falls with acceleration)
- [x] Create flap/jump mechanic (upward velocity on click/tap)
- [x] Add pipe generation system (random heights, consistent gap)
- [x] Implement pipe movement (scroll from right to left)
- [x] Create collision detection (bird hits pipe or ground/ceiling)
- [x] Add score increment (pass through pipe gap)
- [x] Implement game boundaries (top and bottom)

### Game Mechanics
- [x] Create game loop with requestAnimationFrame
- [x] Add pipe spawning at intervals
- [x] Remove off-screen pipes for performance
- [ ] Implement difficulty increase (faster pipes over time) - optional
- [x] Add bird rotation based on velocity (tilt up/down)

### UI & Controls
- [x] Handle click/tap to flap
- [x] Handle spacebar to flap
- [x] Handle arrow keys for movement
- [x] Render bird sprite with rotation
- [x] Draw pipes (top and bottom)
- [x] Display current score
- [x] Show high score
- [x] Create start screen (tap to begin)
- [x] Create game over screen with restart button
- [x] Add background scrolling effect

### Polish
- [ ] Implement smooth bird wing flapping animation
- [ ] Add parallax scrolling background
- [ ] Create score popup animation when passing pipe
- [ ] Add particle effects on collision
- [ ] Implement flap sound effect
- [ ] Add score ding sound
- [ ] Create collision sound
- [x] Store high score in localStorage
- [ ] Add visual feedback for flap action

---

## Snake

### Setup & State Management
- [x] Create initial game state (snake body, direction, food position, score, game status)
- [x] Set up useReducer with actions: START_GAME, CHANGE_DIRECTION, MOVE_SNAKE, EAT_FOOD, GROW_SNAKE, GAME_OVER, RESET_GAME
- [x] Define grid size (e.g., 20x20 cells)
- [x] Initialize snake with starting length (3-4 segments)
- [x] Create direction system (up, down, left, right)

### Core Game Logic
- [x] Implement snake movement (head moves, body follows)
- [x] Create direction change validation (can't reverse directly)
- [x] Add food placement (random empty cell)
- [x] Implement collision detection with walls
- [x] Add self-collision detection (snake hits own body)
- [x] Create food eating logic (head position matches food)
- [x] Implement snake growth after eating

### Game Mechanics
- [x] Create game loop with setInterval or requestAnimationFrame
- [x] Increase snake speed as it grows (optional)
- [x] Add score tracking (points per food eaten)
- [x] Implement high score system
- [x] Create different game speeds/difficulty levels
- [ ] Add walls or wrap-around mode toggle

### UI & Controls
- [x] Handle arrow keys for direction change
- [ ] Alternative WASD keys for direction
- [ ] Prevent multiple direction changes per frame
- [x] Render grid-based game board
- [ ] Draw snake segments with distinct head
- [x] Display food item
- [x] Show current score and high score
- [ ] Add pause functionality
- [x] Create start screen
- [x] Create game over screen with restart

### Polish
- [ ] Design distinct colors for snake head, body, and food
- [ ] Add smooth movement animations
- [ ] Create food spawn animation
- [ ] Implement visual feedback when eating food
- [ ] Add grid lines for clarity
- [x] Store high score in localStorage
- [ ] Add eating sound effect
- [ ] Create game over sound
- [ ] Show snake length in UI

---

## Tic-Tac-Toe

### Setup & State Management
- [x] Create initial game state (3x3 board, current player, winner, game status)
- [x] Set up useReducer with actions: MAKE_MOVE, SWITCH_PLAYER, SET_WINNER, RESET_GAME, SET_GAME_MODE
- [x] Initialize empty 3x3 grid
- [x] Define player symbols (X and O)
- [ ] Create game mode options (PvP, vs AI)

### Core Game Logic
- [x] Implement move validation (cell is empty and game not over)
- [x] Create win condition checker (rows, columns, diagonals)
- [x] Add draw/tie detection (board full, no winner)
- [x] Implement player switching after valid move
- [ ] Create AI opponent logic (random, minimax algorithm)
- [ ] Add first player selection

### Game Mechanics
- [x] Allow players to place X or O in empty cells
- [x] Prevent moves after game ends
- [ ] Track move history for undo (optional)
- [ ] Implement score tracking across multiple games
- [ ] Add difficulty levels for AI (easy, medium, hard)

### UI & Controls
- [x] Handle cell clicks to make moves
- [x] Render 3x3 game board
- [x] Display X and O symbols clearly
- [x] Show current player's turn
- [x] Highlight winning combination
- [x] Display winner or draw message
- [x] Add reset/new game button
- [ ] Create game mode selector (PvP vs AI)
- [ ] Show game statistics (wins, losses, draws)

### Polish
- [x] Add hover effect on empty cells
- [ ] Implement symbol placement animation
- [ ] Create winning line animation
- [ ] Add smooth transitions between states
- [ ] Implement victory celebration effect
- [ ] Add sound effects for moves and wins
- [ ] Create draw animation
- [ ] Store game statistics in localStorage
- [ ] Add player name input (optional)
- [ ] Implement theme customization (optional)

---

## Memory Game

### Setup & State Management
- [x] Create initial game state (cards, flipped cards, matched pairs, moves, game status, timer)
- [x] Set up useReducer with actions: START_GAME, FLIP_CARD, CHECK_MATCH, RESET_FLIPPED, GAME_WON, RESET_GAME, SET_DIFFICULTY
- [x] Define difficulty levels (Easy: 4x3, Medium: 4x4, Hard: 6x4)
- [x] Create card data structure (id, value/image, isFlipped, isMatched)
- [x] Initialize card pairs and shuffle algorithm

### Core Game Logic
- [x] Implement card shuffling (Fisher-Yates algorithm)
- [x] Create card flip logic (max 2 cards flipped at once)
- [x] Add match checking (compare two flipped cards)
- [x] Implement matched cards lock (stay flipped)
- [x] Add non-match logic (flip back after delay)
- [x] Create win condition (all pairs matched)
- [x] Track number of moves/attempts

### Game Mechanics
- [x] Allow flipping only unmatched, non-flipped cards
- [ ] Prevent flipping during match checking delay
- [x] Implement move counter (increment per pair attempt)
- [x] Add game timer (starts on first flip)
- [ ] Calculate star rating based on moves (optional)
- [x] Create best time/moves tracking

### UI & Controls
- [x] Handle card click to flip
- [x] Render grid of cards based on difficulty
- [x] Create card component with front and back
- [x] Implement card flip animation
- [x] Display moves counter and timer
- [ ] Show matched pairs counter
- [x] Add difficulty selector
- [x] Create start screen
- [x] Create victory screen with stats
- [x] Add restart button

### Polish
- [x] Design card back and front images/patterns
- [x] Implement smooth 3D flip animation
- [ ] Add matched cards celebration effect
- [ ] Create card shake animation for non-match
- [ ] Add success sound for matches
- [ ] Create flip sound effect
- [ ] Implement victory fanfare
- [x] Store best scores per difficulty in localStorage
- [ ] Add theme options (animals, emojis, colors, etc.)
- [ ] Create combo/streak system for consecutive matches

---

## Tetris

### Setup & State Management
- [ ] Create initial game state structure (board grid, current piece, next piece, score, level, game status)
- [ ] Set up useReducer with actions: START_GAME, MOVE_PIECE, ROTATE_PIECE, DROP_PIECE, CLEAR_LINES, GAME_OVER, PAUSE_GAME
- [ ] Define tetromino shapes (I, O, T, S, Z, J, L pieces) with rotation states
- [ ] Initialize 10x20 game board grid

### Core Game Logic
- [ ] Implement piece spawning logic (random piece generation)
- [ ] Create collision detection system (walls, floor, other pieces)
- [ ] Implement horizontal movement (left/right) with collision checks
- [ ] Implement rotation logic with wall kicks
- [ ] Add soft drop (faster fall) and hard drop (instant drop) mechanics
- [ ] Implement line clearing detection and scoring
- [ ] Create gravity system (automatic piece falling based on level)

### Game Mechanics
- [ ] Add scoring system (points for lines cleared, bonus for combos)
- [ ] Implement level progression (speed increases)
- [ ] Create "ghost piece" preview (shows where piece will land)
- [ ] Add next piece preview display
- [ ] Implement hold piece functionality (optional)
- [ ] Add game over detection (piece can't spawn)

### UI & Controls
- [ ] Create keyboard controls (arrow keys, space, P for pause)
- [ ] Build game board rendering component
- [ ] Design score, level, and next piece display
- [ ] Add pause/resume functionality
- [ ] Create start screen and game over screen
- [ ] Add restart button

### Polish
- [ ] Implement smooth animations for piece movement
- [ ] Add visual feedback for line clears
- [ ] Create sound effects (optional)
- [ ] Add color schemes for different tetrominoes
- [ ] Implement local high score storage

---

## Minesweeper

### Setup & State Management
- [ ] Create initial game state (board, revealed cells, flagged cells, mine positions, game status, timer)
- [ ] Set up useReducer with actions: START_GAME, REVEAL_CELL, FLAG_CELL, GAME_WIN, GAME_LOSE, RESET_GAME
- [ ] Define difficulty levels (Beginner: 9x9/10 mines, Intermediate: 16x16/40 mines, Expert: 16x30/99 mines)
- [ ] Create cell data structure (isMine, isRevealed, isFlagged, adjacentMines)

### Core Game Logic
- [ ] Implement mine placement algorithm (random, avoid first click)
- [ ] Create adjacent mines calculation for all cells
- [ ] Implement flood fill algorithm for revealing empty cells
- [ ] Add flag/unflag cell functionality
- [ ] Create win condition checker (all non-mine cells revealed)
- [ ] Implement lose condition (mine revealed)

### Game Mechanics
- [ ] Add first-click safety (ensure first click is always safe)
- [ ] Implement chord/double-click reveal (reveal adjacent cells if flags match number)
- [ ] Create mine counter (total mines - flags placed)
- [ ] Add game timer (starts on first click)
- [ ] Prevent actions after game over

### UI & Controls
- [ ] Handle left-click to reveal cells
- [ ] Handle right-click to flag cells
- [ ] Build board grid rendering component
- [ ] Create cell component with different states (hidden, revealed, flagged, mine, number)
- [ ] Design mine counter and timer display
- [ ] Add difficulty selector
- [ ] Create face button (reset game, shows emoji based on game state)

### Polish
- [ ] Add number colors (1-8 different colors)
- [ ] Implement mine reveal animation on game over
- [ ] Add flag and mine icons/emojis
- [ ] Create victory and defeat screens
- [ ] Add local best time storage per difficulty
- [ ] Implement question mark flag option (optional)

---

## Brick Breaker

### Setup & State Management
- [ ] Create initial game state (paddle, ball, bricks, score, lives, level, game status)
- [ ] Set up useReducer with actions: START_GAME, UPDATE_PADDLE, UPDATE_BALL, BREAK_BRICK, LOSE_LIFE, LEVEL_UP, GAME_OVER, PAUSE_GAME
- [ ] Define game constants (canvas size, paddle size, ball size, brick dimensions)
- [ ] Initialize brick layout patterns for different levels

### Core Game Logic
- [ ] Implement paddle movement (follows mouse or keyboard)
- [ ] Create ball physics (position, velocity, direction)
- [ ] Implement ball-paddle collision detection and angle calculation
- [ ] Add ball-brick collision detection (top, bottom, sides)
- [ ] Create ball-wall collision (left, right, top)
- [ ] Implement brick breaking and removal
- [ ] Add ball-out-of-bounds detection (lose life)

### Game Mechanics
- [ ] Create game loop with requestAnimationFrame
- [ ] Implement scoring system (different brick types = different points)
- [ ] Add lives system (start with 3 lives)
- [ ] Create level progression (clear all bricks = next level)
- [ ] Implement multiple brick types (normal, strong [2 hits], unbreakable)
- [ ] Add power-ups (multi-ball, wider paddle, laser, etc.) - optional
- [ ] Increase ball speed gradually

### UI & Controls
- [ ] Handle mouse movement for paddle control
- [ ] Add keyboard controls (arrow keys or A/D)
- [ ] Render paddle, ball, and bricks on canvas
- [ ] Display score, lives, and level
- [ ] Create start ball on paddle state (click/space to launch)
- [ ] Add pause functionality
- [ ] Create game over and level complete screens

### Polish
- [ ] Add particle effects for brick breaking
- [ ] Implement trail effect for ball movement
- [ ] Create color schemes for different brick types
- [ ] Add sound effects for collisions and breaking
- [ ] Implement combo multiplier for consecutive brick breaks
- [ ] Add visual feedback for paddle hits (ball changes color/speed)
- [ ] Create multiple level layouts with increasing difficulty

---

## Tower Defense

### Setup & State Management
- [ ] Create initial game state (towers, enemies, path, gold, lives, wave, game status)
- [ ] Set up useReducer with actions: PLACE_TOWER, UPGRADE_TOWER, SELL_TOWER, SPAWN_ENEMY, UPDATE_ENEMIES, DAMAGE_ENEMY, ENEMY_REACHED_END, START_WAVE, GAME_OVER
- [ ] Define tower types (basic gun, sniper, splash, slow, etc.)
- [ ] Define enemy types (normal, fast, tank, flying, etc.)
- [ ] Create game map/path structure

### Core Game Logic
- [ ] Implement pathfinding for enemies (predefined path or A* algorithm)
- [ ] Create tower placement validation (can't block path, must be on valid tile)
- [ ] Implement tower range and targeting system (closest, first, last, strongest)
- [ ] Add projectile physics and movement
- [ ] Create collision detection (projectile hits enemy)
- [ ] Implement damage calculation and enemy health system
- [ ] Add gold/resource system (earn gold from kills)

### Game Mechanics
- [ ] Create wave spawning system (increasing difficulty)
- [ ] Implement tower attack cooldown/fire rate
- [ ] Add tower upgrade system (increase damage, range, speed)
- [ ] Create tower selling functionality (refund partial cost)
- [ ] Implement lives system (lose life when enemy reaches end)
- [ ] Add wave completion bonus gold
- [ ] Create auto-start next wave or manual trigger

### Tower Types
- [ ] Basic Tower: moderate damage, fire rate, and range
- [ ] Sniper Tower: high damage, long range, slow fire rate
- [ ] Splash Tower: area damage, moderate range
- [ ] Slow Tower: slows enemies, support tower
- [ ] Add unique abilities per tower type

### UI & Controls
- [ ] Create grid-based map rendering
- [ ] Handle click to select tower placement location
- [ ] Build tower selection menu with costs
- [ ] Display tower range on hover/selection
- [ ] Create tower info panel (upgrade, sell options)
- [ ] Show enemy path on map
- [ ] Display gold, lives, and current wave
- [ ] Add start wave button
- [ ] Create game over and victory screens

### Polish
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