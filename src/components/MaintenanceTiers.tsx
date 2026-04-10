'use client';

interface MaintenanceTiersProps {
  isMigration: boolean;
}

const TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 25,
    features: [
      'Hosting included',
      '2 bi-weekly health checks with reports',
      '£10/hr for extra work',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 40,
    features: [
      'Hosting included',
      'AI assistant on WhatsApp for anytime updates',
      '£7/hr for complex features',
    ],
  },
] as const;

export default function MaintenanceTiers({ isMigration }: MaintenanceTiersProps) {
  return (
    <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] bg-[rgba(100,116,139,0.1)] border border-[rgba(100,116,139,0.2)] rounded-full px-2.5 py-0.5">
          Optional
        </span>
      </div>
      <h4 className="text-base font-bold text-white mb-1 mt-2">Keep your site healthy</h4>
      <p className="text-xs text-[#64748b] mb-4">Ongoing support plans — no lock-in, cancel anytime.</p>

      {/* Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TIERS.map((tier) => {
          const showFreeBadge = !isMigration && tier.id === 'standard';
          return (
            <div
              key={tier.id}
              className="relative rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(129,140,248,0.25)] hover:bg-[rgba(129,140,248,0.04)] transition-all duration-200 p-4"
            >
              {showFreeBadge && (
                <div className="absolute -top-2.5 left-4">
                  <span className="text-[10px] font-bold text-[#34d399] bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)] rounded-full px-2.5 py-0.5">
                    3 months free
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-semibold text-white">{tier.name}</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs text-[#64748b]">£</span>
                  <span className="text-xl font-extrabold text-white font-display">{tier.price}</span>
                  <span className="text-xs text-[#64748b]">/mo</span>
                </div>
              </div>

              <ul className="space-y-1.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                    <span className="text-[#818cf8] flex-shrink-0 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#64748b] mt-4 text-center">
        Not ready yet? No problem — reach out anytime.
      </p>
    </div>
  );
}
