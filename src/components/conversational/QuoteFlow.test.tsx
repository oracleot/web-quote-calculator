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

  // Helper: render and advance through steps by directly updating state
  // This avoids relying on setTimeout-based auto-advance in tests
  function renderQuoteFlow(onProceedToForm = vi.fn()) {
    return render(<QuoteFlow onProceedToForm={onProceedToForm} />);
  }

  // ── Step 0: Business Type ────────────────────────────────────────────────

  it('renders welcome message on first step', () => {
    renderQuoteFlow();
    expect(screen.getByText(/Hey! Let's build your website quote/i)).toBeInTheDocument();
  });

  it('shows two business type options', () => {
    renderQuoteFlow();
    expect(screen.getByText('Service Business')).toBeInTheDocument();
    expect(screen.getByText('Local Business')).toBeInTheDocument();
  });

  it('shows service and local business description text', () => {
    renderQuoteFlow();
    expect(screen.getByText(/Consultants, agencies, freelancers, coaches/i)).toBeInTheDocument();
    expect(screen.getByText(/Restaurants, salons, retail shops, clinics/i)).toBeInTheDocument();
  });

  it('hides price on landing (shows £—)', () => {
    renderQuoteFlow();
    expect(screen.getByText('£—')).toBeInTheDocument();
  });

  // ── Step 1: Migration ────────────────────────────────────────────────────

  it('auto-advances to migration step after business type selection', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText(/Are you migrating an existing site?/i)).toBeInTheDocument();
  });

  it('shows migration step with Yes/No options', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('shows migration fee (+£100) when Yes is selected', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText(/\+£100/i)).toBeInTheDocument();
  });

  // ── Step 2: Non-migration Pages ────────────────────────────────────────

  it('non-migration flow shows pages step after answering No and clicking Next', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    // Select business type (auto-advances to migration)
    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Select No for migration
    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Click Next to go to Pages step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Pages step shows "Included (recommended)" header for default pages
    expect(screen.getByText(/Included.*recommended/i)).toBeInTheDocument();
  });

  it('shows 4 default pages for service businesses on regular path', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Default pages: Home, About, Services, Contact are shown as "included"
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('About').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Services').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1);
  });

  // ── Step 2: Migration Pages ────────────────────────────────────────────

  it('migration flow shows migration pages step after Yes and Next', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('Yes'));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(screen.getByText(/Which pages from your old site/i)).toBeInTheDocument();
  });

  // ── Step 3: Revamp (migration path only) ────────────────────────────────

  it('migration flow shows revamp step after migration pages and Next', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    // Business type → auto-advance to migration
    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Migration = Yes
    await act(async () => {
      await user.click(screen.getByText('Yes'));
    });

    // Next → Migration Pages
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Next → Revamp step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(screen.getByText(/Would you like us to revamp/i)).toBeInTheDocument();
  });

  // ── Step 3/4: Features ─────────────────────────────────────────────────

  it('features step shows Google Analytics as suggestion', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    // Select business type → migration step
    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // No migration
    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Next → Pages step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Next → Features step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(screen.getByText('Google Analytics')).toBeInTheDocument();
  });

  it('features step shows AI Chatbot as optional add-on', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Pages step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Features step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Need to click "Show more" to see AI Chatbot
    const showMore = screen.queryByText(/show \d+ more options/i);
    if (showMore) {
      await act(async () => {
        await user.click(showMore);
      });
    }

    expect(screen.getByText('AI Chatbot')).toBeInTheDocument();
  });

  it('clicking a feature checkbox adds it to selected features', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Pages step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Features step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Click Newsletter Signup
    const newsletterRow = screen.getByText('Newsletter Signup').closest('button');
    if (newsletterRow) await user.click(newsletterRow);

    // Price should now include +£50 for newsletter
    await waitFor(() => {
      expect(screen.getByText(/£300/)).toBeInTheDocument(); // £250 base + £50 newsletter
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────

  it('Back button exists on pages step', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Next → Pages step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  // ── Summary step ─────────────────────────────────────────────────────

  it('shows live quote summary on last step (non-migration)', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    // Business type - auto-advance to migration
    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // No migration
    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Navigate: Pages(2) -> Features(3) -> Summary(5)
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        const nextBtn = screen.getByRole('button', { name: /next/i });
        await user.click(nextBtn);
        await new Promise((r) => setTimeout(r, 400));
      });
    }

    // Should be on summary step
    expect(screen.getByText(/Your Estimate/i)).toBeInTheDocument();
  });

  it('summary shows Generate Invoice and Get a Quote CTAs', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    // Business type - auto-advance
    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // No migration
    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Navigate: Pages(2) -> Features(3) -> Summary(5)
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        const nextBtn = screen.getByRole('button', { name: /next/i });
        await user.click(nextBtn);
        await new Promise((r) => setTimeout(r, 400));
      });
    }

    // Check for CTAs on summary
    expect(screen.getByText('Generate Invoice')).toBeInTheDocument();
    expect(screen.getByText('Get a Quote')).toBeInTheDocument();
  });

  // ── Show More ────────────────────────────────────────────────────────

  it('shows Show more button for optional features', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Pages
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    // Features
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    const showMore = screen.queryByText(/show \d+ more options/i);
    expect(showMore).toBeInTheDocument();
  });

  it('shows Show more button for optional pages', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Navigate to pages step
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    const showMore = screen.queryByText(/show \d+ more/i);
    expect(showMore).toBeInTheDocument();
  });

  it('clicking Show more reveals more optional pages', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 300));
    });

    const showMore = screen.queryByText(/show \d+ more/i);
    if (showMore) {
      await act(async () => {
        await user.click(showMore);
      });
      expect(screen.getByText('Show less')).toBeInTheDocument();
    }
  });

  // ── localStorage persistence ───────────────────────────────────────

  it('persists state to localStorage after selection', async () => {
    const user = userEvent.setup();
    renderQuoteFlow();

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
    renderQuoteFlow(onProceed);

    // Select business type (auto-advances to migration)
    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 500));
    });

    // Verify state was saved
    await waitFor(() => {
      expect(localStorage.getItem('quote_flow_state_v1')).not.toBeNull();
    });

    // No migration
    await act(async () => {
      await user.click(screen.getByText('No'));
    });

    // Navigate: Pages(2) -> Features(3) -> Summary(5)
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        const nextBtn = screen.getByRole('button', { name: /next/i });
        await user.click(nextBtn);
        await new Promise((r) => setTimeout(r, 400));
      });
    }

    // On summary step - click "Get My Quote"
    const getMyQuoteBtn = screen.getByRole('button', { name: /get my quote/i });
    await act(async () => {
      await user.click(getMyQuoteBtn);
    });

    expect(localStorage.getItem('quote_flow_state_v1')).toBeNull();
  });
});