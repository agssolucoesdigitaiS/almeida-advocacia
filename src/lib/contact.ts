import { site } from '../data/site';

export type ContactPayload = {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  area: string;
  mensagem: string;
  consentimento: boolean;
};

export type SubmitResult = { status: 'sent' } | { status: 'demo' } | { status: 'error'; message: string };

/**
 * Interface desacoplada de envio. Configure site.contactEndpoint (POST JSON) ou substitua esta função
 * por outro meio autorizado. O envio só é confirmado com resposta 2xx do servidor.
 * O servidor deve revalidar os dados, aplicar antispam (ex.: honeypot + rate limit/captcha) e registrar o consentimento.
 */
export async function submitContact(data: ContactPayload, honeypot: string, startedAt: number): Promise<SubmitResult> {
  if (honeypot || Date.now() - startedAt < 2500) return { status: 'error', message: 'Não foi possível validar o envio. Aguarde alguns segundos e tente novamente.' };
  if (!site.contactEndpoint) return { status: 'demo' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(site.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return { status: 'error', message: `O servidor não aceitou a mensagem (código ${res.status}). Tente novamente mais tarde.` };
    return { status: 'sent' };
  } catch {
    return { status: 'error', message: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.' };
  }
}

export function formatPayload(d: ContactPayload) {
  return [`Nome: ${d.nome}`, `E-mail: ${d.email}`, `Telefone: ${d.telefone || 'não informado'}`, `Assunto: ${d.assunto}`, `Área relacionada: ${d.area || 'não informada'}`, '', d.mensagem].join('\n');
}
