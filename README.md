# SYSTEM 84

Arquivo digital com interface de terminal retrô para **filmes, séries, livros, lost media, Analog Horror e ARG**. Leitura e reprodução acontecem dentro do site. O catálogo reúne domínio público, filmes Creative Commons com atribuição e ficções originais CC0. Novos vídeos são transmitidos diretamente do acervo de origem; livros e vídeos históricos já existentes usam arquivos locais.

**Site no ar:** https://felipe03052010.github.io/SYSTEM-84/

## Catálogo

| Seção | Obras |
| --- | --- |
| Filmes | Nosferatu (1922) · Metropolis (1927) · O Gabinete do Dr. Caligari (1920) · Viagem à Lua (1902) |
| Séries (capítulo 1 de seriados históricos) | Flash Gordon Conquers the Universe (1940) · The Phantom Creeps (1939) · The Phantom Empire (1935) · Undersea Kingdom (1936) |
| Livros (texto integral, Project Gutenberg) | Frankenstein · Drácula · O Retrato de Dorian Gray · A Máquina do Tempo |
| Lost media recuperada | Frankenstein (1910) · Le Manoir du diable (1896) |

O catálogo ampliado contém **83 registros**: 14 filmes, 5 séries/coleções, 42 livros, 10 registros de lost media, 6 transcrições originais de Analog Horror e 6 enigmas ARG. A tabela acima documenta a seleção histórica inicial. Idiomas, disponibilidade de capítulos, fontes e licenças aparecem em cada registro. Os títulos traduzidos no catálogo não significam que o texto ou vídeo esteja traduzido.

Cada registro guarda a fonte documental, a licença e a história da preservação. Filmes locais longos são divididos em partes. Os vídeos com `remoteUrl` não são baixados na compilação e dependem da disponibilidade do acervo; a reprodução continua no player interno.

Os dossiês de lost media são resumos originais com fontes institucionais. Analog Horror contém histórias fictícias em formato de transcrição, e ARG contém enigmas locais com dicas, conclusão e progresso salvo no navegador. Esses textos originais estão disponibilizados sob CC0 1.0; as obras de terceiros mantêm suas próprias licenças.

As transições entre diretórios duram 220–520 ms, abaixo da inicialização BIOS. Cada seção tem uma animação distinta. Sons de digitação e cliques podem ser desativados no cabeçalho, com preferência salva. O cursor retrô é aplicado a dispositivos com ponteiro preciso; movimento reduzido é respeitado.

## Estrutura

- `src/` — React 19 + Vite 7; leitor de livros e player de vídeo internos, com progresso lembrado no navegador.
- `src/data/catalog.json` — o catálogo (fonte de verdade do site e do banco).
- `scripts/download-media.mjs` — baixa as mídias do Internet Archive e do Project Gutenberg, confere checksums e transcodifica vídeos com ffmpeg (download único por fonte, mesmo quando dividida em partes).
- `database/schema.sql` — esquema MySQL (`works`, `media`, `sources`); veja `database/README.md`.
- `.github/workflows/pages.yml` — a cada push em `main`: baixa as mídias, valida, compila e publica no GitHub Pages.

## Rodar localmente

Requisitos: Node.js 20.19+ (ou 22.12+). Vite 7 não roda em versões anteriores.

```bash
npm install
npm run media:download   # baixa e prepara as mídias em public/media
npm run dev              # abre http://localhost:5173
```

Outros comandos: `npm run build`, `npm run check`, `npm run check:media`, `npm test`. O teste de interação cobre novas abas, pesquisa sem acentos, solução e restauração de ARG, dossiês e preferência sonora. O workflow executa testes antes da preparação de mídias.

## Banco de dados local (MySQL)

O catálogo também é guardado em um MySQL local isolado (porta 3307), para consultas e edições no próprio computador. A publicação no GitHub Pages é estática e usa a cópia JSON do catálogo; o servidor do Pages não executa MySQL.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-mysql.ps1
npm run db:check    # confere o servidor e as tabelas
npm run db:seed     # importa o catálogo para o banco
npm run db:export   # exporta o banco de volta para src/data/catalog.json
```

As credenciais ficam em `.env.local` (ignorado pelo git). Nunca envie credenciais ou o diretório de dados ao repositório.

## Publicação

O deploy é automático: qualquer push em `main` publica em https://felipe03052010.github.io/SYSTEM-84/ (workflow `.github/workflows/pages.yml`, fonte de Pages em **GitHub Actions**).

## Notas de preservação

- Filmes mudos são apresentados sem trilha sonora moderna; os seriados mantêm o áudio original.
- A cópia pública de cada obra indica a fonte (Internet Archive / Project Gutenberg) e a licença.


## Optical Memory / acesso e assinatura

A home é editorial, sem computador. Antes dela, uma inicialização BIOS dá acesso a uma sala com três monitores CRT fotorealistas: Criador, Administrador e Assinar o arquivo. Os campos são HTML interativo dentro das telas; movimento reduzido é respeitado.

O site completo está em https://system84-optical-memory.felipegabrielpessoa8.chatgpt.site . O endereço do GitHub Pages redireciona para ele. A hospedagem integrada usa um Worker e um banco D1; o Pages mantém os arquivos históricos usados pelo proxy autenticado de mídia. Filmes remotos e suas fontes institucionais continuam sendo públicos na origem.

- Contas são validadas no servidor. Senhas pessoais usam PBKDF2; sessões usam cookie HttpOnly, Secure em HTTPS e SameSite Strict.
- Criador e administrador precisam de senhas de convite separadas, configuradas como secrets. Elas não aparecem no bundle nem neste repositório. Cada pessoa cria a própria senha pessoal.
- Assinantes pagam R$ 15 por mês diretamente à chave Nubank configurada no servidor. O aviso de pagamento fica pendente e não libera o acervo.
- O admin confere o crédito de R$ 15 no app Nubank e informa o identificador bancário único para liberar um mês. A mesma transação não pode ser reutilizada. O vencimento é calculado pelo servidor, incluindo meses curtos.
- No vencimento, as rotas do aplicativo voltam à entrada e o proxy de mídia nega acesso. Alterar localStorage não concede função administrativa nem assinatura.

### Hospedagem

`.openai/hosting.json` identifica o Site existente; reutilize esse ID. `server/api.js` contém a API portátil e `server/worker.js` é o Worker hospedado. O build `npm run build:hosted` embute os assets e produz `dist/server/index.js`. O esquema inicial está em `server/schema.sql`; as migrações hospedadas ficam na cópia de fonte do Sites. O Worker recebe a conexão D1 como `DB` e as variáveis secretas `ADMIN_INVITE_CODE`, `CREATOR_INVITE_CODE`, `PIX_KEY`.

Para desenvolvimento Node local, copie `server/.env.example` para `server/.env.local`, configure os convites e a chave Pix, rode `npm run build:paid` e `npm run start:access`. O SQLite local fica em `server/data/` e não vai para o Git. O Vite estático sozinho permite apenas a prévia visual e não processa pagamentos.

Validações: `npm test`, `npm run test:access`, `npm run check`, `npm run build:hosted`. A publicação do GitHub usa `npm run build:pages` para gerar a página de encaminhamento, preservando a mídia.

O monitor foi criado com ImageGen a partir de um briefing de fotografia frontal de CRT bege envelhecido; a imagem enviada pelo usuário foi referência estética. As fontes são Space Grotesk e IBM Plex Mono. Os formulários e o logotipo permanecem nativos do site.

Atualização visual: as imagens e carcaças de computadores foram retiradas da interface. O tema global agora simula a própria tela CRT, com fósforo verde, tipografia monoespaçada, linhas de varredura estáticas e vinheta discreta. A BIOS mantém os sons de inicialização.
