import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { useUI } from '../../lib/ui';
import { Magnetic } from '../motion/Magnetic';
import { Monogram } from '../ui/Monogram';

const links = [
  { id: 'manifesto', label: 'Escritório' },
  { id: 'areas', label: 'Áreas' },
  { id: 'conteudo', label: 'Artigos' },
  { id: 'contato', label: 'Contato' },
];

/** Header fixo minimalista: monograma à esquerda, links à direita. O contraste segue o tom da seção (data-tone). */
export function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const { menuOpen, setMenuOpen, ready, goToSection } = useUI();
  const [tone, setTone] = useState<'light' | 'dark'>('dark');
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const pick = () => {
      let t: 'light' | 'dark' = 'dark';
      document.querySelectorAll<HTMLElement>('[data-tone]').forEach((s) => { const r = s.getBoundingClientRect(); if (r.top <= 36 && r.bottom > 36) t = (s.dataset.tone as 'light' | 'dark') || 'dark'; });
      setTone(t);
    };
    let last = window.scrollY, raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pick();
        const y = window.scrollY; setScrolled(y > 40);
        if (Math.abs(y - last) > 6) { setHidden(y > last && y > 260); last = y; }
      });
    };
    pick(); const t = window.setTimeout(pick, 500);
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.clearTimeout(t); cancelAnimationFrame(raf); };
  }, [loc.pathname]);

  useGSAP(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current!.querySelectorAll('[data-h-item]'), { yPercent: -140, autoAlpha: 0, duration: 1.1, ease: EASE.out, stagger: 0.06, delay: loc.pathname === '/' ? 1.6 : 0.2 });
    });
    return () => mm.revert();
  }, { dependencies: [ready], scope: ref });

  const light = tone === 'light' && !menuOpen;
  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[60] px-site transition-[color,transform] duration-700 ease-out ${light ? 'text-ink' : 'text-paper'}`}
      style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))', transform: hidden && !menuOpen ? 'translateY(-115%)' : 'none', visibility: ready ? 'visible' : 'hidden' }}
    >
      <nav aria-label="Principal" className="flex h-[56px] items-center justify-between gap-6">
        <Link to="/" data-h-item onClick={(e) => { if (loc.pathname === '/') { e.preventDefault(); goToSection('inicio'); } }} className="flex items-center gap-4" aria-label="Almeida Advocacia, página inicial">
          <Monogram className="h-9 w-11" title="" />
          <span className={`label hidden transition-opacity duration-500 sm:inline ${scrolled ? 'opacity-0' : 'opacity-80'}`}>Almeida Advocacia</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-8">
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.id} data-h-item>
                <button type="button" onClick={() => goToSection(l.id)} className="link-u label opacity-80 transition-opacity hover:opacity-100">{l.label}</button>
              </li>
            ))}
          </ul>
          <span data-h-item>
            <Magnetic>
              <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="menu-overlay" className="flex min-h-[44px] items-center gap-3 px-1">
                <span className="label">{menuOpen ? 'Fechar' : 'Menu'}</span>
                <span aria-hidden="true" className="relative block h-[10px] w-7">
                  <span className="absolute left-0 right-0 top-0 h-px bg-current transition-transform duration-500 ease-nord" style={{ transform: menuOpen ? 'translateY(4.5px) rotate(45deg)' : 'none' }} />
                  <span className="absolute bottom-0 right-0 h-px bg-gold transition-all duration-500 ease-nord" style={{ width: menuOpen ? '100%' : '70%', transform: menuOpen ? 'translateY(-4.5px) rotate(-45deg)' : 'none' }} />
                </span>
              </button>
            </Magnetic>
          </span>
        </div>
      </nav>
    </header>
  );
}
