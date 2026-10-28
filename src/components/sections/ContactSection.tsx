import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { SplitTextReveal } from '../motion/SplitTextReveal';
import { Magnetic } from '../motion/Magnetic';
import { Reveal } from '../motion/Reveal';
import { ContactForm } from '../ui/ContactForm';
import { useScroll } from '../motion/SmoothScroll';

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { scrollTo } = useScroll();
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(ref.current!.querySelectorAll('[data-grid-v]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 15%', scrub: true } });
      gsap.fromTo(ref.current!.querySelector('[data-glow]'), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  const toForm = () => { scrollTo('#form-contato', { offset: -100 }); window.setTimeout(() => document.getElementById('home-nome')?.focus({ preventScroll: true }), 900); };

  return (
    <section ref={ref} id="contato" tabIndex={-1} data-tone="dark" className="grain relative overflow-hidden bg-[#0b0d0c] py-[clamp(120px,18vh,220px)] text-paper outline-none" aria-labelledby="contato-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[12, 50, 88].map((l) => <span key={l} data-grid-v className="absolute bottom-0 top-0 w-px origin-top bg-[rgba(244,241,234,0.06)]" style={{ left: `${l}%` }} />)}
        <div data-glow className="absolute left-1/2 top-[18%] h-[60vmax] w-[60vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(178,154,104,.10),transparent)]" />
      </div>
      <div className="px-site relative grid grid-cols-12 gap-x-6 gap-y-12">
        <p className="label col-span-12 flex gap-4 text-gold"><span className="num">09</span> Contato</p>
        <SplitTextReveal id="contato-title" text={'Questões importantes\nmerecem atenção.'} className="display h-xl col-span-12 uppercase" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case [&:nth-child(2)]:text-champagne [&:nth-child(2)]:md:pl-[10vw]" stagger={0.14} />
        <Reveal className="col-span-12 grid content-start gap-8 md:col-span-4">
          <p data-reveal className="lead text-paper/80">Entre em contato para obter informações sobre o atendimento do escritório.</p>
          <div data-reveal className="flex flex-wrap gap-3">
            <Magnetic><button type="button" onClick={() => navigate('/contato')} className="btn btn-light"><span>Informações de contato</span></button></Magnetic>
            <Magnetic><button type="button" onClick={toForm} className="btn btn-gold"><span>Enviar mensagem</span><ArrowRight size={16} strokeWidth={1.5} /></button></Magnetic>
          </div>
          <p data-reveal className="text-xs leading-relaxed text-paper/45">O envio de mensagem não estabelece relação de prestação de serviços. Evite compartilhar documentos ou informações sigilosas neste primeiro contato.</p>
        </Reveal>
        <div id="form-contato" className="col-span-12 border-t border-paper/10 pt-10 md:col-span-7 md:col-start-6 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <ContactForm prefix="home" onOpenPrivacy={() => navigate('/privacidade')} />
        </div>
      </div>
    </section>
  );
}
