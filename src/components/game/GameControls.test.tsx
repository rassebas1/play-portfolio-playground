import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from './GameControls';
import { describe, it, expect, vi } from 'vitest';

describe('GameControls', () => {
  it('renders the New Game button', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} />);
    const newGameButton = screen.getByText('New Game');
    expect(newGameButton).toBeInTheDocument();
  });

  it('calls restartGame when New Game button is clicked', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} />);
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);
    expect(restartGame).toHaveBeenCalledTimes(1);
  });

  it('renders the Undo button when undoMove is provided', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} />);
    const undoButton = screen.getByText('Undo');
    expect(undoButton).toBeInTheDocument();
  });

  it('disables the Undo button when canUndo is false', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} canUndo={false} />);
    const undoButton = screen.getByText('Undo');
    expect(undoButton).toBeDisabled();
  });

  it('enables the Undo button when canUndo is true', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} canUndo={true} />);
    const undoButton = screen.getByText('Undo');
    expect(undoButton).not.toBeDisabled();
  });

  it('calls undoMove when Undo button is clicked', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} canUndo={true} />);
    const undoButton = screen.getByText('Undo');
    fireEvent.click(undoButton);
    expect(undoMove).toHaveBeenCalledTimes(1);
  });

  it('renders the move count when provided', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} moveCount={10} />);
    const moveCount = screen.getByText('Moves: 10');
    expect(moveCount).toBeInTheDocument();
  });

  it('renders the score when provided', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} score={100} />);
    const score = screen.getByText('Score: 100');
    expect(score).toBeInTheDocument();
  });
});
