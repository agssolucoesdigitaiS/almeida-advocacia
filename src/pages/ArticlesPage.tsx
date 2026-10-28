import { ArticleGrid } from '../components/sections/ArticleGrid';
import { PageHero } from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ArticlesPage() {
  usePageMeta('Artigos', 'Artigos informativos sobre contratos, sucessões, responsabilidade civil e direito empresarial.');
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <PageHero image="biblioteca" alt="Biblioteca jurídica com estantes de madeira escura." eyebrow="Conteúdo" title={'Conhecimento\ne informação.'} back={{ to: '/', label: 'Início' }}>
        <p className="max-w-[60ch] text-paper/80">Textos informativos, escritos em linguagem acessível. Não constituem aconselhamento jurídico.</p>
      </PageHero>
      <ArticleGrid showHeader={false} />
    </main>
  );
}
