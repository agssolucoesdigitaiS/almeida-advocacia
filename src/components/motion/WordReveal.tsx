import { useRef, type ElementType } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';

/**
 * Frase revelada palavra por palavra conforme o scroll (scrub, reversível).
 * Texto completo acessível; sem JS ou com movimento reduzido, tudo visível.
 */
export function WordReveal({ text, as: Tag = 'h2', className = '', id, accent = [] }: { text: string; as?: ElementType; className?: string; id?: string; accent?: string[] }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(ref.current!.querySelectorAll('[data-w]'), { opacity: 0.12, yPercent: 18 }, {
        opacity: 1, yPercent: 0, ease: 'none', stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 40%', scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, { scope: ref });
  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((w, i) => (
          <span key={i} data-w className={`inline-block ${accent.includes(w.replace(/[.,]/g, '')) ? 'italic text-gold' : ''}`}>{w}&nbsp;</span>
        ))}
      </span>
    </Tag>
  );
}
