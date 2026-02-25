import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from './GameControls';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      if (key === 'moves' && options?.count !== undefined) {
        return `Moves: ${options.count}`;
      }
      if (key === 'score' && options?.count !== undefined) {
        return `Score: ${options.count}`;
      }
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

describe('GameControls', () => {
  it('renders the New Game button', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} />);
    const newGameButton = screen.getByText('new_game');
    expect(newGameButton).toBeInTheDocument();
  });

  it('calls restartGame when New Game button is clicked', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} />);
    const newGameButton = screen.getByText('new_game');
    fireEvent.click(newGameButton);
    expect(restartGame).toHaveBeenCalledTimes(1);
  });

  it('renders the Undo button when undoMove is provided', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} />);
    const undoButton = screen.getByText('undo');
    expect(undoButton).toBeInTheDocument();
  });

  it('disables the Undo button when canUndo is false', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} canUndo={false} />);
    const undoButton = screen.getByText('undo');
    expect(undoButton).toBeDisabled();
  });

  it('enables the Undo button when canUndo is true', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} canUndo={true} />);
    const undoButton = screen.getByText('undo');
    expect(undoButton).not.toBeDisabled();
  });

  it('calls undoMove when Undo button is clicked', () => {
    const restartGame = vi.fn();
    const undoMove = vi.fn();
    render(<GameControls restartGame={restartGame} undoMove={undoMove} canUndo={true} />);
    const undoButton = screen.getByText('undo');
    fireEvent.click(undoButton);
    expect(undoMove).toHaveBeenCalledTimes(1);
  });

  it('renders the move count when provided', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} moveCount={10} />);
    const moveCount = screen.getByText(/\d+/);
    expect(moveCount).toBeInTheDocument();
  });

  it('renders the score when provided', () => {
    const restartGame = vi.fn();
    render(<GameControls restartGame={restartGame} score={100} />);
    const score = screen.getByText(/\d+/);
    expect(score).toBeInTheDocument();
  });
});
