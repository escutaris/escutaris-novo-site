import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type LeadServico =
  | 'diagnostico'
  | 'palestra'
  | 'roda'
  | 'treinamento'
  | 'programa'
  | 'consultoria';

export interface LeadInput {
  nome: string;
  empresa?: string;
  email: string;
  telefone?: string;
  servico: LeadServico;
  mensagem?: string;
}

export async function insertLead(lead: LeadInput) {
  // Sem .select(): a política de segurança permite ao visitante INSERIR um lead,
  // mas (corretamente) não permite LER a tabela — pedir o dado de volta derruba o envio.
  const { error } = await supabase.from('leads_escutaris').insert([lead]);

  return { error };
}
