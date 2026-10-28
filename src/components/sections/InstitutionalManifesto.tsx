import { useRef } from 'react';
import { WordReveal } from '../motion/WordReveal';
import { AnimatedDivider } from '../motion/AnimatedDivider';
import { Reveal } from '../motion/Reveal';
import { Img } from '../ui/Img';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';

export function InstitutionalManifesto() {
  const ref = useRef<HTMLElement>(null);
  // texto tipográfico que atravessa a seção em sentido horizontal
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(ref.current!.querySelector('[data-cross]'), { xPercent: 8 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="manifesto" tabIndex={-1} data-tone="light" className="grain relative overflow-hidden bg-paper py-[clamp(110px,18vh,220px)] text-ink outline-none" aria-labelledby="manifesto-title">
      <p data-cross aria-hidden="true" className="pointer-events-none absolute left-0 top-[clamp(40px,8vh,90px)] whitespace-nowrap font-serif text-[clamp(5rem,16vw,18rem)] font-light italic leading-none text-[rgba(16,19,17,0.045)]">
        Compreensão · Análise · Clareza ·
      </p>
      <div className="px-site relative grid grid-cols-12 gap-x-6">
        <p className="label col-span-12 mb-10 flex gap-4 text-mineral md:col-span-2 md:pt-5"><span className="num">01</span> Manifesto</p>
        <WordReveal
          id="manifesto-title"
          text="O Direito exige mais do que respostas. Exige compreensão."
          accent={['compreensão']}
          className="display col-span-12 text-[clamp(2.5rem,6.6vw,7.6rem)] uppercase leading-[0.95] md:col-span-10"
        />
      </div>

      <div className="px-site mt-[clamp(64px,10vh,120px)]"><AnimatedDivider gold mode="scrub" /></div>

      <div className="px-site mt-[clamp(56px,9vh,110px)] grid grid-cols-12 gap-x-6 gap-y-14">
        <Reveal className="col-span-12 grid content-start gap-10 md:col-span-5 md:col-start-2 md:pt-[10vh]">
          <p data-reveal className="lead max-w-[46ch] text-ink/85">
            Cada questão jurídica possui circunstâncias próprias. Nosso trabalho parte da análise cuidadosa dos fatos, da legislação aplicável e das possibilidades existentes, com comunicação clara durante cada etapa.
          </p>
          <dl data-reveal className="grid grid-cols-3 gap-4 border-t border-line pt-6 text-sm">
            <div><dt className="label text-mineral">Fatos</dt><dd className="mt-2 text-ink/75">Compreensão do contexto</dd></div>
            <div><dt className="label text-mineral">Norma</dt><dd className="mt-2 text-ink/75">Legislação aplicável</dd></div>
            <div><dt className="label text-mineral">Caminhos</dt><dd className="mt-2 text-ink/75">Alternativas e riscos</dd></div>
          </dl>
        </Reveal>
        <figure className="col-span-10 col-start-3 md:col-span-4 md:col-start-8">
          <Img name="pedra-latao" alt="Parede de pedra escura com veios claros e um filete vertical de latão iluminado lateralmente." className="aspect-[3/4] w-full" parallax={10} sizes="(min-width: 768px) 33vw, 80vw" />
          <figcaption className="label mt-4 flex justify-between text-mineral"><span>Fig. 01</span><span>Pedra e latão</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
