import { build } from 'vite'
import { readFileSync, writeFileSync, rmSync, realpathSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
const deployment=JSON.parse(readFileSync('site-deployment.json','utf8').replace(/^\uFEFF/,''))
const url=new URL(deployment.url)
if(url.protocol!=='https:')throw new Error('Hosted Site must use HTTPS')
await build()
const root=realpathSync('.'),out=resolve(root,'dist'),assets=resolve(out,'assets')
if(dirname(assets)!==out||dirname(out)!==root)throw new Error('Unsafe generated assets path')
rmSync(assets,{recursive:true,force:true})
const target=JSON.stringify(url.origin)
writeFileSync(resolve(out,'index.html'),`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${url.origin}"><title>SYSTEM 84 — Abrindo arquivo</title><style>body{background:#080b09;color:#c0f873;font:14px monospace;min-height:90vh;display:grid;place-content:center;text-align:center}a{color:inherit}</style><p>Conectando ao SYSTEM 84…</p><a href="${url.origin}">Abrir o arquivo ↗</a><script>location.replace(${target}+location.hash)</script></html>`)
console.log('GitHub Pages entry points to the protected hosted Site; media is retained for the authenticated proxy.')
