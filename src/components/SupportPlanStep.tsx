'use client';

import { motion, AnimatePresence } from 'framer-motion';
import MaintenancePlanSelector from '@/components/MaintenancePlanSelector';
import { useDirection } from '@/hooks/useDirection';

interface SupportPlanStepProps {
  selectedMaintenancePlan: 'none' | 'basic' | 'standard';
  setSelectedMaintenancePlan: (plan: 'none' | 'basic' | 'standard') => void;
  isMigration: boolean;
  setShowFormPanel: (v: boolean) => void;
  setStep: (step: number) => void;
}

export default function SupportPlanStep({
  selectedMaintenancePlan,
  setSelectedMaintenancePlan,
  isMigration,
  setShowFormPanel,
  setStep,
}: SupportPlanStepProps) {
  const { direction } = useDirection();
  const getVariants = (dir: 1 | -1) => ({
    enter: { x: dir * 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: dir * -40, opacity: 0 },
  });

  return (
    <div className="max-w-2xl mx-auto w-full px-4 animate-scale-in">
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
          <MaintenancePlanSelector
            selectedPlan={selectedMaintenancePlan}
            onSelectPlan={setSelectedMaintenancePlan}
            isMigration={isMigration}
            onContinue={() => {
              setShowFormPanel(true);
              setStep(5);
            }}
            onSkip={() => {
              setSelectedMaintenancePlan('none');
              setStep(6);
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}