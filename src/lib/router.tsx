import { useEffect, useRef, type ReactNode } from 'react';
import { BrowserRouter, MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

/*
 * Roteamento.
 * - Modo "hash" (padrão): rotas internas sincronizadas com um hash simples (#area-direito-civil, #artigo-..., #privacidade). Funciona em hospedagem estática sem reescrita de URL e em ambientes embutidos.
 * - Modo "browser": defina VITE_ROUTER=browser no build para URLs limpas (/areas/direito-civil).
 *   Exige rewrite para index.html no servidor (ex.: vercel.json).
 */
const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };
const MODE = import.meta.env.VITE_ROUTER === 'browser' ? 'browser' : 'hash';

const STATIC: Record<string, string> = { '/artigos': 'artigos', '/contato': 'contato', '/privacidade': 'privacidade', '/aviso-legal': 'aviso-legal' };
const DYNAMIC: [string, string][] = [['/areas/', 'area-'], ['/artigos/', 'artigo-'], ['/equipe/', 'equipe-']];

export function pathToHash(path: string) {
  if (path === '/' || path === '') return '';
  if (STATIC[path]) return STATIC[path];
  for (const [p, h] of DYNAMIC) if (path.startsWith(p) && /^[a-z0-9-]+$/.test(path.slice(p.length))) return h + path.slice(p.length);
  return 'nao-encontrada';
}

export function hashToPath(hash: string) {
  const h = hash.replace(/^#/, '');
  if (!h) return '/';
  const s = Object.entries(STATIC).find(([, v]) => v === h);
  if (s) return s[0];
  for (const [p, pre] of DYNAMIC) if (h.startsWith(pre)) return p + h.slice(pre.length);
  return '/nao-encontrada';
}

function HashSync() {
  const loc = useLocation();
  const navigate = useNavigate();
  const current = useRef(loc.pathname);
  current.current = loc.pathname;

  useEffect(() => {
    const target = pathToHash(loc.pathname);
    if (window.location.hash.replace(/^#/, '') === target) return;
    try {
      const url = target ? `#${target}` : window.location.pathname + window.location.search;
      window.history.pushState(null, '', url);
    } catch { /* ambientes que bloqueiam history: segue só com o roteador em memória */ }
  }, [loc.pathname]);

  useEffect(() => {
    const onChange = () => {
      const p = hashToPath(window.location.hash);
      if (p !== current.current) navigate(p);
    };
    window.addEventListener('popstate', onChange);
    window.addEventListener('hashchange', onChange);
    return () => { window.removeEventListener('popstate', onChange); window.removeEventListener('hashchange', onChange); };
  }, [navigate]);
  return null;
}

export function AppRouter({ children }: { children: ReactNode }) {
  if (MODE === 'browser') return <BrowserRouter future={FUTURE}>{children}</BrowserRouter>;
  return (
    <MemoryRouter future={FUTURE} initialEntries={[hashToPath(window.location.hash)]}>
      <HashSync />
      {children}
    </MemoryRouter>
  );
}
