import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../../lib/gsap';
import { sculptureWords } from '../../data/content';
import { useReducedMotion, useMedia } from '../../hooks/useMedia';
import { Img } from '../ui/Img';

const SculptureScene = lazy(() => import('../three/SculptureScene'));
export const SCULPTURE_FALLBACK = 'escultura';

function capability() {
  try {
    const c = document.createElement('canvas');
    const ok = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    const nav = navigator as Navigator & { deviceMemory?: number };
    const low = (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 1;
    return { webgl: ok, low };
  } catch { return { webgl: false, low: true }; }
}

/** Experiência visual 3D: escultura abstrata que se reorganiza com o scroll. */
export function ThreeScene() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const small = useMedia('(max-width: 767px)');
  const [cap, setCap] = useState<{ webgl: boolean; low: boolean } | null>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [word, setWord] = useState(0);
  const [ready, setReady] = useState(false);
  const first = useRef(true);

  useEffect(() => { setCap(capability()); }, []);
  const interactive = !!cap?.webgl && !cap.low && !reduced;

  useEffect(() => {
    if (!interactive || !track.current) return;
    const el = track.current;
    const a = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: '900px 0px' });
    const b = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px 0px' });
    a.observe(el); b.observe(el);
    return () => { a.disconnect(); b.disconnect(); };
  }, [interactive]);

  useGSAP(() => {
    if (!interactive) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const st = ScrollTrigger.create({
        trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (s) => { progress.current = s.progress; const w = s.progress < 0.34 ? 0 : s.progress < 0.68 ? 1 : 2; setWord((p) => (p === w ? p : w)); },
      });
      gsap.fromTo(ref.current!.querySelector('[data-s-bar]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: true } });
      return () => st.kill();
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [interactive] });

  // troca das palavras por máscara
  useEffect(() => {
    if (!interactive || !ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-s-word]');
    items.forEach((el, i) => gsap.to(el, { yPercent: i === word ? 0 : i < word ? -110 : 110, duration: first.current ? 0 : 0.9, ease: 'expo.out', overwrite: true }));
    first.current = false;
  }, [word, interactive]);

  return (
    <section ref={ref} id="experiencia" tabIndex={-1} data-tone="dark" className="relative bg-ink text-paper outline-none" aria-labelledby="exp-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-6 pb-10 pt-[clamp(100px,14vh,180px)]">
        <p className="label col-span-12 flex gap-4 text-gold md:col-span-2"><span className="num">04</span> Composição</p>
        <h2 id="exp-title" className="display h-md col-span-12 max-w-[22ch] md:col-span-6">Equilíbrio, estrutura e ordem, em uma forma.</h2>
        <p className="col-span-12 self-end text-sm text-paper/60 md:col-span-4">Escultura digital abstrata. Role para ver as peças se reorganizarem.</p>
      </div>

      {interactive ? (
        <div ref={track} className="relative" style={{ height: '300vh' }}>
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}><Img name={SCULPTURE_FALLBACK} alt="" reveal="none" className="h-full w-full" /></div>
            {near && (
              <Suspense fallback={null}>
                <SculptureScene progress={progress} running={visible} lite={small} onReady={() => setReady(true)} />
              </Suspense>
            )}
            <div className="px-site pointer-events-none absolute inset-0 flex flex-col justify-end" style={{ paddingBottom: 'calc(36px + env(safe-area-inset-bottom, 0px))' }}>
              <p className="display relative h-[1.05em] overflow-hidden text-[clamp(2.8rem,9vw,10rem)] uppercase leading-none" aria-live="polite">
                {sculptureWords.map((w, i) => (
                  <span key={w} data-s-word aria-hidden={i !== word} className={`absolute left-0 top-0 ${i === 1 ? 'italic normal-case text-champagne' : ''}`}>{w}</span>
                ))}
              </p>
              <div className="mt-6 flex items-center gap-6">
                <span className="label num text-mineral">{String(word + 1).padStart(2, '0')} / 03</span>
                <div className="h-px flex-1 bg-paper/15"><div data-s-bar className="h-full origin-left bg-gold" /></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-site grid grid-cols-12 gap-6 pb-[clamp(96px,14vh,180px)]">
          <Img name={SCULPTURE_FALLBACK} alt="Composição escultórica abstrata: monólito de bronze escovado, blocos de pedra escura e uma viga de aço em equilíbrio sobre um plinto." className="col-span-12 aspect-[16/9] w-full lg:col-span-8" sizes="(min-width: 1024px) 66vw, 100vw" />
          <ul className="col-span-12 grid content-end gap-2 lg:col-span-4">
            {sculptureWords.map((w) => <li key={w} className="display break-words border-t border-paper/15 pt-3 text-[clamp(1.7rem,2.6vw,2.8rem)] uppercase leading-none">{w}</li>)}
            {cap && !cap.webgl && <li className="mt-3 text-xs text-paper/50">Seu navegador não oferece WebGL; exibimos uma imagem da composição.</li>}
          </ul>
        </div>
      )}
    </section>
  );
}
