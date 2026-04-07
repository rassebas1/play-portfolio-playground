/**
 * Floating Text Component
 * 
 * Renders a floating text entry (e.g. "+10💰) that animates upward and fades out.
 * Animation is handled entirely by CSS @keyframes — no JS animation library needed.
 */

import React from 'react';
import { FloatingText } from '../types';
import { GRID_CONFIG } from '../constants';

interface FloatingTextComponentProps {
  text: FloatingText;
  cellSize: number;
}

export const FloatingTextComponent: React.FC<FloatingTextComponentProps> = ({ text, cellSize }) => {
  const left = (text.x / GRID_CONFIG.cols) * 100;
  const top = (text.y / GRID_CONFIG.rows) * 100;

  return (
    <div
      className="absolute pointer-events-none animate-float-up"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: `${cellSize * 0.4}px`,
        fontWeight: 'bold',
        color: '#fbbf24',
        textShadow: '0 0 4px rgba(0,0,0,0.8)',
      }}
    >
      {text.text}
    </div>
  );
};
