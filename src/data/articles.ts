// Artigos demonstrativos de caráter informativo. Não constituem aconselhamento jurídico.

export type Block = { type: 'p' | 'h2'; text: string } | { type: 'ul'; items: string[] };

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO — data editorial demonstrativa
  image: { name: string; alt: string };
  excerpt: string;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: 'antes-de-assinar-um-contrato',
    title: 'O que considerar antes de assinar um contrato?',
    category: 'Direito Contratual',
    date: '2026-09-14',
    image: { name: 'contrato', alt: 'Contrato impresso sobre mesa de madeira com caneta.' },
    excerpt: 'Partes, objeto, prazos, penalidades e formas de encerramento: pontos que merecem leitura atenta antes da assinatura.',
    body: [
      { type: 'p', text: 'O contrato é o documento que registra o que foi combinado entre as partes. Depois de assinado, ele passa a orientar a execução do negócio e, se houver divergência, será um dos principais elementos analisados. Por isso, vale reservar tempo para lê-lo com atenção antes de firmá-lo.' },
      { type: 'h2', text: 'Quem são as partes' },
      { type: 'p', text: 'O primeiro passo é confirmar a identificação de quem assina. No caso de empresas, é importante verificar se a pessoa signatária tem poderes para representar a sociedade, o que costuma constar do contrato social ou de procuração. Dados incompletos ou divergentes podem gerar dúvidas sobre quem efetivamente assumiu as obrigações.' },
      { type: 'h2', text: 'O que está sendo contratado' },
      { type: 'p', text: 'A descrição do objeto deve ser clara o bastante para que um terceiro entenda o que será entregue, em que condições e com qual padrão de qualidade. Descrições genéricas abrem espaço para interpretações diferentes sobre o que foi prometido.' },
      { type: 'h2', text: 'Pontos que merecem atenção' },
      { type: 'ul', items: [
        'Preço, forma de pagamento, reajuste e consequências do atraso.',
        'Prazos de início, de entrega e de vigência do contrato.',
        'Multas e cláusula penal: o Código Civil trata da cláusula penal nos artigos 408 a 416.',
        'Hipóteses de rescisão e aviso prévio necessário.',
        'Garantias exigidas de cada parte.',
        'Confidencialidade e tratamento de dados pessoais, quando houver.',
        'Foro, mediação ou arbitragem para solução de conflitos.',
      ] },
      { type: 'h2', text: 'Boa-fé e equilíbrio' },
      { type: 'p', text: 'O Código Civil determina que as partes observem a boa-fé tanto na conclusão quanto na execução do contrato (artigo 422) e que a liberdade contratual seja exercida nos limites da função social do contrato (artigo 421). Esses princípios orientam a interpretação, mas não substituem uma redação cuidadosa.' },
      { type: 'h2', text: 'Antes de assinar' },
      { type: 'p', text: 'Peça a minuta com antecedência, registre por escrito as alterações negociadas e guarde uma via assinada de todos os anexos. Quando o contrato envolver valores relevantes, prazos longos ou obrigações complexas, a revisão por um profissional ajuda a identificar riscos que nem sempre aparecem em uma primeira leitura.' },
      { type: 'p', text: 'Este texto tem caráter informativo e não substitui a análise de um caso concreto.' },
    ],
  },
  {
    slug: 'inventario-extrajudicial',
    title: 'Inventário extrajudicial: aspectos importantes.',
    category: 'Família e Sucessões',
    date: '2026-08-27',
    image: { name: 'mesa-documentos', alt: 'Documentos e pasta de couro sobre mesa de madeira escura.' },
    excerpt: 'Quando o inventário pode ser feito em cartório, quais são os requisitos e por que os prazos importam.',
    body: [
      { type: 'p', text: 'Com o falecimento de uma pessoa, seus bens, direitos e dívidas precisam ser apurados e partilhados entre os herdeiros. Esse procedimento é o inventário. Desde a Lei nº 11.441/2007, ele pode, em determinadas situações, ser realizado por escritura pública em cartório de notas, sem a necessidade de processo judicial.' },
      { type: 'h2', text: 'Requisitos gerais' },
      { type: 'ul', items: [
        'Consenso entre os herdeiros sobre a partilha.',
        'Assistência de advogado, exigida por lei para a lavratura da escritura.',
        'Apresentação dos documentos do falecido, dos herdeiros e dos bens.',
        'Recolhimento do imposto sobre transmissão causa mortis (ITCMD), conforme a lei do estado.',
      ] },
      { type: 'p', text: 'A regulamentação do tema é feita pela Resolução nº 35/2007 do Conselho Nacional de Justiça, que passou por atualizações, inclusive sobre situações envolvendo testamento e herdeiros menores ou incapazes. Como as regras podem mudar, é importante verificar a norma vigente e as exigências do cartório escolhido.' },
      { type: 'h2', text: 'Prazo para abertura' },
      { type: 'p', text: 'O Código de Processo Civil prevê que o inventário seja instaurado em até dois meses a contar da abertura da sucessão. O descumprimento desse prazo pode gerar multa sobre o ITCMD, de acordo com a legislação estadual.' },
      { type: 'h2', text: 'Vantagens e limites' },
      { type: 'p', text: 'O procedimento em cartório tende a ser mais rápido quando todos os requisitos estão presentes e há acordo entre os herdeiros. Se houver divergência sobre a partilha ou outras circunstâncias que impeçam a via extrajudicial, o inventário deverá seguir pelo Judiciário.' },
      { type: 'h2', text: 'Documentos usualmente solicitados' },
      { type: 'ul', items: [
        'Certidão de óbito e documentos pessoais do falecido.',
        'Documentos dos herdeiros e do cônjuge ou companheiro, se houver.',
        'Certidões de matrícula de imóveis e documentos de outros bens.',
        'Certidões negativas de débitos exigidas pelo cartório.',
      ] },
      { type: 'p', text: 'Este texto tem caráter informativo. As exigências podem variar conforme o caso, o estado e o cartório.' },
    ],
  },
  {
    slug: 'responsabilidade-civil-conceitos',
    title: 'Responsabilidade civil: conceitos e aplicações.',
    category: 'Direito Civil',
    date: '2026-07-30',
    image: { name: 'biblioteca', alt: 'Biblioteca com estantes de madeira e luminária acesa.' },
    excerpt: 'Conduta, dano e nexo causal: os elementos que estruturam o dever de reparar e as principais distinções da matéria.',
    body: [
      { type: 'p', text: 'Responsabilidade civil é o dever de reparar um dano causado a outra pessoa. O Código Civil estabelece que quem, por ação ou omissão voluntária, negligência ou imprudência, viola direito e causa dano a outrem comete ato ilícito (artigo 186) e fica obrigado a repará-lo (artigo 927).' },
      { type: 'h2', text: 'Elementos' },
      { type: 'ul', items: [
        'Conduta: a ação ou omissão que deu origem ao dano.',
        'Dano: o prejuízo efetivamente sofrido, material ou extrapatrimonial.',
        'Nexo causal: a ligação entre a conduta e o dano.',
        'Culpa: exigida na responsabilidade subjetiva e dispensada na objetiva.',
      ] },
      { type: 'h2', text: 'Subjetiva e objetiva' },
      { type: 'p', text: 'Na regra geral, é preciso demonstrar culpa. Em algumas situações, porém, a lei impõe responsabilidade independentemente de culpa, como prevê o parágrafo único do artigo 927 para atividades que, por sua natureza, implicam risco, e como ocorre em diversas relações de consumo reguladas pelo Código de Defesa do Consumidor.' },
      { type: 'h2', text: 'Espécies de dano' },
      { type: 'p', text: 'Os danos materiais abrangem o que se perdeu (danos emergentes) e o que razoavelmente se deixou de ganhar (lucros cessantes). Os danos morais dizem respeito a lesões a direitos da personalidade. A jurisprudência também reconhece outras categorias, como o dano estético, conforme as circunstâncias.' },
      { type: 'h2', text: 'Prazos' },
      { type: 'p', text: 'O Código Civil fixa, como regra, o prazo de três anos para a pretensão de reparação civil (artigo 206, § 3º, inciso V). Nas relações de consumo, o Código de Defesa do Consumidor prevê cinco anos para a reparação de danos causados por fato do produto ou do serviço (artigo 27). A contagem pode ter particularidades, o que torna importante avaliar cada situação sem demora.' },
      { type: 'p', text: 'Este texto tem caráter informativo e não substitui a análise de um caso concreto.' },
    ],
  },
  {
    slug: 'contratos-empresariais-prevencao',
    title: 'Contratos empresariais e prevenção de conflitos.',
    category: 'Direito Empresarial',
    date: '2026-07-08',
    image: { name: 'reuniao', alt: 'Sala de reuniões com mesa longa de madeira e cadeiras de couro.' },
    excerpt: 'Como a redação contratual, a matriz de riscos e as cláusulas de solução de disputas ajudam a evitar litígios.',
    body: [
      { type: 'p', text: 'Nas relações entre empresas, o contrato é também uma ferramenta de gestão. Ele organiza responsabilidades, define indicadores e estabelece o que acontece quando algo não sai como planejado. Contratos bem estruturados não eliminam conflitos, mas reduzem a chance de que divergências se tornem disputas longas.' },
      { type: 'h2', text: 'Paridade entre as partes' },
      { type: 'p', text: 'A Lei nº 13.874/2019, conhecida como Lei de Liberdade Econômica, incluiu no Código Civil o artigo 421-A, segundo o qual os contratos civis e empresariais presumem-se paritários e simétricos, salvo elementos concretos em sentido contrário. Na prática, isso reforça a importância do que as partes efetivamente escreveram e negociaram.' },
      { type: 'h2', text: 'Instrumentos de prevenção' },
      { type: 'ul', items: [
        'Matriz de riscos: quem assume cada risco identificado e em que medida.',
        'Critérios objetivos de entrega, aceite e qualidade.',
        'Procedimento para aditivos e mudanças de escopo.',
        'Confidencialidade e regras sobre propriedade intelectual.',
        'Obrigações relativas à proteção de dados pessoais.',
        'Escalonamento de conflitos: negociação, mediação e, se previsto, arbitragem.',
      ] },
      { type: 'h2', text: 'Arbitragem e mediação' },
      { type: 'p', text: 'A arbitragem, regulada pela Lei nº 9.307/1996, permite que disputas sobre direitos patrimoniais disponíveis sejam decididas por árbitros escolhidos pelas partes. A mediação, prevista na Lei nº 13.140/2015, busca a construção de um acordo com apoio de um terceiro imparcial. A escolha entre esses caminhos deve considerar custos, prazos e a natureza do negócio.' },
      { type: 'h2', text: 'Gestão durante a execução' },
      { type: 'p', text: 'Registrar comunicações relevantes, formalizar alterações e acompanhar prazos são práticas simples que facilitam a solução de divergências. Um contrato só cumpre seu papel preventivo se for conhecido e utilizado pelas equipes que executam o negócio.' },
      { type: 'p', text: 'Este texto tem caráter informativo e não substitui a análise de um caso concreto.' },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Tempo de leitura calculado a partir do texto (≈ 200 palavras por minuto). */
export function readingTime(a: Article) {
  const words = a.body.reduce((n, b) => n + (b.type === 'ul' ? b.items.join(' ') : b.text).split(/\s+/).length, a.title.split(/\s+/).length);
  return Math.max(1, Math.ceil(words / 200));
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
