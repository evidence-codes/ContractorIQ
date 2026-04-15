'use client';

import { saveAs } from 'file-saver';
import type { CounterClause } from '@/types/analysis';
import { generateCounterProposalDocx } from '@/lib/export/generateDocx';

export function ExportButton({
  coverNote,
  clauses,
  projectName,
}: {
  coverNote: string;
  clauses: CounterClause[];
  projectName?: string;
}) {
  const onExport = async () => {
    const buffer = await generateCounterProposalDocx(coverNote, clauses, projectName);
    const blob = new Blob([new Uint8Array(buffer)], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    saveAs(blob, `${projectName || 'counter-proposal'}.docx`);
  };

  return (
    <button
      type="button"
      className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
      onClick={onExport}
    >
      Export DOCX
    </button>
  );
}
