import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export interface Tema {
  /** Vira o endereço: /blog/tema/<slug>. */
  slug: string;
  nome: string;
  /** Título da página do tema, para a busca. Até 60 caracteres. */
  titulo: string;
  descricao: string;
  /** Abertura da página do tema. Texto próprio, para a página não ser só uma lista. */
  intro: string;
}

// Ordem de exibição dos temas na lista do blog.
export const TEMAS = {
  nr1: {
    slug: 'nr-1-e-pgr',
    nome: 'NR-1 e PGR',
    titulo: 'NR-1 e PGR: Fatores Psicossociais no Gerenciamento de Riscos',
    descricao:
      'O que a NR-1 exige sobre fatores psicossociais, como eles entram no GRO e no PGR e os erros mais comuns na adequação, com base no que o MTE publicou.',
    intro:
      'Desde 26 de maio de 2026, os fatores de riscos psicossociais relacionados ao trabalho fazem parte, de forma expressa, do gerenciamento de riscos ocupacionais da NR-1. Os artigos deste tema tratam do que muda no GRO e no PGR, de como registrar os fatores no inventário e no plano de ação, da integração com o PCMSO e dos erros que fazem a adequação parecer pronta sem estar.',
  },
  avaliacao: {
    slug: 'avaliacao-e-diagnostico',
    nome: 'Avaliação e diagnóstico',
    titulo: 'Avaliação de Fatores Psicossociais: Métodos e Instrumentos',
    descricao:
      'Como avaliar fatores psicossociais no trabalho: escolha de instrumentos como o HSE-IT, sigilo e LGPD, indicadores e a diferença entre avaliar o trabalho e avaliar a pessoa.',
    intro:
      'Avaliar fatores psicossociais é olhar para a organização do trabalho, não para o diagnóstico de quem trabalha. Os artigos deste tema explicam como escolher o instrumento, o que o HSE-IT mede, como proteger o sigilo das respostas, que indicadores acompanhar e por que questionário sozinho não é diagnóstico.',
  },
  fatores: {
    slug: 'fatores-de-risco-no-trabalho',
    nome: 'Fatores de risco no trabalho',
    titulo: 'Fatores de Risco Psicossocial no Dia a Dia do Trabalho',
    descricao:
      'Sobrecarga, mudanças sucessivas, monitoramento e outras condições de trabalho que adoecem: como reconhecer cada fator psicossocial e o que a organização pode mudar.',
    intro:
      'Um fator de risco psicossocial raramente aparece com esse nome. Aparece como equipe que nunca recompõe quem saiu, como a terceira reestruturação do ano, como software que mede cada minuto. Os artigos deste tema descrevem essas condições, mostram como elas chegam ao adoecimento e apontam o que a organização pode mudar na origem.',
  },
  lideranca: {
    slug: 'lideranca-e-cultura',
    nome: 'Liderança e cultura',
    titulo: 'Liderança, Cultura e Saúde Mental no Trabalho',
    descricao:
      'O papel da liderança na prevenção dos riscos psicossociais: assédio moral, segurança psicológica, cultura organizacional e como apoiar quem adoece.',
    intro:
      'A liderança é quem mexe, todos os dias, em cargas, prioridades, comunicação, autonomia e conflitos. Os artigos deste tema tratam do que a liderança faz para prevenir o adoecimento, de como a cultura da empresa sustenta ou desmonta esse trabalho, do assédio moral e de como apoiar quem passa por uma doença sem expor nem afastar.',
  },
  estrategia: {
    slug: 'saude-ocupacional-e-estrategia',
    nome: 'Saúde ocupacional e estratégia',
    titulo: 'Saúde Ocupacional e Estratégia: Programas e Governança',
    descricao:
      'Como transformar ações isoladas de saúde em programa com governança, indicadores e revisão: Outubro Rosa, direitos de informação, Brain Capital e o Método CUIDAR.',
    intro:
      'Campanha de um mês e palestra isolada raramente mudam alguma coisa. Os artigos deste tema tratam de como a empresa organiza o cuidado com a saúde ao longo do ano: com responsável, fluxo de acesso, indicadores com denominador claro e governança que decide a cada ciclo o que continua e o que muda.',
  },
} as const satisfies Record<string, Tema>;

type Chave = keyof typeof TEMAS;

// Tema de cada artigo, decidido um a um pelo assunto principal do texto.
const POR_ARTIGO: Record<string, Chave> = {
  'adequacao-a-nr1': 'nr1',
  'comunicacao-de-riscos': 'nr1',
  'fatores-psicossociais-no-pgr': 'nr1',
  'integracaodos-risco-psicossociais-ao-pcmso': 'nr1',
  'o-erro-fatal-na-adequacao-a-nr1': 'nr1',
  'riscos-psicossociais': 'nr1',

  'anonimato-e-lgpd': 'avaliacao',
  'antes-de-aplicar-saiba-escolher': 'avaliacao',
  'avaliacao-fatores-psicossociais': 'avaliacao',
  'seguranca-psicologica-no-trabalho': 'avaliacao',
  'hse-indicator-tool': 'avaliacao',
  'indicadores-de-saude-mental-no-trabalho': 'avaliacao',
  'pesquisa-riscos-psicossociais': 'avaliacao',

  'equipe-enxuta-ou-sobrecarga': 'fatores',
  'fadiga-de-mudanca': 'fatores',
  'impacto-dos-fatores-psicossociais-no-trabalho': 'fatores',
  'monitoramento-algoritmico': 'fatores',
  'o-perigo-invisivel': 'fatores',
  'riscos-psicossociais-no-trabalho': 'fatores',

  'ambiente-seguro-mentalmente': 'lideranca',
  'assedio-moral-trabalho': 'lideranca',
  'cancer-de-mama-e-lideranca': 'lideranca',
  'cultura-organizacional-e-saude-mental': 'lideranca',
  'lideranca-saude-mental': 'lideranca',
  'nao-sou-um-lider-toxico': 'lideranca',
  'sofrimento-moral-no-trabalho': 'lideranca',

  'brain-capital': 'estrategia',
  'lei-15377-informacao-cancer': 'estrategia',
  'metodo-cuidar': 'estrategia',
  'outubro-rosa-na-empresa': 'estrategia',
};

/** Artigo novo fora do mapa cai em "fatores", o tema mais geral. */
export function temaDoArtigo(post: Post): Tema {
  return TEMAS[POR_ARTIGO[post.id] ?? 'fatores'];
}
