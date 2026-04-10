'use client';

import { motion, AnimatePresence } from 'framer-motion';
import PageSelector from '@/components/PageSelector';
import FeatureSelector from '@/components/FeatureSelector';
import BuilderSidebar from '@/components/BuilderSidebar';
import type { SelectionItem } from '@/hooks/useSelectionList';

interface BuilderPhaseProps {
  step: number;
  direction: React.MutableRefObject<1 | -1>;
  selectedPages: string[];
  setSelectedPages: (v: string[]) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (v: string[]) => void;
  siteType: 'one-page' | 'multi-page';
  setSiteType: (v: 'one-page' | 'multi-page') => void;
  livePrice: number;
  featureTotal: number;
  selectedPageItems: SelectionItem[];
  selectedFeatureItems: SelectionItem[];
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
}

const VARIANTS = (dir: 1 | -1) => ({
  enter: { x: dir * 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: dir * -40, opacity: 0 },
});

const BACK_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function BuilderPhase({
  step, direction, selectedPages, setSelectedPages,
  selectedFeatures, setSelectedFeatures, siteType, setSiteType,
  livePrice, featureTotal,
  selectedPageItems, selectedFeatureItems,
  onPrev, onNext, canContinue,
}: BuilderPhaseProps) {
  return (
    <div className="builder-layout-wrapper max-w-5xl mx-auto">
      <div className="builder-layout">
        <div className="builder-content card p-6 sm:p-8 animate-scale-in">
          <AnimatePresence mode="wait" custom={direction.current}>
            {step === 1 && (
              <motion.div key="step1" custom={direction.current} variants={VARIANTS(direction.current)}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
                <PageSelector selected={selectedPages} onChange={setSelectedPages}
                  siteType={siteType} onSiteTypeChange={setSiteType} livePrice={livePrice} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" custom={direction.current} variants={VARIANTS(direction.current)}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
                <FeatureSelector selected={selectedFeatures} onChange={setSelectedFeatures} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
            <button onClick={onPrev} disabled={step === 1} className="btn-secondary sm:flex hidden">
              <span className="flex items-center gap-2">{BACK_ICON}Back</span>
            </button>
          </div>
          <div className="flex items-center justify-between mt-0 sm:hidden">
            <button onClick={onPrev} disabled={step === 1} className="btn-secondary">
              <span className="flex items-center gap-2">{BACK_ICON}Back</span>
            </button>
          </div>
        </div>

        <BuilderSidebar step={step} selectedPages={selectedPageItems} selectedFeatures={selectedFeatureItems}
          livePrice={livePrice} featureTotal={featureTotal}
          onContinue={onNext} canContinue={canContinue} />
      </div>
    </div>
  );
}
