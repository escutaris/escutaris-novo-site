# Escutaris — Site

Site institucional e de geração de leads da **Escutaris** (saúde mental ocupacional, diagnóstico de fatores psicossociais e conformidade com a NR-1).

Responsabilidade técnica: Dra. Ana Paula Teixeira — CRM-BA 12797.

## Stack

- **[Astro](https://astro.build)** (site estático)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Supabase** (armazenamento dos leads do formulário de contato)
- Fontes hospedadas localmente: **Garet** (títulos) e **Poppins** (corpo)

## Como rodar localmente

```sh
npm install
npm run dev      # servidor local em http://localhost:4321
```

| Comando           | Ação                                         |
| :---------------- | :------------------------------------------- |
| `npm install`     | Instala as dependências                      |
| `npm run dev`     | Sobe o servidor de desenvolvimento (4321)    |
| `npm run build`   | Gera o site de produção em `./dist/`         |
| `npm run preview` | Pré-visualiza o build de produção            |

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (use o `.env.example` como modelo). **Nunca** versione o `.env` — ele já está no `.gitignore`.

```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Estrutura

```
src/
├── components/   # Seções e elementos reutilizáveis (.astro)
├── content/blog/ # Artigos do blog (Markdown)
├── layouts/      # Layout base (SEO, <head>, dados estruturados)
├── pages/        # Rotas do site
└── styles/       # CSS global + tokens da marca
public/           # Imagens e assets estáticos
```

## Conteúdo

- **Home** com diagnóstico (produto principal), urgência (NR-1), serviços, comparativo, depoimentos e contato.
- **Páginas de serviço:** Diagnóstico, Palestras, Rodas de Conversa, Treinamentos, Programa Contínuo, Consultoria NR-1/GRO.
- **Blog** com artigos sobre NR-1, riscos psicossociais e saúde mental no trabalho.
- **Política de Privacidade (LGPD)**.
