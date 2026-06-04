import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Coleção do blog. Cada artigo é um arquivo .md em src/content/blog/.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.string().default('Saúde Mental no Trabalho'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
