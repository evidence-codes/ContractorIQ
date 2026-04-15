import { createClient } from '@/lib/supabase/server';
import { ContractList } from '@/components/dashboard/ContractList';
import { EmptyState } from '@/components/dashboard/EmptyState';
import type { Analysis } from '@/types/analysis';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data } = await supabase.from('analyses').select('id,user_id,file_name,file_url,file_hash,status,scope_json,flags_json,hours_json,summary_text,counter_json,counter_text,client_name,project_name,total_hours_low,total_hours_mid,total_hours_high,risk_score,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).range(0, 19);
  if (!data || data.length === 0) return <EmptyState />;
  return <ContractList analyses={data as unknown as Analysis[]} />;
}
