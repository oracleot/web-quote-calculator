'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StepIndicator from '@/components/StepIndicator';
import BuilderPhase from '@/components/BuilderPhase';
import QuoteSummary from '@/components/QuoteSummary';
import FormPanel from '@/components/FormPanel';
import MigrationToggle from '@/components/MigrationToggle';
import SelectionBottomBar from '@/components/SelectionBottomBar';
import SupportPlanStep from '@/components/SupportPlanStep';
import Step3Content from '@/components/steps/Step3Content';
import Step6Content from '@/components/steps/Step6Content';
import { calculateQuote } from '@/lib/pricing';
import { useDirection } from '@/hooks/useDirection';
import { useSelectionList } from '@/hooks/useSelectionList';

const TOTAL_STEPS = 6;
const EMPTY_IDS: string[] = Object.freeze([]) as unknown as string[];
const STEP_TITLES = [
  { title: 'Choose Your Pages', sub: 'Select the pages your website needs' },
  { title: 'Add Extra Features', sub: 'Optional add-ons for advanced functionality' },
  { title: 'Choose a Support Plan', sub: 'Optional ongoing maintenance for your new site' },
  { title: 'Review Your Quote', sub: 'Your estimated project cost at a glance' },
  { title: 'Submit Your Inquiry', sub: 'Get in touch to kick things off' },
  { title: 'All Done', sub: 'Your inquiry has been received' },
];
const STEP_LABELS = ['Pages', 'Features', 'Plan', 'Review', 'Submit'];
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
  const [selectedMaintenancePlan, setSelectedMaintenancePlan] = useState<'none' | 'basic' | 'standard'>('none');

  const { direction, goNext, goPrev } = useDirection();

  const livePrice = useMemo(() => calculateQuote(selectedPages, [], { isMigration }).total, [selectedPages, isMigration]);
  const featureTotal = useMemo(() => calculateQuote([], selectedFeatures).featuresCost, [selectedFeatures]);
  const quote = useMemo(
    () => calculateQuote(selectedPages, selectedFeatures, { isMigration }),
    [selectedPages, selectedFeatures, isMigration]
  );
  const selectedPageItems = useSelectionList(selectedPages, EMPTY_IDS);
  const selectedFeatureItems = useSelectionList(EMPTY_IDS, selectedFeatures);
  const canProceed = () => step !== 1 || isMigration || selectedPages.length > 0;

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
      setStep(6);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleNext = () => { goNext(); setStep((s) => s + 1); };
  const handlePrev = () => { goPrev(); setStep((s) => Math.max(1, s - 1)); };
  const isBuilderPhase = step === 1 || step === 2;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Clean flat background — no grid or ambient glow */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="pt-10 pb-6 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent-muted)] bg-[var(--accent-subtle)] text-xs font-medium text-[var(--accent)] mb-6 animate-fade-in">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant estimate · No commitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2 animate-fade-in-up font-display">
            Website Quote Calculator
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-md mx-auto animate-fade-in-up">
            Build your perfect website quote in minutes — transparent pricing, no surprises.
          </p>
        </header>

        {step === 1 && (
          <div className="px-4 mb-4 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <MigrationToggle isMigration={isMigration} onChange={(v) => { setIsMigration(v); setSelectedPages(v ? [] : ['home']); }} />
            </div>
          </div>
        )}

        <div className="px-4 mb-6 animate-fade-in">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS - 1} labels={STEP_LABELS} />
        </div>

        <div className="mb-5 animate-fade-in-up text-center px-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-0.5 font-display">{STEP_TITLES[step - 1].title}</h2>
          <p className="text-sm text-[var(--text-muted)]">{STEP_TITLES[step - 1].sub}</p>
        </div>

        <main className="flex-1 px-4 pb-8">
          {isBuilderPhase && (
            <BuilderPhase step={step} direction={direction}
              selectedPages={selectedPages} setSelectedPages={setSelectedPages}
              selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
              siteType={siteType} setSiteType={setSiteType}
              livePrice={livePrice} featureTotal={featureTotal}
              selectedPageItems={selectedPageItems} selectedFeatureItems={selectedFeatureItems}
              onPrev={handlePrev} onNext={handleNext} canContinue={canProceed()} isMigration={isMigration} />
          )}

          {step === 3 && (
            <SupportPlanStep
              selectedMaintenancePlan={selectedMaintenancePlan}
              setSelectedMaintenancePlan={setSelectedMaintenancePlan}
              isMigration={isMigration}
              direction={direction}
              onNext={handleNext}
              onBack={handlePrev}
            />
          )}

          {step === 4 && (
            <Step3Content
              direction={direction}
              selectedPages={selectedPages}
              selectedFeatures={selectedFeatures}
              siteType={siteType}
              isMigration={isMigration}
              couponStatus={couponStatus}
              couponDiscount={couponDiscount}
              couponCode={couponCode}
              originalTotal={quote.total}
              maintenancePlan={selectedMaintenancePlan}
              onEditPages={() => { goPrev(); setStep(1); }}
              onEditFeatures={() => { goPrev(); setStep(2); }}
              onEditPlan={() => { goPrev(); setStep(3); }}
              onProceed={() => { goNext(); setStep(5); setShowFormPanel(true); }}
              onPrev={handlePrev}
            />
          )}

          {step === 5 && (
            <div className="max-w-2xl mx-auto">
              <div className="card p-6 sm:p-8 animate-scale-in">
                <QuoteSummary
                  selectedPageIds={selectedPages}
                  selectedFeatureIds={selectedFeatures}
                  siteType={siteType}
                  isMigration={isMigration}
                  couponDiscount={couponStatus === 'valid' ? couponDiscount : null}
                  couponCode={couponStatus === 'valid' ? couponCode : null}
                  originalTotal={quote.total}
                  maintenancePlan={selectedMaintenancePlan}
                />
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-center">
                  <Link
                    href={(() => {
                      const params = new URLSearchParams();
                      params.set('from', 'quote');
                      if (selectedPages.length > 0) params.set('pages', selectedPages.join(','));
                      if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
                      if (isMigration) params.set('migration', 'true');
                      if (selectedMaintenancePlan !== 'none') params.set('maintenance', selectedMaintenancePlan);
                      return `/invoice?${params.toString()}`;
                    })()}
                    className="inline-flex items-center gap-2 btn-secondary text-sm px-5 py-2.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Invoice
                  </Link>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <Step6Content
              direction={direction}
              selectedMaintenancePlan={selectedMaintenancePlan}
              selectedPages={selectedPages}
              selectedFeatures={selectedFeatures}
              isMigration={isMigration}
            />
          )}
        </main>

        <footer className="px-4 pb-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">All quotes are estimates. Final pricing may vary based on project specifics.</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Need to bill a client?{' '}
            <Link href="/invoice" className="text-[var(--accent)] hover:underline">
              Open Invoice Generator →
            </Link>
          </p>
        </footer>
      </div>

      {isBuilderPhase && (
        <SelectionBottomBar selectedPages={selectedPageItems} selectedFeatures={selectedFeatureItems}
          livePrice={livePrice} featureTotal={featureTotal}
          onContinue={handleNext} onBack={handlePrev} step={step}
          canContinue={canProceed()} isMigration={isMigration} />
      )}

      <FormPanel open={showFormPanel && step === 5} onClose={() => { setShowFormPanel(false); goPrev(); setStep(4); }}
        name={clientName} email={clientEmail} couponCode={couponCode}
        couponStatus={couponStatus} couponDiscount={couponDiscount} isMigration={isMigration}
        onNameChange={setClientName} onEmailChange={setClientEmail} onCouponChange={setCouponCode}
        onCouponValidate={handleCouponBlur} onSubmit={handleSubmit}
        isSubmitting={isSubmitting} isSuccess={isSuccess} error={error} />
    </div>
  );
}
