'use client';



interface MaintenancePlanSelectorProps {
  selectedPlan: 'none' | 'basic' | 'standard';
  onSelectPlan: (plan: 'none' | 'basic' | 'standard') => void;
  isMigration: boolean;
  onContinue: () => void;
  onBack?: () => void;
}

const PLANS = [
  {
    id: 'none' as const,
    name: "No thanks",
    sub: "I'll handle hosting and updates myself",
    price: null,
    features: [] as string[],
    badge: null,
  },
  {
    id: 'basic' as const,
    name: 'Basic',
    sub: 'Essential support',
    price: 25,
    features: [
      'Hosting included',
      '2 bi-weekly health checks with reports',
      '£10/hr for extra work',
    ],
    badge: null,
  },
  {
    id: 'standard' as const,
    name: 'Standard',
    sub: 'Full support',
    price: 40,
    features: [
      'Hosting included',
      'AI assistant on WhatsApp for anytime updates',
      '£7/hr for complex features',
    ],
    badge: '3 months free',
  },
] as const;

export default function MaintenancePlanSelector({
  selectedPlan,
  onSelectPlan,
  isMigration,
  onContinue,
  onBack,
}: MaintenancePlanSelectorProps) {
  return (
    <div className="card p-6 sm:p-8 animate-scale-in">
        {/* Plan cards */}
        <div className="space-y-3 mb-6">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const showBadge = plan.badge && plan.id === 'standard' && !isMigration;

            return (
              <button
                key={plan.id}
                onClick={() => onSelectPlan(plan.id)}
                className={`select-card w-full text-left p-4 transition-all duration-150 ${isSelected ? 'selected' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Radio indicator */}
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]'
                      : 'border-[var(--text-muted)]'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{plan.name}</span>
                      {plan.price !== null ? (
                        <span className="text-xs text-[var(--text-muted)]">
                          £<span className="font-semibold text-[var(--text-primary)] font-mono">{plan.price}</span>/mo
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">Free</span>
                      )}
                      {showBadge && (
                        <span className="text-[10px] font-bold text-[var(--success)] bg-[var(--success-bg)] border border-[rgba(52,211,153,0.3)] rounded-full px-2 py-0.5">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{plan.sub}</p>
                    {plan.features.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                            <span className="text-[var(--accent)] flex-shrink-0 mt-0.5">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2 pt-6 border-t border-[var(--border)]">
          {onBack ? (
            <button onClick={onBack} className="btn-secondary">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </span>
            </button>
          ) : (
            <div />
          )}
          <button onClick={onContinue} className="btn-primary px-6 py-2.5">
            <span className="flex items-center justify-center gap-2">
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
    </div>
  );
}
