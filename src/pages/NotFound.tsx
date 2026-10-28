import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { Monogram } from '../components/ui/Monogram';

export default function NotFound() {
  usePageMeta('Página não encontrada');
  return (
    <main id="principal" tabIndex={-1} data-tone="dark" className="px-site grid min-h-[100svh] content-center gap-8 bg-ink py-32 text-paper outline-none">
      <Monogram className="w-20 text-paper/60" />
      <p className="label text-gold">Erro 404</p>
      <h1 className="display h-xl">Esta página<br /><em>não foi encontrada.</em></h1>
      <div><Link to="/" className="btn btn-gold"><span>Voltar ao início</span></Link></div>
    </main>
  );
}
