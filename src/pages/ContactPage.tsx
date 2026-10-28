import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { site } from '../data/site';
import { compliance } from '../data/compliance';
import { PageHero } from '../components/ui/PageHero';
import { ContactForm } from '../components/ui/ContactForm';
import { usePageMeta } from '../hooks/usePageMeta';

function CopyLine({ label, value, demo }: { label: string; value: string; demo?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="grid gap-1 border-t border-paper/15 pt-4">
      <dt className="label text-paper/50">{label}</dt>
      <dd className="flex flex-wrap items-center gap-3">
        <span className="select-all break-all text-lg">{value}</span>
        <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 2000); } catch { /* seleção manual */ } }} className="label inline-flex items-center gap-1 text-gold" aria-label={`Copiar ${label}`}>{ok ? <Check size={14} /> : <Copy size={14} />}{ok ? 'Copiado' : 'Copiar'}</button>
        {demo && <span className="text-xs text-paper/45">demonstrativo</span>}
      </dd>
    </div>
  );
}

export default function ContactPage() {
  usePageMeta('Contato', 'Informações de contato e formulário da Almeida Advocacia (demonstrativo).');
  const navigate = useNavigate();
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <PageHero image="fachada" alt="Fachada de edifício corporativo em pedra e vidro." eyebrow="Contato" title={'Informações\nde contato.'} back={{ to: '/', label: 'Início' }} />
      <section data-tone="dark" className="grain relative bg-graphite py-[clamp(80px,12vh,150px)] text-paper">
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-14">
          <dl className="col-span-12 grid content-start gap-6 md:col-span-4">
            <CopyLine label="E-mail" value={site.contact.email} demo={site.contact.emailIsDemo} />
            <CopyLine label="Telefone" value={site.contact.phone} demo={site.contact.phoneIsDemo} />
            <div className="grid gap-1 border-t border-paper/15 pt-4"><dt className="label text-paper/50">Cidade</dt><dd className="text-lg">{site.city}</dd></div>
            <div className="grid gap-1 border-t border-paper/15 pt-4"><dt className="label text-paper/50">Endereço</dt><dd className="text-paper/60">{compliance.endereco.value ?? 'Informação pendente de validação'}</dd></div>
            <div className="grid gap-1 border-t border-paper/15 pt-4"><dt className="label text-paper/50">Atendimento</dt><dd className="text-paper/70">{site.contact.hours}</dd></div>
          </dl>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <h2 className="display h-md mb-10">Enviar mensagem</h2>
            <ContactForm prefix="page" onOpenPrivacy={() => navigate('/privacidade')} />
          </div>
        </div>
      </section>
    </main>
  );
}
