import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PageSelector from './PageSelector';

describe('PageSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all page options', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Services')).toBeDefined();
  });

  it('shows selected count', () => {
    render(<PageSelector selected={['home', 'about']} onChange={mockOnChange} />);
    expect(screen.getByText('2 selected')).toBeDefined();
  });

  it('does not show one-page / multi-page toggle options', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} />);
    expect(screen.queryByText('One page')).toBeNull();
    expect(screen.queryByText('Multi-page')).toBeNull();
  });

  it('calls onChange when a page is selected', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home']);
  });

  it('calls onChange when a page is deselected', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('toggles pages correctly', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} />);
    const aboutButton = screen.getByText('About').closest('button');
    fireEvent.click(aboutButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home', 'about']);
  });
});
