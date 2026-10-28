import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { areas, getArea } from '../data/areas';
import { articles } from '../data/articles';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedDivider } from '../components/motion/AnimatedDivider';
import { usePageMeta } from '../hooks/usePageMeta';
import { useUI } from '../lib/ui';
import NotFound from './NotFound';

export default function AreaPage() {
  const { slug = '' } = useParams();
  const a = getArea(slug);
  const { openContact } = useUI();
  usePageMeta(a ? a.title : 'Área não encontrada', a ? `${a.title}: ${a.short}` : undefined);
  if (!a) return <NotFound />;
  const idx = areas.indexOf(a);
  const next = areas[(idx + 1) % areas.length];
  const related = articles.filter((x) => x.category.includes(a.title.replace('Direito ', '')) || a.title.includes(x.category.replace('Direito ', '')));

  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <PageHero image={a.image.name} alt={a.image.alt} eyebrow={`Área ${a.index} / 06`} title={a.title.replace(' e ', '\ne ').replace('Direito ', 'Direito\n')} back={{ to: '/', label: 'Áreas de atuação', state: { scrollTo: 'areas' } }}>
        <p className="lead max-w-[60ch] text-paper/85">{a.short}</p>
      </PageHero>

      <section data-tone="light" className="grain relative bg-paper py-[clamp(90px,14vh,170px)] text-ink">
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-14">
          <p className="label col-span-12 text-mineral md:col-span-3">Visão geral</p>
          <Reveal className="col-span-12 grid gap-6 md:col-span-8">
            {a.overview.map((p) => <p key={p} data-reveal className="display text-[clamp(1.5rem,2.4vw,2.3rem)] leading-[1.25]">{p}</p>)}
          </Reveal>
        </div>
        <div className="px-site my-[clamp(56px,9vh,110px)]"><AnimatedDivider gold mode="scrub" /></div>
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-14">
          <div className="col-span-12 md:col-span-5">
            <h2 className="label mb-6 text-mineral">Temas frequentes</h2>
            <Reveal as="ul" className="border-t border-line">
              {a.topics.map((t, i) => <li key={t} data-reveal className="grid grid-cols-[3rem_1fr] border-b border-line py-4"><span className="num text-gold">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
            </Reveal>
          </div>
          <div className="col-span-12 grid content-start gap-12 md:col-span-6 md:col-start-7">
            <div>
              <h2 className="label mb-6 text-mineral">Como a atuação costuma ser organizada</h2>
              <Reveal as="ol" className="grid gap-5">
                {a.approach.map((t, i) => <li key={t} data-reveal className="flex gap-5"><span className="display num text-3xl text-gold">{i + 1}</span><span className="pt-2 text-ink/80">{t}</span></li>)}
              </Reveal>
            </div>
            <div className="border border-line p-6">
              <h2 className="label mb-4 text-mineral">Para um primeiro contato, basta informar</h2>
              <ul className="grid gap-2 text-sm text-ink/80">{a.firstContact.map((t) => <li key={t}>— {t}</li>)}</ul>
              <p className="mt-4 text-xs text-ink/55">Não é necessário enviar documentos nesta etapa.</p>
              <button type="button" onClick={openContact} className="btn btn-dark mt-6"><span>Enviar mensagem</span></button>
            </div>
          </div>
        </div>
        <p className="px-site mt-20 max-w-[80ch] text-xs text-ink/55">Conteúdo de caráter informativo, que não substitui a análise individual de cada situação e não representa promessa de resultado.</p>
      </section>

      {related.length > 0 && (
        <section data-tone="dark" className="bg-graphite py-20 text-paper">
          <div className="px-site flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="label text-gold">Leitura relacionada</h2>
            {related.map((r) => <Link key={r.slug} to={`/artigos/${r.slug}`} className="display group flex items-center gap-3 text-[clamp(1.5rem,2.6vw,2.4rem)]">{r.title}<ArrowUpRight size={22} strokeWidth={1} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>)}
          </div>
        </section>
      )}

      <section data-tone="dark" className="bg-ink text-paper" aria-label="Próxima área">
        <Link to={`/areas/${next.slug}`} data-cursor="Explorar" className="group px-site flex flex-wrap items-end justify-between gap-6 border-t border-paper/10 py-[clamp(72px,12vh,140px)]">
          <span><span className="label text-gold">Próxima área · {next.index}</span><span className="display h-lg mt-3 block group-hover:italic">{next.title}</span></span>
          <ArrowUpRight size={48} strokeWidth={0.8} className="transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" />
        </Link>
      </section>
    </main>
  );
}
