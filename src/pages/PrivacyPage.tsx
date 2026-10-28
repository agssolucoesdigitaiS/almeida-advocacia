import { AlertTriangle } from 'lucide-react';
import { site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

const sections = [
  { t: 'Controlador', p: `Este é o site demonstrativo de ${site.short}, escritório fictício. Antes da publicação, este item deve identificar a sociedade de advogados responsável, seu registro e o canal do encarregado de dados.` },
  { t: 'Dados tratados', p: 'Apenas os dados informados voluntariamente no formulário de contato: nome, e-mail, telefone (opcional), assunto, área relacionada e mensagem. O formulário orienta a não enviar documentos ou informações sigilosas no primeiro contato.' },
  { t: 'Finalidade e base legal', p: 'Responder à solicitação de contato. A base legal deve ser definida pelo controlador, em regra o consentimento ou procedimentos preliminares relacionados a contrato, nos termos da Lei nº 13.709/2018 (LGPD).' },
  { t: 'Compartilhamento', p: 'Os dados não são vendidos nem utilizados para publicidade. Eventuais operadores (como provedores de e-mail ou hospedagem) devem ser listados aqui.' },
  { t: 'Retenção', p: 'Pelo tempo necessário para tratar o contato e cumprir obrigações legais e éticas aplicáveis. O prazo deve ser definido pelo controlador.' },
  { t: 'Direitos do titular', p: 'Confirmação, acesso, correção, anonimização, portabilidade, eliminação e revogação do consentimento, conforme o artigo 18 da LGPD, mediante solicitação ao canal do encarregado.' },
  { t: 'Cookies', p: 'Esta versão não utiliza cookies de rastreamento ou publicidade. Caso ferramentas de análise sejam adicionadas, esta política e o aviso de cookies devem ser atualizados.' },
  { t: 'Situação atual', p: 'No modo demonstrativo, o formulário não envia nem armazena nenhuma informação.' },
];

export default function PrivacyPage() {
  usePageMeta('Política de privacidade', 'Política de privacidade demonstrativa da Almeida Advocacia.');
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <section data-tone="light" className="grain relative bg-paper pb-24 text-ink" style={{ paddingTop: 'calc(170px + env(safe-area-inset-top, 0px))' }}>
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4"><p className="label text-mineral">Documento</p><h1 className="display h-lg mt-6">Política de privacidade</h1></div>
          <div className="col-span-12 grid gap-10 md:col-span-7 md:col-start-6">
            <p role="note" className="flex gap-3 border border-ink/30 p-5 text-sm"><AlertTriangle size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" /><span><strong className="font-semibold">Modelo demonstrativo.</strong> Este texto não substitui revisão jurídica e deve ser adaptado ao controlador real antes da publicação.</span></p>
            {sections.map((s, i) => (
              <article key={s.t} className="grid gap-3 border-t border-line pt-6">
                <h2 className="flex gap-4 font-serif text-3xl"><span className="num label pt-3 text-gold">{String(i + 1).padStart(2, '0')}</span>{s.t}</h2>
                <p className="max-w-[64ch] text-ink/75">{s.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
