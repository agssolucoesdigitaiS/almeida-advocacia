import { useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { img, preloadImage } from '../../lib/assets';
import { useReducedMotion } from '../../hooks/useMedia';
import { Monogram } from '../ui/Monogram';

const NAME = 'ALMEIDA ADVOCACIA';

/**
 * Preloader cinematográfico. O progresso (linha dourada) reflete apenas recursos críticos
 * realmente carregados: imagem do hero e fontes de exibição. Limite máximo de 6 s.
 */
export function Preloader({ onDone, heroImage }: { onDone: () => void; heroImage: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const el = root.current!;
    if (!reduced) {
      gsap.fromTo(el.querySelectorAll('[data-mono-draw]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.12 });
      gsap.fromTo(el.querySelectorAll('[data-pl-char]'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: EASE.out, stagger: 0.035, delay: 0.35 });
    }
    const src = window.innerWidth > 1100 ? img(heroImage).src : img(heroImage).small;
    const tasks: Promise<unknown>[] = [
      preloadImage(src),
      document.fonts?.load('300 64px "Cormorant Garamond"') ?? Promise.resolve(),
      document.fonts?.load('500 16px "Manrope Variable"') ?? Promise.resolve(),
      document.fonts?.ready ?? Promise.resolve(),
    ];
    let done = 0;
    tasks.forEach((t) => t.catch(() => null).finally(() => { done++; if (!cancelled) setProgress(done / tasks.length); }));
    const all = Promise.all(tasks.map((t) => t.catch(() => null)));
    const timeout = new Promise((r) => setTimeout(r, 6000));
    const minimum = new Promise((r) => setTimeout(r, reduced ? 0 : 1500));

    Promise.all([Promise.race([all, timeout]), minimum]).then(() => {
      if (cancelled) return;
      setProgress(1);
      if (reduced) { setGone(true); onDone(); return; }
      gsap.timeline({ delay: 0.35, onComplete: () => setGone(true) })
        .to(el.querySelectorAll('[data-pl-char]'), { yPercent: -110, duration: 0.6, ease: 'power3.in', stagger: 0.015 })
        .to(el.querySelector('[data-pl-mono]'), { autoAlpha: 0, scale: 0.94, duration: 0.6 }, 0)
        .to(el.querySelector('[data-pl-top]'), { yPercent: -100, duration: 1.1, ease: EASE.inOut }, 0.45)
        .to(el.querySelector('[data-pl-bottom]'), { yPercent: 100, duration: 1.1, ease: EASE.inOut }, 0.45)
        .to(el.querySelector('[data-pl-line]'), { scaleX: 0, duration: 0.6, ease: EASE.inOut }, 0.4)
        .add(() => onDone(), 0.8);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  const pct = Math.round(progress * 100);
  return (
    <div ref={root} className="fixed inset-0 z-[200]" role="status" aria-live="polite" aria-label={`Carregando ${pct}%`}>
      <div data-pl-top className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-pl-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div className="relative grid h-full place-items-center px-site text-paper">
        <div className="flex flex-col items-center gap-8">
          <div data-pl-mono><Monogram draw className="w-24 text-paper md:w-28" /></div>
          <p className="flex overflow-hidden font-serif text-[clamp(1.4rem,3.4vw,2.6rem)] font-light tracking-[0.32em]" aria-hidden="true">
            {NAME.split('').map((c, i) => <span key={i} data-pl-char className="inline-block">{c === ' ' ? ' ' : c}</span>)}
          </p>
          <div className="relative h-px w-[min(420px,70vw)] bg-paper/10">
            <div data-pl-line className="absolute inset-0 origin-center bg-gold" style={{ transform: `scaleX(${progress})`, transition: 'transform .7s cubic-bezier(.16,1,.3,1)' }} />
          </div>
          <span className="label num text-mineral">{String(pct).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
}
