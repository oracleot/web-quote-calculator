'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  onEditPages: () => void;
  onEditFeatures: () => void;
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
  onEditPages,
  onEditFeatures,
  onProceed,
  onPrev,
}: Step3ContentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6 sm:p-8 animate-scale-in">
        <AnimatePresence mode="wait" custom={direction.current}>
          <motion.div
            key="step3"
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
              onEditPages={onEditPages}
              onEditFeatures={onEditFeatures}
              onProceed={onProceed}
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
          <button onClick={onPrev} className="btn-secondary">
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
  );
}
