'use client';

import { useRef } from 'react';

/**
 * Tracks navigation direction: 1 = forward, -1 = backward.
 * Call goNext() to advance and goPrev() to go back.
 * Returns { direction, goNext, goPrev }.
 * direction is a ref so consumers can read it without re-renders.
 */
export function useDirection() {
  const direction = useRef<1 | -1>(1);

  const goNext = () => {
    direction.current = 1;
  };

  const goPrev = () => {
    direction.current = -1;
  };

  return { direction, goNext, goPrev };
}
