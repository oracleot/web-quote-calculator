'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { SelectionItem } from '@/hooks/useSelectionList';

interface BuilderSidebarProps {
  step: number;
  selectedPages: SelectionItem[];
  selectedFeatures: SelectionItem[];
  livePrice: number;
  featureTotal: number;
  migrationFee?: number;
  onContinue: () => void;
  canContinue: boolean;
}

export default function BuilderSidebar({
  step,
  selectedPages,
  selectedFeatures,
  livePrice,
  featureTotal,
  migrationFee = 0,
  onContinue,
  canContinue,
}: BuilderSidebarProps) {
  const allItems = [...selectedPages, ...selectedFeatures];
  const total = livePrice + featureTotal + migrationFee;

  return (
    <aside className="builder-sidebar hidden sm:flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Your Selection
        </p>
        <div className="h-px bg-[var(--border)]" />
      </div>

      {/* Selection list */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1">
        <AnimatePresence initial={false}>
          {allItems.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[var(--text-muted)] py-2 px-1"
            >
              No items selected yet
            </motion.p>
          ) : (
            allItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-[rgba(129,140,248,0.05)] border border-[rgba(129,140,248,0.1)]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[var(--accent)] text-[10px] flex-shrink-0">✓</span>
                  <span className="text-xs text-[var(--text-secondary)] truncate">{item.label}</span>
                </div>
                {item.type === 'feature' && item.price > 0 && (
                  <span className="text-xs text-[var(--accent)] font-medium flex-shrink-0">
                    £{item.price}
                  </span>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Price breakdown (step 2 shows feature subtotal) */}
      <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
        {step === 2 && featureTotal > 0 && (
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Features</span>
            <span className="text-[var(--text-secondary)]">+£{featureTotal}</span>
          </div>
        )}
        {step === 2 && (
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Pages</span>
            <span className="text-[var(--text-secondary)]">£{livePrice}</span>
          </div>
        )}
        {migrationFee > 0 && (
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Migration</span>
            <span className="text-[#818cf8]">+£{migrationFee}</span>
          </div>
        )}

        {/* Running total */}
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Total
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-[var(--text-muted)]">£</span>
            <motion.span
              key={total}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-2xl font-extrabold text-white font-display"
            >
              {total}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Continue CTA */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="btn-primary w-full mt-4"
      >
        <span className="flex items-center justify-center gap-2">
          Continue
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </aside>
  );
}
