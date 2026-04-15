'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useAnalysisStore } from '@/store/analysisStore';
import { FileText, Loader2, Upload } from 'lucide-react';

export function UploadZone() {
  const router = useRouter();
  const { setError, setAnalysisId, setExtractedText, setResult, setStep, setFileName, setAnalysisNotice, clearError, step, error } =
    useAnalysisStore();
  const [progress, setProgress] = useState(0);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const uploadWithProgress = async (file: File) => {
    clearError();
    setAnalysisNotice(null);
    setLocalStatus(null);
    setProgress(0);
    setFileName(file.name);
    setStep('uploading');

    const formData = new FormData();
    formData.append('file', file);

    const uploadJson = await new Promise<{
      analysisId?: string;
      extractedText?: string;
      cached?: boolean;
      error?: string;
    }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');
      xhr.withCredentials = true;
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          let msg = 'Upload failed';
          try {
            const j = JSON.parse(xhr.responseText) as { error?: string };
            if (j.error) msg = j.error;
          } catch {
            if (xhr.status === 401) msg = 'You need to sign in to upload.';
          }
          reject(new Error(msg));
          return;
        }
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Upload response could not be parsed'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error — check your connection.'));
      xhr.send(formData);
    });

    if (uploadJson.error) throw new Error(uploadJson.error);

    if (uploadJson.cached && uploadJson.analysisId) {
      setAnalysisId(uploadJson.analysisId);
      setStep('complete');
      setLocalStatus('Opening your previous analysis…');
      router.push(`/analysis/${uploadJson.analysisId}`);
      return;
    }

    if (!uploadJson.analysisId || !uploadJson.extractedText) {
      throw new Error('Upload did not return analysis data. Try again or use a different file.');
    }

    setAnalysisId(uploadJson.analysisId);
    setExtractedText(uploadJson.extractedText);
    setStep('analyzing');
    setProgress(100);
    setLocalStatus('Analyzing contract with AI… this can take up to a minute.');

    const analyzeRes = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId: uploadJson.analysisId,
        extractedText: uploadJson.extractedText,
      }),
    });
    const analyzeJson = (await analyzeRes.json()) as {
      error?: string;
      result?: unknown;
      fallback?: string;
    };
    if (!analyzeRes.ok) {
      throw new Error(analyzeJson.error || 'Analysis failed. Check your API key and try again.');
    }
    setResult(analyzeJson.result as never);
    if (analyzeJson.fallback === 'anthropic_billing_unavailable') {
      setAnalysisNotice('Demo fallback result shown: AI provider credits are unavailable right now.');
    } else {
      setAnalysisNotice(null);
    }
    setStep('complete');
    setLocalStatus(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,
    disabled: step === 'uploading' || step === 'analyzing',
    onDropAccepted: async (files) => {
      try {
        await uploadWithProgress(files[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
        setProgress(0);
        setLocalStatus(null);
      }
    },
    onDropRejected: () => setError('Only PDF or DOCX up to 10 MB.'),
  });

  const busy = step === 'uploading' || step === 'analyzing';

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragActive
            ? 'scale-[1.01] border-emerald-400/60 bg-emerald-500/5'
            : 'border-white/15 bg-zinc-900/40 hover:border-white/25 hover:bg-zinc-900/60'
        } ${busy ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          {busy ? (
            <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
          ) : (
            <Upload className="h-7 w-7 text-zinc-400" />
          )}
        </div>
        <p className="mt-4 text-lg font-medium text-white">
          {busy ? (step === 'uploading' ? 'Uploading…' : 'Analyzing…') : 'Drop your contract here'}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          PDF or DOCX · max 10 MB
        </p>
        {!busy && (
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-600">
            <FileText className="h-4 w-4" />
            Click to browse files
          </p>
        )}
        {progress > 0 && progress < 100 && (
          <div className="mx-auto mt-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {localStatus && (
        <p className="flex items-center justify-center gap-2 text-center text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          {localStatus}
        </p>
      )}
    </div>
  );
}
