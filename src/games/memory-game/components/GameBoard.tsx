/**
 * src/games/memory-game/components/GameBoard.tsx
 *
 * Renders the main game board for the Memory Game, displaying all the cards.
 * It maps over the game state's cards and renders an individual `Card` component for each.
 */

import React from 'react';
import { GameState } from '../types';
import Card from './Card';
import './GameBoard.css'; // Styling for the game board grid

/**
 * Props for the GameBoard component.
 * @interface GameBoardProps
 * @property {GameState} state - The current state of the Memory Game, containing card data and difficulty.
 * @property {(index: number) => void} onCardClick - Callback function to handle a click on a card,
 *                                                  passing the index of the clicked card.
 */
interface GameBoardProps {
  state: GameState;
  onCardClick: (index: number) => void;
}

/**
 * React functional component for the Memory Game board.
 * It dynamically renders a grid of `Card` components based on the game's current state.
 *
 * @param {GameBoardProps} { state, onCardClick } - Props passed to the component.
 * @returns {JSX.Element} The rendered game board.
 */
const GameBoard: React.FC<GameBoardProps> = ({ state, onCardClick }) => {
  return (
    // The game board container, with a dynamic class based on difficulty for styling
    <div className={`game-board ${state.difficulty.toLowerCase()}`}>
      {/* Map through each card in the state and render a Card component */}
      {state.cards.map((card, index) => (
        <Card 
          key={card.id} // Unique key for React list rendering
          card={card}   // Pass the card data to the Card component
          onClick={() => onCardClick(index)} // Pass click handler with card's index
        />
      ))}
    </div>
  );
};

export default GameBoard;
