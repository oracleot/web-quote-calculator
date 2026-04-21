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
    expect(screen.getByText('Social Feed Integration')).toBeDefined();
    expect(screen.getByText('Email Management Dashboard')).toBeDefined();
  });

  it('shows selected count', () => {
    render(<FeatureSelector selected={['ai-chatbot']} onChange={mockOnChange} />);
    expect(screen.getByText('1 selected')).toBeDefined();
  });

  it('calls onChange when a feature is selected', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);
    const chatbotButton = screen.getByRole('button', { name: /AI Chatbot/i });
    fireEvent.click(chatbotButton);
    expect(mockOnChange).toHaveBeenCalledWith(['ai-chatbot']);
  });

  it('calls onChange when a feature is deselected', () => {
    render(<FeatureSelector selected={['ai-chatbot']} onChange={mockOnChange} />);
    const chatbotButton = screen.getByRole('button', { name: /AI Chatbot/i });
    fireEvent.click(chatbotButton);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('displays feature prices including social feed and email dashboard', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);
    expect(screen.getByText('+£100')).toBeDefined(); // AI Chatbot price
    expect(screen.getAllByText('+£80').length).toBeGreaterThan(0); // Social Feed Integration price
    expect(screen.getByText('+£150')).toBeDefined(); // Email Management Dashboard price
  });

  it('expands email feature details when requested', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);

    const detailsToggle = screen.getByRole('button', { name: /what’s included\?/i });
    fireEvent.click(detailsToggle);

    expect(screen.getByText(/Centralized inbox and outbox/i)).toBeDefined();
    expect(screen.getByText(/Compose and send emails directly/i)).toBeDefined();
    expect(screen.getByText(/Search and filters across inbound and outbound messages/i)).toBeDefined();
  });

  it('calls onChange with social feature and reflects +£80 pricing in the card', () => {
    render(<FeatureSelector selected={[]} onChange={mockOnChange} />);

    const socialFeatureButton = screen.getByRole('button', { name: /Social Feed Integration/i });
    fireEvent.click(socialFeatureButton);

    expect(mockOnChange).toHaveBeenCalledWith(['social']);
    expect(screen.getAllByText('+£80').length).toBeGreaterThan(0);
  });
});
