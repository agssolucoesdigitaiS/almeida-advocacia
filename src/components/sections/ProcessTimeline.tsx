import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { steps } from '../../data/content';
import { SplitTextReveal } from '../motion/SplitTextReveal';

/**
 * Timeline com linha vertical de progresso desenhada pelo scroll e transformação
 * do fundo: de off-white para grafite conforme as etapas avançam.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      gsap.fromTo(ref.current, { backgroundColor: '#f4f1ea', color: '#101311' }, { backgroundColor: '#1c211e', color: '#f4f1ea', ease: 'none', scrollTrigger: { trigger: q('[data-list]')[0], start: 'top 40%', end: 'center 40%', scrub: true, onUpdate: (s) => { ref.current!.dataset.tone = s.progress > 0.5 ? 'dark' : 'light'; } } });
      gsap.fromTo(q('[data-progress]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('[data-list]')[0], start: 'top 60%', end: 'bottom 60%', scrub: true } });
      q('[data-step]').forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none reverse' } });
        tl.fromTo(el.querySelector('[data-num]'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: EASE.out })
          .fromTo(el.querySelector('[data-dot]'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0)
          .fromTo(el.querySelectorAll('[data-txt]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: EASE.soft, stagger: 0.08 }, 0.15);
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="atendimento" tabIndex={-1} data-tone="light" className="relative bg-paper py-[clamp(110px,16vh,200px)] text-ink outline-none" aria-labelledby="atendimento-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8">
        <p className="label col-span-12 flex gap-4 opacity-60 md:col-span-2 md:pt-4"><span className="num">08</span> Atendimento</p>
        <SplitTextReveal id="atendimento-title" text={'Um processo\nbaseado em clareza.'} className="display h-xl col-span-12 uppercase md:col-span-10" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case" />
      </div>
      <ol data-list className="px-site relative mt-[clamp(64px,10vh,120px)] grid gap-[clamp(64px,12vh,150px)]">
        <span aria-hidden="true" className="absolute bottom-0 left-[calc(max(var(--pad-x),env(safe-area-inset-left,0px))+11px)] top-0 w-px bg-current opacity-15 md:left-1/2"><span data-progress className="absolute inset-0 origin-top bg-gold" /></span>
        {steps.map((s, i) => (
          <li key={s.index} data-step className={`relative grid grid-cols-[24px_1fr] gap-x-8 md:grid-cols-2 md:gap-x-24 ${i % 2 ? '' : ''}`}>
            <span data-dot aria-hidden="true" className="relative z-10 mt-6 h-[23px] w-[23px] rounded-full border border-gold bg-gold/90 md:absolute md:left-1/2 md:mt-10 md:-translate-x-1/2" />
            <div className={`col-start-2 md:col-start-auto ${i % 2 ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}>
              <span className="block overflow-hidden"><span data-num className="num block font-serif text-[clamp(4.4rem,10vw,10rem)] font-light leading-[0.9] text-gold">{s.index}</span></span>
              <h3 data-txt className="display mt-2 text-[clamp(2rem,3.4vw,3.4rem)] leading-none">{s.title}</h3>
              <p data-txt className={`mt-4 max-w-[42ch] opacity-75 ${i % 2 ? '' : 'md:ml-auto'}`}>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="px-site mt-20 max-w-[70ch] text-sm opacity-60">As condições de contratação e honorários são tratadas diretamente, de forma individual, após a análise preliminar. Este site não divulga valores.</p>
    </section>
  );
}
