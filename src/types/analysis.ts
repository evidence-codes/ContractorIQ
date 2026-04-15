export type RiskSeverity = 'critical' | 'moderate' | 'minor';
export type AnalysisStatus = 'pending' | 'processing' | 'complete' | 'error';
export type IPStance = 'retain' | 'transfer-ok' | 'negotiate';

export interface ScopeItem {
  id: string;
  task: string;
  deliverable: string;
  ambiguity_score: number;
  ambiguity_reason?: string;
  phase?: string;
}

export interface RiskFlag {
  id: string;
  clause: string;
  clause_location?: string;
  severity: RiskSeverity;
  category: string;
  reason: string;
  suggested_fix: string;
  impact: string;
}

export interface HourEstimate {
  id: string;
  task: string;
  phase?: string;
  low: number;
  mid: number;
  high: number;
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
}

export interface CounterClause {
  id: string;
  flag_id: string;
  original: string;
  replacement: string;
  rationale: string;
}

export interface AnalysisResult {
  scope: ScopeItem[];
  flags: RiskFlag[];
  hours: HourEstimate[];
  summary: string;
  client_name?: string;
  project_name?: string;
  contract_type?: string;
  risk_score: number;
}

export interface CounterProposalResult {
  clauses: CounterClause[];
  cover_note: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_hash: string;
  status: AnalysisStatus;
  scope_json: ScopeItem[] | null;
  flags_json: RiskFlag[] | null;
  hours_json: HourEstimate[] | null;
  summary_text: string | null;
  counter_json: CounterClause[] | null;
  counter_text: string | null;
  client_name: string | null;
  project_name: string | null;
  total_hours_low: number | null;
  total_hours_mid: number | null;
  total_hours_high: number | null;
  risk_score: number | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  hourly_rate: number;
  revision_limit: number;
  ip_stance: IPStance;
  payment_terms: string;
  currency: string;
  specialization: string | null;
}

export interface ChatMessage {
  id: string;
  analysis_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
