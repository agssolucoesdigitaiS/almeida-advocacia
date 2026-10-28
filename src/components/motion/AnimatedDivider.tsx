import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';

/** Linha fina que se desenha: "once" ao entrar, ou "scrub" acompanhando o scroll. */
export function AnimatedDivider({ gold = false, mode = 'once', className = '', origin = 'left' }: { gold?: boolean; mode?: 'once' | 'scrub'; className?: string; origin?: 'left' | 'center' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const st = mode === 'scrub'
        ? { trigger: ref.current, start: 'top 92%', end: 'top 40%', scrub: true }
        : { trigger: ref.current, start: 'top 92%', once: true };
      gsap.fromTo(ref.current, { scaleX: 0 }, { scaleX: 1, duration: mode === 'once' ? 1.6 : undefined, ease: mode === 'once' ? EASE.inOut : 'none', scrollTrigger: st });
    });
    return () => mm.revert();
  }, { scope: ref });
  return <div ref={ref} aria-hidden="true" className={`h-px w-full ${gold ? 'bg-gold' : 'bg-current opacity-20'} ${className}`} style={{ transformOrigin: `${origin} center` }} />;
}
