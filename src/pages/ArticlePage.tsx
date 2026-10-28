import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { articles, formatDate, getArticle, readingTime } from '../data/articles';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/motion/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

export default function ArticlePage() {
  const { slug = '' } = useParams();
  const a = getArticle(slug);
  usePageMeta(a ? a.title.replace(/[.]$/, '') : 'Artigo não encontrado', a?.excerpt);
  if (!a) return <NotFound />;
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const words = a.title.split(' '); const mid = Math.ceil(words.length / 2);
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <PageHero image={a.image.name} alt={a.image.alt} eyebrow={a.category} title={`${words.slice(0, mid).join(' ')}\n${words.slice(mid).join(' ')}`} back={{ to: '/artigos', label: 'Todos os artigos' }}>
        <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
          <div><dt className="label text-paper/50">Publicação</dt><dd className="num mt-1">{formatDate(a.date)} <span className="text-paper/50">(demonstrativa)</span></dd></div>
          <div><dt className="label text-paper/50">Leitura</dt><dd className="num mt-1">{readingTime(a)} min</dd></div>
        </dl>
      </PageHero>
      <article data-tone="light" className="grain relative bg-paper py-[clamp(80px,12vh,150px)] text-ink">
        <div className="px-site grid grid-cols-12 gap-x-6">
          <aside className="col-span-12 mb-10 md:col-span-3 md:mb-0">
            <div className="md:sticky md:top-28"><p className="label text-mineral">Conteúdo informativo</p><p className="mt-3 max-w-[28ch] text-xs text-ink/55">Não constitui aconselhamento jurídico. Cada situação exige análise própria.</p></div>
          </aside>
          <Reveal className="prose-law col-span-12 max-w-[68ch] text-[1.06rem] text-ink/85 md:col-span-8 md:col-start-5">
            <p data-reveal className="lead !mt-0 text-ink">{a.excerpt}</p>
            {a.body.map((b, i) => b.type === 'h2' ? <h2 key={i} data-reveal>{b.text}</h2> : b.type === 'ul' ? <ul key={i} data-reveal>{b.items.map((it) => <li key={it}>{it}</li>)}</ul> : <p key={i} data-reveal>{b.text}</p>)}
          </Reveal>
        </div>
      </article>
      <section data-tone="dark" className="bg-ink py-20 text-paper" aria-label="Outros artigos">
        <div className="px-site grid gap-10 md:grid-cols-2">
          {others.map((o) => (
            <Link key={o.slug} to={`/artigos/${o.slug}`} data-cursor="Ler artigo" className="group border-t border-paper/15 pt-6">
              <span className="label text-gold">{o.category}</span>
              <span className="display mt-3 flex items-start justify-between gap-4 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-tight">{o.title}<ArrowUpRight size={22} strokeWidth={1} className="mt-2 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
