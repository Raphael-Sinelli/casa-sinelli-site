// Único lugar do código com o número do WhatsApp da loja.
export const WHATSAPP_NUMERO = '5511971776165';
export const WHATSAPP_TELEFONE_FORMATADO = '(11) 97177-6165';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}`;

export const MENSAGENS_WHATSAPP = {
  padrao: 'Olá! Gostaria de conhecer os produtos da Casa Sinelli.',
  naoEncontrei: 'Olá! Estava procurando um produto no site e não encontrei. Podem me ajudar?',
  catalogoVazio: 'Olá! Não encontrei o que procurava no catálogo. Podem me ajudar?',
} as const;

export function linkWhatsApp(mensagem?: string): string {
  if (!mensagem) return WHATSAPP_URL;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemProduto(nomeProduto: string): string {
  return `Olá! Tenho interesse no produto ${nomeProduto}. Poderia me passar mais informações, disponibilidade e condições?`;
}
