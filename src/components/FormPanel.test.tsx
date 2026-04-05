import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPanel from './FormPanel';

const defaultProps = {
  open: false,
  onClose: vi.fn(),
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  couponCode: '',
  couponStatus: 'idle' as const,
  couponDiscount: null,
  onNameChange: vi.fn(),
  onEmailChange: vi.fn(),
  onCouponChange: vi.fn(),
  onCouponValidate: vi.fn(),
  onSubmit: vi.fn().mockResolvedValue(undefined),
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

describe('FormPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does NOT render when open=false', () => {
    render(<FormPanel {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders when open=true', () => {
    render(<FormPanel {...defaultProps} open={true} />);
    // Use getAllByText and check there's at least one — there are two "Submit Inquiry" (heading + button)
    expect(screen.getAllByText('Submit Inquiry').length).toBeGreaterThanOrEqual(1);
  });

  it('has role=dialog when open', () => {
    render(<FormPanel {...defaultProps} open={true} />);
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('renders InquiryForm inside when open', () => {
    render(<FormPanel {...defaultProps} open={true} />);
    expect(screen.getByRole('button', { name: /submit inquiry/i })).toBeDefined();
  });

  it('closes on backdrop click', async () => {
    const onClose = vi.fn();
    render(<FormPanel {...defaultProps} open={true} onClose={onClose} />);
    const backdrop = document.querySelector('.fixed.z-40');
    if (backdrop) fireEvent.click(backdrop);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('closes on close button click', async () => {
    const onClose = vi.fn();
    render(<FormPanel {...defaultProps} open={true} onClose={onClose} />);
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(<FormPanel {...defaultProps} open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
