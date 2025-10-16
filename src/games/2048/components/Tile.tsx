import React from 'react';
import type { Tile as TileType } from '../types';
import { cn } from '@/lib/utils'; // Force re-process

interface TileProps {
  tile: TileType;

}

export const Tile: React.FC<TileProps > = ({ tile }) => {
  const tileClasses = cn(
    "absolute rounded-lg flex items-center justify-center text-2xl font-bold",
    "transition-all duration-200 ease-out", // Smooth transition for movement
    {
      "bg-gray-300 text-gray-700": tile.value === 2,
      "bg-gray-400 text-gray-800": tile.value === 4,
      "bg-yellow-300 text-gray-900": tile.value === 8,
      "bg-yellow-400 text-gray-900": tile.value === 16,
      "bg-orange-400 text-white": tile.value === 32,
      "bg-orange-500 text-white": tile.value === 64,
      "bg-red-400 text-white": tile.value === 128,
      "bg-red-500 text-white": tile.value === 256,
      "bg-purple-400 text-white": tile.value === 512,
      "bg-purple-500 text-white": tile.value === 1024,
      "bg-blue-500 text-white": tile.value === 2048,
      "scale-110 animate-pop": tile.isNew, // Animation for new tiles
      "z-10": tile.isMerged, // Ensure merged tiles are on top during animation
      "opacity-0 scale-0": tile.isRemoved, // Animate out removed tiles
    }
  );

  const style: React.CSSProperties = {
    width: 'calc(25% - 0.1875rem)',
    height: 'calc(25% - 0.1875rem)',
    left: `calc(${tile.col} * (25% + 0.0625rem))`,
    top: `calc(${tile.row} * (25% + 0.0625rem))`,
    zIndex: tile.isMerged ? 20 : 10,
  };

  if (tile.previousPosition) {
    const deltaX = tile.previousPosition.col - tile.col;
    const deltaY = tile.previousPosition.row - tile.row;
    style.transform = `translate(calc(${deltaX} * (100% + 0.25rem)), calc(${deltaY} * (100% + 0.25rem)))`;
  }
  return (
    <div
      className={cn(tileClasses)}
      style={style}
    >
      {tile.value}
    </div>
  );
};