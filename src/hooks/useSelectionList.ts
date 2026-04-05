'use client';

import { useMemo } from 'react';
import { PAGES, FEATURES } from '@/lib/pricing';

export interface SelectionItem {
  id: string;
  label: string;
  price: number;
  type: 'page' | 'feature';
}

function isNonNull<T>(value: T | null): value is T {
  return value !== null;
}

export function useSelectionList(
  selectedPageIds: string[],
  selectedFeatureIds: string[]
): SelectionItem[] {
  return useMemo(() => {
    const pageItems = selectedPageIds
      .map((id): SelectionItem | null => {
        const page = PAGES.find((p) => p.id === id);
        if (!page) return null;
        return { id, label: page.label, price: 0, type: 'page' };
      })
      .filter(isNonNull);

    const featureItems = selectedFeatureIds
      .map((id): SelectionItem | null => {
        const feature = FEATURES.find((f) => f.id === id);
        if (!feature) return null;
        return { id, label: feature.label, price: feature.price, type: 'feature' };
      })
      .filter(isNonNull);

    return [...pageItems, ...featureItems];
  }, [selectedPageIds, selectedFeatureIds]);
}
