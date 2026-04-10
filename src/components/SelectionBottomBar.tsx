'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SelectionItem } from '@/hooks/useSelectionList';

interface SelectionBottomBarProps {
  selectedPages: SelectionItem[];
  selectedFeatures: SelectionItem[];
  livePrice: number;
  featureTotal: number;
  onContinue: () => void;
  canContinue: boolean;
}

export default function SelectionBottomBar({
  selectedPages,
  selectedFeatures,
  livePrice,
  featureTotal,
  onContinue,
  canContinue,
}: SelectionBottomBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  // livePrice already includes migration fee when isMigration=true — no double-counting
  const total = livePrice + featureTotal;
  const pageCount = selectedPages.length;
  const allItems = [...selectedPages, ...selectedFeatures];
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Move focus to sheet content when opened, restore to trigger when closed
  useEffect(() => {
    if (sheetOpen) {
      const focusable = sheetRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [sheetOpen]);

  // Escape key closes the sheet
  useEffect(() => {
    if (!sheetOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sheetOpen]);

  return (
    <>
      {/* Bottom bar — mobile only */}
      <div className="builder-bottom-bar sm:hidden">
        <button
          ref={triggerRef}
          className="flex-1 flex items-center gap-2 min-w-0"
          onClick={() => setSheetOpen(true)}
          aria-label="View selection details"
        >
          <span className="text-base font-extrabold text-white font-display">£{total}</span>
          <span className="text-xs text-[var(--text-muted)]">·</span>
          <span className="text-xs text-[var(--text-secondary)] truncate">
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            {selectedFeatures.length > 0 ? `, ${selectedFeatures.length} feature${selectedFeatures.length > 1 ? 's' : ''}` : ''}
          </span>
          <svg className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="btn-primary px-5 py-2.5 text-sm flex-shrink-0"
        >
          <span className="flex items-center gap-1.5">
            Continue
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
              onClick={() => setSheetOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet-panel"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="sheet-heading"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 sm:hidden rounded-t-2xl"
              style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
              </div>

              <div className="px-5 pb-6 pt-2">
                <div className="flex items-center justify-between mb-4">
                  <p id="sheet-heading" className="text-sm font-semibold text-[var(--text-primary)]">Your Selection</p>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Selection list */}
                <div className="space-y-2 max-h-60 overflow-y-auto mb-5">
                  {allItems.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] py-2">No items selected yet</p>
                  ) : (
                    allItems.map((item) => (
                      <div
                        key={item.id}
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
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between pt-3 border-t border-[var(--border)] mb-4">
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Total
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-[var(--text-muted)]">£</span>
                    <span className="text-2xl font-extrabold text-white font-display">{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setSheetOpen(false); onContinue(); }}
                  disabled={!canContinue}
                  className="btn-primary w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
