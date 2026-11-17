# Publicar o SYSTEM 84 gratuitamente na Cloudflare

A implantação usa **Cloudflare Workers com Static Assets** para o React/Vite e **D1** para a API em `server/api.js`. O Worker é `server/cloudflare-worker.js`. Assim, frontend e backend compartilham a **mesma origem HTTPS**, sem CORS e sem um servidor Node continuamente ligado.

> Este commit **prepara** a implantação. Não cria uma conta Cloudflare, não cria o banco e não publica o site por conta própria. O ID de D1 em `wrangler.jsonc` é um placeholder e precisa ser substituído pelo ID real antes do deploy.

## Preparação na conta Cloudflare (plano Free)

1. Crie uma conta gratuita em https://dash.cloudflare.com/ e instale Node.js 24 em seu computador.
2. Na cópia atualizada do repositório, execute `npm ci` e `npx wrangler@4 login`.
3. Crie o banco remoto: `npx wrangler@4 d1 create system84-db`.
4. Copie o **database_id** (UUID) retornado e substitua `00000000-0000-0000-0000-000000000000` em `wrangler.jsonc`. Faça commit dessa alteração no GitHub (o ID do banco não é senha).
5. Crie as tabelas: `npx wrangler@4 d1 migrations apply system84-db --remote`. As migrações já existem em `drizzle/0000_access.sql`.
6. Compile o frontend com modo de autenticação: `npm run build:paid`. **Não use `npm run build:pages`**, pois esse comando constrói apenas a página de redirecionamento antiga.
7. Publique: `npx wrangler@4 deploy`. A URL será exibida pelo Wrangler, geralmente `https://system-84.<seu-subdominio>.workers.dev`.
8. Configure os segredos, um por vez (será solicitado seu valor no terminal):
   - `npx wrangler@4 secret put ADMIN_INVITE_CODE`
   - `npx wrangler@4 secret put CREATOR_INVITE_CODE`
   - `npx wrangler@4 secret put PIX_KEY` (somente se for usar o fluxo Pix manual).
   
   Use **novos códigos aleatórios**; os exemplos antigos do repositório ficaram públicos e não são seguros.
9. Verifique `https://<sua-url>/api/access/config` (JSON com `ready: true` e `paymentReady` de acordo com a configuração), cadastre uma conta de teste e confirme que `/api/access/me` retorna JSON.
10. Ative o vínculo com GitHub em **Cloudflare → Workers & Pages → seu Worker → Settings → Builds** (nomes podem mudar). Conecte `felipe03052010/SYSTEM-84`, branch `main`, com **Build command:** `npm run build:paid` e **Deploy command:** `npx wrangler@4 deploy`. Confirme que o ID real de D1 está versionado.

## Testar antes de publicar

```bash
npm ci
npm run check
npm test
npm run test:access
npm run build:paid
npx wrangler@4 d1 migrations apply system84-db --local
npx wrangler@4 dev
```

Os comandos locais de D1 usam dados locais (não o banco de produção). Os endpoints `/api/*` precisam da binding `DB`; sem a migração, retornam erros de tabela inexistente.

## Mídias e GitHub Pages

Arquivos grandes em `/media/*` **não** são embarcados no Worker. Usuários autorizados recebem uma resposta de mídia transmitida a partir da publicação existente em `https://felipe03052010.github.io/SYSTEM-84/`. **Não desative o workflow `.github/workflows/pages.yml`**, não remova `public/media/` do processo de publicação e não substitua o redirecionamento antigo antes de confirmar que as mídias continuam respondendo com status 200/206. O tráfego e a disponibilidade do upstream ainda dependem do GitHub Pages e das políticas desses serviços.

Depois que o site Cloudflare estiver validado, atualize a propriedade `url` de `site-deployment.json` para o endereço real da Cloudflare. Isso fará o GitHub Pages redirecionar para o novo frontend no próximo deploy.

## Segurança e limitações

- Não copie `.env`, `.dev.vars`, códigos de convite ou credenciais para o GitHub. Faça a rotação dos convites que já apareceram no histórico público, incluindo os do host anterior.
- O Worker usa cookies `HttpOnly`, `Secure` e `SameSite=Strict` em HTTPS. A API valida a origem dos POSTs.
- Para **assinatura automática** (cartão, renovação mensal sem conferência manual), configure o Mercado Pago seguindo `docs/mercado-pago.md`.
- O fluxo Pix é **manual**: a liberação depende da verificação do crédito pelo administrador. Não é uma integração automática com o banco.
- O plano Free tem limites de requisições, CPU, armazenamento e leituras/gravações D1; confira https://developers.cloudflare.com/workers/platform/limits/ e https://developers.cloudflare.com/d1/platform/limits/ antes de abrir o site para muitos usuários.
- A configuração deliberadamente mantém `server/worker.js` intacto porque ele é usado pela hospedagem anterior `npm run build:hosted`.
