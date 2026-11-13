import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
await build({entryPoints:['scripts/check-interactions.jsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},jsx:'automatic',define:{'import.meta.env.BASE_URL':'"/"'},outfile:'work/check-interactions.mjs'})
const result = spawnSync(process.execPath,['work/check-interactions.mjs'],{stdio:'inherit',windowsHide:true})
process.exit(result.status ?? 1)
