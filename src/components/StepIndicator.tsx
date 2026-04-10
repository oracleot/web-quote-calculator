'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const DEFAULT_LABELS = ['Pages', 'Features', 'Review', 'Submit'];

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const STEP_LABELS = labels ?? DEFAULT_LABELS;

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(30,33,48,0.8)] backdrop-blur-sm">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={i} className="flex items-center">
              <div className="step-pill">
                <div className={`step-dot ${isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}`}
                     style={isActive ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}}>
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>
                <span className={`step-label hidden sm:inline ${isActive ? 'active font-semibold' : isCompleted ? 'active' : 'inactive'}`}>
                  {STEP_LABELS[i]}
                </span>
              </div>

              {i < totalSteps - 1 && (
                <div className={`step-connector mx-2 ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
