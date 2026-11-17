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

O acervo completo tem **151 registros**: 27 filmes, 5 séries, 81 livros (com 22 clássicos em língua portuguesa: Machado, Alencar, Aluísio Azevedo, Lima Barreto, Raul Pompeia, Eça, Camões…), 26 dossiês de lost media, 6 fitas de Analog Horror e 6 enigmas ARG. Idiomas, capítulos, fontes e licenças aparecem em cada registro. Títulos traduzidos no catálogo não significam que o texto ou vídeo esteja traduzido.

### Seções do site

| Rota | Conteúdo | Abertura animada |
| --- | --- | --- |
| `/` | Início: sinal do dia, contadores, destaques, recém-chegados, coleções temáticas, gráfico por década | monograma [84] montando |
| `/filmes` | Cinema mudo, clássicos e animação livre | contagem regressiva de projetor 3-2-1 |
| `/series` | Seriados de matinê por capítulo | estática + tubo de TV ligando |
| `/livros` | Leitor interno com busca no livro e progresso | livro abrindo, páginas virando |
| `/lost-media` | Dossiês de obras perdidas e recuperadas | setores de disco sendo recuperados |
| `/analog-horror` | Fitas fictícias (CC0) em formato de transcrição | barras de cor + "ESTE NÃO É UM TESTE" |
| `/arg` | Seis enigmas com progresso salvo | cofre e texto descriptografando |
| `/linha-do-tempo` | Todo o acervo por época, com filtro | contador de anos de 700 a.C. a 2026 |
| `/pesquisa` | Busca por título, autor, ano e etiqueta | radar |
| `/comunidade` | Mural BBS e fila de envios | discagem de modem |
| `/sobre` | Missão, planos, princípios e perguntas frequentes | globo de arame sendo desenhado |
| `/obra/:id` | Ficha, player/leitor, procedência e registros relacionados | pasta confidencial abrindo |

Clique, Esc, Enter ou espaço pulam a abertura; `?loader=0` desliga. Depois da abertura o conteúdo entra com um movimento ligado ao tema e os blocos aparecem ao rolar. Movimento reduzido no sistema desliga tudo.

### Como a mídia é carregada

Cada arquivo é tentado em ordem: cópia local do site (`public/media`) → espelho do GitHub Pages → fonte original. Partes de um mesmo filme usam fragmentos de tempo (`#t=início,fim`) quando caem para a fonte original. Páginas HTML (Gutenberg Austrália) viram texto no leitor. Se tudo falhar, o site mostra o erro com um link para a fonte.

Cada registro guarda a fonte documental, a licença e a história da preservação. Filmes locais longos são divididos em partes. Os vídeos com `remoteUrl` não são baixados na compilação e dependem da disponibilidade do acervo; a reprodução continua no player interno.

Os dossiês de lost media são resumos originais com fontes institucionais. Analog Horror contém histórias fictícias em formato de transcrição, e ARG contém enigmas locais com dicas, conclusão e progresso salvo no navegador. Esses textos originais estão disponibilizados sob CC0 1.0; as obras de terceiros mantêm suas próprias licenças.

As transições entre diretórios duram 220–520 ms, abaixo da inicialização BIOS. Cada seção tem uma animação distinta. Sons de digitação e cliques podem ser desativados no cabeçalho, com preferência salva. O cursor retrô é aplicado a dispositivos com ponteiro preciso; movimento reduzido é respeitado.

## Estrutura

- `src/` — React 19 + Vite 7; leitor de livros e player de vídeo internos, com progresso lembrado no navegador.
- `src/data/catalog.json` — catálogo histórico (fonte de verdade do banco MySQL).
- `src/data/expansion.js` e `src/data/acervo-ampliado.js` — fichas com mídia remota, dossiês e ficções originais; `src/data/autores.js` — autoria; `src/data/records.js` junta tudo.
- `src/utils/media.js` — ordem de origens, conversão de HTML e paginação do leitor.
- `src/components/RouteTransition.jsx` + `src/styles/intros.css` — aberturas de cada seção.
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


## Analog Horror / curadoria externa

O diretório `#/analog-horror` inclui as fitas originais CC0 do SYSTEM 84 e uma seleção de vídeos de LOCAL58TV (Kris Straub) e Gemini Home Entertainment (Remy Abode). Os vídeos externos têm autoria, fonte, código e glifo geométrico exclusivo e não são apresentados como CC0. O iframe é carregado apenas quando o visitante clica; se a incorporação estiver bloqueada pelo autor, há link ao YouTube original. Dados: `src/data/analog-youtube.js`. Pictogramas: `src/components/analogYoutubeGlyphs.jsx`. Player: `src/components/YouTubeEmbed.jsx`.

**Pagamentos:** o checkout Mercado Pago existente trata pagamento avulso e confirmação automática de acesso de um mês, não renovação recorrente. Uma assinatura recorrente exige integração separada e validação do webhook e das credenciais de produção.

### Histórico granular do catálogo de Analog Horror

As alterações visuais e o player podem existir sem novos vídeos externos. Cada nova obra do YouTube deve ser registrada em um commit exclusivo, adicionando simultaneamente sua ficha em `src/data/analog-youtube.js` e seu glifo único em `src/components/analogYoutubeGlyphs.jsx`. A verificação de catálogo e de interface funciona em todas as etapas (de zero a vários vídeos). Não reescreva a história publicada da branch `main`.
