import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Switch } from './switch';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });
});

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Describe..." />);
    expect(screen.getByPlaceholderText('Describe...')).toBeInTheDocument();
  });
});

describe('Switch', () => {
  it('renders switch element', () => {
    render(<Switch />);
    expect(document.querySelector('[role="switch"]')).toBeInTheDocument();
  });
});

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />);
    expect(document.querySelector('[role="checkbox"]')).toBeInTheDocument();
  });
});

describe('RadioGroup', () => {
  it('renders radio items', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    );
    expect(document.querySelectorAll('[role="radio"]')).toHaveLength(2);
  });
});

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';
describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(<Select><SelectTrigger><SelectValue placeholder="Pick one" /></SelectTrigger><SelectContent><SelectItem value="a">A</SelectItem></SelectContent></Select>);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });
});
