'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import InquiryForm from '@/components/InquiryForm';

interface FormPanelProps {
  open: boolean;
  onClose: () => void;
  // InquiryForm props
  name: string;
  email: string;
  couponCode: string;
  couponStatus: 'idle' | 'valid' | 'invalid' | 'error';
  couponDiscount: number | null;
  isMigration?: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onCouponChange: (v: string) => void;
  onCouponValidate: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function FormPanel({
  open,
  onClose,
  name,
  email,
  couponCode,
  couponStatus,
  couponDiscount,
  isMigration = false,
  onNameChange,
  onEmailChange,
  onCouponChange,
  onCouponValidate,
  onSubmit,
  isSubmitting,
  isSuccess,
  error,
}: FormPanelProps) {
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus first focusable element in panel when opened
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [open]);

  // Escape key closes the panel
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="form-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />

          {isMobile ? (
            /* Mobile: bottom sheet */
            <motion.div
              key="form-panel-mobile"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-panel-heading-mobile"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="form-panel fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
              </div>

              <div className="px-5 pb-8 pt-2">
                <div className="flex items-center justify-between mb-5">
                  <h3 id="form-panel-heading-mobile" className="text-base font-semibold text-[var(--text-primary)]">
                    Submit Inquiry
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <InquiryForm
                  name={name}
                  email={email}
                  couponCode={couponCode}
                  couponStatus={couponStatus}
                  couponDiscount={couponDiscount}
                  isMigration={isMigration}
                  onNameChange={onNameChange}
                  onEmailChange={onEmailChange}
                  onCouponChange={onCouponChange}
                  onCouponValidate={onCouponValidate}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  isSuccess={isSuccess}
                  error={error}
                />
              </div>
            </motion.div>
          ) : (
            /* Desktop: right slide-in panel */
            <motion.div
              key="form-panel-desktop"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-panel-heading-desktop"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="form-panel fixed top-0 right-0 bottom-0 z-50 w-[400px] overflow-y-auto"
            >
              <div className="p-6 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 id="form-panel-heading-desktop" className="text-lg font-semibold text-[var(--text-primary)]">
                    Submit Inquiry
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <InquiryForm
                  name={name}
                  email={email}
                  couponCode={couponCode}
                  couponStatus={couponStatus}
                  couponDiscount={couponDiscount}
                  isMigration={isMigration}
                  onNameChange={onNameChange}
                  onEmailChange={onEmailChange}
                  onCouponChange={onCouponChange}
                  onCouponValidate={onCouponValidate}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  isSuccess={isSuccess}
                  error={error}
                />
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
