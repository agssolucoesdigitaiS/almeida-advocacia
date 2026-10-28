import { useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../../lib/gsap';
import { pillars } from '../../data/content';
import { Img } from '../ui/Img';
import { SplitTextReveal } from '../motion/SplitTextReveal';
import { useReducedMotion } from '../../hooks/useMedia';

/**
 * Experiência sticky: os três pilares entram progressivamente; o número ativo cresce
 * e sua linha lateral muda para dourado. Imagens com parallax em camada separada.
 */
export function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      const st = ScrollTrigger.create({
        trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (s) => { const i = Math.min(pillars.length - 1, Math.floor(s.progress * pillars.length * 0.999)); setActive((p) => (p === i ? p : i)); },
      });
      // imagens: troca por máscara + parallax próprio
      const imgs = q('[data-p-img]');
      const tl = gsap.timeline({ scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      imgs.forEach((el, i) => {
        if (i > 0) tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, i - 0.5);
        tl.fromTo(el.querySelector('img'), { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.02, ease: 'none', duration: 1.6 }, Math.max(0, i - 0.6));
      });
      gsap.fromTo(q('[data-p-progress]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: true } });
      return () => st.kill();
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="filosofia" tabIndex={-1} data-tone="dark" className="grain relative bg-graphite text-paper outline-none" aria-labelledby="filosofia-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8 pb-14 pt-[clamp(110px,16vh,200px)]">
        <p className="label col-span-12 flex gap-4 text-gold md:col-span-2 md:pt-4"><span className="num">03</span> Filosofia</p>
        <SplitTextReveal id="filosofia-title" text={'Rigor na análise.\nClareza na condução.'} className="display h-xl col-span-12 uppercase md:col-span-10" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case [&:nth-child(2)]:text-champagne" stagger={0.14} />
      </div>

      <div ref={track} className="relative" style={{ height: reduced ? 'auto' : '300vh' }}>
        <div className={`${reduced ? '' : 'sticky top-0 h-[100svh]'} overflow-hidden`}>
          <div className="px-site grid h-full grid-cols-12 content-center items-center gap-x-6 gap-y-8 py-16 md:py-0">
            <div className="relative col-span-12 aspect-[16/10] w-full overflow-hidden md:hidden" aria-hidden="true">
              <Img key={active} name={pillars[active].image.name} alt="" reveal={reduced ? 'none' : 'clip'} className="h-full w-full" sizes="100vw" />
            </div>
            <ol className="relative col-span-12 grid gap-8 md:col-span-6 md:gap-12" aria-label="Pilares de trabalho">
              <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 hidden w-px bg-paper/10 md:block"><span data-p-progress className="absolute inset-0 origin-top bg-gold/70" /></span>
              {pillars.map((p, i) => {
                const on = reduced || active === i;
                return (
                  <li key={p.index} aria-current={active === i ? 'step' : undefined} className={`relative grid grid-cols-[auto_1fr] items-start gap-x-6 transition-opacity duration-700 md:pl-10 ${on ? 'opacity-100' : 'opacity-35'}`}>
                    <span aria-hidden="true" className={`absolute left-0 top-0 hidden h-full w-[2px] transition-colors duration-700 md:block ${on ? 'bg-gold' : 'bg-transparent'}`} />
                    <span className={`num font-serif font-light leading-[0.8] transition-all duration-700 ease-out ${on ? 'text-[clamp(3.6rem,7vw,7rem)] text-gold' : 'text-[clamp(2.4rem,4vw,4rem)] text-paper/40'}`}>{p.index}</span>
                    <div className="pt-2">
                      <h3 className="display text-[clamp(1.9rem,3.2vw,3.2rem)] leading-none">{p.title}</h3>
                      <p className={`mt-4 max-w-[38ch] text-paper/75 transition-all duration-700 ${on ? 'translate-y-0' : 'translate-y-2'}`}>{p.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="relative col-span-12 hidden aspect-[3/4] max-h-[78svh] w-full md:col-span-5 md:col-start-8 md:block">
              {pillars.map((p, i) => (
                <div key={p.index} data-p-img className="absolute inset-0 overflow-hidden" style={{ clipPath: i === 0 || reduced ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', zIndex: i }}>
                  <Img name={p.image.name} alt={active === i ? p.image.alt : ''} reveal="none" className="h-full w-full" sizes="40vw" />
                </div>
              ))}
              <span className="label absolute -bottom-8 left-0 text-mineral">Pilar {pillars[active].index} / 03</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
