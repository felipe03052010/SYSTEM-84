import assert from 'node:assert/strict'
const sources=[],volumes=[]
let context
class Node {
 connect(){} disconnect(){this.disconnected=true}
 start(){this.started=true} stop(){this.stopped=true}
}
class AudioContext {
 constructor(){context=this;this.state='running';this.currentTime=0;this.sampleRate=8000;this.destination={}}
 resume(){this.state='running';return Promise.resolve()}
 createOscillator(){const source=new Node();source.frequency={setValueAtTime(){}};sources.push(source);return source}
 createGain(){const node=new Node();node.gain={setValueAtTime(value){volumes.push(value)},exponentialRampToValueAtTime(value){volumes.push(value)}};return node}
 createBuffer(channels,length){return {getChannelData(){return new Float32Array(length)}}}
 createBufferSource(){const source=new Node();sources.push(source);return source}
}
globalThis.window={AudioContext}
globalThis.localStorage={getItem(){return 'on'},setItem(){}}
const {createBootAudio}=await import('../src/utils/bootAudio.js')
const {setSoundEnabled}=await import('../src/utils/audio.js')
const boot=createBootAudio();assert.equal(await boot.start(),true)
assert(sources.some(source=>source.loop&&source.started),'Fan starts only after audio is enabled')
boot.tick(3);boot.tick(9)
assert(sources.length>6,'POST, processing ticks and completion tones are scheduled')
assert(Math.max(...volumes)<=0.017,'Startup volume is bounded')
boot.stop();boot.stop()
assert(sources.every(source=>source.stopped&&source.disconnected),'Leaving the screen stops and disconnects every source')
const count=sources.length;boot.tick(4);assert.equal(sources.length,count,'No audio can start after disposal')
setSoundEnabled(false);assert.equal(await createBootAudio().start(),false);assert.equal(sources.length,count)
setSoundEnabled(true)
let resume
context.state='suspended';context.resume=()=>new Promise(resolve=>{resume=()=>{context.state='running';resolve()}})
const cancelled=createBootAudio(),pending=cancelled.start();cancelled.stop();resume();assert.equal(await pending,false)
assert.equal(sources.length,count,'Skipping while browser audio unlocks cannot leave a running fan')
console.log('PASS: boot sound phases, volume, mute preference, source cleanup and interrupted audio unlock.')
