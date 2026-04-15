export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          hourly_rate: number;
          revision_limit: number;
          ip_stance: 'retain' | 'transfer-ok' | 'negotiate';
          payment_terms: string;
          currency: string;
          specialization: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_url: string;
          file_hash: string;
          file_size: number | null;
          status: 'pending' | 'processing' | 'complete' | 'error';
          scope_json: Json | null;
          flags_json: Json | null;
          hours_json: Json | null;
          summary_text: string | null;
          counter_json: Json | null;
          counter_text: string | null;
          client_name: string | null;
          project_name: string | null;
          total_hours_low: number | null;
          total_hours_mid: number | null;
          total_hours_high: number | null;
          risk_score: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          analysis_id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
      };
    };
  };
}
