import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { useUI } from '../../lib/ui';
import { Img } from '../ui/Img';
import { Magnetic } from '../motion/Magnetic';
import { site } from '../../data/site';

export const HERO_IMAGE = 'hero-biblioteca';
const WORDS = ['Conhecimento.', 'Estratégia.', 'Compromisso.'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const { ready, goToSection } = useUI();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      // abertura: foto 1.15 → 1, palavras em tempos diferentes, subtítulo, botões, indicador
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
      tl.fromTo(q('[data-h-scale]'), { scale: 1.15 }, { scale: 1, duration: 2.8, ease: 'expo.out' })
        .fromTo(q('[data-h-word]')[0], { yPercent: 115 }, { yPercent: 0, duration: 1.5 }, 0.2)
        .fromTo(q('[data-h-word]')[1], { yPercent: 115 }, { yPercent: 0, duration: 1.5 }, 0.42)
        .fromTo(q('[data-h-word]')[2], { yPercent: 115 }, { yPercent: 0, duration: 1.6 }, 0.72)
        .fromTo(q('[data-h-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: EASE.inOut }, 0.6)
        .fromTo(q('[data-h-sub]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 1.1)
        .fromTo(q('[data-h-btn]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 1.4)
        .fromTo(q('[data-h-cue]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.8);
      intro.current = tl;

      // saída: a fotografia se recolhe para um quadro vertical central, conectando ao manifesto
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
        .to(q('[data-h-media]'), { clipPath: 'inset(6% 22% 0% 22%)', ease: 'none' }, 0)
        .to(q('[data-h-img]'), { scale: 1.14, yPercent: 10, ease: 'none' }, 0)
        .to(q('[data-h-word]'), { yPercent: (i) => -30 - i * 18, ease: 'none' }, 0)
        .to(q('[data-h-fade]'), { autoAlpha: 0, y: -40, ease: 'none' }, 0);
      return () => { intro.current = null; };
    });
    return () => mm.revert();
  }, { scope: ref });

  useGSAP(() => { if (ready) intro.current?.play(); }, { dependencies: [ready] });

  return (
    <section ref={ref} id="inicio" tabIndex={-1} data-tone="dark" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-paper outline-none" aria-labelledby="hero-title">
      <div data-h-media className="absolute inset-0" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
        <div data-h-img className="absolute inset-0">
          <div data-h-scale className="absolute inset-0">
            <Img name={HERO_IMAGE} alt="Imagem ilustrativa de biblioteca jurídica: estantes com códigos e obras de doutrina, mesa de trabalho com documentos e luminária acesa." reveal="none" priority className="h-full w-full" imgClassName="object-[35%_50%]" />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,19,17,.86)_0%,rgba(16,19,17,.45)_55%,rgba(16,19,17,.2)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,19,17,.55)_0%,rgba(16,19,17,0)_30%,rgba(16,19,17,0)_60%,rgba(16,19,17,.85)_100%)]" />
      </div>

      <div className="px-site relative flex h-full flex-col justify-end" style={{ paddingBottom: 'calc(30px + env(safe-area-inset-bottom, 0px))' }}>
        <p data-h-fade className="label absolute left-0 right-0 top-0 hidden px-site text-paper/60 md:flex md:justify-between" style={{ paddingTop: 'calc(112px + env(safe-area-inset-top, 0px))' }}>
          <span>Advocacia consultiva e contenciosa</span><span>{site.city}</span>
        </p>

        <h1 id="hero-title" className="display uppercase text-[clamp(2.7rem,9.6vw,11.5rem)] leading-[0.88]">
          <span className="sr-only">Conhecimento. Estratégia. Compromisso.</span>
          <span aria-hidden="true">
            {WORDS.map((w, i) => (
              <span key={w} className={`line-mask ${i === 1 ? 'pl-[8vw] italic normal-case text-champagne' : ''} ${i === 2 ? 'pl-[3vw]' : ''}`}>
                <span data-h-word>{w}</span>
              </span>
            ))}
          </span>
        </h1>

        <div data-h-rule className="mt-8 h-px origin-left bg-gold/70" />
        <div data-h-fade className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <p data-h-sub className="lead col-span-12 max-w-[44ch] text-paper/85 md:col-span-6">
            Atuação jurídica consultiva e contenciosa, com atenção às particularidades de cada situação.
          </p>
          <div className="col-span-12 flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end">
            <span data-h-btn><Magnetic><button type="button" onClick={() => goToSection('manifesto')} className="btn btn-light"><span>Conheça o escritório</span></button></Magnetic></span>
            <span data-h-btn><Magnetic><button type="button" onClick={() => goToSection('areas')} className="btn btn-gold"><span>Áreas de atuação</span></button></Magnetic></span>
            <button data-h-cue type="button" onClick={() => goToSection('manifesto')} aria-label="Rolar para a próxima seção" className="ml-2 hidden h-14 items-center gap-3 md:flex">
              <span className="relative block h-12 w-px overflow-hidden bg-paper/20"><span className="scroll-cue absolute inset-0 bg-gold" /></span>
              <ArrowDown size={14} strokeWidth={1.25} className="text-paper/70" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
