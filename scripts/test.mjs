import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
await build({entryPoints:['scripts/check-interactions.jsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},jsx:'automatic',define:{'import.meta.env.BASE_URL':'"/"'},outfile:'work/check-interactions.mjs'})
for (const script of ['work/check-interactions.mjs','scripts/check-boot-audio.mjs']) {
  const result=spawnSync(process.execPath,[script],{stdio:'inherit',windowsHide:true})
  if (result.status!==0) process.exit(result.status??1)
}
