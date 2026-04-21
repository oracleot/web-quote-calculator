'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURES, PAGES, BASE_PRICE, PAGES_INCLUDED, PRICE_PER_EXTRA_PAGE, MIGRATION_FEE, calculateQuote } from '@/lib/pricing';
import type { QuoteFlowState, BusinessType } from './recommendations';
import { RECOMMENDATIONS, isDefaultPage, isDefaultFeature } from './recommendations';
import PriceRationale from './PriceRationale';

interface QuoteStepProps {
  step: number;
  state: QuoteFlowState;
  onUpdate: (partial: Partial<QuoteFlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[var(--accent-fg)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Step 0: Business Type ───
function StepBusinessType({ state, onUpdate, onNext }: { state: QuoteFlowState; onUpdate: (partial: Partial<QuoteFlowState>) => void; onNext: () => void }) {
  const options: { type: BusinessType; label: string; description: string; icon: React.ReactNode }[] = [
    {
      type: 'service',
      label: 'Service Business',
      description: 'Consultants, agencies, freelancers, coaches',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: 'local',
      label: 'Local Business',
      description: 'Restaurants, salons, retail shops, clinics',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-muted)]">
        <span className="text-2xl">👋</span>
        <div>
          <p className="text-[var(--text-primary)] font-medium">Hey! Let's build your website quote.</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">What kind of business do you have?</p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map(({ type, label, description, icon }) => {
          const isSelected = state.businessType === type;
          return (
            <button
              key={type}
              onClick={() => {
                onUpdate({ businessType: type });
                // Auto-advance after short delay for better UX
                setTimeout(() => onNext(), 300);
              }}
              className={`
                w-full text-left p-4 rounded-xl border transition-all duration-200
                flex items-center gap-4
                ${isSelected
                  ? 'bg-[var(--accent-subtle)] border-[var(--border-active)] shadow-[0_0_0_1px_rgba(34,211,238,0.2)]'
                  : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[rgba(34,211,238,0.3)] hover:bg-[var(--bg-card-hover)]'
                }
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{label}</p>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{description}</p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0"
                >
                  <CheckIcon />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Pages ───
function StepPages({ state, onUpdate }: { state: QuoteFlowState; onUpdate: (partial: Partial<QuoteFlowState>) => void }) {
  const [showMorePages, setShowMorePages] = useState(false);
  const businessType = state.businessType;

  if (!businessType) return null;

  const recs = RECOMMENDATIONS[businessType];
  const defaultPages = recs.pages.default;
  const allOptional = recs.pages.optional;

  const togglePage = (pageId: string) => {
    if (isDefaultPage(businessType, pageId)) return; // default pages non-dismissible
    const isSelected = state.selectedPages.includes(pageId);
    onUpdate({
      selectedPages: isSelected
        ? state.selectedPages.filter((id) => id !== pageId)
        : [...state.selectedPages, pageId],
    });
  };

  const pageRows = PAGES.filter((p) => !defaultPages.includes(p.id));
  const visibleOptional = allOptional.slice(0, showMorePages ? allOptional.length : 1);
  const hiddenOptional = allOptional.slice(showMorePages ? allOptional.length : 1);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-muted)]">
        <p className="text-[var(--text-primary)] font-medium">
          Based on <span className="text-[var(--accent)]">{businessType === 'service' ? 'service' : 'local'}</span> businesses, here are typical pages:
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Default selections are pre-chosen — you can uncheck optional ones.</p>
      </div>

      {/* Default pages (non-dismissible) */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 mb-2">Included (recommended)</p>
        {defaultPages.map((pageId) => {
          const page = PAGES.find((p) => p.id === pageId);
          if (!page) return null;
          return (
            <div
              key={pageId}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] opacity-75"
            >
              <div className="w-5 h-5 rounded bg-[var(--accent-muted)] border border-[rgba(34,211,238,0.2)] flex items-center justify-center flex-shrink-0">
                <CheckIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{page.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{page.description}</p>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">included</span>
            </div>
          );
        })}
      </div>

      {/* Optional pages by group */}
      {allOptional.map(({ group, items }) => (
        <div key={group} className="space-y-1.5">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 mb-2">{group}</p>
          {items.map((pageId) => {
            const page = PAGES.find((p) => p.id === pageId);
            if (!page) return null;
            const isSelected = state.selectedPages.includes(pageId);

            return (
              <button
                key={pageId}
                onClick={() => togglePage(pageId)}
                className={`
                  w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                  ${isSelected
                    ? 'bg-[var(--accent-subtle)] border-[var(--border-active)]'
                    : 'bg-[var(--bg-card)] border-[var(--border)] hover:bg-[var(--bg-card-hover)]'
                  }
                `}
              >
                <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--text-muted)]'}`}>
                  {isSelected && <CheckIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{page.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{page.description}</p>
                </div>
                <span className="text-xs font-mono text-[var(--accent)]">+£{PRICE_PER_EXTRA_PAGE}</span>
              </button>
            );
          })}
        </div>
      ))}

      {/* Show more toggle */}
      {hiddenOptional.length > 0 && (
        <button
          onClick={() => setShowMorePages(!showMorePages)}
          className="flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors px-1"
        >
          <ChevronIcon open={showMorePages} />
          {showMorePages ? 'Show less' : `Show ${hiddenOptional.reduce((sum, g) => sum + g.items.length, 0)} more options`}
        </button>
      )}
    </div>
  );
}

// ─── Step 2: Features ───
function StepFeatures({ state, onUpdate }: { state: QuoteFlowState; onUpdate: (partial: Partial<QuoteFlowState>) => void }) {
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const businessType = state.businessType;

  if (!businessType) return null;

  const recs = RECOMMENDATIONS[businessType];
  const defaultFeatures = recs.features.default;
  const optionalFeatures = recs.features.optional;

  const toggleFeature = (featureId: string) => {
    const isSelected = state.selectedFeatures.includes(featureId);
    onUpdate({
      selectedFeatures: isSelected
        ? state.selectedFeatures.filter((id) => id !== featureId)
        : [...state.selectedFeatures, featureId],
    });
  };

  // Show first 4 optional features by default
  const visibleOptional = optionalFeatures.slice(0, showMoreFeatures ? optionalFeatures.length : 4);
  const hiddenOptional = optionalFeatures.slice(showMoreFeatures ? optionalFeatures.length : 4);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-muted)]">
        <p className="text-[var(--text-primary)] font-medium">Any optional add-ons?</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Analytics is included by default. Select any additional features you'd like.
        </p>
      </div>

      {/* Default features (analytics, pre-selected) */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 mb-2">Included (recommended)</p>
        {defaultFeatures.map((featureId) => {
          const feature = FEATURES.find((f) => f.id === featureId);
          if (!feature) return null;
          return (
            <div
              key={featureId}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] opacity-75"
            >
              <div className="w-5 h-5 rounded bg-[var(--accent-muted)] border border-[rgba(34,211,238,0.2)] flex items-center justify-center flex-shrink-0">
                <CheckIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{feature.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{feature.description}</p>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">included</span>
            </div>
          );
        })}
      </div>

      {/* Optional features */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 mb-2">Optional Add-ons</p>
        {visibleOptional.map((featureId) => {
          const feature = FEATURES.find((f) => f.id === featureId);
          if (!feature) return null;
          const isSelected = state.selectedFeatures.includes(featureId);

          return (
            <button
              key={featureId}
              onClick={() => toggleFeature(featureId)}
              className={`
                w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'bg-[var(--accent-subtle)] border-[var(--border-active)]'
                  : 'bg-[var(--bg-card)] border-[var(--border)] hover:bg-[var(--bg-card-hover)]'
                }
              `}
            >
              <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--text-muted)]'}`}>
                {isSelected && <CheckIcon />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{feature.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{feature.description}</p>
              </div>
              <span className="text-xs font-mono text-[var(--accent)]">+£{feature.price}</span>
            </button>
          );
        })}
      </div>

      {/* Show more toggle */}
      {hiddenOptional.length > 0 && (
        <button
          onClick={() => setShowMoreFeatures(!showMoreFeatures)}
          className="flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors px-1"
        >
          <ChevronIcon open={showMoreFeatures} />
          {showMoreFeatures ? 'Show less' : `Show ${hiddenOptional.length} more options`}
        </button>
      )}
    </div>
  );
}

// ─── Step 3: Migration ───
function StepMigration({ state, onUpdate }: { state: QuoteFlowState; onUpdate: (partial: Partial<QuoteFlowState>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-muted)]">
        <p className="text-[var(--text-primary)] font-medium">Are you migrating an existing site?</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Migration includes a full audit, content transfer, and redirect setup.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[false, true].map((value) => {
          const isSelected = state.isMigration === value;
          const label = value ? 'Yes' : 'No';
          return (
            <button
              key={String(value)}
              onClick={() => onUpdate({ isMigration: value })}
              className={`
                p-4 rounded-xl border transition-all duration-200 text-center
                ${isSelected
                  ? 'bg-[var(--accent-subtle)] border-[var(--border-active)]'
                  : 'bg-[var(--bg-card)] border-[var(--border)] hover:bg-[var(--bg-card-hover)]'
                }
              `}
            >
              <p className={`text-lg font-semibold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{label}</p>
              {value && <p className="text-xs text-[var(--text-muted)] mt-1">+£{MIGRATION_FEE}</p>}
            </button>
          );
        })}
      </div>

      {state.isMigration && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text-secondary)]"
        >
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Site audit, content transfer, and URL redirect mapping are included in the migration fee.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Step 4: Live Quote Summary ───
function StepSummary({ state, onGoToStep }: { state: QuoteFlowState; onGoToStep: (step: number) => void }) {
  const quote = calculateQuote(state.selectedPages, state.selectedFeatures, { isMigration: state.isMigration });
  const selectedPages = PAGES.filter((p) => state.selectedPages.includes(p.id));
  const selectedFeatures = FEATURES.filter((f) => state.selectedFeatures.includes(f.id));

  return (
    <div className="space-y-4">
      {/* Quote card */}
      <div className="quote-total p-5">
        <div className="text-center pb-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Your Estimate</p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="price-hero-currency">£</span>
            <span className="price-hero">{quote.total}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">GBP · estimates exclude VAT</p>
        </div>

        <div className="space-y-2.5 text-sm border-t border-[var(--border)] pt-4">
          {/* Base */}
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Base package</span>
            <span className="font-mono font-medium text-[var(--text-primary)]">£{quote.basePrice}</span>
          </div>

          {/* Extra pages */}
          {quote.extraPages > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Extra pages ({quote.extraPages} × £{PRICE_PER_EXTRA_PAGE})</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">£{quote.pagesCost}</span>
            </div>
          )}

          {/* Features */}
          {selectedFeatures.length > 0 && (
            <>
              {selectedFeatures.map((f) => (
                <div key={f.id} className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">{f.label}</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">£{f.price}</span>
                </div>
              ))}
            </>
          )}

          {/* Migration */}
          {state.isMigration && (
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Migration</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">£{quote.migrationFee}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <span className="font-semibold text-[var(--text-primary)]">Total</span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono">£{quote.total}</span>
          </div>
        </div>
      </div>

      {/* Editable sections */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1">Review your selections</p>

        {[
          { label: 'Business type', value: state.businessType === 'service' ? 'Service Business' : 'Local Business', step: 0 },
          { label: 'Pages', value: `${selectedPages.length} selected`, step: 1 },
          { label: 'Features', value: `${selectedFeatures.length} selected`, step: 2 },
          { label: 'Migration', value: state.isMigration ? 'Yes' : 'No', step: 3 },
        ].map(({ label, value, step }) => (
          <button
            key={label}
            onClick={() => onGoToStep(step)}
            className="w-full text-left flex items-center justify-between p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
              <span className="text-sm text-[var(--text-muted)]">·</span>
              <span className="text-sm text-[var(--accent)]">{value}</span>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-muted)]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-xs">Edit</span>
            </div>
          </button>
        ))}
      </div>

      {/* Price rationale */}
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Why this price?</p>
        <PriceRationale state={state} />
      </div>
    </div>
  );
}

// ─── Main QuoteStep component ───
export default function QuoteStep({ step, state, onUpdate, onNext, onBack }: QuoteStepProps) {
  const contentVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`step-${step}`}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {step === 0 && <StepBusinessType state={state} onUpdate={onUpdate} onNext={onNext} />}
        {step === 1 && <StepPages state={state} onUpdate={onUpdate} />}
        {step === 2 && <StepFeatures state={state} onUpdate={onUpdate} />}
        {step === 3 && <StepMigration state={state} onUpdate={onUpdate} />}
        {step === 4 && <StepSummary state={state} onGoToStep={(s) => {
          // Navigate to a step
          onUpdate({ currentStep: s, history: state.history });
        }} />}
      </motion.div>
    </AnimatePresence>
  );
}
