#!/usr/bin/env node
/**
 * Publica o dossiê visual como site estático navegável:
 * cada rota vira uma pasta com index.html, para abrir direto pelo arquivo
 * ou por qualquer servidor.
 *
 * Uso: node scripts/build-dossie-site.mjs
 * Saída: work/dossie-site/
 */
import { cp, mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] || '.'
const dist = join(root, 'dist')
const out = join(root, 'work/dossie-site')

await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
await cp(dist, out, { recursive: true })

// O site usa HashRouter: /#/filmes. Geramos um espelho em pastas para
// quem abrir o arquivo direto ver o mesmo dossiê sem precisar de servidor.
const routes = ['', 'filmes', 'series', 'livros', 'pesquisa', 'lost-media', 'comunidade', 'obra/5']
const index = await import('node:fs/promises').then((fs) => fs.readFile(join(dist, 'index.html'), 'utf8'))

for (const route of routes) {
  if (!route) continue
  const dir = join(out, route)
  await mkdir(dir, { recursive: true })
  const depth = route.split('/').length
  const up = '../'.repeat(depth)
  const html = index
    .replace(/(href|src)="\.\/assets\//g, `$1="${up}assets/`)
    .replace(/(href|src)="\/assets\//g, `$1="${up}assets/`)
    .replace('<head>', `<head><base href="${up}">`)
    .replace('</body>', `<script>location.hash = '#/${route}?loader=0'</script></body>`)
  await writeFile(join(dir, 'index.html'), html)
}

const readme = `# SYSTEM 84 — Dossiê visual unificado

Este pacote é o site do SYSTEM 84 com a estética do dossiê visual
(paleta #090D0B / #EBEDDF / #A8FF60 / #FF6332, Syncopate + Space Grotesk +
IBM Plex Mono + VT323, ângulos retos e fios de 1px).

## Como abrir

- Abra \`index.html\` na raiz: a página inicial do arquivo.
- As pastas \`filmes/\`, \`series/\`, \`livros/\`, \`pesquisa/\`, \`lost-media/\`,
  \`comunidade/\` e \`obra/5/\` abrem cada prancha do dossiê.
- Se o navegador bloquear algo, suba um servidor local nesta pasta:
  \`python -m http.server 8000\` e abra http://localhost:8000

## Conteúdo

Todo o acervo é de domínio público ou ficção original CC0, com fonte e
licença em cada ficha.
`
await writeFile(join(out, 'LEIA-ME.md'), readme)

console.log('pronto:', out, existsSync(join(out, 'index.html')))
