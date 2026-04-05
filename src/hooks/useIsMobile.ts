'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true if the viewport is mobile (< 640px).
 * Uses lazy initialization for SSR/hydration safety,
 * then syncs with media query in effect (no cascading renders
 * since the lazy init already set the initial value).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(max-width: 639px)').matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 639px)');
    // Sync with current value after hydration (idempotent — same value = no re-render)
    if (mq.matches !== isMobile) {
      setIsMobile(mq.matches);
    }

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  // isMobile intentionally omitted — we only want to run once after mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMobile;
}
