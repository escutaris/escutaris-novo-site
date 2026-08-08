import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Coleção do blog. Cada artigo é um arquivo .md em src/content/blog/.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Só preencher quando o texto for de fato revisado. Aparece na página e vira
    // dateModified para a busca. Ver src/pages/blog/[slug].astro.
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.string().default('Saúde Mental no Trabalho'),
    // Opcional. Quando presente, manda no bloco "Leia também" do fim do artigo;
    // sem tags, a proximidade sai do título e da descrição. Ver src/lib/relacionados.ts.
    tags: z.array(z.string()).default([]),
    // Perguntas e respostas do fim do artigo. Viram bloco na página e FAQPage
    // para a busca, que é o formato que os motores de resposta conseguem citar
    // inteiro. Resposta curta e fechada rende mais que parágrafo comprido.
    faq: z
      .array(z.object({ pergunta: z.string(), resposta: z.string() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
