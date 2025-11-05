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
- [x] Added "What I'm Learning" section.
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

### Mobile Enhancements (Touch Controls)
- [ ] **Snake:** Implement swipe gestures on the game board for direction control.
- [ ] **2048:** Implement swipe gestures on the game board for tile movement.
- [ ] **Flappy Bird:** Ensure tap input is robust and responsive for mobile devices.
- [ ] **Tic-Tac-Toe:** Ensure tap input is robust and responsive for mobile devices.

### Internationalization (i18n)
- [ ] Identify all user-facing text and content for translation.
- [ ] Choose and integrate an i18n library (e.g., `react-i18next`, `formatjs`).
- [ ] Implement text extraction and translation workflows.
- [ ] Add language switching functionality (UI and logic).
- [ ] Ensure proper formatting for dates, times, numbers, and currencies across different locales.

### Game-specific Improvements
- [ ] **2048:** Add a "You Win!" message that is more subtle and allows the user to continue playing without a modal.
- [ ] **Flappy Bird:** Add a "Ready, Set, Go!" countdown before the game starts.
- [ ] **Tic-Tac-Toe:** Add an AI opponent.

### Animations
- [ ] **Tic Tac Toe:** Animate 'X'/'O' appearance, winning line, and reset button.
- [ ] **2048:** Animate tile movement, merging, and new tile appearance.
- [ ] **Flappy Bird:** Animate bird's flapping, pipes' movement, and game over.

### General UI/UX Improvements
- [ ] Add animations to page transitions.
- [ ] Improve the styling of the navigation bar.
- [ ] Add a footer to the layout.

### Backend Features
- [ ] Add a backend to store high scores and user profiles.
- [ ] Implement user authentication.

### Code Quality and Maintenance
- [ ] Write unit tests for game logic.
- [ ] Develop integration tests for UI components.
- [ ] Set up a CI/CD pipeline.

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