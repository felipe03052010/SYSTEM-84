import { build as viteBuild } from 'vite'
import { build as bundle } from 'esbuild'
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
process.env.VITE_ACCESS_MODE='paid'
await viteBuild()
const assets={},types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'}
function collect(directory){for(const name of readdirSync(directory)){const path=join(directory,name);if(statSync(path).isDirectory()){if(!['server','.openai','media'].includes(name))collect(path)}else{const type=types[extname(path)];if(type)assets['/'+relative('dist',path).replaceAll('\\','/')]={type,body:readFileSync(path).toString('base64')}}}}
collect('dist');mkdirSync('dist/server',{recursive:true})
await bundle({entryPoints:['server/worker.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:'dist/server/index.js',plugins:[{name:'embedded-assets',setup(build){build.onResolve({filter:/^site-assets$/},()=>({path:'site-assets',namespace:'assets'}));build.onLoad({filter:/.*/,namespace:'assets'},()=>({contents:`export default ${JSON.stringify(assets)}`,loader:'js'}))}}]})
mkdirSync('dist/.openai',{recursive:true});writeFileSync('dist/.openai/hosting.json',readFileSync('.openai/hosting.json'))
console.log(`Embedded ${Object.keys(assets).length} assets in the Worker.`)
