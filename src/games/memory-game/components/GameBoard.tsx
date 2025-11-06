
// src/games/memory-game/components/GameBoard.tsx

import React from 'react';
import { GameState } from '../types';
import Card from './Card';
import './GameBoard.css';

interface GameBoardProps {
  state: GameState;
  onCardClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ state, onCardClick }) => {
  return (
    <div className={`game-board ${state.difficulty.toLowerCase()}`}>
      {state.cards.map((card, index) => (
        <Card key={card.id} card={card} onClick={() => onCardClick(index)} />
      ))}
    </div>
  );
};

export default GameBoard;
