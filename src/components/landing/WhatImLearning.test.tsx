import { render, screen } from '@testing-library/react';
import { WhatImLearning } from './WhatImLearning';
import { describe, it, expect } from 'vitest';

describe('WhatImLearning', () => {
  it('renders the main title', () => {
    render(<WhatImLearning />);
    
    expect(screen.getByText("What I'm Learning")).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<WhatImLearning />);
    
    const description = "Currently enhancing capabilities through a Master's in Big Data, focusing on cloud architecture, data processing, and machine learning applications.";
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders the list of topics', () => {
    render(<WhatImLearning />);
    
    expect(screen.getByText('Cloud Architecture (AWS, Azure)')).toBeInTheDocument();
    expect(screen.getByText('Data Pipelines (Spark, Kafka)')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning (Pytorch, TensorFlow, Keras)')).toBeInTheDocument();
  });
});
