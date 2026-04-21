'use client';

import { useState } from 'react';
import { FEATURES } from '@/lib/pricing';

interface FeatureSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'ai-chatbot': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'shopping-cart': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  booking: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  cms: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  'user-accounts': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  newsletter: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  social: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
  analytics: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  multilang: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  ),
  'email-management-dashboard': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h10m-10 4h16M20 14v6m-3-3h6" />
    </svg>
  ),
};

export default function FeatureSelector({ selected, onChange }: FeatureSelectorProps) {
  const [showEmailFeatureInfo, setShowEmailFeatureInfo] = useState(false);

  const toggleFeature = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          All add-ons are optional
        </div>
        <div className="ml-auto text-xs text-[var(--accent)] bg-[var(--accent-muted)] border border-[rgba(34,211,238,0.2)] rounded-full px-2.5 py-0.5 font-medium">
          {selected.length} selected
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => {
          const isSelected = selected.includes(feature.id);
          const isEmailFeature = feature.id === 'email-management-dashboard';
          const isExpanded = isEmailFeature && showEmailFeatureInfo;

          return (
            <div key={feature.id} className={`select-card ${isSelected ? 'selected' : ''}`}>
              <button
                type="button"
                onClick={() => toggleFeature(feature.id)}
                className="w-full text-left p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`checkbox flex-shrink-0 ${isSelected ? 'checked' : ''}`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className={`flex-shrink-0 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
                       style={{ transition: 'color 0.15s' }}>
                    {FEATURE_ICONS[feature.id]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--text-primary)] text-sm leading-tight">{feature.label}</div>
                    <div className="text-xs text-[var(--text-muted)] leading-tight mt-0.5">{feature.description}</div>
                  </div>

                  <div className={`price-tag flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${isSelected ? '' : 'opacity-60'}`}>
                    +£{feature.price}
                  </div>
                </div>
              </button>

              {isEmailFeature && (
                <div className="px-4 pb-4 mt-3 pt-3 border-t border-[var(--border)]">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setShowEmailFeatureInfo((v) => !v)}
                    className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isExpanded ? 'Hide details' : 'What’s included?'}
                  </button>

                  {isExpanded && (
                    <ul className="mt-2 space-y-1 text-xs text-[var(--text-secondary)] list-disc pl-4">
                      <li>Centralized inbox and outbox in one dashboard</li>
                      <li>Compose and send emails directly from the dashboard</li>
                      <li>Search and filters across inbound and outbound messages</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
