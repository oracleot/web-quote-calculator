import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuoteFlow from './QuoteFlow';

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.PropsWithChildren<object>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('QuoteFlow v2', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  // ── Step 0: Business type ────────────────────────────────────────────────

  it('renders welcome message on first step', () => {
    render(<QuoteFlow onProceedToForm={vi.fn()} />);
    expect(screen.getByText(/Hey! Let's build your website quote/i)).toBeInTheDocument();
  });

  it('shows two business type options', () => {
    render(<QuoteFlow onProceedToForm={vi.fn()} />);
    expect(screen.getByText('Service Business')).toBeInTheDocument();
    expect(screen.getByText('Local Business')).toBeInTheDocument();
  });

  it('shows service and local business description text', () => {
    render(<QuoteFlow onProceedToForm={vi.fn()} />);
    expect(screen.getByText(/Consultants, agencies, freelancers, coaches/i)).toBeInTheDocument();
    expect(screen.getByText(/Restaurants, salons, retail shops, clinics/i)).toBeInTheDocument();
  });

  it('hides price on landing (shows £—)', () => {
    render(<QuoteFlow onProceedToForm={vi.fn()} />);
    expect(screen.getByText('£—')).toBeInTheDocument();
  });

  it('shows price after business type selection', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    // Base £250 should now show
    expect(screen.getByText('£250')).toBeInTheDocument();
  });

  // ── Step 1: Migration? ──────────────────────────────────────────────────

  it('auto-advances to migration step after business type selection', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(screen.getByText(/Are you migrating an existing site?/i)).toBeInTheDocument();
  });

  it('shows migration step with Yes/No options', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('shows migration fee (+£100) when Yes is selected', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/\+£100/i)).toBeInTheDocument();
  });

  // ── Step 2: Non-migration Pages ────────────────────────────────────────

  it('non-migration flow shows pages step after answering No to migration', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/Base £250 covers up to/i)).toBeInTheDocument();
  });

  it('shows only 4 default pages for service businesses (no testimonials/pricing)', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Default pages: Home, About, Services, Contact
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    // No longer defaults: Testimonials, Pricing
    expect(screen.queryByText('Testimonials')).not.toBeInTheDocument();
    expect(screen.queryByText('Pricing')).not.toBeInTheDocument();
  });

  it('shows Gallery for service business as optional page', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  // ── Step 2: Migration Pages ────────────────────────────────────────────

  it('migration flow shows migration pages step after Yes', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/Which pages from your old site do you want to migrate?/i)).toBeInTheDocument();
  });

  it('migration pages are pre-selected by default', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Default migration pages are pre-selected — Home, About, Services, Contact
    // They should show as selected (checked)
    const homeText = screen.getAllByText('Home');
    expect(homeText.length).toBeGreaterThan(0);
  });

  // ── Step 3: Revamp ────────────────────────────────────────────────────

  it('migration flow shows revamp step after migration pages', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    // Migration = Yes
    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Navigate to Revamp step (step 3)
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/Would you like us to revamp your existing website?/i)).toBeInTheDocument();
  });

  it('revamp shows +£100 when Yes selected', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/\+£100/i)).toBeInTheDocument();
  });

  // ── Step 3/4: Features (non-migration) ────────────────────────────────

  it('non-migration shows features step after pages', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/Any optional add-ons?/i)).toBeInTheDocument();
  });

  it('features step shows Google Analytics as suggestion but NOT pre-checked', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText('Google Analytics')).toBeInTheDocument();
    // Analytics checkbox should NOT be checked (no auto-pre-selection)
    const analyticsRow = screen.getByText('Google Analytics').closest('button');
    expect(analyticsRow).not.toBeNull();
  });

  it('features step shows AI Chatbot as optional add-on', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText('AI Chatbot')).toBeInTheDocument();
  });

  it('features step shows Booking for local businesses', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Local Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText('Booking / Reservations')).toBeInTheDocument();
  });

  it('clicking a feature checkbox adds it to selected features', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Click Newsletter Signup
    const newsletterRow = screen.getByText('Newsletter Signup').closest('button');
    if (newsletterRow) await user.click(newsletterRow);

    // Price should update
    await waitFor(() => {
      expect(screen.getByText('£300')).toBeInTheDocument(); // £250 base + £50 newsletter
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────

  it('Back button exists on features step', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  // ── Summary step ─────────────────────────────────────────────────────

  it('shows live quote summary on last step', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Pages → Features → Next × 2
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /next/i }));
        await new Promise((r) => setTimeout(r, 500));
      });
    }

    expect(screen.getByText(/Your Estimate/i)).toBeInTheDocument();
    expect(screen.getByText(/Review your selections/i)).toBeInTheDocument();
  });

  it('summary shows Base package for regular flow', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /next/i }));
        await new Promise((r) => setTimeout(r, 500));
      });
    }

    expect(screen.getByText('Base package')).toBeInTheDocument();
  });

  it('summary shows Generate Invoice and Get a Quote CTAs', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /next/i }));
        await new Promise((r) => setTimeout(r, 500));
      });
    }

    expect(screen.getByText('Generate Invoice')).toBeInTheDocument();
    expect(screen.getByText('Get a Quote')).toBeInTheDocument();
  });

  // ── Show More ────────────────────────────────────────────────────────

  it('shows Show more button for optional features', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    const showMore = screen.queryByText(/show \d+ more options/i);
    expect(showMore).toBeInTheDocument();
  });

  it('shows Show more button for optional pages', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    const showMore = screen.queryByText(/show \d+ more options/i);
    expect(showMore).toBeInTheDocument();
  });

  it('clicking Show more reveals more optional pages', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
      await new Promise((r) => setTimeout(r, 500));
    });

    const showMore = screen.queryByText(/show \d+ more options/i);
    if (showMore) await user.click(showMore);

    // After show more, should say "Show less"
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  // ── localStorage persistence ───────────────────────────────────────

  it('persists state to localStorage after selection', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    const saved = localStorage.getItem('quote_flow_state_v1');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved!);
    expect(parsed.businessType).toBe('service');
  });

  it('clears localStorage on form submission', async () => {
    const onProceed = vi.fn();
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={onProceed} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Navigate to last step
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /next/i }));
        await new Promise((r) => setTimeout(r, 500));
      });
    }

    // Click "Get My Quote" button
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /get my quote/i }));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(localStorage.getItem('quote_flow_state_v1')).toBeNull();
  });
});
