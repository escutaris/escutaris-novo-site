// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
          return { ...item, url: url.href };
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
