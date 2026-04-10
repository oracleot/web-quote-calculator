'use client';



interface MaintenancePlanSelectorProps {
  selectedPlan: 'none' | 'basic' | 'standard';
  onSelectPlan: (plan: 'none' | 'basic' | 'standard') => void;
  isMigration: boolean;
  onContinue: () => void;
  onSkip: () => void;
}

const PLANS = [
  {
    id: 'none' as const,
    name: "No thanks",
    sub: "I'll handle updates myself",
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
  onSkip,
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
                className={`select-card w-full text-left p-4 transition-all duration-200 ${isSelected ? 'selected' : ''}`}
              >
                <div className="flex items-start gap-4 relative z-10">
                  {/* Radio indicator */}
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-[#818cf8] bg-[#818cf8]'
                      : 'border-[#64748b]'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{plan.name}</span>
                      {plan.price !== null ? (
                        <span className="text-xs text-[#64748b]">
                          £<span className="font-semibold text-white">{plan.price}</span>/mo
                        </span>
                      ) : (
                        <span className="text-xs text-[#64748b]">Free</span>
                      )}
                      {showBadge && (
                        <span className="text-[10px] font-bold text-[#34d399] bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)] rounded-full px-2 py-0.5">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5">{plan.sub}</p>
                    {plan.features.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                            <span className="text-[#818cf8] flex-shrink-0 mt-0.5">✓</span>
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
        <div className="flex flex-col items-center gap-3">
          <button onClick={onContinue} className="btn-primary w-full py-3.5">
            <span className="flex items-center justify-center gap-2">
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button onClick={onSkip} className="text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors underline">
            Skip for now
          </button>
        </div>
    </div>
  );
}
