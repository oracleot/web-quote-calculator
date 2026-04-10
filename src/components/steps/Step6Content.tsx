'use client';

import { motion, AnimatePresence } from 'framer-motion';
import FinalConfirmation from '@/components/FinalConfirmation';

interface Step6ContentProps {
  direction: React.MutableRefObject<1 | -1>;
  selectedMaintenancePlan: 'none' | 'basic' | 'standard';
}

const getVariants = (dir: 1 | -1) => ({
  enter: { x: dir * 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: dir * -40, opacity: 0 },
});

export default function Step6Content({ direction, selectedMaintenancePlan }: Step6ContentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6 sm:p-8 animate-scale-in">
        <AnimatePresence mode="wait" custom={direction.current}>
          <motion.div
            key="step6"
            custom={direction.current}
            variants={getVariants(direction.current)}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <FinalConfirmation selectedMaintenancePlan={selectedMaintenancePlan} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
