// Deterministic recommendation map for conversational flow
import { FEATURES, PAGES } from '@/lib/pricing';

export type BusinessType = 'service' | 'local';

export interface Recommendations {
  pages: {
    default: string[];      // locked, included in base £250
    optional: { group: string; items: string[] }[];
  };
  features: {
    default: string[];      // suggestions only — NOT pre-selected in v2
    optional: string[];
  };
  // Migration pages: separate pool, no base £250
  migrationPages: {
    default: string[];
    optional: { group: string; items: string[] }[];
  };
}

export const RECOMMENDATIONS: Record<BusinessType, Recommendations> = {
  service: {
    pages: {
      default: ['home', 'about', 'services', 'contact'],
      optional: [
        { group: 'Marketing', items: ['gallery', 'team', 'faq'] },
        { group: 'Content', items: ['blog'] },
      ],
    },
    features: {
      default: ['analytics'],
      optional: ['newsletter', 'cms', 'ai-chatbot', 'user-accounts', 'multilang', 'booking', 'shopping-cart', 'social', 'email-management-dashboard'],
    },
    migrationPages: {
      default: ['home', 'about', 'services', 'contact'],
      optional: [
        { group: 'Marketing', items: ['gallery', 'team', 'faq', 'testimonials', 'pricing'] },
        { group: 'Content', items: ['blog'] },
      ],
    },
  },
  local: {
    pages: {
      default: ['home', 'about', 'services', 'contact'],
      optional: [
        { group: 'More info', items: ['team', 'faq', 'pricing'] },
        { group: 'Content', items: ['blog'] },
      ],
    },
    features: {
      default: ['analytics'],
      optional: ['newsletter', 'booking', 'cms', 'ai-chatbot', 'user-accounts', 'multilang', 'shopping-cart', 'social', 'email-management-dashboard'],
    },
    migrationPages: {
      default: ['home', 'about', 'services', 'contact'],
      optional: [
        { group: 'More info', items: ['gallery', 'team', 'faq', 'testimonials', 'pricing'] },
        { group: 'Content', items: ['blog'] },
      ],
    },
  },
};

export interface QuoteFlowState {
  currentStep: number;
  history: number[];
  businessType: BusinessType | null;

  // Regular path: selectedPages tracks ONLY manually selected optional pages
  // The 4 default pages are NOT stored here (they're included in base £250)
  selectedPages: string[];

  // Migration path
  isMigration: boolean;
  isRevamp: boolean;
  migrationPageIds: string[];   // pages user wants to migrate (£50 each)

  // Features: starts empty in v2 — suggestions only, NOT pre-selected
  selectedFeatures: string[];

  // Meta
  maintenancePlan: 'none' | 'basic' | 'standard';
}

export const FLOW_STEP_LABELS = ['Type', 'Migration', 'Pages', 'Revamp', 'Features', 'Summary'];
export const TOTAL_FLOW_STEPS = FLOW_STEP_LABELS.length - 1; // Max step index (Summary = step 5)

export function getInitialState(): QuoteFlowState {
  return {
    currentStep: 0,
    history: [],
    businessType: null,
    selectedPages: [],
    isMigration: false,
    isRevamp: false,
    migrationPageIds: [],
    selectedFeatures: [],
    maintenancePlan: 'none',
  };
}

// No longer used in v2 — features & pages are NOT auto-selected
// Kept for any remaining references, but does nothing
export function applyBusinessTypeDefaults(state: QuoteFlowState): QuoteFlowState {
  return state;
}

export function getPageItem(id: string) {
  return PAGES.find((p) => p.id === id);
}

export function getFeatureItem(id: string) {
  return FEATURES.find((f) => f.id === id);
}

export function isPageSelected(state: QuoteFlowState, pageId: string): boolean {
  return state.selectedPages.includes(pageId);
}

export function isFeatureSelected(state: QuoteFlowState, featureId: string): boolean {
  return state.selectedFeatures.includes(featureId);
}

export function isDefaultPage(businessType: BusinessType | null, pageId: string): boolean {
  if (!businessType) return false;
  return RECOMMENDATIONS[businessType].pages.default.includes(pageId);
}

export function isDefaultFeature(businessType: BusinessType | null, featureId: string): boolean {
  if (!businessType) return false;
  return RECOMMENDATIONS[businessType].features.default.includes(featureId);
}
