import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuoteFlow from './QuoteFlow';
import { QuoteFlowState } from './recommendations';

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.PropsWithChildren<object>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('QuoteFlow', () => {
  afterEach(() => {
    cleanup();
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

  // ── Pages step (step 1) ─────────────────────────────────────────────────

  it('shows Testimonials and Pricing on pages step for service businesses', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('shows Gallery and Testimonials for local businesses on pages step', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Local Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
  });

  // ── Features step (step 2) ──────────────────────────────────────────────

  it('navigates from pages to features step via Next button', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText(/Any optional add-ons/i)).toBeInTheDocument();
  });

  it('shows Google Analytics pre-selected on features step for service businesses', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText('Google Analytics')).toBeInTheDocument();
  });

  it('shows AI Chatbot on features step for service businesses', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText('AI Chatbot')).toBeInTheDocument();
  });

  it('shows Booking feature on features step for local businesses', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Local Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText('Booking / Reservations')).toBeInTheDocument();
  });

  // ── Migration step (step 3) ─────────────────────────────────────────────

  it('shows migration step with Yes/No options', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText(/Are you migrating/i)).toBeInTheDocument();
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

    for (let i = 0; i < 2; i++) {
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /next/i }));
        await new Promise((r) => setTimeout(r, 100));
      });
    }

    await act(async () => {
      await user.click(screen.getByText('Yes'));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByText(/\+£100/i)).toBeInTheDocument();
  });

  // ── Back navigation ─────────────────────────────────────────────────────

  it('Back button exists on features step', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  // ── Summary step (step 4) ───────────────────────────────────────────────

  it('shows live quote summary with price breakdown on last step', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /next/i }));
        await new Promise((r) => setTimeout(r, 100));
      });
    }

    expect(screen.getByText(/Your Estimate/i)).toBeInTheDocument();
    expect(screen.getByText(/Review your selections/i)).toBeInTheDocument();
  });

  it('price shows £375 after service business auto-advanced to pages step', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    // Service default: base £250 + analytics £25 + 6 pages (2 extra = £100) = £375
    expect(screen.getByText(/£375/i)).toBeInTheDocument();
  });

  // ── Progressive disclosure ─────────────────────────────────────────────

  it('shows Show more button for optional features', async () => {
    const user = userEvent.setup();
    render(<QuoteFlow onProceedToForm={vi.fn()} />);

    await act(async () => {
      await user.click(screen.getByText('Service Business'));
      await new Promise((r) => setTimeout(r, 400));
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await new Promise((r) => setTimeout(r, 100));
    });

    // Show more button should exist since there are more than 4 optional features
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

    const showMore = screen.queryByText(/show \d+ more options/i);
    expect(showMore).toBeInTheDocument();
  });
});
