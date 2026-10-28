// Configuração central do site. Itens demonstrativos devem ser substituídos antes da publicação.
// Pendências regulatórias (OAB, sociedade, responsável) ficam em ./compliance.ts.

export const site = {
  name: 'ALMEIDA ADVOCACIA',
  short: 'Almeida Advocacia',
  signature: 'Conhecimento jurídico. Compromisso com cada decisão.',
  city: 'São Paulo, SP',

  /** Enquanto true, o site exibe avisos de identidade e conteúdo demonstrativos. */
  demoMode: true,

  contact: {
    email: 'contato@almeidaadvocacia.exemplo', // domínio .exemplo é reservado e não recebe mensagens
    emailIsDemo: true,
    phone: '+55 (11) 0000-0000',
    phoneIsDemo: true,
    hours: 'Segunda a sexta, das 9h às 18h (horário demonstrativo)',
    linkedin: null as string | null,
    instagram: null as string | null,
  },

  /**
   * Endpoint do formulário (POST JSON). null = modo demonstrativo: nada é enviado.
   * O site só confirma o envio após resposta 2xx do servidor. Aplique validação,
   * antispam e rate limit no backend.
   */
  contactEndpoint: null as string | null,

  credits: { label: 'Desenvolvimento:', author: 'AGS Soluções Digitais', url: null as string | null },
  imageNote: 'Imagens: renders digitais conceituais criados para esta demonstração. Não retratam pessoas ou locais reais.',
};

export type NavItem = { id: string; label: string; index: string };
export const nav: NavItem[] = [
  { id: 'inicio', label: 'Início', index: '00' },
  { id: 'manifesto', label: 'O escritório', index: '01' },
  { id: 'areas', label: 'Áreas de atuação', index: '02' },
  { id: 'filosofia', label: 'Filosofia', index: '03' },
  { id: 'equipe', label: 'Profissionais', index: '04' },
  { id: 'conteudo', label: 'Artigos', index: '05' },
  { id: 'atendimento', label: 'Atendimento', index: '06' },
  { id: 'contato', label: 'Contato', index: '07' },
];
