
// src/games/memory-game/components/Card.tsx

import React from 'react';
import { Card as CardType } from '../types';
import './Card.css';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">
          <span>?</span>
        </div>
        <div className="card-back">
          <span>{card.value}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
