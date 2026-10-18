// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Data de cada artigo para o <lastmod> do sitemap: a revisão quando existe,
// senão a publicação. Mesma regra da página (src/pages/blog/[slug].astro), para
// o sitemap nunca anunciar como mudado um texto que não foi revisado.
const DATA_DO_ARTIGO = Object.fromEntries(
  fs.readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const texto = fs.readFileSync(`./src/content/blog/${f}`, 'utf8');
      const campo = (nome) => texto.match(new RegExp(`^${nome}:\\s*"?([0-9-]+)`, 'm'))?.[1];
      return [f.replace(/\.md$/, '').toLowerCase(), campo('updatedDate') ?? campo('pubDate')];
    }),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.escutaris.com.br',
  integrations: [
    sitemap({
      // O sitemap saía com barra no fim (/blog/artigo/) enquanto cada página
      // declara como canônica a versão sem barra: apontava o Google para o
      // endereço que o próprio site não reconhece como oficial. A raiz mantém
      // a barra, que lá faz parte do endereço.
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname !== '/' && url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
        }
        const slug = url.pathname.match(/^\/blog\/(.+)$/)?.[1]?.toLowerCase();
        const data = slug && DATA_DO_ARTIGO[slug];
        return { ...item, url: url.href, ...(data && { lastmod: new Date(data).toISOString() }) };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
