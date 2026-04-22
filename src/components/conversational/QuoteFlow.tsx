'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildQuotePricing } from '@/lib/quote-billing';
import type { QuoteFlowState, BusinessType } from './recommendations';
import { TOTAL_FLOW_STEPS, getInitialState } from './recommendations';
import QuoteStep from './QuoteStep';
import QuoteProgress from './QuoteProgress';

const STORAGE_KEY = 'quote_flow_state_v1';

function loadState(): QuoteFlowState {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.currentStep === 'number' && Array.isArray(parsed.history)) {
        return { ...getInitialState(), ...parsed };
      }
    }
  } catch {
    // ignore parse errors
  }
  return getInitialState();
}

function saveState(state: QuoteFlowState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface QuoteFlowProps {
  onProceedToForm: (state: QuoteFlowState) => void;
}

export default function QuoteFlow({ onProceedToForm }: QuoteFlowProps) {
  const [state, setState] = useState<QuoteFlowState>(loadState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced save on every state change
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(state), 300);
  }, [state]);

  const update = useCallback((partial: Partial<QuoteFlowState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      const currentStep = prev.currentStep;
      let nextStep = currentStep + 1;
      if (!prev.isMigration && nextStep === 4) {
        nextStep = 5;
      }
      nextStep = Math.min(nextStep, TOTAL_FLOW_STEPS);
      const nextHistory = prev.history.includes(currentStep)
        ? prev.history
        : [...prev.history, currentStep];
      return { ...prev, currentStep: nextStep, history: nextHistory };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) return prev;
      let prevStep = prev.currentStep - 1;
      // Skip irrelevant steps when going back
      if (!prev.isMigration && prevStep === 4) {
        prevStep = 3; // Skip Revamp step back to Features
      }
      return { ...prev, currentStep: prevStep };
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    const safeStep = Math.max(0, Math.min(step, TOTAL_FLOW_STEPS));
    setState((prev) => ({
      ...prev,
      currentStep: safeStep,
      history: prev.history.includes(safeStep) ? prev.history : [...prev.history, safeStep],
    }));
  }, []);

  // Compute the live price for the counter
  const liveQuote = useMemo(() => {
    if (!state.businessType) {
      return { total: 0, hasBusinessType: false };
    }

    const quote = buildQuotePricing(state);
    return {
      total: quote.total,
      hasBusinessType: true,
    };
  }, [state]);

  const canGoNext =
    state.currentStep < TOTAL_FLOW_STEPS
    && (state.currentStep !== 0 || Boolean(state.businessType));
  const isLastStep = state.currentStep === TOTAL_FLOW_STEPS;

  const stepLabels = ['Business Type', 'Migration?', 'Pages', 'Revamp?', 'Features', 'Summary'];

  const handleBusinessTypeSelect = useCallback((type: BusinessType) => {
    setState((prev) => ({
      ...prev,
      businessType: type,
      history: prev.history.includes(0) ? prev.history : [...prev.history, 0],
    }));
  }, []);

  const handleProceedToForm = useCallback((finalState: QuoteFlowState) => {
    clearState();
    onProceedToForm(finalState);
  }, [onProceedToForm]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Live price counter + progress */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border)] px-4 py-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-[var(--text-muted)]">Quote:</span>
            <motion.span
              key={liveQuote.total}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold font-mono text-[var(--text-primary)]"
            >
              {liveQuote.hasBusinessType ? `£${liveQuote.total}` : '£—'}
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

        {/* Mobile progress */}
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
              onUpdate={update}
              onNext={goNext}
              onGoToStep={goToStep}
              onBusinessTypeSelect={handleBusinessTypeSelect}
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
              onClick={() => handleProceedToForm(state)}
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
