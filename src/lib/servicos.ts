import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export interface Servico {
  /** Nome curto, para usar dentro de frase. */
  nome: string;
  url: string;
  /** Vira o texto do link no fim do artigo. Fala do serviço, não do clique. */
  chamada: string;
}

export const SERVICOS = {
  diagnostico: {
    nome: 'Diagnóstico de Fatores Psicossociais',
    url: '/diagnostico-dos-fatores-psicossociais-e-saude-mental-no-trabalho',
    chamada: 'Como funciona o diagnóstico de fatores psicossociais da Escutaris',
  },
  consultoria: {
    nome: 'Consultoria de Adequação à NR-1',
    url: '/consultoria-nr1',
    chamada: 'A consultoria de adequação à NR-1, do GRO psicossocial ao PGR',
  },
  palestra: {
    nome: 'Palestras Corporativas',
    url: '/palestra',
    chamada: 'Palestras corporativas em saúde mental no trabalho',
  },
  roda: {
    nome: 'Rodas de Conversa',
    url: '/roda-de-conversa',
    chamada: 'Rodas de conversa para lideranças em saúde mental',
  },
  programa: {
    nome: 'Programa Contínuo',
    url: '/programa-continuo',
    chamada: 'O programa contínuo de saúde mental ocupacional',
  },
  intervencoes: {
    nome: 'Intervenções que funcionam',
    url: '/intervencoes-riscos-psicossociais-que-funcionam',
    chamada: 'O que a evidência mostra sobre intervenções em riscos psicossociais',
  },
} as const satisfies Record<string, Servico>;

type Chave = keyof typeof SERVICOS;

// Destino de cada artigo, decidido um a um. Regra automática erra em texto
// editorial: "Assédio Moral" e "Cultura Organizacional" citam NR-1 no corpo,
// mas quem lê os dois não está procurando consultoria de conformidade.
const POR_ARTIGO: Record<string, Chave> = {
  'adequacao-a-nr1': 'consultoria',
  'ambiente-seguro-mentalmente': 'intervencoes',
  'anonimato-e-lgpd': 'diagnostico',
  'antes-de-aplicar-saiba-escolher': 'diagnostico',
  'assedio-moral-trabalho': 'roda',
  'avaliacao-fatores-psicossociais': 'diagnostico',
  'comunicacao-de-riscos': 'consultoria',
  'cultura-organizacional-e-saude-mental': 'programa',
  'hse-indicator-tool': 'diagnostico',
  'impacto-dos-fatores-psicossociais-no-trabalho': 'diagnostico',
  'indicadores-de-saude-mental-no-trabalho': 'diagnostico',
  'integracaodos-risco-psicossociais-ao-pcmso': 'consultoria',
  'lideranca-saude-mental': 'palestra',
  'nao-sou-um-lider-toxico': 'palestra',
  'o-erro-fatal-na-adequacao-a-nr1': 'consultoria',
  'o-perigo-invisivel': 'diagnostico',
  'pesquisa-riscos-psicossociais': 'diagnostico',
  'riscos-psicossociais': 'diagnostico',
  'riscos-psicossociais-no-trabalho': 'intervencoes',
};

// Rede para artigo novo que ainda não esteja no mapa acima. Ordem importa:
// a primeira regra que casar decide.
const POR_TERMO: [RegExp, Chave][] = [
  [/pcmso|pgr\b|gro\b|fiscaliza|conformidade|adequa|burocracia|nr[\s-]?0?1/i, 'consultoria'],
  [/palestra|l[ií]der|gestor|chefia/i, 'palestra'],
  [/ass[ée]dio|roda de conversa|escuta/i, 'roda'],
  [/cultura|clima|programa cont[ií]nuo/i, 'programa'],
  [/interven|estrat[ée]gia|pr[aá]tica|o que funciona/i, 'intervencoes'],
];

/** A página de serviço para onde este artigo deve levar. */
export function servicoDoArtigo(post: Post): Servico {
  const escolhido = POR_ARTIGO[post.id];
  if (escolhido) return SERVICOS[escolhido];

  const texto = `${post.data.title} ${post.data.description}`;
  for (const [padrao, chave] of POR_TERMO) {
    if (padrao.test(texto)) return SERVICOS[chave];
  }

  return SERVICOS.diagnostico;
}
