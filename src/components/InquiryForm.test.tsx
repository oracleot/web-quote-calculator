import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InquiryForm from './InquiryForm';

describe('InquiryForm', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
  const defaultProps = {
    name: '',
    email: '',
    couponCode: '',
    couponStatus: 'idle' as const,
    couponDiscount: null,
    onNameChange: vi.fn(),
    onEmailChange: vi.fn(),
    onCouponChange: vi.fn(),
    onCouponValidate: vi.fn(),
    onSubmit: mockOnSubmit,
    isSubmitting: false,
    isSuccess: false,
    error: null,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields', () => {
    render(<InquiryForm {...defaultProps} />);
    expect(screen.getByLabelText('Your Name')).toBeDefined();
    expect(screen.getByLabelText('Email Address')).toBeDefined();
  });

  it('validates name field', () => {
    render(<InquiryForm {...defaultProps} email="test@example.com" />);
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
    expect(submitButton).toBeDisabled();
  });

  it('validates email field', () => {
    render(<InquiryForm {...defaultProps} name="Ada Lovelace" />);
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit when both fields are filled', () => {
    render(<InquiryForm {...defaultProps} name="Ada Lovelace" email="ada@example.com" />);
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onNameChange when name is typed', () => {
    const onNameChange = vi.fn();
    render(<InquiryForm {...defaultProps} onNameChange={onNameChange} />);
    const nameInput = screen.getByLabelText('Your Name');
    fireEvent.change(nameInput, { target: { value: 'Ada Lovelace' } });
    expect(onNameChange).toHaveBeenCalledWith('Ada Lovelace');
  });

  it('calls onEmailChange when email is typed', () => {
    const onEmailChange = vi.fn();
    render(<InquiryForm {...defaultProps} onEmailChange={onEmailChange} />);
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'ada@example.com' } });
    expect(onEmailChange).toHaveBeenCalledWith('ada@example.com');
  });

  it('displays error message', () => {
    render(<InquiryForm {...defaultProps} name="Ada Lovelace" email="ada@example.com" error="Failed to send inquiry" />);
    expect(screen.getByText('Failed to send inquiry')).toBeDefined();
  });

  it('shows loading state', () => {
    render(<InquiryForm {...defaultProps} name="Ada Lovelace" email="ada@example.com" isSubmitting={true} />);
    expect(screen.getByText('Sending...')).toBeDefined();
  });
});
