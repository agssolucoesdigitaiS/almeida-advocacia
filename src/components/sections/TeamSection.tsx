import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { team } from '../../data/content';
import { Img } from '../ui/Img';
import { SplitTextReveal } from '../motion/SplitTextReveal';

export function TeamSection() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      ref.current!.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
        gsap.from(card.querySelectorAll('[data-t-line]'), { yPercent: 110, duration: 1.1, ease: EASE.out, stagger: 0.06, scrollTrigger: { trigger: card, start: 'top 82%', once: true } });
      });
    });
    mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
      // deslocamento vertical diferente por coluna (parallax multicamadas)
      ref.current!.querySelectorAll<HTMLElement>('[data-card]').forEach((card, i) => {
        gsap.fromTo(card, { y: [60, 140, 20][i] ?? 0 }, { y: [-30, -80, -10][i] ?? 0, ease: 'none', scrollTrigger: { trigger: ref.current!.querySelector('[data-grid]'), start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="equipe" tabIndex={-1} data-tone="dark" className="grain relative overflow-hidden bg-ink py-[clamp(110px,16vh,200px)] text-paper outline-none" aria-labelledby="equipe-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8">
        <p className="label col-span-12 flex gap-4 text-gold md:col-span-2 md:pt-4"><span className="num">06</span> Equipe</p>
        <SplitTextReveal id="equipe-title" text={'Profissionais\ne atuação.'} className="display h-xl col-span-12 uppercase md:col-span-7" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case [&:nth-child(2)]:text-champagne" />
        <p className="col-span-12 self-end border-l border-gold/60 pl-4 text-sm text-paper/65 md:col-span-3">
          Perfis ilustrativos. Nomes, imagens e descrições não representam profissionais verificados e devem ser substituídos antes da publicação.
        </p>
      </div>

      <ul data-grid className="px-site mt-[clamp(64px,10vh,120px)] grid gap-16 md:grid-cols-3 md:gap-8">
        {team.map((m) => {
          const content = (
            <>
              <div className="relative overflow-hidden">
                <Img
                  name={m.image.name}
                  alt={m.image.alt}
                  parallax={7}
                  className="aspect-[4/5] w-full"
                  imgClassName="grayscale transition-[filter,transform] duration-[1.2s] ease-out group-hover:grayscale-0 group-hover:scale-[1.04] group-focus-visible:grayscale-0"
                  sizes="(min-width: 768px) 32vw, 100vw"
                />
                {/* enquadramento cinematográfico no hover */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[9%] origin-top scale-y-0 bg-ink transition-transform duration-700 ease-nord group-hover:scale-y-100" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[9%] origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-nord group-hover:scale-y-100" />
                <span className="demo-tag absolute left-4 top-4 bg-ink/60 text-paper/80 backdrop-blur-sm">Perfil ilustrativo</span>
              </div>
              <div className="mt-6 grid gap-2">
                <h3 className="display text-[clamp(1.9rem,2.6vw,2.7rem)] leading-none"><span className="line-mask"><span data-t-line>{m.name}</span></span></h3>
                <p className="label text-gold"><span className="line-mask"><span data-t-line>{m.role}</span></span></p>
                <p className="mt-2 max-w-[40ch] text-sm text-paper/65">{m.bio}</p>
                {m.profileEnabled && <span className="label mt-3 inline-flex items-center gap-2 text-paper/80 group-hover:text-paper">Ver perfil <ArrowUpRight size={14} strokeWidth={1.4} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>}
              </div>
            </>
          );
          return (
            <li key={m.slug} data-card>
              {m.profileEnabled
                ? <Link to={`/equipe/${m.slug}`} data-cursor="Explorar" className="group block">{content}</Link>
                : <div className="group">{content}</div>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
