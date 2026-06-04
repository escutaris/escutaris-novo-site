import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type LeadServico = 'diagnostico' | 'palestra' | 'roda' | 'direcionamento';

export interface LeadInput {
  nome: string;
  empresa?: string;
  email: string;
  telefone?: string;
  servico: LeadServico;
  mensagem?: string;
}

export async function insertLead(lead: LeadInput) {
  const { data, error } = await supabase
    .from('leads_escutaris')
    .insert([lead])
    .select()
    .single();

  return { data, error };
}
