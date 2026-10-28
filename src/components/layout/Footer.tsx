import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { nav, site } from '../../data/site';
import { areas } from '../../data/areas';
import { articles } from '../../data/articles';
import { compliance, pendingCount } from '../../data/compliance';
import { useUI } from '../../lib/ui';
import { useScroll } from '../motion/SmoothScroll';
import { Monogram } from '../ui/Monogram';
import { Credits } from './Credits';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { goToSection } = useUI();
  const { scrollTo } = useScroll();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(ref.current!.querySelector('[data-mono]'), { yPercent: 35, scale: 0.92 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
    });
    return () => mm.revert();
  }, { scope: ref });

  const reg = (k: string) => compliance[k]?.value ?? 'informação pendente de validação';
  return (
    <footer ref={ref} data-tone="dark" className="grain relative overflow-hidden bg-ink text-paper">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-12 border-t border-paper/10 pt-20 md:pt-28">
        <div className="col-span-12 md:col-span-4">
          <p className="display text-[clamp(1.8rem,2.6vw,2.6rem)] leading-tight">Almeida Advocacia</p>
          <p className="mt-3 max-w-[30ch] text-paper/60">{site.signature}</p>
          <p className="label mt-8 text-paper/45">{site.city}</p>
        </div>
        <nav aria-label="Institucional" className="col-span-6 md:col-span-2">
          <p className="label mb-5 text-gold">Institucional</p>
          <ul className="grid gap-2 text-sm">
            {nav.filter((n) => !['inicio', 'areas', 'conteudo'].includes(n.id)).map((n) => (
              <li key={n.id}><button type="button" onClick={() => goToSection(n.id)} className="link-u text-left text-paper/75 hover:text-paper">{n.label}</button></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Áreas de atuação" className="col-span-6 md:col-span-2">
          <p className="label mb-5 text-gold">Áreas</p>
          <ul className="grid gap-2 text-sm">{areas.map((a) => <li key={a.slug}><Link to={`/areas/${a.slug}`} className="link-u text-paper/75 hover:text-paper">{a.title}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Artigos" className="col-span-6 md:col-span-2">
          <p className="label mb-5 text-gold">Artigos</p>
          <ul className="grid gap-2 text-sm">
            {articles.slice(0, 3).map((a) => <li key={a.slug}><Link to={`/artigos/${a.slug}`} className="link-u text-paper/75 hover:text-paper">{a.title.replace(/[.?]$/, '')}</Link></li>)}
            <li><Link to="/artigos" className="link-u text-paper">Todos os artigos</Link></li>
          </ul>
        </nav>
        <div className="col-span-6 md:col-span-2">
          <p className="label mb-5 text-gold">Contato</p>
          <ul className="grid gap-2 text-sm text-paper/75">
            <li className="select-all break-all">{site.contact.email}</li>
            {site.contact.emailIsDemo && <li className="text-xs text-paper/45">E-mail demonstrativo</li>}
            <li className="select-all">{site.contact.phone}</li>
            {site.contact.phoneIsDemo && <li className="text-xs text-paper/45">Telefone demonstrativo</li>}
            <li><Link to="/contato" className="link-u text-paper">Informações de contato</Link></li>
          </ul>
        </div>
      </div>

      <div className="px-site relative mt-16 flex items-end justify-between gap-8">
        <div data-mono aria-hidden="true" className="w-[min(78vw,900px)] text-paper/90"><Monogram className="w-full" title="" /></div>
        <button type="button" onClick={() => scrollTo(0, { duration: 2.2 })} className="group mb-6 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/50 transition-colors hover:bg-gold hover:text-ink" aria-label="Voltar ao topo">
          <ArrowUp size={18} strokeWidth={1.25} className="transition-transform duration-500 group-hover:-translate-y-1" />
        </button>
      </div>

      <div className="px-site mt-12 grid gap-6 border-t border-paper/10 py-8 text-xs text-paper/50 md:grid-cols-3" style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="grid gap-1">
          <p>Registro da sociedade na OAB: {reg('registroSociedade')}</p>
          <p>Responsável técnico e inscrição: {reg('responsavel')}</p>
          <p>CNPJ: {reg('cnpj')}</p>
        </div>
        <div className="grid gap-1">
          <p>Escritório e profissionais fictícios. Modelo demonstrativo de website{pendingCount ? ` · ${pendingCount} itens pendentes de validação` : ''}.</p>
          <p>{site.imageNote}</p>
        </div>
        <div className="grid content-start gap-1 md:text-right">
          <p><Link to="/privacidade" className="link-u text-paper/70">Política de privacidade</Link> · <Link to="/aviso-legal" className="link-u text-paper/70">Aviso legal</Link></p>
          <p>© {new Date().getFullYear()} Almeida Advocacia (demonstrativo)</p>
          <Credits />
        </div>
      </div>
    </footer>
  );
}
