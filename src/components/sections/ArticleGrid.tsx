import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { articles, formatDate, readingTime } from '../../data/articles';
import { Img } from '../ui/Img';
import { SplitTextReveal } from '../motion/SplitTextReveal';

// grade editorial assimétrica: posições por índice
const layout = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-8 md:col-start-3',
];
const ratios = ['aspect-[4/5] md:aspect-[5/6]', 'aspect-[16/10]', 'aspect-[16/10]', 'aspect-[21/9]'];

export function ArticleGrid({ showHeader = true }: { showHeader?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      ref.current!.querySelectorAll<HTMLElement>('[data-art]').forEach((a) => {
        gsap.from(a.querySelectorAll('[data-a-txt]'), { y: 24, autoAlpha: 0, duration: 1, ease: EASE.soft, stagger: 0.06, scrollTrigger: { trigger: a, start: 'top 85%', once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="conteudo" tabIndex={-1} data-tone="light" className="grain relative bg-paper py-[clamp(110px,16vh,200px)] text-ink outline-none" aria-labelledby="conteudo-title">
      {showHeader && (
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8">
          <p className="label col-span-12 flex gap-4 text-mineral md:col-span-2 md:pt-4"><span className="num">07</span> Conteúdo</p>
          <SplitTextReveal id="conteudo-title" text={'Conhecimento\ne informação.'} className="display h-lg col-span-12 uppercase md:col-span-7" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case" />
          <div className="col-span-12 flex flex-col justify-end gap-4 md:col-span-3">
            <p className="text-sm text-ink/65">Artigos informativos. Não constituem aconselhamento jurídico para casos específicos.</p>
            <Link to="/artigos" className="link-u label w-fit">Ver todos os artigos</Link>
          </div>
        </div>
      )}
      <ul className="px-site mt-[clamp(56px,9vh,110px)] grid gap-x-8 gap-y-16 md:grid-cols-12">
        {articles.map((a, i) => (
          <li key={a.slug} data-art className={layout[i % layout.length]}>
            <Link to={`/artigos/${a.slug}`} data-cursor="Ler artigo" className="group block">
              <div className="relative overflow-hidden">
                <Img name={a.image.name} alt={a.image.alt} parallax={6} className={`${ratios[i % ratios.length]} w-full`} imgClassName="transition-[transform,filter] duration-[1.4s] ease-out group-hover:scale-[1.06] group-hover:brightness-110" sizes="(min-width: 768px) 60vw, 100vw" />
                {/* cortina diagonal discreta no hover */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/35 transition-[clip-path] duration-700 ease-nord [clip-path:polygon(0_0,0_0,0_100%,0_100%)] group-hover:[clip-path:polygon(0_0,18%_0,8%_100%,0_100%)]" />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/60" data-a-txt>
                <span className="label text-ink">{a.category}</span>
                <span className="num">{formatDate(a.date)}</span>
                <span className="num">{readingTime(a)} min de leitura</span>
              </div>
              <h3 data-a-txt className="display mt-3 flex items-start justify-between gap-4 text-[clamp(1.7rem,2.6vw,2.8rem)] leading-[1.05]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]">{a.title}</span>
                <ArrowUpRight aria-hidden="true" size={24} strokeWidth={1} className="mt-2 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </h3>
              <p data-a-txt className="mt-3 max-w-[56ch] text-sm text-ink/65">{a.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="px-site mt-16 text-xs text-ink/45">Datas editoriais demonstrativas.</p>
    </section>
  );
}
