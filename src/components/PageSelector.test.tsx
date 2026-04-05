import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PageSelector from './PageSelector';

describe('PageSelector', () => {
  const mockOnChange = vi.fn();
  const mockOnSiteTypeChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSiteTypeChange.mockClear();
  });

  it('renders all page options', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Services')).toBeDefined();
  });

  it('shows selected count in multi-page mode', () => {
    render(<PageSelector selected={['home', 'about']} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('2 selected')).toBeDefined();
  });

  it('shows section count in one-page mode', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="one-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('1 section selected')).toBeDefined();
  });

  it('shows plural sections count in one-page mode with multiple selections', () => {
    render(<PageSelector selected={['home', 'about', 'services']} onChange={mockOnChange} siteType="one-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('3 sections selected')).toBeDefined();
  });

  it('calls onChange when a page is selected', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home']);
  });

  it('calls onChange when a page is deselected', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('toggles pages correctly', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const aboutButton = screen.getByText('About').closest('button');
    fireEvent.click(aboutButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home', 'about']);
  });

  it('calls onSiteTypeChange when site type is toggled', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const onePageButton = screen.getByText('One page');
    fireEvent.click(onePageButton);
    expect(mockOnSiteTypeChange).toHaveBeenCalledWith('one-page');
  });

  it('in one-page mode, clicking an already-selected section deselects it', () => {
    render(<PageSelector selected={['home', 'about']} onChange={mockOnChange} siteType="one-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['about']);
  });

  it('in one-page mode, multiple sections can be selected', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="one-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const aboutButton = screen.getByText('About').closest('button');
    fireEvent.click(aboutButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home', 'about']);
  });
});
