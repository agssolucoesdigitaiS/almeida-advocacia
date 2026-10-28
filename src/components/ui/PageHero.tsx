import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { Img } from './Img';

/** Abertura das páginas internas: imagem com scale de entrada, título por linhas e parallax de saída. */
export function PageHero({ image, alt, eyebrow, title, back, children }: { image: string; alt: string; eyebrow: string; title: string; back: { to: string; label: string; state?: unknown }; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      gsap.fromTo(q('[data-ph-scale]'), { scale: 1.15 }, { scale: 1, duration: 2.4, ease: 'expo.out', delay: 0.2 });
      gsap.fromTo(q('[data-ph-line]'), { yPercent: 115 }, { yPercent: 0, duration: 1.4, ease: EASE.out, stagger: 0.09, delay: 0.4 });
      gsap.fromTo(q('[data-ph-fade]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.soft, stagger: 0.07, delay: 0.75 });
      gsap.to(q('[data-ph-img]'), { yPercent: 18, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref });
  const lines = title.split('\n');
  return (
    <section ref={ref} data-tone="dark" className="relative flex min-h-[86svh] flex-col justify-end overflow-hidden bg-ink text-paper">
      <div data-ph-img className="absolute inset-0"><div data-ph-scale className="absolute inset-0"><Img name={image} alt={alt} reveal="none" priority className="h-full w-full" /></div></div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,19,17,.7)_0%,rgba(16,19,17,.35)_45%,rgba(16,19,17,.9)_100%)]" />
      <div className="px-site relative pb-12" style={{ paddingTop: 'calc(120px + env(safe-area-inset-top, 0px))' }}>
        <Link to={back.to} state={back.state} data-ph-fade className="label mb-16 inline-flex items-center gap-2 text-paper/75 hover:text-paper"><ArrowLeft size={14} strokeWidth={1.5} /> {back.label}</Link>
        <p data-ph-fade className="label mb-5 text-gold">{eyebrow}</p>
        <h1 className="display h-xl max-w-[16ch] uppercase">
          <span className="sr-only">{lines.join(' ')}</span>
          <span aria-hidden="true">{lines.map((l, i) => <span key={i} className={`line-mask ${i === 1 ? 'italic normal-case text-champagne' : ''}`}><span data-ph-line>{l}</span></span>)}</span>
        </h1>
        {children && <div data-ph-fade className="mt-10 border-t border-paper/15 pt-6">{children}</div>}
      </div>
    </section>
  );
}
