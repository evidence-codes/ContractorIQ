import type { AnalysisResult, CounterProposalResult } from '@/types/analysis';

export const sampleAnalysis: AnalysisResult = {
  summary:
    'This fixed-price web redesign includes discovery, UI implementation, and post-launch support. The current draft has ambiguous scope language and payment/termination terms that create risk for the freelancer.',
  risk_score: 74,
  client_name: 'Acme Ventures',
  project_name: 'Marketing Site Refresh',
  contract_type: 'fixed-price',
  scope: [
    {
      id: 'scope-1',
      task: 'Discovery and planning',
      deliverable: 'Workshop notes, sitemap, and approved project plan',
      ambiguity_score: 0.22,
      phase: 'Discovery',
    },
    {
      id: 'scope-2',
      task: 'Design and build',
      deliverable: 'Responsive landing pages and CMS-backed blog templates',
      ambiguity_score: 0.38,
      phase: 'Production',
    },
    {
      id: 'scope-3',
      task: 'Content migration',
      deliverable: 'Move and format up to 40 legacy pages',
      ambiguity_score: 0.66,
      ambiguity_reason: 'Contract says migration as needed without page limit in clause text.',
      phase: 'Production',
    },
  ],
  flags: [
    {
      id: 'flag-1',
      clause: 'Contractor transfers all IP rights upon signing, regardless of payment status.',
      clause_location: 'Section 5.1',
      severity: 'critical',
      category: 'IP Ownership',
      reason: 'You lose leverage and rights before payment is completed.',
      suggested_fix:
        'IP transfer becomes effective only after full payment is received; prior to that client receives a limited review license.',
      impact: 'Unpaid work with no retained rights or negotiation leverage.',
    },
    {
      id: 'flag-2',
      clause: 'Contractor will provide revisions until client is fully satisfied.',
      clause_location: 'Section 3.4',
      severity: 'critical',
      category: 'Revision Policy',
      reason: 'Unlimited revisions create unbounded labor and timeline risk.',
      suggested_fix:
        'Include two revision rounds per deliverable; additional revisions billed at hourly rate.',
      impact: 'Scope creep and reduced project margin.',
    },
    {
      id: 'flag-3',
      clause: 'Invoices payable within 60 days.',
      clause_location: 'Section 6.2',
      severity: 'moderate',
      category: 'Payment Terms',
      reason: 'Long payment window creates cash-flow strain.',
      suggested_fix: 'Change to Net-14 or Net-30 with 50% upfront.',
      impact: 'Delayed cash and higher collection risk.',
    },
    {
      id: 'flag-4',
      clause: 'Either party may terminate at any time.',
      clause_location: 'Section 9.1',
      severity: 'moderate',
      category: 'Kill Fee',
      reason: 'No compensation guaranteed for in-progress work after sudden termination.',
      suggested_fix:
        'Add a kill fee equal to 20% of remaining contract value plus payment for work completed.',
      impact: 'Lost revenue and unrecoverable planning costs.',
    },
  ],
  hours: [
    {
      id: 'hours-1',
      task: 'Discovery and planning',
      phase: 'Discovery',
      low: 10,
      mid: 14,
      high: 20,
      confidence: 'high',
      assumptions: ['Client provides stakeholder access within 3 business days.'],
    },
    {
      id: 'hours-2',
      task: 'UI implementation and CMS integration',
      phase: 'Production',
      low: 48,
      mid: 62,
      high: 84,
      confidence: 'medium',
      assumptions: ['Design approvals in two rounds.', 'No major architecture changes mid-build.'],
    },
    {
      id: 'hours-3',
      task: 'Content migration and QA',
      phase: 'Production',
      low: 24,
      mid: 38,
      high: 58,
      confidence: 'low',
      assumptions: ['Migration capped at 40 pages.', 'Client provides final copy on time.'],
    },
  ],
};

export const sampleCounterProposal: CounterProposalResult = {
  cover_note:
    'Hi — thanks again for the opportunity. Before we kick off, I wanted to align on a few contract points that help both sides move faster with fewer surprises.',
  clauses: [
    {
      id: 'cp-1',
      flag_id: 'flag-1',
      original: 'All IP transfers on signature.',
      replacement:
        'IP for custom deliverables transfers upon receipt of final payment. Prior to final payment, Client receives a non-exclusive license to use deliverables for internal review.',
      rationale: 'This keeps incentives aligned and protects both parties if timelines shift.',
    },
    {
      id: 'cp-2',
      flag_id: 'flag-2',
      original: 'Unlimited revisions.',
      replacement:
        'Two structured revision rounds per major deliverable; additional changes billed at the agreed hourly rate with written approval.',
      rationale: 'Clear revision boundaries prevent scope drift while preserving quality.',
    },
  ],
};
