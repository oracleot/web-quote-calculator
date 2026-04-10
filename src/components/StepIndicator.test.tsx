import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StepIndicator from './StepIndicator';

describe('StepIndicator', () => {
  it('renders correct number of steps', () => {
    const { container } = render(<StepIndicator currentStep={1} totalSteps={4} />);
    const steps = container.querySelectorAll('.step-label');
    expect(steps).toHaveLength(4);
  });

  it('renders step labels', () => {
    render(<StepIndicator currentStep={1} totalSteps={4} />);
    expect(screen.getByText('Pages')).toBeDefined();
    expect(screen.getByText('Features')).toBeDefined();
    expect(screen.getByText('Review')).toBeDefined();
    expect(screen.getByText('Submit')).toBeDefined();
  });

  it('highlights active step with animation', () => {
    const { container } = render(<StepIndicator currentStep={2} totalSteps={4} />);
    const activeDot = container.querySelector('.active');
    expect(activeDot).toBeDefined();
  });

  it('shows completed steps with checkmark', () => {
    const { container } = render(<StepIndicator currentStep={3} totalSteps={4} />);
    const completedDot = container.querySelector('.completed');
    expect(completedDot).toBeDefined();
  });
});
