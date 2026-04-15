'use client';
import { useAnalysisStore } from '@/store/analysisStore';

export function useUpload() {
  const store = useAnalysisStore();
  return {
    ...store,
    async uploadAndAnalyze(file: File) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error || 'Upload failed');
      if (uploadJson.cached && uploadJson.analysisId) {
        store.setAnalysisId(uploadJson.analysisId);
        store.setStep('complete');
        if (typeof window !== 'undefined') {
          window.location.assign(`/analysis/${uploadJson.analysisId}`);
        }
        return;
      }
      store.setAnalysisId(uploadJson.analysisId);
      store.setExtractedText(uploadJson.extractedText);
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: uploadJson.analysisId, extractedText: uploadJson.extractedText }),
      });
      const analyzeJson = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeJson.error || 'Analysis failed');
      store.setResult(analyzeJson.result);
      store.setStep('complete');
    },
  };
}
