import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { SplitTextReveal } from '../motion/SplitTextReveal';
import { Reveal } from '../motion/Reveal';
import { Img } from '../ui/Img';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // linha de conexão visual entre as duas imagens, desenhada pelo scroll
      gsap.fromTo(ref.current!.querySelector('[data-connect]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: ref.current!.querySelector('[data-connect-wrap]'), start: 'top 75%', end: 'bottom 55%', scrub: true } });
      gsap.fromTo(ref.current!.querySelector('[data-vert]'), { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="sobre" tabIndex={-1} data-tone="light" className="grain relative overflow-hidden bg-paper py-[clamp(110px,16vh,200px)] text-ink outline-none" aria-labelledby="sobre-title">
      {/* headline vertical */}
      <p data-vert aria-hidden="true" className="pointer-events-none absolute right-[max(16px,2vw)] top-[18%] hidden font-serif text-[clamp(4rem,8vw,9rem)] font-light uppercase leading-none tracking-[0.04em] text-[rgba(16,19,17,0.06)] lg:block" style={{ writingMode: 'vertical-rl' }}>
        Responsabilidade
      </p>
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8">
        <p className="label col-span-12 flex gap-4 text-mineral md:col-span-2 md:pt-4"><span className="num">05</span> O escritório</p>
        <SplitTextReveal id="sobre-title" text={'Uma atuação orientada\npela responsabilidade.'} className="display h-lg col-span-12 uppercase md:col-span-9" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:normal-case" />
      </div>

      <div data-connect-wrap className="px-site relative mt-[clamp(64px,10vh,130px)] grid grid-cols-12 gap-x-6 gap-y-12">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path data-connect d="M 44 30 C 58 30, 52 70, 66 74" pathLength={1} strokeDasharray="1" fill="none" stroke="var(--c-gold)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <figure className="relative col-span-12 md:col-span-6">
          <Img name="escritorio" alt="Sala de trabalho de advogado: mesa de madeira, cadeira de couro, estante com livros jurídicos e janela para a cidade." className="aspect-[4/3] w-full" parallax={6} sizes="(min-width: 768px) 50vw, 100vw" />
          <figcaption className="label mt-4 flex justify-between text-mineral"><span>Sala de trabalho</span><span>Imagem ilustrativa</span></figcaption>
        </figure>
        <Reveal className="relative col-span-12 grid content-start gap-6 md:col-span-4 md:col-start-8 md:pt-6">
          <p data-reveal className="lead text-ink/85">
            A Almeida Advocacia apresenta uma proposta de atuação pautada pelo estudo contínuo do Direito, pelo atendimento individualizado e pela atenção às circunstâncias de cada demanda.
          </p>
          <p data-reveal className="text-ink/70">
            A clareza na comunicação e a responsabilidade profissional orientam a relação com quem procura o escritório.
          </p>
        </Reveal>
        <figure className="relative col-span-10 col-start-3 md:col-span-4 md:col-start-8 md:mt-[6vh]">
          <Img name="mesa-documentos" alt="Contratos sobre a mesa de trabalho, com caneta e pasta de couro." className="aspect-[4/3] w-full" parallax={12} reveal="clip-side" sizes="(min-width: 768px) 33vw, 80vw" />
          <figcaption className="label mt-4 text-mineral">Análise de documentos</figcaption>
        </figure>
      </div>
    </section>
  );
}
