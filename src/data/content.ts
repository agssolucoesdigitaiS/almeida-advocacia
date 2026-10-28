// Conteúdo editorial: filosofia, equipe ilustrativa, atendimento e cena 3D.

export const pillars = [
  { index: '01', title: 'Escuta', text: 'Compreender os fatos, as expectativas e as particularidades de cada situação.', image: { name: 'escada', alt: 'Escada monumental de pedra escura iluminada por luz zenital.' } },
  { index: '02', title: 'Análise', text: 'Examinar fundamentos jurídicos, documentos, riscos e alternativas disponíveis.', image: { name: 'pedra-latao', alt: 'Parede de pedra escura com filete vertical de latão.' } },
  { index: '03', title: 'Acompanhamento', text: 'Manter comunicação objetiva e atenção aos desdobramentos de cada demanda.', image: { name: 'escritorio', alt: 'Sala de trabalho com mesa de madeira e janela para a cidade.' } },
];

/**
 * PERFIS ILUSTRATIVOS. Os nomes não representam profissionais verificados.
 * Substitua por dados reais (nome, inscrição na OAB e áreas) antes da publicação.
 * Não informe especialização sem comprovação.
 */
export type Member = { slug: string; name: string; role: string; bio: string; image: { name: string; alt: string }; profileEnabled: boolean; about: string[] };
export const team: Member[] = [
  {
    slug: 'rafael-almeida', name: 'Rafael Almeida', role: 'Atuação em Direito Civil e Empresarial',
    bio: 'Perfil demonstrativo voltado a questões patrimoniais, contratos e assessoria a empresas.',
    image: { name: 'retrato-1', alt: 'Retrato ilustrativo em silhueta de uma pessoa junto à janela de um escritório.' },
    profileEnabled: true,
    about: ['Este perfil é ilustrativo e foi criado para demonstrar a estrutura do site.', 'Em um site real, esta página apresentaria nome completo, número de inscrição na OAB e áreas de atuação, em linguagem informativa e sóbria.'],
  },
  {
    slug: 'mariana-almeida', name: 'Mariana Almeida', role: 'Atuação em Família e Sucessões',
    bio: 'Perfil demonstrativo dedicado a questões de família, inventários e planejamento sucessório.',
    image: { name: 'retrato-2', alt: 'Retrato ilustrativo em silhueta de uma pessoa em escritório com estantes de livros.' },
    profileEnabled: true,
    about: ['Este perfil é ilustrativo e foi criado para demonstrar a estrutura do site.', 'Substitua por informações verificadas, sem títulos, especializações ou credenciais que não possam ser comprovadas.'],
  },
  {
    slug: 'henrique-costa', name: 'Henrique Costa', role: 'Atuação em Direito Trabalhista e Contratual',
    bio: 'Perfil demonstrativo voltado a relações de trabalho e à elaboração e revisão de contratos.',
    image: { name: 'retrato-3', alt: 'Retrato ilustrativo em silhueta de uma pessoa diante da parede envidraçada de uma sala de reuniões.' },
    profileEnabled: true,
    about: ['Este perfil é ilustrativo e foi criado para demonstrar a estrutura do site.', 'As informações de cada profissional devem ser revisadas conforme as normas de publicidade da advocacia.'],
  },
];
export const getMember = (slug: string) => team.find((m) => m.slug === slug);

export const steps = [
  { index: '01', title: 'Contato inicial', text: 'Canal para apresentação da questão e solicitação de informações sobre o atendimento.' },
  { index: '02', title: 'Análise preliminar', text: 'Identificação dos elementos necessários para compreender a demanda e avaliar os próximos encaminhamentos.' },
  { index: '03', title: 'Definição do escopo', text: 'Esclarecimento sobre os serviços jurídicos pertinentes, condições de contratação e responsabilidades.' },
  { index: '04', title: 'Acompanhamento', text: 'Comunicação sobre o andamento dos serviços contratados, respeitando as especificidades de cada procedimento.' },
];

export const sculptureWords = ['Análise.', 'Responsabilidade.', 'Precisão.'];
