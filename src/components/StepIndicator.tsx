'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const DEFAULT_LABELS = ['Pages', 'Features', 'Review', 'Submit'];

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const STEP_LABELS = labels ?? DEFAULT_LABELS;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="max-w-md mx-auto">
      {/* Progress bar */}
      <div className="step-progress-bar">
        <div
          className="step-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="step-labels">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <span
              key={i}
              className={`step-label ${isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}`}
            >
              {STEP_LABELS[i]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
