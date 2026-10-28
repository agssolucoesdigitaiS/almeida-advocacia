import { Link, useParams } from 'react-router-dom';
import { getMember, team } from '../data/content';
import { PageHero } from '../components/ui/PageHero';
import { Img } from '../components/ui/Img';
import { Reveal } from '../components/motion/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

export default function ProfilePage() {
  const { slug = '' } = useParams();
  const m = getMember(slug);
  usePageMeta(m ? `${m.name} (perfil ilustrativo)` : 'Perfil não encontrado', m?.bio);
  if (!m || !m.profileEnabled) return <NotFound />;
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <PageHero image="escritorio" alt="Ambiente de escritório com janela para a cidade." eyebrow="Perfil ilustrativo" title={m.name.replace(' ', '\n')} back={{ to: '/', label: 'Profissionais', state: { scrollTo: 'equipe' } }}>
        <p className="label text-gold">{m.role}</p>
      </PageHero>
      <section data-tone="light" className="grain relative bg-paper py-[clamp(80px,12vh,150px)] text-ink">
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <Img name={m.image.name} alt={m.image.alt} className="aspect-[4/5] w-full" imgClassName="grayscale" parallax={6} sizes="(min-width: 768px) 33vw, 100vw" />
            <p className="label mt-4 text-mineral">Retrato ilustrativo · substituir por fotografia autorizada</p>
          </div>
          <Reveal className="col-span-12 grid content-start gap-6 md:col-span-6 md:col-start-6">
            <p data-reveal className="demo-tag w-fit text-ink/70">Conteúdo demonstrativo</p>
            <p data-reveal className="display text-[clamp(1.6rem,2.6vw,2.5rem)] leading-tight">{m.bio}</p>
            {m.about.map((p) => <p key={p} data-reveal className="text-ink/75">{p}</p>)}
            <dl data-reveal className="mt-4 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
              <div><dt className="label text-mineral">Inscrição na OAB</dt><dd className="mt-1 text-ink/60">Pendente de validação</dd></div>
              <div><dt className="label text-mineral">Áreas</dt><dd className="mt-1">{m.role.replace('Atuação em ', '')}</dd></div>
            </dl>
          </Reveal>
        </div>
        <nav aria-label="Outros perfis" className="px-site mt-20 flex flex-wrap gap-6 border-t border-line pt-8">
          {team.filter((t) => t.slug !== m.slug).map((t) => <Link key={t.slug} to={`/equipe/${t.slug}`} className="link-u display text-2xl">{t.name}</Link>)}
        </nav>
      </section>
    </main>
  );
}
