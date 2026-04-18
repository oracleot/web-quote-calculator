'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import QuoteReviewPanel from '@/components/QuoteReviewPanel';

interface Step3ContentProps {
  direction: React.MutableRefObject<1 | -1>;
  selectedPages: string[];
  selectedFeatures: string[];
  siteType: 'one-page' | 'multi-page';
  isMigration: boolean;
  couponStatus: 'idle' | 'valid' | 'invalid' | 'error';
  couponDiscount: number | null;
  couponCode: string;
  originalTotal: number;
  maintenancePlan: 'none' | 'basic' | 'standard';
  onEditPages: () => void;
  onEditFeatures: () => void;
  onEditPlan: () => void;
  onProceed: () => void;
  onPrev: () => void;
}

const getVariants = (dir: 1 | -1) => ({
  enter: { x: dir * 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: dir * -40, opacity: 0 },
});

export default function Step3Content({
  direction,
  selectedPages,
  selectedFeatures,
  siteType,
  isMigration,
  couponStatus,
  couponDiscount,
  couponCode,
  originalTotal,
  maintenancePlan,
  onEditPages,
  onEditFeatures,
  onEditPlan,
  onProceed,
  onPrev,
}: Step3ContentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6 sm:p-8 animate-scale-in">
        <AnimatePresence mode="wait" custom={direction.current}>
          <motion.div
            key="step4"
            custom={direction.current}
            variants={getVariants(direction.current)}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <QuoteReviewPanel
              selectedPageIds={selectedPages}
              selectedFeatureIds={selectedFeatures}
              siteType={siteType}
              isMigration={isMigration}
              couponDiscount={couponStatus === 'valid' ? couponDiscount : null}
              couponCode={couponStatus === 'valid' ? couponCode : ''}
              originalTotal={originalTotal}
              maintenancePlan={maintenancePlan}
              onEditPages={onEditPages}
              onEditFeatures={onEditFeatures}
              onEditPlan={onEditPlan}
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)] gap-2 flex-wrap">
          <button onClick={onPrev} className="btn-secondary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </span>
          </button>
          <div className="flex items-center gap-2">
            <Link
              href={(() => {
                const params = new URLSearchParams();
                params.set('from', 'quote');
                if (selectedPages.length > 0) params.set('pages', selectedPages.join(','));
                if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
                if (isMigration) params.set('migration', 'true');
                if (maintenancePlan !== 'none') params.set('maintenance', maintenancePlan);
                return `/invoice?${params.toString()}`;
              })()}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Invoice
            </Link>
            <button onClick={onProceed} className="btn-primary px-6 py-2.5">
              <span className="flex items-center gap-2">
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
