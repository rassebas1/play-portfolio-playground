import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BirdSVG from './BirdSVG';

describe('BirdSVG', () => {
  it('renders an SVG element with correct size', () => {
    const { container } = render(<BirdSVG isFlapping={false} isGameOver={false} size={50} />);
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
    expect(container.firstChild).toHaveStyle({ width: '50px', height: '50px' });
  });

  it('applies animate-flap class when flapping and not game over', () => {
    const { container } = render(<BirdSVG isFlapping={true} isGameOver={false} size={50} />);
    const flapSvgs = container.querySelectorAll('.animate-flap');
    expect(flapSvgs.length).toBeGreaterThan(0);
    const nonFlapSvgs = container.querySelectorAll('svg:not(.animate-flap)');
    expect(nonFlapSvgs.length).toBeGreaterThan(0);
  });

  it('does not apply animate-flap when game is over', () => {
    const { container } = render(<BirdSVG isFlapping={true} isGameOver={true} size={50} />);
    expect(container.querySelector('.animate-flap')).toBeNull();
  });

  it('applies animate-bounce class when not game over', () => {
    const { container } = render(<BirdSVG isFlapping={false} isGameOver={false} size={50} />);
    expect(container.firstChild).toHaveClass('animate-bounce');
  });

  it('does not apply animate-bounce when game is over', () => {
    const { container } = render(<BirdSVG isFlapping={false} isGameOver={true} size={50} />);
    expect(container.firstChild).not.toHaveClass('animate-bounce');
  });
});
