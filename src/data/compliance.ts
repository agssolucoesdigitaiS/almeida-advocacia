/*
 * CHECKLIST DE PUBLICAÇÃO — campos pendentes de validação.
 *
 * Este site é um MODELO DEMONSTRATIVO. Antes de publicar para um escritório real:
 * - preencha cada campo com dados verificados e mude o status para 'validado';
 * - revise todos os textos à luz do Provimento CFOAB nº 205/2021, do Código de Ética e
 *   Disciplina da OAB e das demais normas vigentes;
 * - não publique valores de honorários, promessas de resultado, índices de êxito,
 *   depoimentos de clientes ou expressões de superioridade.
 *
 * Enquanto houver campo 'pendente', o rodapé mostra "informação pendente de validação".
 */

export type Pending = { label: string; value: string | null; status: 'pendente' | 'validado'; note?: string };

export const compliance: Record<string, Pending> = {
  razaoSocial: { label: 'Razão social da sociedade de advogados', value: null, status: 'pendente' },
  registroSociedade: { label: 'Registro da sociedade na OAB', value: null, status: 'pendente', note: 'Número de registro na Seccional competente.' },
  cnpj: { label: 'CNPJ', value: null, status: 'pendente' },
  responsavel: { label: 'Advogado(a) responsável e inscrição na OAB', value: null, status: 'pendente', note: 'Nome completo e número de inscrição.' },
  endereco: { label: 'Endereço completo', value: null, status: 'pendente', note: 'Hoje o site exibe apenas a cidade.' },
  email: { label: 'E-mail institucional', value: null, status: 'pendente' },
  telefone: { label: 'Telefone', value: null, status: 'pendente' },
  encarregadoLGPD: { label: 'Canal do encarregado de dados (LGPD)', value: null, status: 'pendente' },
  politicaPrivacidade: { label: 'Política de privacidade revisada', value: null, status: 'pendente', note: 'O texto atual é um modelo.' },
  perfis: { label: 'Perfis profissionais reais (nomes, inscrições, áreas)', value: null, status: 'pendente', note: 'Os três perfis atuais são ilustrativos.' },
  imagens: { label: 'Fotografias reais com autorização de uso', value: null, status: 'pendente' },
};

export const pendingCount = Object.values(compliance).filter((c) => c.status === 'pendente').length;
