/**
 * src/games/memory-game/components/Card.tsx
 *
 * Renders an individual card for the Memory Game.
 * It displays either the card's back (a question mark) or its value (an emoji)
 * based on whether it's flipped or matched.
 */

import React from 'react';
import { Card as CardType } from '../types';
import './Card.css'; // Styling for the card component

/**
 * Props for the Card component.
 * @interface CardProps
 * @property {CardType} card - The card data object, containing its value, flipped state, and matched state.
 * @property {() => void} onClick - Callback function to be executed when the card is clicked.
 */
interface CardProps {
  card: CardType;
  onClick: () => void;
}

/**
 * React functional component for a single Memory Game card.
 * It visually represents a card that can be flipped to reveal its value.
 *
 * @param {CardProps} { card, onClick } - Props passed to the component.
 * @returns {JSX.Element} The rendered card.
 */
const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    // The main card container. The 'flipped' class is applied if the card is either flipped or matched,
    // triggering a CSS transform to show the back face.
    <div 
      className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`} 
      onClick={onClick} // Attach click handler
    >
      <div className="card-inner">
        {/* The front face of the card, typically showing a placeholder (e.g., '?') */}
        <div className="card-front">
          <span>?</span>
        </div>
        {/* The back face of the card, showing its actual value (emoji) */}
        <div className="card-back">
          <span>{card.value}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
