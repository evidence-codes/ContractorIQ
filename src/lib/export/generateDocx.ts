import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import type { CounterClause } from '@/types/analysis';

export async function generateCounterProposalDocx(coverNote: string, clauses: CounterClause[], projectName?: string): Promise<Buffer> {
  const doc = new Document({ sections: [{ properties: {}, children: [
    new Paragraph({ text: `Counter-Proposal${projectName ? ` — ${projectName}` : ''}`, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ text: '' }),
    new Paragraph({ children: [new TextRun({ text: coverNote, size: 24 })] }),
    new Paragraph({ text: '' }),
    ...clauses.flatMap((clause, i) => [
      new Paragraph({ text: `Amendment ${i + 1}: ${clause.rationale}`, heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ children: [new TextRun({ text: 'Original: ', bold: true }), new TextRun({ text: clause.original, italics: true })] }),
      new Paragraph({ children: [new TextRun({ text: 'Proposed: ', bold: true }), new TextRun({ text: clause.replacement })] }),
      new Paragraph({ text: '' }),
    ]),
  ] }] });
  return Packer.toBuffer(doc);
}
