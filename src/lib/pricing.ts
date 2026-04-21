export const BASE_PRICE = 250;       // Flat rate for all websites
export const PAGES_INCLUDED = 4;
export const PRICE_PER_EXTRA_PAGE = 50;

export const PAGES = [
  { id: 'home', label: 'Home', description: 'Landing page with hero section and overview' },
  { id: 'about', label: 'About', description: 'Company story, mission, and values' },
  { id: 'services', label: 'Services', description: 'What you offer to clients' },
  { id: 'contact', label: 'Contact', description: 'Contact form and business details' },
  { id: 'gallery', label: 'Gallery', description: 'Photo or media showcase' },
  { id: 'testimonials', label: 'Testimonials', description: 'Client reviews and feedback' },
  { id: 'team', label: 'Team', description: 'Meet your team or staff' },
  { id: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { id: 'pricing', label: 'Pricing', description: 'Pricing for your services' },
  { id: 'blog', label: 'Blog / News', description: 'Articles and updates' },
];

export const FEATURES = [
  { id: 'ai-chatbot', label: 'AI Chatbot', price: 100, description: 'Intelligent assistant for visitor support' },
  { id: 'shopping-cart', label: 'Shopping Cart + Payments', price: 400, description: 'E-commerce with checkout and payment processing' },
  { id: 'booking', label: 'Booking / Reservations', price: 250, description: 'Appointment scheduling system' },
  { id: 'cms', label: 'CMS / Blog', price: 120, description: 'Manage your own content and articles' },
  { id: 'user-accounts', label: 'User Accounts', price: 120, description: 'Login, profiles, and saved data' },
  { id: 'newsletter', label: 'Newsletter Signup', price: 50, description: 'Email list collection' },
  { id: 'social', label: 'Social Feed Integration', price: 80, description: 'Embed live social feeds and recent social content updates on your website' },
  { id: 'analytics', label: 'Google Analytics', price: 25, description: 'Visitor tracking and reporting' },
  { id: 'multilang', label: 'Multi-language Support', price: 80, description: 'Localized content in multiple languages' },
  {
    id: 'email-management-dashboard',
    label: 'Email Management Dashboard',
    price: 150,
    description: 'Centralized inbox/outbox with compose, send, search, and filtering tools',
  },
];

export const MIGRATION_FEE = 100;

export function calculateQuote(
  selectedPageIds: string[],
  selectedFeatureIds: string[],
  options?: { isMigration?: boolean }
) {
  const pageCount = selectedPageIds.length;

  // Base price (£250) applies to new builds OR migrations that include pages
  // For migration with 0 pages: only migration fee applies (content transfer included)
  const basePrice = options?.isMigration && selectedPageIds.length === 0 ? 0 : BASE_PRICE;

  // Extra pages beyond the 4 included
  const extraPages = pageCount > PAGES_INCLUDED ? pageCount - PAGES_INCLUDED : 0;
  const pagesCost = extraPages * PRICE_PER_EXTRA_PAGE;

  const featuresCost = selectedFeatureIds.reduce((total, id) => {
    const feature = FEATURES.find((f) => f.id === id);
    return total + (feature?.price ?? 0);
  }, 0);

  const migrationFee = options?.isMigration ? MIGRATION_FEE : 0;
  const total = basePrice + pagesCost + featuresCost + migrationFee;

  return {
    basePrice,
    pagesCost,
    extraPages,
    featuresCost,
    migrationFee,
    total,
  };
}
