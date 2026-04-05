import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FeatureSelector from './FeatureSelector';

describe('FeatureSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all feature options', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);
    expect(screen.getByText('AI Chatbot')).toBeDefined();
    expect(screen.getByText('Shopping Cart + Payments')).toBeDefined();
    expect(screen.getByText('Booking / Reservations')).toBeDefined();
  });

  it('shows selected count', () => {
    render(<FeatureSelector selected={['ai-chatbot']} onChange={mockOnChange} />);
    expect(screen.getByText('1 selected')).toBeDefined();
  });

  it('calls onChange when a feature is selected', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);
    const chatbotButton = screen.getByText('AI Chatbot').closest('button');
    fireEvent.click(chatbotButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['ai-chatbot']);
  });

  it('calls onChange when a feature is deselected', () => {
    render(<FeatureSelector selected={['ai-chatbot']} onChange={mockOnChange} />);
    const chatbotButton = screen.getByText('AI Chatbot').closest('button');
    fireEvent.click(chatbotButton!);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('displays feature prices', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);
    expect(screen.getByText('+£100')).toBeDefined(); // AI Chatbot price
  });
});
