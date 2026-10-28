import { useNavigate } from 'react-router-dom';
import { useUI } from '../../lib/ui';
import { Drawer } from './Drawer';
import { ContactForm } from './ContactForm';
import { site } from '../../data/site';

export function ContactDrawer() {
  const { contactOpen, closeContact } = useUI();
  const navigate = useNavigate();
  return (
    <Drawer open={contactOpen} onClose={closeContact} title="Enviar mensagem">
      <div className="grid gap-10 pt-4">
        <header className="grid gap-4">
          <span data-d-item className="label text-gold">Contato · {site.city}</span>
          <h2 data-d-item className="display h-lg">Envie uma mensagem.</h2>
          <p data-d-item className="max-w-[52ch] text-paper/70">Descreva o tema de forma breve. Informações detalhadas e documentos podem ser tratados depois, por canal adequado.</p>
        </header>
        <ContactForm prefix="cf" onOpenPrivacy={() => { closeContact(); window.setTimeout(() => navigate('/privacidade'), 500); }} />
      </div>
    </Drawer>
  );
}
