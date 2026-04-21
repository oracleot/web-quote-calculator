// Deterministic recommendation map for conversational flow
import { FEATURES, PAGES } from '@/lib/pricing';

export type BusinessType = 'service' | 'local';

export interface Recommendations {
  pages: {
    default: string[];
    optional: { group: string; items: string[] }[];
  };
  features: {
    default: string[];
    optional: string[];
  };
}

export const RECOMMENDATIONS: Record<BusinessType, Recommendations> = {
  service: {
    pages: {
      default: ['home', 'about', 'services', 'contact', 'testimonials', 'pricing'],
      optional: [
        { group: 'Marketing', items: ['gallery', 'team', 'faq'] },
        { group: 'Content', items: ['blog'] },
      ],
    },
    features: {
      default: ['analytics'],
      optional: ['newsletter', 'cms', 'ai-chatbot', 'user-accounts', 'multilang', 'booking', 'shopping-cart', 'social', 'email-management-dashboard'],
    },
  },
  local: {
    pages: {
      default: ['home', 'about', 'services', 'contact', 'gallery', 'testimonials'],
      optional: [
        { group: 'More info', items: ['team', 'faq', 'pricing'] },
        { group: 'Content', items: ['blog'] },
      ],
    },
    features: {
      default: ['analytics'],
      optional: ['newsletter', 'booking', 'cms', 'ai-chatbot', 'user-accounts', 'multilang', 'shopping-cart', 'social', 'email-management-dashboard'],
    },
  },
};

export interface QuoteFlowState {
  currentStep: number;
  history: number[];
  businessType: BusinessType | null;
  selectedPages: string[];
  selectedFeatures: string[];
  isMigration: boolean;
  maintenancePlan: 'none' | 'basic' | 'standard';
}

export const TOTAL_FLOW_STEPS = 5; // 0=type, 1=pages, 2=features, 3=migration, 4=summary

export const FLOW_STEP_LABELS = ['Type', 'Pages', 'Features', 'Migration', 'Review'];

export function getInitialState(): QuoteFlowState {
  return {
    currentStep: 0,
    history: [],
    businessType: null,
    selectedPages: [],
    selectedFeatures: [],
    isMigration: false,
    maintenancePlan: 'none',
  };
}

export function applyBusinessTypeDefaults(state: QuoteFlowState): QuoteFlowState {
  if (!state.businessType) return state;
  const recs = RECOMMENDATIONS[state.businessType];
  return {
    ...state,
    selectedPages: [...recs.pages.default],
    selectedFeatures: [...recs.features.default],
  };
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
