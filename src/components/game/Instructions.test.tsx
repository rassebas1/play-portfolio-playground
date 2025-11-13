import { render, screen } from '@testing-library/react';
import { Instructions } from './Instructions';
import { describe, it, expect } from 'vitest';

describe('Instructions', () => {
  it('renders its children', () => {
    const instructionText = 'Use the arrow keys to move the tiles.';
    render(
      <Instructions>
        <p>{instructionText}</p>
      </Instructions>
    );
    
    const instructionElement = screen.getByText(instructionText);
    expect(instructionElement).toBeInTheDocument();
    expect(instructionElement.tagName).toBe('P');
  });

  it('renders multiple children', () => {
    const instructionText1 = 'First instruction.';
    const instructionText2 = 'Second instruction.';
    render(
      <Instructions>
        <p>{instructionText1}</p>
        <p>{instructionText2}</p>
      </Instructions>
    );
    
    const instructionElement1 = screen.getByText(instructionText1);
    const instructionElement2 = screen.getByText(instructionText2);
    
    expect(instructionElement1).toBeInTheDocument();
    expect(instructionElement2).toBeInTheDocument();
  });
});
