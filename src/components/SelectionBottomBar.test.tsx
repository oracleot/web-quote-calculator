import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectionBottomBar from './SelectionBottomBar';

const defaultProps = {
  selectedPages: [
    { id: 'home', label: 'Home', price: 0, type: 'page' as const },
    { id: 'about', label: 'About', price: 0, type: 'page' as const },
  ],
  selectedFeatures: [
    { id: 'analytics', label: 'Analytics', price: 50, type: 'feature' as const },
  ],
  livePrice: 0,
  featureTotal: 50,
  onContinue: vi.fn(),
  canContinue: true,
};

describe('SelectionBottomBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the bottom bar with price info', () => {
    render(<SelectionBottomBar {...defaultProps} />);
    expect(screen.getByText('£50')).toBeDefined();
    expect(screen.getByText('2 pages, 1 feature')).toBeDefined();
  });

  it('Continue button is disabled when canContinue is false', () => {
    render(<SelectionBottomBar {...defaultProps} canContinue={false} />);
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).toBeDisabled();
  });

  it('Continue button is enabled when canContinue is true', () => {
    render(<SelectionBottomBar {...defaultProps} canContinue={true} />);
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).not.toBeDisabled();
  });

  it('Continue button is disabled when no pages are selected', () => {
    render(
      <SelectionBottomBar
        {...defaultProps}
        selectedPages={[]}
        selectedFeatures={[]}
        livePrice={0}
        featureTotal={0}
        canContinue={false}
      />
    );
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).toBeDisabled();
  });

  it('Continue button calls onContinue when clicked', () => {
    const onContinue = vi.fn();
    render(<SelectionBottomBar {...defaultProps} onContinue={onContinue} />);
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueBtn);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('opens the sheet when the bar is tapped', async () => {
    render(<SelectionBottomBar {...defaultProps} />);
    const viewBtn = screen.getByRole('button', { name: /view selection details/i });
    fireEvent.click(viewBtn);
    await waitFor(() => {
      expect(screen.getByText('Your Selection')).toBeDefined();
    });
  });

  it('closes the sheet via close button', async () => {
    render(<SelectionBottomBar {...defaultProps} />);
    const viewBtn = screen.getByRole('button', { name: /view selection details/i });
    fireEvent.click(viewBtn);
    await waitFor(() => {
      expect(screen.getByText('Your Selection')).toBeDefined();
    });
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByText('Your Selection')).toBeNull();
    });
  });

  it('closes the sheet via backdrop click', async () => {
    render(<SelectionBottomBar {...defaultProps} />);
    const viewBtn = screen.getByRole('button', { name: /view selection details/i });
    fireEvent.click(viewBtn);
    await waitFor(() => {
      expect(screen.getByText('Your Selection')).toBeDefined();
    });
    // Backdrop is the fixed div with z-40
    const backdrop = document.querySelector('.fixed.z-40');
    if (backdrop) fireEvent.click(backdrop);
    await waitFor(() => {
      expect(screen.queryByText('Your Selection')).toBeNull();
    });
  });
});
