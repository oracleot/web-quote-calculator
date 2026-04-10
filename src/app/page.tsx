'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/StepIndicator';
import BuilderPhase from '@/components/BuilderPhase';
import QuoteReviewPanel from '@/components/QuoteReviewPanel';
import FormPanel from '@/components/FormPanel';
import MigrationToggle from '@/components/MigrationToggle';
import SelectionBottomBar from '@/components/SelectionBottomBar';
import { calculateQuote } from '@/lib/pricing';
import { useDirection } from '@/hooks/useDirection';
import { useSelectionList } from '@/hooks/useSelectionList';

const TOTAL_STEPS = 4;
const EMPTY_IDS: string[] = Object.freeze([]) as unknown as string[];
const STEP_TITLES = [
  { title: 'Choose Your Pages', sub: 'Select the pages your website needs' },
  { title: 'Add Extra Features', sub: 'Optional add-ons for advanced functionality' },
  { title: 'Review Your Quote', sub: 'Your estimated project cost at a glance' },
  { title: 'Submit Your Inquiry', sub: 'Get in touch to kick things off' },
];
type CouponStatus = 'idle' | 'valid' | 'invalid' | 'error';

export default function Home() {
  const [step, setStep] = useState(1);
  const [isMigration, setIsMigration] = useState(false);
  const [siteType, setSiteType] = useState<'one-page' | 'multi-page'>('multi-page');
  const [selectedPages, setSelectedPages] = useState<string[]>(['home']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('idle');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFormPanel, setShowFormPanel] = useState(false);

  const { direction, goNext, goPrev } = useDirection();

  const livePrice = useMemo(() => calculateQuote(selectedPages, []).total, [selectedPages]);
  const featureTotal = useMemo(() => calculateQuote([], selectedFeatures).featuresCost, [selectedFeatures]);
  const quote = useMemo(
    () => calculateQuote(selectedPages, selectedFeatures, { isMigration }),
    [selectedPages, selectedFeatures, isMigration]
  );
  const migrationFee = isMigration ? 100 : 0;

  const selectedPageItems = useSelectionList(selectedPages, EMPTY_IDS);
  const selectedFeatureItems = useSelectionList(EMPTY_IDS, selectedFeatures);
  const canProceed = () => step !== 1 || selectedPages.length > 0;

  const handleCouponBlur = async () => {
    if (!couponCode.trim() || !clientEmail.trim()) { setCouponStatus('idle'); setCouponDiscount(null); return; }
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, email: clientEmail }),
      });
      const data = await res.json();
      if (data.valid) { setCouponStatus('valid'); setCouponDiscount(data.discountPercent); }
      else { setCouponStatus('invalid'); setCouponDiscount(null); }
    } catch { setCouponStatus('error'); setCouponDiscount(null); }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); setError(null);
    try {
      if (couponStatus === 'valid' && couponCode && clientEmail) {
        await fetch('/api/apply-coupon', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode, email: clientEmail }) });
      }
      const res = await fetch('/api/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName, email: clientEmail, selectedPageIds: selectedPages,
          selectedFeatureIds: selectedFeatures, siteType, isMigration,
          couponCode: couponStatus === 'valid' ? couponCode : undefined,
          couponDiscount: couponStatus === 'valid' ? couponDiscount : undefined }),
      });
      if (!res.ok) throw new Error('Failed to send inquiry');
      setIsSuccess(true);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const getVariants = (dir: 1 | -1) => ({
    enter: { x: dir * 40, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: dir * -40, opacity: 0 },
  });
  const handleNext = () => { goNext(); setStep((s) => s + 1); };
  const handlePrev = () => { goPrev(); setStep((s) => Math.max(1, s - 1)); };
  const isBuilderPhase = step === 1 || step === 2;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="ambient-glow pointer-events-none" />
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="pt-10 pb-6 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(129,140,248,0.25)] bg-[rgba(129,140,248,0.08)] text-xs font-medium text-[#818cf8] mb-6 animate-fade-in">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant estimate · No commitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 animate-fade-in-up font-display">
            Website Quote Calculator
          </h1>
          <p className="text-[#94a3b8] text-base max-w-md mx-auto animate-fade-in-up">
            Build your perfect website quote in minutes — transparent pricing, no surprises.
          </p>
        </header>

        {step === 1 && (
          <div className="px-4 mb-4 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <MigrationToggle isMigration={isMigration} onChange={setIsMigration} />
            </div>
          </div>
        )}

        <div className="px-4 mb-6 animate-fade-in">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        <div className="mb-5 animate-fade-in-up text-center px-4">
          <h2 className="text-xl font-bold text-white mb-0.5 font-display">{STEP_TITLES[step - 1].title}</h2>
          <p className="text-sm text-[#64748b]">{STEP_TITLES[step - 1].sub}</p>
        </div>

        <main className="flex-1 px-4 pb-8">
          {isBuilderPhase && (
            <BuilderPhase step={step} direction={direction}
              selectedPages={selectedPages} setSelectedPages={setSelectedPages}
              selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
              siteType={siteType} setSiteType={setSiteType}
              livePrice={livePrice} featureTotal={featureTotal} migrationFee={migrationFee}
              selectedPageItems={selectedPageItems} selectedFeatureItems={selectedFeatureItems}
              onPrev={handlePrev} onNext={handleNext} canContinue={canProceed()} />
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <div className="card p-6 sm:p-8 animate-scale-in">
                <AnimatePresence mode="wait" custom={direction.current}>
                  <motion.div key="step3" custom={direction.current} variants={getVariants(direction.current)}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
                    <QuoteReviewPanel selectedPageIds={selectedPages} selectedFeatureIds={selectedFeatures}
                      siteType={siteType} isMigration={isMigration}
                      couponDiscount={couponStatus === 'valid' ? couponDiscount : null}
                      couponCode={couponStatus === 'valid' ? couponCode : ''} originalTotal={quote.total}
                      onEditPages={() => { goPrev(); setStep(1); }} onEditFeatures={() => { goPrev(); setStep(2); }}
                      onProceed={() => { setShowFormPanel(true); setStep(4); }} />
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <button onClick={handlePrev} className="btn-secondary">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="px-4 pb-8 text-center">
          <p className="text-xs text-[#374151]">All quotes are estimates. Final pricing may vary based on project specifics.</p>
        </footer>
      </div>

      {isBuilderPhase && (
        <SelectionBottomBar selectedPages={selectedPageItems} selectedFeatures={selectedFeatureItems}
          livePrice={livePrice} featureTotal={featureTotal} migrationFee={migrationFee}
          onContinue={handleNext} canContinue={canProceed()} />
      )}

      <FormPanel open={showFormPanel} onClose={() => { setShowFormPanel(false); setStep(3); }}
        name={clientName} email={clientEmail} couponCode={couponCode}
        couponStatus={couponStatus} couponDiscount={couponDiscount} isMigration={isMigration}
        onNameChange={setClientName} onEmailChange={setClientEmail} onCouponChange={setCouponCode}
        onCouponValidate={handleCouponBlur} onSubmit={handleSubmit}
        isSubmitting={isSubmitting} isSuccess={isSuccess} error={error} />
    </div>
  );
}
