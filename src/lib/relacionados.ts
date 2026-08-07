import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

const QUANTOS = 3;

// Teto de vezes que um mesmo artigo pode aparecer como "Leia também".
// Sem ele, os artigos de tema mais genérico (NR-1, riscos psicossociais) ocupam
// quase todos os slots e o resto do blog nunca recebe link interno.
const TETO = 5;

// Palavras que aparecem em quase todo artigo e não dizem nada sobre proximidade
// de assunto. Ficam de fora antes de comparar.
const VAZIAS = new Set([
  'para', 'como', 'com', 'sem', 'que', 'por', 'dos', 'das', 'nos', 'nas',
  'uma', 'seu', 'sua', 'seus', 'suas', 'mais', 'sobre', 'entre', 'quando',
  'onde', 'este', 'esta', 'isso', 'pode', 'saiba', 'veja', 'guia', 'completo',
  'entenda', 'aprenda', 'descubra', 'evite', 'empresa', 'empresas',
]);

function termos(texto: string): string[] {
  const limpo = texto
    .normalize('NFD')
    // Tira os acentos: o NFD separa a letra do sinal, e a faixa abaixo é a dos sinais.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ');

  return [...new Set(limpo.split(/[\s-]+/).filter((t) => t.length >= 4 && !VAZIAS.has(t)))];
}

// Peso inverso à frequência: "pcmso" e "lgpd" identificam um assunto,
// "trabalho" e "psicossociais" aparecem em quase todos e valem quase nada.
function pesos(posts: Post[]): Map<string, number> {
  const emQuantos = new Map<string, number>();

  for (const p of posts) {
    for (const t of termos(`${p.data.title} ${p.data.description}`)) {
      emQuantos.set(t, (emQuantos.get(t) ?? 0) + 1);
    }
  }

  const peso = new Map<string, number>();
  for (const [termo, n] of emQuantos) {
    peso.set(termo, Math.log(posts.length / n));
  }

  return peso;
}

function proximidade(a: Post, b: Post, peso: Map<string, number>): number {
  const tagsA = a.data.tags ?? [];
  const tagsB = b.data.tags ?? [];
  const tagsEmComum = tagsA.filter((t) => tagsB.includes(t)).length;

  const titulosA = new Set(termos(a.data.title));
  const titulosB = new Set(termos(b.data.title));
  const textoA = new Set(termos(`${a.data.title} ${a.data.description}`));
  const textoB = new Set(termos(`${b.data.title} ${b.data.description}`));

  let pontos = tagsEmComum * 4;

  for (const t of textoA) {
    if (!textoB.has(t)) continue;
    // Termo que está nos dois títulos pesa o triplo de um que só aparece na descrição.
    const noTitulo = titulosA.has(t) && titulosB.has(t);
    pontos += (peso.get(t) ?? 0) * (noTitulo ? 3 : 1);
  }

  return pontos;
}

/**
 * Monta o bloco "Leia também" de todos os artigos de uma vez.
 *
 * Precisa ser calculado em conjunto, e não artigo a artigo, porque a garantia
 * que interessa é global: nenhum artigo do blog pode ficar sem receber link.
 */
export function mapaDeRelacionados(posts: Post[]): Map<string, Post[]> {
  const peso = pesos(posts);
  const aparicoes = new Map<string, number>(posts.map((p) => [p.id, 0]));

  // Ranking de candidatos de cada artigo: assunto mais próximo primeiro,
  // e o mais recente na frente quando a proximidade empata.
  const ranking = new Map<string, Post[]>();
  for (const post of posts) {
    const candidatos = posts
      .filter((p) => p.id !== post.id)
      .map((p) => ({ p, pontos: proximidade(post, p, peso) }))
      .sort(
        (a, b) =>
          b.pontos - a.pontos ||
          b.p.data.pubDate.getTime() - a.p.data.pubDate.getTime(),
      )
      .map((c) => c.p);

    ranking.set(post.id, candidatos);
  }

  // Distribuição: o artigo mais antigo escolhe primeiro. Quem publicou há mais
  // tempo tem menos chance de ser puxado por outro caminho, então ganha a
  // primeira escolha enquanto os slots ainda estão livres.
  const ordemDeEscolha = [...posts].sort(
    (a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime(),
  );

  const mapa = new Map<string, Post[]>();

  for (const post of ordemDeEscolha) {
    const candidatos = ranking.get(post.id) ?? [];
    const escolhidos = candidatos
      .filter((p) => (aparicoes.get(p.id) ?? 0) < TETO)
      .slice(0, QUANTOS);

    // Se o teto derrubou candidatos demais, completa com os melhores restantes
    // para o bloco nunca sair com menos de três cards.
    if (escolhidos.length < QUANTOS) {
      for (const p of candidatos) {
        if (escolhidos.length >= QUANTOS) break;
        if (!escolhidos.includes(p)) escolhidos.push(p);
      }
    }

    for (const p of escolhidos) {
      aparicoes.set(p.id, (aparicoes.get(p.id) ?? 0) + 1);
    }

    mapa.set(post.id, escolhidos);
  }

  // Rede de segurança: quem terminou com zero link recebido entra à força no
  // artigo em que a proximidade é maior, no lugar do terceiro card de lá.
  for (const orfao of posts.filter((p) => (aparicoes.get(p.id) ?? 0) === 0)) {
    const anfitriao = posts
      .filter((p) => p.id !== orfao.id)
      .sort(
        (a, b) => proximidade(orfao, b, peso) - proximidade(orfao, a, peso),
      )[0];

    if (!anfitriao) continue;

    const lista = mapa.get(anfitriao.id);
    if (!lista || lista.length === 0) continue;

    const substituido = lista[lista.length - 1];
    lista[lista.length - 1] = orfao;
    aparicoes.set(orfao.id, 1);
    aparicoes.set(substituido.id, Math.max(0, (aparicoes.get(substituido.id) ?? 1) - 1));
  }

  return mapa;
}
