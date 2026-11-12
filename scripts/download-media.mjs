import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = fileURLToPath(new URL('../', import.meta.url))
const catalog = JSON.parse(await fs.readFile(path.join(root,'src/data/catalog.json'),'utf8'))
const require = createRequire(import.meta.url)
const cache = path.join(root,'.media-cache')
await fs.mkdir(cache,{recursive:true})

function run(program,args) {
  return new Promise((resolve,reject)=>{
    const child=spawn(program,args,{stdio:['ignore','ignore','pipe'],windowsHide:true})
    let errors=''
    child.stderr.on('data',b=>{errors=(errors+b).slice(-4000)})
    child.on('error',reject)
    child.on('exit',code=>code===0?resolve():reject(new Error(`${program} failed (${code}): ${errors}`)))
  })
}
async function hash(file,algorithm='md5') {
  const digest=createHash(algorithm)
  for await(const part of createReadStream(file))digest.update(part)
  return digest.digest('hex')
}
async function exists(file){try{return(await fs.stat(file)).size>0}catch{return false}}
function safeOutput(relative) {
  if(!/^media\/[a-z0-9_.-]+\.(mp4|txt)$/.test(relative))throw new Error(`Unsafe media path: ${relative}`)
  return path.join(root,'public',relative)
}
const filter=process.argv.find(x=>x.startsWith('--only='))?.slice(7)
const jobs=catalog.flatMap(r=>r.media).filter(m=>!filter||m.kind===filter||m.path.includes(filter))

// Single-flight download: partes de um mesmo filme compartilham o sourceKey e
// devem baixar o arquivo-fonte apenas uma vez, nunca em paralelo.
const inflight = new Map()
async function ensureSource(media) {
  const key = media.sourceKey || path.basename(media.path)
  const source = path.join(cache, key + '.source')
  const verified = await exists(source) && (!media.sourceChecksum || await hash(source, media.sourceChecksum.algorithm) === media.sourceChecksum.value)
  if (verified) return source
  if (!inflight.has(key)) {
    inflight.set(key, (async () => {
      console.log(`Downloading source: ${key}`)
      await run(process.platform==='win32'?'curl.exe':'curl',['--fail','--location','--retry','4','--retry-all-errors','--connect-timeout','30','--max-time','1800','--continue-at','-','--silent','--show-error',media.sourceUrl,'--output',source])
      if (media.sourceChecksum && await hash(source, media.sourceChecksum.algorithm) !== media.sourceChecksum.value) {
        await fs.rm(source, { force: true })
        throw new Error(`Source checksum mismatch: ${media.path} (${key}); cached source removed, retry to download again.`)
      }
      return source
    })())
  }
  try { await inflight.get(key) } finally { inflight.delete(key) }
  return source
}

async function prepare(media){
  const output=safeOutput(media.path)
  await fs.mkdir(path.dirname(output),{recursive:true})
  if(await exists(output)){console.log(`Present: ${media.path}`);return}
  const source=await ensureSource(media)
  if(media.kind==='text'){
    const text=await fs.readFile(source,'utf8')
    if(!text.includes('PROJECT GUTENBERG')||text.length<50000||/^\s*</.test(text))throw new Error(`Invalid book response: ${media.path}`)
    await fs.copyFile(source,output)
  }else{
    const ffmpeg = process.env.FFMPEG_PATH || require('ffmpeg-static')
    console.log(`Encoding for internal player: ${media.path}`)
    const temporary=output+'.part.mp4'
    const t=media.transform
    const args=['-hide_banner','-loglevel','error','-y']
    if(t.start)args.push('-ss',String(t.start))
    args.push('-i',source,'-map','0:v:0','-vf',`scale=${t.maxWidth}:-2:force_original_aspect_ratio=decrease`,'-c:v','libx264','-preset','veryfast','-b:v',t.videoBitrate,'-maxrate','400k','-bufsize','800k','-pix_fmt','yuv420p','-threads','2')
    if(t.mute)args.push('-an')
    else args.push('-map','0:a:0?','-c:a','aac','-b:a','48k','-ac','1')
    if(t.duration)args.push('-t',String(t.duration))
    args.push('-movflags','+faststart',temporary)
    await run(ffmpeg,args)
    await fs.rename(temporary,output)
  }
  console.log(`Ready: ${media.path} (${((await fs.stat(output)).size/1024/1024).toFixed(1)} MiB)`)
}
let cursor=0
await Promise.all(Array.from({length:2},async()=>{while(cursor<jobs.length)await prepare(jobs[cursor++])}))
console.log('Media preparation complete.')
