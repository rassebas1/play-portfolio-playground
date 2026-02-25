# Project TODO List

This document tracks the features and tasks that need to be completed for the project.

## ✅ Completed Development Advances

### New Games
- [x] **Snake Game:** Fully implemented with core logic, state management (reducer), and integrated into the application.
- [x] **Memory Game:** Fully implemented with difficulty levels and best score tracking.
- [x] **Brick Breaker:** Fully implemented with paddle, ball physics, brick destruction, and level progression.

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

### Internationalization (i18n)
- [x] Implemented i18n with JSON locale files in `public/locales/[lang]/`
- [x] Configured `i18next-http-backend` for async loading
- [x] Set up namespaces (common, skills, experience, education, games)
- [x] Migrated skills, experience, and education constants to use translation keys

### Documentation
- [x] Updated `README.md` with comprehensive details.
- [x] Added inline comments to clarify complex logic.
- [x] Created AGENTS.md for agentic coding guidelines.

---

## 🚀 Future Features & Enhancements

### New Games
- [ ] Implement the **Tetris** game
- [ ] Implement the **Minesweeper** game
- [ ] Implement the **Tower Defense** game

### Mobile Enhancements (Touch Controls)
- [x] **Snake:** Implement swipe gestures on the game board for direction control.
- [x] **2048:** Implement swipe gestures on the game board for tile movement.
- [x] **Flappy Bird:** Ensure tap input is robust and responsive for mobile devices.
- [x] **Tic-Tac-Toe:** Ensure tap input is robust and responsive for mobile devices.
- [x] **Brick Breaker:** Implement touch controls for paddle movement (e.g., drag or tap left/right halves of the screen).

### Game-specific Improvements

#### Snake
- [x] Implement difficulty selection (1-9).
- [x] Adjust points per eaten food based on difficulty.
- [x] Adjust snake speed based on difficulty.

#### Memory Game
- [x] Create best time/moves tracking
- [x] Store best scores per difficulty in localStorage

#### Tetris
- [ ] Implement the Tetris game following the project structure conventions

#### Minesweeper
- [ ] Implement the Minesweeper game following the project structure conventions

#### Brick Breaker

##### Game Mechanics
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
- [ ] Implement the Tower Defense game (see project structure for guidance)

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

#### 2048
- [ ] Add a "You Win!" message that is more subtle and allows the user to continue playing without a modal.

#### Flappy Bird
- [ ] Add a "Ready, Set, Go!" countdown before the game starts.

#### Tic-Tac-Toe
- [ ] Add an AI opponent.

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

### Code Quality and Maintenance
- [ ] Write unit tests for game logic.
- [ ] Develop integration tests for UI components.
- [ ] Set up a CI/CD pipeline for automated testing and deployment to GitHub Pages.

---

## 💡 Accessibility & Performance

### Performance & Accessibility (a11y)
- [x] Perform an accessibility review (WCAG 2.1 AA) as a general goal
- [ ] Implement ARIA attributes for custom components and dynamic content.
- [ ] Ensure comprehensive keyboard navigation and focus management for all interactive elements.
- [ ] Verify sufficient color contrast ratios for all text and UI elements.
- [ ] Add screen reader support for game states, scores, instructions, and interactive UI elements.
- [ ] Conduct automated and manual accessibility testing with tools (e.g., Lighthouse, axe-core, screen readers).
- [ ] Analyze and optimize frontend performance metrics.

### Responsiveness & Compatibility
- [ ] Ensure full cross-browser compatibility.

### Code Quality & Architecture
- [ ] Review and potentially refactor the application's state management strategy.

---

## 🎨 Portfolio Visual Evolution (2024-2025)

### Phase 1: Mobile Foundation (✅ COMPLETED)
- [x] Fix container padding for mobile (responsive 1rem-2rem)
- [x] Reduce heading sizes for mobile (responsive text-3xl to text-7xl)
- [x] Add skip link for accessibility (Layout component)
- [x] Remove simulated loading delays (Experience, Education pages)
- [x] Add translations for skip link (EN, ES, FR, IT)

### Phase 2: Touch & Interaction (✅ COMPLETED)
- [x] Improve mobile menu with better touch targets (44px minimum)
- [x] Add touch feedback to buttons (touch-manipulation CSS)
- [x] Optimize game controls for mobile touch
- [x] Add larger button sizes (lg, iconSm variants)
- [x] Improve navbar icon buttons with 44px touch targets

### Phase 3: Visual Enhancements (✅ COMPLETED)
- [x] Add hover effects to game cards (Games page)
- [x] Enhance DeveloperProfile with visual effects (gradient border, avatar ring)
- [x] Improve Skills component with color-coded badges
- [x] Add animations to Experience cards
- [x] Enhance Footer with gradient border and hover effects

### Phase 4: Hero Section Upgrade (✅ COMPLETED)
- [x] Add CSS enhancements (grid pattern, glassmorphism utilities)
- [x] Create TypingEffect component (animated role rotation)
- [x] Create HeroCTA component (GitHub, LinkedIn, Play 2048 buttons)
- [x] Update Home page with new hero section
- [x] Add hero background effects (grid pattern, radial glow)
- [x] Add translations for hero section (EN, ES, FR, IT)

### Phase 5: Bento Grid Skills (✅ COMPLETED)
- [x] Create SkillCard component with glassmorphism
- [x] Create BentoGrid component (4 skill categories)
- [x] Add responsive grid layout (1-2 columns)
- [x] Add hover animations and corner accents
- [x] Add translations for bento grid (EN, ES, FR, IT)

### Phase 6: Projects Section (✅ COMPLETED)
- [x] Create ProjectSlide component with glassmorphism
- [x] Create ProjectsCarousel with auto-advance (5 seconds)
- [x] Add pause on hover functionality
- [x] Add navigation arrows (left/right)
- [x] Add progress indicator dots
- [x] Include 3 projects (2 professional + 1 research)
- [x] Position above Seniority Badges on Home page
- [x] Add translations (EN, ES, FR, IT)

### Phase 7: Big Data & AI Lab (⏳ PENDING - Requires Details)
**Requirements Needed from User:**
- [ ] Power BI/Tableau visualizations or screenshots
- [ ] SECGle project details (arrhythmia detector)
- [ ] Spark/Hadoop pipeline descriptions
- [ ] Any Big Data project showcases

**Implementation Tasks:**
- [ ] Create DataLab page or section
- [ ] Create data visualization components
- [ ] Add chart components (using existing Recharts)
- [ ] Add translations
- [ ] Add to navigation

### Phase 8: Seniority Badges (✅ COMPLETED)
- [x] Create BadgeItem component with glassmorphism
- [x] Create SeniorityBadges container (9 badges)
- [x] Add color-coded categories (Security, Quality, Tools)
- [x] Integrate below Bento Grid on Home page
- [x] Add hover animations and staggered entrance
- [x] Add translations (EN, ES, FR, IT)
