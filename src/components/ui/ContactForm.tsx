import { useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { site } from '../../data/site';
import { areas } from '../../data/areas';
import { formatPayload, submitContact, type ContactPayload } from '../../lib/contact';

type Errors = Partial<Record<keyof ContactPayload, string>>;
const empty: ContactPayload = { nome: '', email: '', telefone: '', assunto: '', area: '', mensagem: '', consentimento: false };

function validate(d: ContactPayload): Errors {
  const e: Errors = {};
  if (d.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Informe um e-mail válido, como nome@dominio.com.';
  const digits = d.telefone.replace(/\D/g, '');
  if (digits && (digits.length < 10 || digits.length > 13)) e.telefone = 'Informe o telefone com DDD, por exemplo (11) 91234-5678, ou deixe em branco.';
  if (d.assunto.trim().length < 3) e.assunto = 'Informe o assunto em poucas palavras.';
  if (d.mensagem.trim().length < 20) e.mensagem = 'Descreva brevemente sua questão (mínimo de 20 caracteres).';
  if (!d.consentimento) e.consentimento = 'É preciso concordar com o tratamento dos dados para continuar.';
  return e;
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Formulário de primeiro contato. Pede apenas o necessário (sem documentos ou dados sensíveis).
 * Sem endpoint configurado, não simula envio: informa o modo demonstrativo e oferece copiar os dados.
 * Só confirma envio após resposta positiva do servidor.
 */
export function ContactForm({ onOpenPrivacy, prefix = 'cf' }: { onOpenPrivacy: () => void; prefix?: string }) {
  const [data, setData] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'demo' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const honey = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLPreElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(Date.now());
  const text = useMemo(() => formatPayload(data), [data]);
  const id = (k: string) => `${prefix}-${k}`;

  const set = <K extends keyof ContactPayload>(k: K, v: ContactPayload[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate(data);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) { formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    setStatus('sending');
    const r = await submitContact(data, honey.current?.value ?? '', startedAt.current);
    if (r.status === 'error') { setStatus('error'); setServerMsg(r.message); return; }
    setStatus(r.status);
  }

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied('ok'); }
    catch {
      setCopied('fail');
      const el = summaryRef.current; if (el) { const range = document.createRange(); range.selectNodeContents(el); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(range); }
    }
  }

  if (status === 'demo') {
    return (
      <div role="status" className="grid gap-6">
        <span className="demo-tag w-fit text-gold">Modo demonstrativo</span>
        <h3 className="display h-md">Sua mensagem não foi enviada.</h3>
        <p className="text-paper/75">Este site é um modelo demonstrativo e não possui um canal de recebimento configurado. Nenhum dado foi transmitido ou armazenado. Se quiser guardar o texto, copie o resumo abaixo.</p>
        <pre ref={summaryRef} className="max-h-72 overflow-auto whitespace-pre-wrap border border-paper/15 p-5 font-sans text-sm text-paper/85">{text}</pre>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={copy} className="btn btn-light">{copied === 'ok' ? <Check size={16} /> : <Copy size={16} />}<span>{copied === 'ok' ? 'Resumo copiado' : 'Copiar resumo'}</span></button>
          <button type="button" onClick={() => setStatus('idle')} className="btn btn-light"><span>Voltar ao formulário</span></button>
        </div>
        {copied === 'fail' && <p className="text-sm text-gold">Não foi possível copiar automaticamente. O texto foi selecionado: use Ctrl+C ou Cmd+C.</p>}
        <p className="text-xs text-paper/50">Para ativar o envio, configure <code>contactEndpoint</code> em src/data/site.ts e valide os dados no servidor.</p>
      </div>
    );
  }
  if (status === 'sent') {
    return (
      <div role="status" className="grid gap-5">
        <h3 className="display h-md">Mensagem recebida.</h3>
        <p className="text-paper/75">O servidor confirmou o recebimento. O retorno será feito pelos contatos informados.</p>
      </div>
    );
  }

  const field = (k: keyof ContactPayload) => ({ id: id(k), name: k, 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `${id(k)}-err` : undefined });
  const Err = ({ k }: { k: keyof ContactPayload }) => (errors[k] ? <span id={`${id(k)}-err`} className="err">{errors[k]}</span> : null);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-7" aria-label="Formulário de contato">
      {site.contactEndpoint === null && (
        <p data-d-item className="flex gap-3 border border-paper/15 p-4 text-sm text-paper/70">
          <span className="demo-tag h-fit shrink-0 text-gold">Demo</span>
          Formulário em modo demonstrativo: a validação funciona, mas nenhuma mensagem é enviada ou armazenada.
        </p>
      )}
      <div className="grid gap-7 md:grid-cols-2">
        <div data-d-item className="field"><label htmlFor={id('nome')}>Nome</label><input {...field('nome')} autoComplete="name" value={data.nome} onChange={(e) => set('nome', e.target.value)} /><Err k="nome" /></div>
        <div data-d-item className="field"><label htmlFor={id('email')}>E-mail</label><input {...field('email')} type="email" autoComplete="email" inputMode="email" value={data.email} onChange={(e) => set('email', e.target.value)} /><Err k="email" /></div>
        <div data-d-item className="field"><label htmlFor={id('telefone')}>Telefone (opcional)</label><input {...field('telefone')} type="tel" autoComplete="tel" inputMode="tel" value={data.telefone} onChange={(e) => set('telefone', maskPhone(e.target.value))} /><Err k="telefone" /></div>
        <div data-d-item className="field"><label htmlFor={id('assunto')}>Assunto</label><input {...field('assunto')} maxLength={120} value={data.assunto} onChange={(e) => set('assunto', e.target.value)} /><Err k="assunto" /></div>
        <div data-d-item className="field md:col-span-2"><label htmlFor={id('area')}>Área de atuação relacionada (opcional)</label>
          <select {...field('area')} value={data.area} onChange={(e) => set('area', e.target.value)}><option value="">Não sei informar</option>{areas.map((a) => <option key={a.slug}>{a.title}</option>)}</select></div>
        <div data-d-item className="field md:col-span-2"><label htmlFor={id('mensagem')}>Mensagem</label>
          <textarea {...field('mensagem')} rows={4} maxLength={2000} value={data.mensagem} onChange={(e) => set('mensagem', e.target.value)} placeholder="Descreva brevemente o tema. Não envie documentos ou informações sigilosas neste primeiro contato." className="resize-y placeholder:text-paper/35" /><Err k="mensagem" /></div>
      </div>
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden"><label htmlFor={id('site')}>Não preencha</label><input id={id('site')} ref={honey} tabIndex={-1} autoComplete="off" /></div>
      <div data-d-item className="grid gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-paper/80">
          <input {...field('consentimento')} type="checkbox" checked={data.consentimento} onChange={(e) => set('consentimento', e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#b29a68]" />
          <span>Concordo com o tratamento destes dados exclusivamente para retorno a este contato, conforme a{' '}
            <button type="button" onClick={onOpenPrivacy} className="link-u text-paper">política de privacidade</button>.</span>
        </label>
        <Err k="consentimento" />
      </div>
      {status === 'error' && <p role="alert" className="border border-[#e3a28f]/50 p-4 text-sm text-[#f0b6a6]">{serverMsg}</p>}
      <div data-d-item>
        <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="btn btn-gold disabled:opacity-60">
          <span>{status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}</span><ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
