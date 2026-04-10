'use client';

import { useState } from 'react';

interface InquiryFormProps {
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

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  autoComplete,
  fontMono = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  fontMono?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="floating-form-group">
      <label
        htmlFor={id}
        className={`floating-label ${isFloated ? 'float-up' : ''}`}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`form-input ${fontMono ? 'font-mono tracking-wider' : ''}`}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function InquiryForm({
  name,
  email,
  couponCode,
  couponStatus,
  couponDiscount,
  onNameChange,
  onEmailChange,
  onCouponChange,
  onCouponValidate,
  onSubmit,
  isSubmitting,
  isSuccess,
  error,
}: InquiryFormProps) {
  const [couponFocused, setCouponFocused] = useState(false);

  if (isSuccess) {
    return (
      <div className="animate-scale-in">
        <div className="text-center py-8 space-y-5">
          <div className="success-ring w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1.5">Inquiry Sent!</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              Your quote request is in. Dami will review your requirements and reach out within 24 hours.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--success-bg)] border border-[rgba(52,211,153,0.2)] rounded-full px-4 py-2">
            <svg className="w-3.5 h-3.5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Check your inbox for a confirmation email
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-muted)]">
        <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-[var(--text-secondary)]">
          Your quote details will be attached. Dami will review your requirements and get back to you within 24 hours.
        </p>
      </div>

      <div className="space-y-3">
        <FloatingInput
          id="name"
          label="Your Name"
          value={name}
          onChange={onNameChange}
          autoComplete="name"
        />

        <FloatingInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={onEmailChange}
          autoComplete="email"
        />

        {/* Coupon field */}
        <div className="space-y-1.5">
          <div className="floating-form-group">
            <label
              htmlFor="coupon"
              className={`floating-label ${(couponFocused || couponCode.length > 0) ? 'float-up' : ''}`}
            >
              Coupon Code <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                type="text"
                value={couponCode}
                onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
                onFocus={() => setCouponFocused(true)}
                onBlur={() => setCouponFocused(false)}
                className="form-input font-mono tracking-wider flex-1"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={onCouponValidate}
                className="px-4 py-2 rounded-lg bg-[var(--accent-muted)] border border-[rgba(34,211,238,0.2)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent-subtle)] transition-colors whitespace-nowrap"
              >
                Validate
              </button>
            </div>
          </div>
        </div>

        {/* Coupon validation feedback */}
        {couponStatus === 'valid' && couponDiscount && (
          <div className="p-3 rounded-lg bg-[var(--success-bg)] border border-[rgba(52,211,153,0.2)] text-sm text-[var(--success)] flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {couponDiscount}% discount applied!
          </div>
        )}

        {couponStatus === 'invalid' && (
          <div className="p-3 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)] text-sm text-[var(--error)] flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Invalid, expired, or already used coupon
          </div>
        )}

        {couponStatus === 'error' && (
          <div className="p-3 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)] text-sm text-[var(--error)] flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error validating coupon
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)] text-sm text-[var(--error)] flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !name || !email}
        className="btn-primary w-full py-3.5 mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Inquiry
          </span>
        )}
      </button>
    </div>
  );
}
