import { create } from 'zustand';
import type { AnalysisResult, CounterProposalResult } from '@/types/analysis';

type UploadStep = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'complete' | 'error';

interface AnalysisStore {
  step: UploadStep;
  analysisId: string | null;
  extractedText: string | null;
  fileName: string | null;
  result: AnalysisResult | null;
  analysisNotice: string | null;
  counterProposal: CounterProposalResult | null;
  error: string | null;
  setStep: (step: UploadStep) => void;
  setAnalysisId: (id: string) => void;
  setExtractedText: (text: string) => void;
  setFileName: (name: string) => void;
  setResult: (result: AnalysisResult) => void;
  setAnalysisNotice: (notice: string | null) => void;
  setCounterProposal: (cp: CounterProposalResult) => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  step: 'idle', analysisId: null, extractedText: null, fileName: null, result: null, analysisNotice: null, counterProposal: null, error: null,
  setStep: (step) => set({ step }),
  setAnalysisId: (analysisId) => set({ analysisId }),
  setExtractedText: (extractedText) => set({ extractedText }),
  setFileName: (fileName) => set({ fileName }),
  setResult: (result) => set({ result }),
  setAnalysisNotice: (analysisNotice) => set({ analysisNotice }),
  setCounterProposal: (counterProposal) => set({ counterProposal }),
  setError: (error) => set({ error, step: 'error' }),
  clearError: () => set({ error: null }),
  reset: () =>
    set({ step: 'idle', analysisId: null, extractedText: null, fileName: null, result: null, analysisNotice: null, counterProposal: null, error: null }),
}));
