// Áreas de atuação demonstrativas. Conteúdo informativo, sem aconselhamento individual.

export type Area = {
  slug: string;
  index: string;
  title: string;
  short: string;
  image: { name: string; alt: string };
  overview: string[];
  topics: string[];
  approach: string[];
  firstContact: string[];
};

export const areas: Area[] = [
  {
    slug: 'direito-civil',
    index: '01',
    title: 'Direito Civil',
    short: 'Análise e condução de questões relativas a obrigações, responsabilidade civil, contratos e relações patrimoniais.',
    image: { name: 'biblioteca', alt: 'Biblioteca jurídica com estantes de legislação e mesa de leitura iluminada.' },
    overview: [
      'O Direito Civil organiza as relações entre particulares: o cumprimento de obrigações, a reparação de danos, a propriedade, os contratos e o patrimônio. É o ramo que mais aparece no cotidiano de pessoas e empresas, muitas vezes antes mesmo de existir um conflito.',
      'A atuação pode ser consultiva, para orientar uma decisão ou estruturar um negócio, ou contenciosa, quando é necessário levar a questão ao Judiciário ou a métodos adequados de solução de conflitos.',
    ],
    topics: ['Cobrança e cumprimento de obrigações', 'Responsabilidade civil e reparação de danos', 'Relações de consumo', 'Direitos reais e posse', 'Revisão e rescisão de negócios jurídicos', 'Negociação, mediação e acordos'],
    approach: [
      'Levantamento dos fatos, documentos e prazos envolvidos, incluindo prazos prescricionais.',
      'Análise das alternativas disponíveis, com seus riscos e custos, antes de qualquer medida judicial.',
      'Comunicação objetiva sobre cada etapa e sobre os possíveis desdobramentos.',
    ],
    firstContact: ['Breve descrição da situação', 'Datas relevantes', 'Indicação de existência de contrato ou processo em andamento'],
  },
  {
    slug: 'familia-e-sucessoes',
    index: '02',
    title: 'Família e Sucessões',
    short: 'Orientação jurídica sobre divórcio, guarda, alimentos, inventários, partilhas e planejamento sucessório.',
    image: { name: 'familia-docs', alt: 'Pasta de documentos identificada como inventário e partilha, ao lado de uma escritura pública.' },
    overview: [
      'Questões de família e de sucessões envolvem patrimônio, mas também vínculos e decisões pessoais. Por isso, pedem atenção ao contexto de cada pessoa e, sempre que possível, a busca por soluções consensuais.',
      'Muitos procedimentos podem ser realizados em cartório, quando há consenso e os requisitos legais estão presentes. Outros dependem do Judiciário. A escolha do caminho é feita a partir da análise do caso.',
    ],
    topics: ['Divórcio e dissolução de união estável', 'Guarda e convivência', 'Alimentos', 'Inventário judicial e extrajudicial', 'Partilha de bens', 'Testamentos e planejamento sucessório'],
    approach: [
      'Escuta cuidadosa e tratamento reservado das informações compartilhadas.',
      'Avaliação da viabilidade de acordo e dos procedimentos cabíveis, judiciais ou extrajudiciais.',
      'Atenção a prazos legais, como o prazo para abertura de inventário.',
    ],
    firstContact: ['Tipo de questão (por exemplo, divórcio ou inventário)', 'Cidade em que os envolvidos residem', 'Existência de filhos menores ou de processo em andamento'],
  },
  {
    slug: 'direito-empresarial',
    index: '03',
    title: 'Direito Empresarial',
    short: 'Assessoria jurídica para sociedades empresárias, relações comerciais, governança e organização contratual.',
    image: { name: 'reuniao', alt: 'Sala de reuniões com mesa longa de madeira e cadeiras de couro.' },
    overview: [
      'A assessoria empresarial acompanha a empresa em suas decisões estruturais: constituição, organização societária, relação entre sócios, contratos com fornecedores e clientes e prevenção de conflitos.',
      'O trabalho tende a ser contínuo e preventivo, com foco em documentar acordos, reduzir incertezas e apoiar a tomada de decisão dos gestores.',
    ],
    topics: ['Constituição e alterações societárias', 'Acordos de sócios', 'Contratos comerciais', 'Governança e organização interna', 'Operações de compra e venda de participações', 'Resolução de conflitos societários'],
    approach: [
      'Compreensão do modelo de negócio e dos objetivos da empresa.',
      'Mapeamento de riscos contratuais e societários.',
      'Elaboração e revisão de documentos com linguagem clara para quem vai utilizá-los.',
    ],
    firstContact: ['Segmento de atuação da empresa', 'Tipo societário, se já constituída', 'Tema que motivou o contato'],
  },
  {
    slug: 'direito-imobiliario',
    index: '04',
    title: 'Direito Imobiliário',
    short: 'Atuação em contratos imobiliários, locações, regularização documental e conflitos relacionados à propriedade e à posse.',
    image: { name: 'imobiliario', alt: 'Instrumento de compra e venda sobre a mesa, com chaves e pasta de matrícula e certidões.' },
    overview: [
      'Negócios imobiliários costumam envolver valores relevantes e documentação extensa. A análise prévia da matrícula, das certidões e das condições do contrato ajuda a identificar riscos antes da assinatura.',
      'Também fazem parte da área as relações de locação, a regularização de imóveis e os conflitos sobre propriedade, posse e condomínio.',
    ],
    topics: ['Compra e venda de imóveis', 'Análise de matrícula e certidões', 'Locações residenciais e comerciais', 'Regularização documental', 'Usucapião', 'Questões condominiais'],
    approach: [
      'Verificação documental do imóvel e das partes envolvidas.',
      'Revisão das cláusulas de pagamento, prazos, garantias e penalidades.',
      'Orientação sobre registros e providências posteriores à assinatura.',
    ],
    firstContact: ['Tipo de operação ou conflito', 'Cidade do imóvel', 'Se já existe contrato assinado ou proposta'],
  },
  {
    slug: 'direito-trabalhista',
    index: '05',
    title: 'Direito Trabalhista',
    short: 'Orientação e representação em relações de trabalho, análise de obrigações legais e conflitos trabalhistas.',
    image: { name: 'trabalhista', alt: 'Contrato de trabalho e termo de rescisão sobre a mesa, com calculadora e a CLT.' },
    overview: [
      'As relações de trabalho são reguladas pela CLT, por normas complementares e por instrumentos coletivos. Compreender essas regras ajuda tanto quem contrata quanto quem presta serviços a conhecer seus direitos e obrigações.',
      'A atuação pode envolver orientação preventiva, análise de documentos e rotinas, negociação e representação em processos trabalhistas.',
    ],
    topics: ['Contratos de trabalho e rescisões', 'Jornada, remuneração e benefícios', 'Normas coletivas', 'Rotinas e documentos trabalhistas', 'Negociação e acordos', 'Processos trabalhistas'],
    approach: [
      'Análise das circunstâncias da relação de trabalho e dos documentos existentes.',
      'Atenção aos prazos aplicáveis, inclusive os prescricionais.',
      'Esclarecimento sobre os caminhos possíveis e suas implicações.',
    ],
    firstContact: ['Se a consulta é de pessoa física ou de empresa', 'Período da relação de trabalho', 'Tema principal da dúvida'],
  },
  {
    slug: 'direito-contratual',
    index: '06',
    title: 'Direito Contratual',
    short: 'Elaboração, revisão e negociação de contratos, com atenção aos riscos jurídicos, obrigações e interesses envolvidos.',
    image: { name: 'contrato', alt: 'Contrato impresso sobre mesa de madeira, com caneta e linha de assinatura.' },
    overview: [
      'Um contrato bem estruturado registra o que as partes combinaram e antecipa como lidar com situações que podem surgir durante a sua execução. Clareza na redação reduz dúvidas de interpretação.',
      'O trabalho inclui elaborar minutas, revisar propostas recebidas, apoiar negociações e acompanhar aditivos e encerramentos.',
    ],
    topics: ['Elaboração de minutas', 'Revisão de contratos recebidos', 'Negociação de cláusulas', 'Aditivos e distratos', 'Cláusulas de solução de conflitos', 'Confidencialidade e proteção de dados'],
    approach: [
      'Compreensão do negócio e do que cada parte espera do contrato.',
      'Identificação de pontos sensíveis: obrigações, prazos, multas, garantias e rescisão.',
      'Redação objetiva, com comentários que explicam as escolhas feitas.',
    ],
    firstContact: ['Tipo de contrato', 'Se a minuta é própria ou da outra parte', 'Prazo desejado para assinatura'],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
