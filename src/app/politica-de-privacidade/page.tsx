import type { Metadata } from 'next';
import { WHATSAPP_TELEFONE_FORMATADO, WHATSAPP_URL } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Casa Sinelli trata dados pessoais e cookies neste site.',
};

export default function PoliticaDePrivacidade() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h1 className="font-serif text-3xl sm:text-4xl font-medium text-grafite mb-2">
        Política de Privacidade
      </h1>
      <p className="text-sm text-grafite/50 mb-10">Última atualização: agosto de 2026</p>

      <div className="space-y-8 text-grafite/80 leading-relaxed text-[15px]">
        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">1. Quem trata os seus dados</h2>
          <p>
            Este site (casasinelli.com.br) é operado pela Casa Sinelli, loja de móveis e
            colchões com endereço físico em Ribeirão Pires - SP. Para qualquer assunto
            relacionado a esta política ou aos seus dados pessoais, use os contatos da
            seção 6.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">2. O que este site não faz</h2>
          <p>
            O site é um catálogo de produtos. Não há cadastro de conta, login, checkout ou
            coleta de dados de pagamento — nenhuma dessas funções existe aqui. Os únicos pontos
            de contato são o botão de WhatsApp e os cookies de estatística descritos abaixo.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">3. Dados que tratamos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-grafite">Contato via WhatsApp:</span> ao clicar em
              &quot;Consulte o preço&quot; ou em qualquer botão de WhatsApp, você é direcionado ao
              WhatsApp Business da loja. A conversa e os dados que você compartilhar nela
              (nome, telefone, preferências de produto) ficam no WhatsApp e são usados apenas
              para o atendimento comercial.
            </li>
            <li>
              <span className="font-medium text-grafite">Cookies de estatística:</span> usados para
              medir visitas e páginas mais acessadas, de forma agregada. Não identificam você
              nominalmente. Só são ativados depois que você aceita no aviso de cookies (seção 4).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">4. Cookies</h2>
          <p>
            Nenhum cookie não essencial é carregado antes do seu consentimento. No aviso exibido
            na primeira visita, você escolhe &quot;Aceitar&quot; ou &quot;Recusar&quot;. Essa
            escolha fica salva no seu navegador e você pode alterá-la a qualquer momento apagando
            os dados de navegação deste site nas configurações do navegador, o que faz o aviso
            aparecer novamente.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">5. Compartilhamento com terceiros</h2>
          <p>
            Não vendemos nem alugamos dados pessoais. As conversas de atendimento passam pela
            infraestrutura do WhatsApp (Meta). As estatísticas de navegação, quando você
            consente, são processadas pela Vercel (hospedagem do site). Nenhum dado é usado
            para publicidade direcionada por terceiros a partir deste site.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">6. Seus direitos e contato</h2>
          <p className="mb-3">
            Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar a
            qualquer momento: confirmação de tratamento, acesso, correção de dados incompletos ou
            desatualizados, anonimização ou eliminação de dados desnecessários, e informação sobre
            com quem seus dados foram compartilhados.
          </p>
          <p>
            Para exercer esses direitos ou tirar dúvidas sobre esta política, fale com a loja pelo{' '}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-musgo-escuro font-semibold underline underline-offset-4"
            >
              WhatsApp ({WHATSAPP_TELEFONE_FORMATADO})
            </a>{' '}
            ou pelo e-mail{' '}
            <a
              href="mailto:contato@casasinelli.com.br"
              className="text-musgo-escuro font-semibold underline underline-offset-4"
            >
              contato@casasinelli.com.br
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-grafite text-lg mb-2">7. Alterações desta política</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A
            data no topo desta página indica a última atualização.
          </p>
        </section>
      </div>
    </div>
  );
}
