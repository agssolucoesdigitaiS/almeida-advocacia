import { compliance } from '../data/compliance';
import { usePageMeta } from '../hooks/usePageMeta';

export default function LegalNoticePage() {
  usePageMeta('Aviso legal', 'Aviso sobre o caráter demonstrativo deste website.');
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <section data-tone="light" className="grain relative bg-paper pb-24 text-ink" style={{ paddingTop: 'calc(170px + env(safe-area-inset-top, 0px))' }}>
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4"><p className="label text-mineral">Transparência</p><h1 className="display h-lg mt-6">Aviso legal</h1></div>
          <div className="col-span-12 grid gap-8 md:col-span-7 md:col-start-6">
            <p className="lead">Este website é um modelo demonstrativo. A Almeida Advocacia, seus profissionais, imagens e dados institucionais são fictícios e não correspondem a um escritório habilitado.</p>
            <p className="text-ink/75">O conteúdo tem caráter exclusivamente informativo, não constitui aconselhamento jurídico e não representa promessa de resultado. A publicidade de serviços de advocacia deve observar o Provimento CFOAB nº 205/2021, o Código de Ética e Disciplina da OAB e as demais normas aplicáveis.</p>
            <div>
              <h2 className="label mb-4 text-mineral">Informações pendentes de validação</h2>
              <ul className="border-t border-line">
                {Object.values(compliance).map((c) => (
                  <li key={c.label} className="flex flex-wrap justify-between gap-2 border-b border-line py-3 text-sm"><span>{c.label}</span><span className={c.status === 'pendente' ? 'text-ink/50' : 'text-ink'}>{c.value ?? c.status}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
