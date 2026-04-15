'use client';
import { useAnalysisStore } from '@/store/analysisStore';

export function useAnalysis() {
  return useAnalysisStore();
}
