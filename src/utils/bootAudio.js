import { resumeAudio, soundEnabled } from './audio.js'

// All sources belong to this boot instance and are stopped when the screen exits.
export function createBootAudio() {
  let context=null,disposed=false,active=false
  const voices=new Set()
  function track(source,gain){
    const voice={source,gain};voices.add(voice)
    source.onended=()=>{source.disconnect();gain.disconnect();voices.delete(voice)}
    return source
  }
  function tone(frequency,duration,volume,delay=0,type='square'){
    if(!active||disposed||!soundEnabled())return
    const at=context.currentTime+delay,osc=context.createOscillator(),gain=context.createGain()
    osc.type=type;osc.frequency.setValueAtTime(frequency,at)
    gain.gain.setValueAtTime(0.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001,at+duration)
    osc.connect(gain);gain.connect(context.destination);track(osc,gain).start(at);osc.stop(at+duration+0.01)
  }
  return {
    async start(){
      if(disposed||active||!soundEnabled())return false
      context=await resumeAudio()
      if(!context||disposed||!soundEnabled())return false
      active=true
      // Quiet filtered fan/drive noise, underneath the motherboard POST beep.
      const buffer=context.createBuffer(1,context.sampleRate,context.sampleRate),data=buffer.getChannelData(0)
      let previous=0
      for(let i=0;i<data.length;i++){previous=(previous+0.03*(Math.random()*2-1))/1.03;data[i]=previous*3}
      const fan=context.createBufferSource(),gain=context.createGain()
      fan.buffer=buffer;fan.loop=true;gain.gain.setValueAtTime(0.005,context.currentTime)
      fan.connect(gain);gain.connect(context.destination);track(fan,gain).start()
      tone(880,0.16,0.017)
      tone(440,0.06,0.006,0.21)
      return true
    },
    tick(stage){
      if(!soundEnabled()){this.stop();return}
      if(stage===messagesComplete){tone(523.25,0.1,0.012,0,'triangle');tone(659.25,0.1,0.01,0.12,'triangle');tone(783.99,0.16,0.01,0.24,'triangle')}
      else {tone(stage<4?1250:180,0.025,0.004);tone(650+stage*80,0.018,0.003,0.045)}
    },
    stop(){
      if(disposed)return
      disposed=true;active=false
      for(const {source,gain}of voices){source.onended=null;try{source.stop()}catch{/* Already ended. */}source.disconnect();gain.disconnect()}
      voices.clear()
    },
  }
}
const messagesComplete=9
