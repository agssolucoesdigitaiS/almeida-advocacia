import { Hero } from '../components/sections/Hero';
import { InstitutionalManifesto } from '../components/sections/InstitutionalManifesto';
import { PracticeAreas } from '../components/sections/PracticeAreas';
import { PhilosophySection } from '../components/sections/PhilosophySection';
import { ThreeScene } from '../components/sections/ThreeScene';
import { About } from '../components/sections/About';
import { TeamSection } from '../components/sections/TeamSection';
import { ArticleGrid } from '../components/sections/ArticleGrid';
import { ProcessTimeline } from '../components/sections/ProcessTimeline';
import { ContactSection } from '../components/sections/ContactSection';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta(null, 'Almeida Advocacia: escritório demonstrativo de advocacia consultiva e contenciosa em São Paulo. Direito Civil, Família e Sucessões, Empresarial, Imobiliário, Trabalhista e Contratual.');
  return (
    <main id="principal" tabIndex={-1} className="outline-none">
      <Hero />
      <InstitutionalManifesto />
      <PracticeAreas />
      <PhilosophySection />
      <ThreeScene />
      <About />
      <TeamSection />
      <ArticleGrid />
      <ProcessTimeline />
      <ContactSection />
    </main>
  );
}
