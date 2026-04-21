import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuoteSummary from './QuoteSummary';

describe('QuoteSummary', () => {
  it('displays base price £250', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={[]} siteType="multi-page" />);
    expect(screen.getAllByText((content) => content.includes('£250')).length).toBeGreaterThan(0);
  });

  it('displays selected pages', () => {
    render(<QuoteSummary selectedPageIds={['home', 'about']} selectedFeatureIds={[]} siteType="multi-page" />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Selected Pages (2)')).toBeDefined();
  });

  it('displays selected features with prices', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={['ai-chatbot']} siteType="multi-page" />);
    expect(screen.getAllByText('AI Chatbot')[0]).toBeDefined();
    const priceText = screen.getByText((content) => content.includes('£100'));
    expect(priceText).toBeDefined();
  });

  it('uses £80 for social feed integration in summary and totals', () => {
    render(<QuoteSummary selectedPageIds={['home']} selectedFeatureIds={['social']} siteType="multi-page" />);

    expect(screen.getAllByText('Social Feed Integration').length).toBeGreaterThan(0);
    expect(screen.getByText((content) => content.includes('£80'))).toBeDefined();
    expect(screen.getByText('£330')).toBeDefined(); // £250 base + £80 social feed
  });

  it('calculates extra pages correctly', () => {
    // 6 pages: 4 included + 2 extra (£100)
    render(<QuoteSummary selectedPageIds={['home', 'about', 'services', 'contact', 'gallery', 'testimonials']} selectedFeatureIds={[]} siteType="multi-page" />);
    expect(screen.getByText('Extra pages (2 × £50)')).toBeDefined();
    expect(screen.getByText('£100')).toBeDefined(); // Extra pages cost
  });

  it('displays total estimate', () => {
    render(<QuoteSummary selectedPageIds={['home']} selectedFeatureIds={['ai-chatbot']} siteType="multi-page" />);
    expect(screen.getByText('Total Estimate')).toBeDefined();
    expect(screen.getByText('£350')).toBeDefined(); // £250 base + £100 chatbot
  });

  it('shows trust signals', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={[]} siteType="multi-page" />);
    expect(screen.getByText('No commitment')).toBeDefined();
    expect(screen.getByText('Estimate only')).toBeDefined();
    expect(screen.getByText('Response within 24h')).toBeDefined();
  });
});
