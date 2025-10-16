# Project TODO List

This document tracks the features and tasks that need to be completed for the project.

## Game Development

- [ ] Implement the "Snake" game.
- [ ] Implement the "Memory" game.

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

- [x] Separate pure game logic from the `use2048` hook into a `gameLogic.ts` file.
- [x] Use the `Tile` type in the `use2048` hook to represent the board as a `Tile[][]`.
- [x] Implement tile animations using the `TileAnimation` type.

**Flappy Bird**

- [ ] Separate pure game logic from the `useFlappyBird` hook into a `gameLogic.ts` file.
- [ ] Move the `GAME_DIMENSIONS` and `PHYSICS` constants to a separate `constants.ts` file.

## UI/UX Improvements

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

- [ ] Animate the movement of tiles across the board.
- [ ] Animate the merging of tiles.
- [ ] Animate the appearance of new tiles.

**Flappy Bird**

- [ ] Animate the bird's flapping motion.
- [ ] Animate the pipes' movement to make it smoother.
- [ ] Add a "game over" animation when the bird crashes.

### Main Page Content

- [ ] Add a "Featured Game" section to highlight a specific game.
- [ ] Add a "Developer Profile" section with a brief bio and links to GitHub and LinkedIn.
- [ ] Add a "Skills" section with one of the following ideas:
    - [ ] Interactive Skills Radar Chart.
    - [ ] Skills Word Cloud.
    - [ ] Animated Skill Bars.
    - [ ] Categorized Skill List.
- [ ] Add a "What I'm Learning" section.

## Code Quality and Maintenance

- [ ] Write unit tests for the game logic to ensure correctness and prevent regressions.
- [ ] Develop integration tests for the UI components to verify their behavior and interactions.
- [ ] Set up a CI/CD pipeline to automate the testing and deployment processes, improving efficiency and reliability.

## Documentation

- [x] Update the `README.md` file with comprehensive details about the project, including setup instructions, a description of the games, and contribution guidelines.
- [x] Add inline comments to the code to clarify complex logic and improve maintainability.
