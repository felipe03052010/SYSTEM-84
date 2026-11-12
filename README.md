# SYSTEM 84

Arquivo digital com interface de terminal retrô para **filmes, séries, livros e lost media** em domínio público. Todo o conteúdo é lido ou assistido **dentro do site** — os arquivos ficam no próprio site, sem links externos para reprodução.

**Site no ar:** https://felipe03052010.github.io/SYSTEM-84/

## Catálogo

| Seção | Obras |
| --- | --- |
| Filmes | Nosferatu (1922) · Metropolis (1927) · O Gabinete do Dr. Caligari (1920) · Viagem à Lua (1902) |
| Séries (capítulo 1 de seriados históricos) | Flash Gordon Conquers the Universe (1940) · The Phantom Creeps (1939) · The Phantom Empire (1935) · Undersea Kingdom (1936) |
| Livros (texto integral, Project Gutenberg) | Frankenstein · Drácula · O Retrato de Dorian Gray · A Máquina do Tempo |
| Lost media recuperada | Frankenstein (1910) · Le Manoir du diable (1896) |

Cada registro guarda a fonte documental, a licença e a história da preservação. Filmes longos são divididos em partes para respeitar o limite de 100 MB por arquivo do GitHub Pages.

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

Outros comandos: `npm run build`, `npm run check`, `npm run check:media`.

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
