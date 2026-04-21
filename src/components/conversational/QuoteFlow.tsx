'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateQuote } from '@/lib/pricing';
import type { QuoteFlowState, BusinessType } from './recommendations';
import { TOTAL_FLOW_STEPS, getInitialState, applyBusinessTypeDefaults } from './recommendations';
import QuoteStep from './QuoteStep';
import QuoteProgress from './QuoteProgress';

interface QuoteFlowProps {
  onProceedToForm: (state: QuoteFlowState) => void;
}

export default function QuoteFlow({ onProceedToForm }: QuoteFlowProps) {
  const [state, setState] = useState<QuoteFlowState>(getInitialState);

  const update = useCallback((partial: Partial<QuoteFlowState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      const currentStep = prev.currentStep;
      const nextStep = currentStep + 1;
      const nextHistory = prev.history.includes(currentStep)
        ? prev.history
        : [...prev.history, currentStep];
      return { ...prev, currentStep: nextStep, history: nextHistory };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) return prev;
      return { ...prev, currentStep: prev.currentStep - 1 };
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
      history: prev.history.includes(step) ? prev.history : [...prev.history, step],
    }));
  }, []);

  const handleBusinessTypeSelect = useCallback((type: BusinessType) => {
    const withDefaults = applyBusinessTypeDefaults({ ...state, businessType: type });
    update(withDefaults);
  }, [state, update]);

  const handleUpdate = useCallback((partial: Partial<QuoteFlowState>) => {
    // When business type changes, apply new defaults
    if (partial.businessType !== undefined && partial.businessType !== state.businessType) {
      const withDefaults = applyBusinessTypeDefaults({ ...state, ...partial });
      update(withDefaults);
    } else {
      update(partial);
    }
  }, [state, update]);

  const quote = useMemo(
    () => calculateQuote(state.selectedPages, state.selectedFeatures, { isMigration: state.isMigration }),
    [state.selectedPages, state.selectedFeatures, state.isMigration]
  );

  const canGoNext = state.currentStep < TOTAL_FLOW_STEPS;
  const isLastStep = state.currentStep === TOTAL_FLOW_STEPS;

  // Step label for the user-facing flow
  const stepLabels = ['Business Type', 'Pages', 'Features', 'Migration', 'Summary'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Live price counter + progress */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border)] px-4 py-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-[var(--text-muted)]">Quote:</span>
            <motion.span
              key={quote.total}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold font-mono text-[var(--text-primary)]"
            >
              £{quote.total}
            </motion.span>
          </div>

          {/* Progress dots (hidden on mobile, shown on sm+) */}
          <div className="hidden sm:block flex-1 max-w-xs">
            <QuoteProgress
              currentStep={state.currentStep}
              history={state.history}
              onGoToStep={goToStep}
            />
          </div>
        </div>

        {/* Mobile progress (horizontal scroll) */}
        <div className="sm:hidden mt-3">
          <QuoteProgress
            currentStep={state.currentStep}
            history={state.history}
            onGoToStep={goToStep}
          />
        </div>
      </div>

      {/* Conversation area */}
      <div className="px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={`flow-step-${state.currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <QuoteStep
              step={state.currentStep}
              state={state}
              onUpdate={handleUpdate}
              onNext={goNext}
              onBack={goBack}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-[var(--bg-base)] border-t border-[var(--border)] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            onClick={goBack}
            disabled={state.currentStep === 0}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
              ${state.currentStep === 0
                ? 'border-[var(--border)] text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Current step label */}
          <div className="text-center flex-1">
            <span className="text-sm text-[var(--text-muted)]">
              Step {state.currentStep + 1} of {TOTAL_FLOW_STEPS + 1}:{' '}
              <span className="text-[var(--text-secondary)]">{stepLabels[state.currentStep]}</span>
            </span>
          </div>

          {/* Next / Submit button */}
          {isLastStep ? (
            <button
              onClick={() => onProceedToForm(state)}
              className="btn-primary px-6 py-2.5 flex items-center gap-2"
            >
              Get My Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${canGoNext
                  ? 'btn-primary'
                  : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                }
              `}
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
