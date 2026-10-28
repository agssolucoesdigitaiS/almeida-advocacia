# Almeida Advocacia · modelo demonstrativo de website

Website institucional de um escritório de advocacia **fictício**. Marca, profissionais, imagens e dados são demonstrativos.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
npm run preview
```

URLs limpas (Vercel/Netlify): `VITE_ROUTER=browser npm run build` (o `vercel.json` já faz o rewrite).
Sem a variável, as rotas usam hash simples (`#area-direito-civil`, `#artigo-...`) e funcionam em qualquer hospedagem estática.

## Antes de publicar para um escritório real

1. Preencha `src/data/compliance.ts` (registro da sociedade, responsável e inscrição na OAB, CNPJ, endereço, encarregado LGPD) e mude cada item para `validado`.
2. Substitua os perfis ilustrativos em `src/data/content.ts` por dados reais, sem títulos ou especializações não comprovadas.
3. Revise todos os textos à luz do Provimento CFOAB nº 205/2021 e do Código de Ética e Disciplina.
4. Configure `contactEndpoint` em `src/data/site.ts`. Sem ele, o formulário não envia nada e avisa o visitante. No servidor: validação, antispam e rate limit.
5. Revise a política de privacidade com orientação jurídica.
6. Troque os renders por fotografias reais com autorização de uso (`public/assets/img/<nome>-1920.webp` e `-960.webp`).
7. Atualize domínio em `public/sitemap.xml`, `public/robots.txt` e a `og:image` absoluta em `index.html`.
8. Meça LCP, CLS e INP em produção; as metas foram preparadas, não medidas.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Nome, assinatura, contatos, créditos, endpoint | `src/data/site.ts` |
| Pendências regulatórias | `src/data/compliance.ts` |
| Áreas de atuação (home e páginas) | `src/data/areas.ts` |
| Artigos (tempo de leitura é calculado) | `src/data/articles.ts` |
| Filosofia, equipe, atendimento, palavras da cena 3D | `src/data/content.ts` |
| Cores e tipografia | `src/styles/index.css` e `tailwind.config.js` |

## Estrutura

```
src/components/layout    Navbar, FullscreenMenu, Footer, Credits
src/components/motion    Preloader, CustomCursor, PageTransition, SmoothScroll (Lenis), SplitTextReveal,
                         WordReveal, ImageReveal, ParallaxImage, AnimatedDivider, Magnetic, Reveal
src/components/sections  Hero, InstitutionalManifesto, PracticeAreas, PhilosophySection, ThreeScene,
                         About, TeamSection, ArticleGrid, ProcessTimeline, ContactSection
src/components/three     SculptureScene (chunk separado, carregado sob demanda)
src/components/ui        Img, Drawer, ContactForm, ContactDrawer, PageHero, Monogram
src/pages                Home, AreaPage, ArticlesPage, ArticlePage, ProfilePage, ContactPage,
                         PrivacyPage, LegalNoticePage, NotFound (rotas internas com lazy loading)
tools/                   Gerador de renders (Three.js) e testes Playwright
```

## Imagens

Renders digitais originais gerados em código (`tools/render/`), sem fotografias de terceiros, de pessoas reais ou de locais reais. Os retratos são silhuetas ilustrativas.
