'use client';

import { motion } from 'framer-motion';

interface QuoteProgressStep {
  step: number;
  label: string;
}

interface QuoteProgressProps {
  currentStep: number;
  history: number[];
  onGoToStep: (step: number) => void;
  steps: QuoteProgressStep[];
}

export default function QuoteProgress({ currentStep, history, onGoToStep, steps }: QuoteProgressProps) {
  const visitedSet = new Set([0, currentStep, ...history]);

  return (
    <div className="w-full">
      {/* Step dots + labels */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
        {steps.map(({ step, label }, index) => {
          const isActive = step === currentStep;
          const isVisited = visitedSet.has(step);

          return (
            <div key={step} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Step dot */}
              <button
                onClick={() => isVisited && onGoToStep(step)}
                disabled={!isVisited}
                className={`
                  flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold
                  transition-all duration-200 relative
                  ${isActive
                    ? 'bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                    : isVisited
                      ? 'bg-[var(--bg-card)] border border-[rgba(34,211,238,0.3)] text-[var(--accent)] cursor-pointer hover:bg-[var(--bg-card-hover)]'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed'
                  }
                `}
                title={label}
                aria-label={isActive ? `Step ${index + 1}: ${label} (current)` : isVisited ? `Step ${index + 1}: ${label} (click to edit)` : `Step ${index + 1}: ${label} (not reached)`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute inset-0 rounded-full bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                ) : isVisited ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`w-4 sm:w-6 h-px flex-shrink-0 ${isVisited ? 'bg-[rgba(34,211,238,0.3)]' : 'bg-[var(--border)]'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center gap-1 sm:gap-2 mt-2 overflow-x-auto">
        {steps.map(({ step, label }) => {
          const isActive = step === currentStep;
          const isVisited = visitedSet.has(step);
          return (
            <span
              key={step}
              className={`
                text-xs whitespace-nowrap flex-shrink-0 transition-colors duration-200
                ${isActive ? 'text-[var(--accent)] font-semibold' : isVisited ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}
              `}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
