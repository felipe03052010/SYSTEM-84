# Assinatura automática com Mercado Pago

O SYSTEM 84 cobra **R$ 15 por mês** pela API de **Assinaturas** do Mercado Pago (`/preapproval`, sem plano
associado). O assinante autoriza o cartão uma única vez; o Mercado Pago cobra todo mês e o site libera
um mês de acesso a cada cobrança aprovada, sem intervenção do administrador.

## Como funciona

1. O assinante cria a conta e clica em **ASSINAR POR R$ 15 / MÊS** (`POST /api/payments/mp/subscribe`).
2. É redirecionado ao checkout do Mercado Pago e autoriza a assinatura.
3. Ao voltar (`/?assinatura=retorno`), a tela chama `POST /api/payments/mp/sync`.
4. Cada cobrança concluída (`summarized.charged_quantity`) vira **exatamente um mês** de acesso. A conciliação é
   idempotente (`subscriptions.granted_quantity` + referência única `mp-sub-<id>-<n>` em `payments`), então
   notificações repetidas ou simultâneas nunca somam meses a mais.
5. Se o webhook atrasar, `GET /api/access/me` concilia sozinho para assinantes vencidos (no máximo a cada 2 min).
6. Cancelar: `POST /api/payments/mp/cancel`. O acesso continua até o fim do período já pago.

Sem `MP_ACCESS_TOKEN`, o site continua no fluxo manual de Pix (Nubank).

## Configuração (uma vez)

1. No painel de desenvolvedores do Mercado Pago, crie uma aplicação e copie o **Access Token** de produção.
2. Cadastre os segredos no Worker:
   ```bash
   npx wrangler@4 secret put MP_ACCESS_TOKEN
   npx wrangler@4 secret put MP_WEBHOOK_SECRET   # "assinatura secreta" da aba Webhooks
   ```
   Opcional: `MP_PRICE` (padrão 15) e `MP_GRANT_ON_AUTHORIZE=1`.
3. Em **Webhooks → Configurar notificações**, aponte a URL de produção para
   `https://<seu-dominio>/api/payments/mp/webhook` e marque os eventos **Pagamentos** e
   **Planos e assinaturas** (`subscription_preapproval`, `subscription_authorized_payment`).
4. Aplique a migração da tabela de assinaturas: `npx wrangler@4 d1 migrations apply system84-db --remote`
   (`drizzle/0002_subscriptions.sql`; o Worker também cria a tabela sozinho se faltar).
5. Teste com usuários de teste do Mercado Pago antes de abrir ao público.

## Observações

- O primeiro débito pode levar alguns instantes (ou até cerca de uma hora, segundo a documentação do Mercado Pago).
  Por padrão o acesso só é liberado após a cobrança; com `MP_GRANT_ON_AUTHORIZE=1` o primeiro mês é liberado
  já na autorização.
- Se o pagamento de um mês falhar, o Mercado Pago tenta de novo; depois de 3 recusas ele cancela a assinatura.
- Testes automáticos: `npm run test:access` e `npm run test:mp` (API do Mercado Pago simulada).
