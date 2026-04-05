import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Polyfill matchMedia for jsdom (not available by default in jsdom < 22)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => {
    const width = window.innerWidth;

    let matches = false;
    const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
    const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);

    if (minWidthMatch && maxWidthMatch) {
      matches = width >= parseInt(minWidthMatch[1]) && width <= parseInt(maxWidthMatch[1]);
    } else if (minWidthMatch) {
      matches = width >= parseInt(minWidthMatch[1]);
    } else if (maxWidthMatch) {
      matches = width <= parseInt(maxWidthMatch[1]);
    }

    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }),
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
