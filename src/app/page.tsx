'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/StepIndicator';
import PageSelector from '@/components/PageSelector';
import FeatureSelector from '@/components/FeatureSelector';
import QuoteSummary from '@/components/QuoteSummary';
import InquiryForm from '@/components/InquiryForm';
import { calculateQuote } from '@/lib/pricing';
import { useDirection } from '@/hooks/useDirection';

const TOTAL_STEPS = 4;

const STEP_TITLES = [
  { title: 'Choose Your Pages', sub: 'Select the pages your website needs' },
  { title: 'Add Extra Features', sub: 'Optional add-ons for advanced functionality' },
  { title: 'Review Your Quote', sub: 'Your estimated project cost at a glance' },
  { title: 'Submit Your Inquiry', sub: 'Get in touch to kick things off' },
];

type CouponStatus = 'idle' | 'valid' | 'invalid' | 'error';

export default function Home() {
  const [step, setStep] = useState(1);
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
  const [mounted, setMounted] = useState(false);

  const { direction, goNext, goPrev } = useDirection();

  // Live price on Step 1 — base price + any extra pages
  const livePrice = useMemo(() => {
    const quote = calculateQuote(selectedPages, []);
    return quote.total;
  }, [selectedPages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const canProceed = () => {
    if (step === 1) return selectedPages.length > 0;
    return true;
  };

  const handleCouponBlur = async () => {
    if (!couponCode.trim() || !clientEmail.trim()) {
      setCouponStatus('idle');
      setCouponDiscount(null);
      return;
    }

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, email: clientEmail }),
      });

      const data = await res.json();

      if (data.valid) {
        setCouponStatus('valid');
        setCouponDiscount(data.discountPercent);
      } else {
        setCouponStatus('invalid');
        setCouponDiscount(null);
      }
    } catch {
      setCouponStatus('error');
      setCouponDiscount(null);
    }
  };

  const quote = calculateQuote(selectedPages, selectedFeatures);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (couponStatus === 'valid' && couponCode && clientEmail) {
        await fetch('/api/apply-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode, email: clientEmail }),
        });
      }

      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          selectedPageIds: selectedPages,
          selectedFeatureIds: selectedFeatures,
          siteType,
          couponCode: couponStatus === 'valid' ? couponCode : undefined,
          couponDiscount: couponStatus === 'valid' ? couponDiscount : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send inquiry');
      }

      setIsSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direction-aware animation variants
  const getVariants = (dir: 1 | -1) => ({
    enter: { x: dir * 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: dir * -40, opacity: 0 },
  });

  const handleNext = () => {
    goNext();
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    goPrev();
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="ambient-glow pointer-events-none" />
      <div className="bg-grid absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex flex-col ${mounted ? '' : 'opacity-0'}`}
           style={{ transition: 'opacity 0.5s ease' }}>

        {/* Header */}
        <header className="pt-10 pb-6 px-4 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(129,140,248,0.25)] bg-[rgba(129,140,248,0.08)] text-xs font-medium text-[#818cf8] mb-6 animate-fade-in`}
               style={{ animationDelay: '0ms' }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant estimate · No commitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 animate-fade-in-up font-display"
              style={{ animationDelay: '50ms' }}>
            Website Quote Calculator
          </h1>
          <p className="text-[#94a3b8] text-base max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Build your perfect website quote in minutes — transparent pricing, no surprises.
          </p>
        </header>

        {/* Step Indicator */}
        <div className="px-4 mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Main card */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-2xl mx-auto">

            {/* Step header */}
            <div className={`mb-5 animate-fade-in-up text-center`} style={{ animationDelay: '250ms' }}>
              <h2 className="text-xl font-bold text-white mb-0.5 font-display">
                {STEP_TITLES[step - 1].title}
              </h2>
              <p className="text-sm text-[#64748b]">
                {STEP_TITLES[step - 1].sub}
              </p>
            </div>

            {/* Step content card */}
            <div className="card p-6 sm:p-8 animate-scale-in" style={{ animationDelay: '280ms' }}>

              <AnimatePresence mode="wait" custom={direction.current}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction.current}
                    variants={getVariants(direction.current)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* Live running price banner */}
                    <div className="flex items-center justify-between mb-5 px-1">
                      <div className="text-xs text-[#64748b]">
                        Running total
                      </div>
                      <div className="live-price-counter flex items-center gap-1.5 bg-[rgba(129,140,248,0.08)] border border-[rgba(129,140,248,0.15)] rounded-full px-3.5 py-1.5">
                        <span className="text-xs text-[#818cf8] font-medium">£</span>
                        <span
                          className="text-sm font-bold text-white count-up font-display"
                          key={livePrice}
                        >
                          {livePrice}
                        </span>
                        <span className="text-xs text-[#64748b]">GBP</span>
                      </div>
                    </div>
                    <PageSelector
                      selected={selectedPages}
                      onChange={setSelectedPages}
                      siteType={siteType}
                      onSiteTypeChange={setSiteType}
                      livePrice={livePrice}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction.current}
                    variants={getVariants(direction.current)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <FeatureSelector selected={selectedFeatures} onChange={setSelectedFeatures} />
                  </motion.div>
                )}

                {(step === 3 || step === 4) && (
                  <motion.div
                    key={`step${step}`}
                    custom={direction.current}
                    variants={getVariants(direction.current)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <QuoteSummary
                      selectedPageIds={selectedPages}
                      selectedFeatureIds={selectedFeatures}
                      siteType={siteType}
                      couponDiscount={couponStatus === 'valid' ? couponDiscount : null}
                      couponCode={couponStatus === 'valid' ? couponCode : null}
                      originalTotal={quote.total}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {step === 4 && !isSuccess && (
                <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <InquiryForm
                    name={clientName}
                    email={clientEmail}
                    couponCode={couponCode}
                    couponStatus={couponStatus}
                    couponDiscount={couponDiscount}
                    onNameChange={setClientName}
                    onEmailChange={setClientEmail}
                    onCouponChange={setCouponCode}
                    onCouponValidate={handleCouponBlur}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    error={error}
                  />
                </div>
              )}

              {step === 4 && isSuccess && (
                <div className="animate-scale-in">
                  <InquiryForm
                    name={clientName}
                    email={clientEmail}
                    couponCode={couponCode}
                    couponStatus={couponStatus}
                    couponDiscount={couponDiscount}
                    onNameChange={setClientName}
                    onEmailChange={setClientEmail}
                    onCouponChange={setCouponCode}
                    onCouponValidate={handleCouponBlur}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    error={error}
                  />
                </div>
              )}

              {/* Navigation */}
              {step < 4 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <button
                    onClick={handlePrev}
                    disabled={step === 1}
                    className="btn-secondary"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </span>
                  </button>

                  {step < 3 && (
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="btn-primary"
                    >
                      <span className="flex items-center gap-2">
                        Continue
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      <span className="flex items-center gap-2">
                        Proceed to Submit
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 pb-8 text-center">
          <p className="text-xs text-[#374151]">
            All quotes are estimates. Final pricing may vary based on project specifics.
          </p>
        </footer>
      </div>
    </div>
  );
}
