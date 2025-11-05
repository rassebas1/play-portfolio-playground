# Project TODO ListThis document tracks the features and tasks that need to be completed for the project.## Future Features### Game-specific Improvements- [ ] **2048:** Add a "You Win!" message that is more subtle and allows the user to continue playing without a modal.
- [ ] **Flappy Bird:** Add a "Ready, Set, Go!" countdown before the game starts.
- [ ] **Tic-Tac-Toe:** Add an AI opponent.

### General UI/UX Improvements
- [ ] Add animations to page transitions.
- [ ] Improve the styling of the navigation bar.
- [ ] Add a footer to the layout.

### New Games
- [ ] Implement the "Snake" game.
- [ ] Implement the "Memory" game.

### Backend Features
- [ ] Add a backend to store high scores and user profiles.
- [ ] Implement user authentication.

## Completed Tasks

### SPA Refactoring
- [x] Restructured the application into a Single Page Application (SPA).
- [x] Created separate pages for Home, Games, and Experience.
- [x] Added a navigation bar to the layout.

### Main Page Content
- [x] Filled the main page with content from the CV.
- [x] Created `DeveloperProfile`, `Skills`, `WhatImLearning`, and `ExperienceCard` components.

### Game Development

- [ ] Implement the "Snake" game.
- [ ] Implement the "Memory" game.

### Snake Game

- [ ] **File Structure:** Create the basic file structure for the Snake game inside `src/games/snake`.
- [ ] **Game Components:**
    - [ ] Implement the `GameBoard` component, which will serve as the main play area.
    - [ ] Create components for the `Snake` and `Food` elements.
- [ ] **Game Logic:**
    - [ ] Implement the core game logic, including snake movement and controls.
    - [ ] Add logic for generating `Food` at random positions.
    - [ ] Implement collision detection to handle interactions with the walls and the snake's own body.
- [ ] **State Management:**
    - [ ] Implement scoring to keep track of the player's progress.
    - [ ] Add game over and restart functionality.
- [ ] **Integration:**
    - [ ] Create the main `Snake.tsx` component to bring all the elements together and integrate it into the main application.

### Refactoring

**Tic Tac Toe**

- [x] Extract the header section into a `GameHeader` component.
- [x] Extract the game status card into a `GameStatus` component.
- [x] Extract the game rules card into a `GameRules` component.

**2048**

- [x] Extract the header section into a `GameHeader` component.
- [x] Extract the score section into a `Scoreboard` component.
- [x] Extract the game controls section into a `GameControls` component.
- [x] Extract the mobile controls section into a `MobileControls` component.
- [x] Extract the game over modal into a `GameOverModal` component.

- [x] Separate pure game logic from the `use2048` hook into a `gameLogic.ts` file.
- [x] Use the `Tile` type in the `use2048` hook to represent the board as a `Tile[][]`.
- [x] Implement tile animations using the `TileAnimation` type.

**Flappy Bird**

- [x] Extract the header section into a `GameHeader` component.
- [x] Extract the score section into a `Scoreboard` component.
- [x] Extract the game controls section into a `GameControls` component.
- [x] Extract the instructions card into an `Instructions` component.
- [x] Extract the game over modal into a `GameOverModal` component.

### Hooks and Types Refactoring

**Tic Tac Toe**

- [x] Move `initialState` outside the `useTicTacToe` hook to be a constant.
- [x] Remove the `getGameResult` function and determine the game result directly in the `makeMove` function.

**2048**

- [x] Implemented Reducer for State Management: Replaced `useState` with `useReducer` for managing the game state (`tiles`, `byIds`, `score`, `highScore`, `isGameOver`, `isWon`, `canUndo`, `inMotion`, `hasChanged`, `previousState`).
- [x] Centralized Game State: All game-related state is now managed within a single `GameState` interface and updated via `GameReducer`.
- [x] Organized Files into `utils` folder: Moved `boardUtils.ts`, `tileUtils.ts`, `lineProcessor.ts`, `moveProcessor.ts`, and `moveProcessor2.ts` into a new `utils` directory for better file management and clean architecture.
- [x] Created `constants.ts`: Extracted `TILE_COUNT_PER_ROW_OR_COLUMN` and `ANIMATION_DURATION` into a dedicated `constants.ts` file.
- [x] Updated Import Paths: Adjusted all import paths to reflect the new file organization.
- [x] Ensured Correct Tile Spawning: Fixed the bug where new tiles could spawn on existing tiles by ensuring `addRandomTile` always uses the latest board state.
- [x] Corrected Game Over Condition: Updated `isGameOverAfterMove` to correctly account for a full board with no possible moves.
- [x] Fixed Restart Game Logic: Ensured the "New Game" button correctly re-initializes the board with two new tiles without accumulating extra tiles.
- [x] Enabled Undo Functionality: Correctly implemented `canUndo` state management to enable/disable the Undo button.
- [x] Removed Redundant `gameLogic.ts`: Deleted the `gameLogic.ts` file as its re-exporting functionality became redundant after file reorganization.
- [x] Cleaned Unused Imports and Variables: Removed unused `useState` and `Game2048State` imports from `use2048.ts`, and removed unused `Home` import and `goHome` function from `Game2048.tsx`.
- [x] Resolved `class` vs `className` Warning: Replaced `class` with `className` in `src/pages/Index.tsx`.

**Flappy Bird**

- [x] Separate pure game logic from the `useFlappyBird` hook into a `gameLogic.ts` file.
- [x] Move the `GAME_DIMENSIONS` and `PHYSICS` constants to a separate `constants.ts` file.

### UI/UX Improvements

- [x] Create a more engaging and visually appealing landing page (`Index.tsx`) to better showcase the available games.
- [x] Add a custom favicon to the project to improve brand identity.
- [x] Enhance the responsive design of the application to ensure a seamless experience across all devices.
- [x] Implement a theme switcher to allow users to toggle between light and dark modes.


### Animations

**Tic Tac Toe**

- [ ] Animate the appearance of 'X' and 'O' on the board.
- [ ] Animate the winning line when a player wins.
- [ ] Add a subtle animation to the reset button.

**2048**
ndo you 
- [ ] Animate the movement of tiles across the board.
- [ ] Animate the merging of tiles.
- [ ] Animate the appearance of new tiles.

**Flappy Bird**

- [ ] Animate the bird's flapping motion.
- [ ] Animate the pipes' movement to make it smoother.
- [ ] Add a "game over" animation when the bird crashes.

### Main Page Content

- [x] Add a "Developer Profile" section with a brief bio and links to GitHub and LinkedIn.
- [x] Add a "Skills" section.
- [x] Add a "What I'm Learning" section.
- [x] Add an "Experience" section.

### Code Quality and Maintenance

- [ ] Write unit tests for the game logic to ensure correctness and prevent regressions.
- [ ] Develop integration tests for the UI components to verify their behavior and interactions.
- [ ] Set up a CI/CD pipeline to automate the testing and deployment processes, improving efficiency and reliability.

### Documentation

- [x] Update the `README.md` file with comprehensive details about the project, including setup instructions, a description of the games, and contribution guidelines.
- [x] Add inline comments to the code to clarify complex logic and improve maintainability.

# Frontend Development TODOs (Senior Dev + UX/UI Expert Collaboration)

## UX/UI & Design System
- [ ] Conduct a comprehensive UX/UI audit of the existing application to identify pain points, inconsistencies, and areas for improvement.
- [ ] Collaborate with the UX/UI designer to conduct user research, define user personas, and map user journeys to better understand user needs and behaviors.
- [ ] Work with the UX/UI designer to establish and integrate a robust design system (e.g., Storybook, Figma tokens) to ensure consistency and efficiency in development.
- [ ] Implement subtle animations and micro-interactions to improve user feedback, engagement, and overall perceived quality, guided by UX/UI design specifications.

## Performance & Accessibility
- [ ] Perform an accessibility review (WCAG 2.1 AA) and implement necessary changes to ensure the application is usable by individuals with disabilities.
- [ ] Analyze and optimize frontend performance metrics (e.g., page load times, rendering performance, bundle size) in collaboration with the UX/UI designer to ensure a smooth user experience.

## Responsiveness & Compatibility
- [ ] Refine and enhance the responsive design across various devices and screen sizes, ensuring an optimal user experience on mobile, tablet, and desktop.
- [ ] Ensure full cross-browser compatibility for all implemented features, addressing any rendering or functionality discrepancies.

## Testing & Iteration
- [ ] Set up and conduct A/B tests for new features or design changes, analyze results, and iterate on the design and implementation based on user feedback and data.

## Code Quality & Architecture
- [ ] Review and potentially refactor the application's state management strategy to improve predictability, maintainability, and scalability, considering its impact on UX.
