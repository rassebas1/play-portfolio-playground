import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverModal } from './GameOverModal';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('GameOverModal', () => {
  const restartGame = vi.fn();
  const continueGame = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isGameOver is false', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={false}
          isWon={false}
          score={100}
          bestScore={200}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
  });

  it('renders "Game Over" message when isGameOver is true and isWon is false', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={false}
          score={100}
          bestScore={200}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('💔 Game Over')).toBeInTheDocument();
  });

  it('renders "You Win!" message when isGameOver is true and isWon is true', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={true}
          score={300}
          bestScore={300}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('🎉 You Win!')).toBeInTheDocument();
  });

  it('displays the final score', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={false}
          score={150}
          bestScore={200}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('displays "New Best!" badge when score equals bestScore', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={true}
          score={300}
          bestScore={300}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('New Best! 🏆')).toBeInTheDocument();
  });

  it('does not display "New Best!" badge when score is less than bestScore', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={false}
          score={100}
          bestScore={200}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText('New Best! 🏆')).not.toBeInTheDocument();
  });

  it('calls restartGame when "Play Again" button is clicked', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={false}
          score={100}
          bestScore={200}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Play Again'));
    expect(restartGame).toHaveBeenCalledTimes(1);
  });

  it('calls navigate when "Home" button is clicked', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={false}
          score={100}
          bestScore={200}
          restartGame={restartGame}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/games');
  });

  it('renders "Continue" button when canContinue and isWon are true', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={true}
          score={300}
          bestScore={300}
          restartGame={restartGame}
          canContinue={true}
          continueGame={continueGame}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('does not render "Continue" button when canContinue is false', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={true}
          score={300}
          bestScore={300}
          restartGame={restartGame}
          canContinue={false}
          continueGame={continueGame}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
  });

  it('calls continueGame when "Continue" button is clicked', () => {
    render(
      <MemoryRouter>
        <GameOverModal
          isGameOver={true}
          isWon={true}
          score={300}
          bestScore={300}
          restartGame={restartGame}
          canContinue={true}
          continueGame={continueGame}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Continue'));
    expect(continueGame).toHaveBeenCalledTimes(1);
  });
});
