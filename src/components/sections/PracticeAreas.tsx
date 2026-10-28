import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { areas } from '../../data/areas';
import { img } from '../../lib/assets';
import { SplitTextReveal } from '../motion/SplitTextReveal';
import { useFinePointer, useReducedMotion } from '../../hooks/useMedia';

/**
 * Lista vertical com numeração gigante. No desktop, uma imagem contextual segue o cursor
 * e o número decorativo reage ao movimento do mouse. No toque, cada item mostra sua imagem.
 */
export function PracticeAreas() {
  const ref = useRef<HTMLElement>(null);
  const floating = useRef<HTMLDivElement>(null);
  const bigNum = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      gsap.fromTo(q('[data-a-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE.inOut, stagger: 0.09, scrollTrigger: { trigger: q('[data-a-list]')[0], start: 'top 80%', once: true } });
      gsap.from(q('[data-a-row]'), { yPercent: 40, autoAlpha: 0, duration: 1.1, ease: EASE.out, stagger: 0.08, scrollTrigger: { trigger: q('[data-a-list]')[0], start: 'top 78%', once: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  // imagem flutuante + número decorativo seguem o mouse (desktop)
  useEffect(() => {
    if (!fine || reduced) return;
    const sec = ref.current!, f = floating.current!, n = bigNum.current!;
    const fx = gsap.quickTo(f, 'x', { duration: 0.7, ease: 'power3' }), fy = gsap.quickTo(f, 'y', { duration: 0.7, ease: 'power3' });
    const nx = gsap.quickTo(n, 'x', { duration: 1.4, ease: 'power3' }), ny = gsap.quickTo(n, 'y', { duration: 1.4, ease: 'power3' });
    const move = (e: PointerEvent) => {
      fx(e.clientX + 32); fy(e.clientY - 150);
      nx((e.clientX / innerWidth - 0.5) * -60); ny((e.clientY / innerHeight - 0.5) * -40);
    };
    sec.addEventListener('pointermove', move);
    return () => sec.removeEventListener('pointermove', move);
  }, [fine, reduced]);

  useEffect(() => {
    const f = floating.current; if (!f || !fine) return;
    gsap.to(f, { autoAlpha: active === null ? 0 : 1, scale: active === null ? 0.85 : 1, duration: 0.5, ease: EASE.soft });
    f.querySelectorAll<HTMLElement>('[data-f-img]').forEach((el, i) => gsap.to(el, { clipPath: i === active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', duration: 0.7, ease: EASE.inOut }));
  }, [active, fine]);

  return (
    <section ref={ref} id="areas" tabIndex={-1} data-tone="dark" className="grain relative overflow-hidden bg-ink py-[clamp(110px,16vh,200px)] text-paper outline-none" aria-labelledby="areas-title" onPointerLeave={() => setActive(null)}>
      <span ref={bigNum} aria-hidden="true" className="pointer-events-none absolute right-[-2vw] top-[8vh] font-serif text-[clamp(10rem,30vw,32rem)] font-light leading-none text-[rgba(244,241,234,0.04)] transition-opacity">
        {active === null ? '§' : areas[active].index}
      </span>
      <div className="px-site relative grid grid-cols-12 gap-x-6 gap-y-8">
        <p className="label col-span-12 flex gap-4 text-gold md:col-span-2 md:pt-4"><span className="num">02</span> Atuação</p>
        <div className="col-span-12 md:col-span-7">
          <SplitTextReveal id="areas-title" text={'Áreas de\natuação'} className="display h-xl uppercase" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case [&:nth-child(2)]:text-champagne" />
        </div>
        <p className="col-span-12 self-end text-paper/65 md:col-span-3">Conhecimento jurídico aplicado a diferentes necessidades.</p>
      </div>

      <ol data-a-list className="px-site relative mt-[clamp(56px,9vh,110px)]">
        {areas.map((a, i) => {
          const on = active === i;
          return (
            <li key={a.slug} className="relative">
              <div data-a-rule className="h-px origin-left bg-paper/15" aria-hidden="true" />
              <div data-a-row>
                <Link
                  to={`/areas/${a.slug}`}
                  data-cursor="Explorar"
                  onMouseEnter={() => fine && setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 py-6 md:grid-cols-[9rem_1fr_minmax(0,30rem)_auto] md:items-center md:gap-x-8 md:py-9"
                >
                  <span className={`num font-serif text-[clamp(2.4rem,6vw,6.4rem)] font-light leading-[0.8] transition-colors duration-500 ${on ? 'text-gold' : 'text-paper/25'}`}>{a.index}</span>
                  <span className={`display text-[clamp(1.8rem,4.2vw,4.6rem)] leading-[1] transition-transform duration-700 ease-out ${on ? 'translate-x-3 italic' : ''}`}>{a.title}</span>
                  <span className={`col-span-3 col-start-1 mt-4 grid text-sm text-paper/70 transition-[grid-template-rows,opacity] duration-700 ease-out md:col-span-1 md:col-start-3 md:mt-0 ${fine ? (on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0') : ''}`}>
                    <span className="overflow-hidden">{a.short}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" size={26} strokeWidth={1} className={`row-start-1 transition-transform duration-500 md:col-start-4 ${on ? 'translate-x-1 -translate-y-1 text-gold' : 'text-paper/50'}`} />
                  {!fine && (
                    <span className="col-span-3 mt-5 block aspect-[16/9] overflow-hidden">
                      <img src={img(a.image.name).small} alt="" loading="lazy" className="h-full w-full object-cover grayscale-[40%]" />
                    </span>
                  )}
                </Link>
              </div>
            </li>
          );
        })}
        <li aria-hidden="true"><div data-a-rule className="h-px origin-left bg-paper/15" /></li>
      </ol>

      {fine && (
        <div ref={floating} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 h-[300px] w-[240px] overflow-hidden opacity-0">
          {areas.map((a) => (
            <div key={a.slug} data-f-img className="absolute inset-0" style={{ clipPath: 'inset(100% 0% 0% 0%)' }}>
              <img src={img(a.image.name).small} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
