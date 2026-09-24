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

// Cópia do lead no Zoho CRM (transição do Supabase para o Zoho, 21/09/2026).
// Formulário web "Sites e landings - leads"; as chaves abaixo são públicas.
// Envio "por fora": se o Zoho falhar, o visitante não vê erro e o Supabase segue valendo.
function enviarZoho(lead: LeadInput) {
  try {
    const partes = lead.nome.trim().split(/\s+/);
    const sobrenome = partes.length > 1 ? partes.pop()! : partes[0];
    const nome = partes.length ? partes.join(' ') : '';
    const params = new URLSearchParams(window.location.search);
    const d = new URLSearchParams();
    d.append('xnQsjsdp', '7cfa33e6b9556bf57389e3bdd8c348d4458747e166e2592f6ec4a1425c1a7445');
    d.append('xmIwtLD', '3a9dee7718f233d47ee2be042fb1642d7cd055de14277d0ee26ba09821b1aef116ea37815d5e470e4b3220a416417990');
    d.append('actionType', 'TGVhZHM=');
    d.append('returnURL', 'https://www.escutaris.com.br');
    d.append('zc_gad', '');
    d.append('aG9uZXlwb3Q', '');
    d.append('Company', lead.empresa?.trim() || 'Não informado');
    d.append('First Name', nome);
    d.append('Last Name', sobrenome);
    d.append('Email', lead.email);
    d.append('Phone', lead.telefone || '');
    d.append('Description', lead.mensagem || '');
    d.append('LEADCF14', 'Site escutaris.com.br (' + window.location.pathname + ')');
    d.append('LEADCF15', lead.servico);
    d.append('LEADCF16', params.get('utm_source') || '');
    d.append('LEADCF17', params.get('utm_medium') || '');
    d.append('LEADCF18', params.get('utm_campaign') || '');
    d.append('LEADCF19', params.get('utm_content') || '');
    d.append('LEADCF20', params.get('utm_term') || '');
    fetch('https://crm.zoho.com/crm/WebToLeadForm', { method: 'POST', mode: 'no-cors', keepalive: true, body: d })
      .catch((err) => console.warn('Zoho:', err));
  } catch (err) {
    console.warn('Zoho:', err);
  }
}

export async function insertLead(lead: LeadInput) {
  enviarZoho(lead);

  // Sem .select(): a política de segurança permite ao visitante INSERIR um lead,
  // mas (corretamente) não permite LER a tabela — pedir o dado de volta derruba o envio.
  const { error } = await supabase.from('leads_escutaris').insert([lead]);

  // Lead no pixel da Meta (só envia se a pessoa aceitou os cookies)
  if (!error) (window as any).escutarisLead?.();

  return { error };
}
