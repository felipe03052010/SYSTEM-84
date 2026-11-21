import { useState } from 'react'
import '../styles/record.css'
/* Carregar o iframe só depois de um gesto do visitante. */
export default function YouTubeEmbed({media}) {
 const [started,setStarted]=useState(false)
 const id=String(media.youtubeId||'')
 const valid=/^[a-zA-Z0-9_-]{11}$/.test(id)
 const url=valid?'https://www.youtube.com/watch?v='+id:''
 const src=valid?'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?rel=0&autoplay=1':''
 return <section className="youtube-embed" aria-label="Vídeo de criador externo">
   <div className="youtube-viewport">
     {started&&valid?<iframe title={media.title||'Vídeo do YouTube'} src={src} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>:
       <div className="youtube-standby">
        <span className="youtube-label">SYS84 / SINAL EXTERNO</span>
        <span className="youtube-orbit" aria-hidden="true">◎</span>
        <strong>{valid?'TRANSMISSÃO EM ESPERA':'FONTE INDISPONÍVEL'}</strong>
        <span>Vídeo hospedado e controlado pelo canal original.</span>
        {valid&&<button type="button" onClick={()=>setStarted(true)}>▶ INICIAR TRANSMISSÃO</button>}
        <small>O player do YouTube será carregado após seu clique.</small>
       </div>}
   </div>
   <div className="youtube-credit"><span>ARQUIVO EXTERNO / DIREITOS DO CRIADOR</span>{url&&<a href={url} target="_blank" rel="noopener noreferrer">ABRIR NO YOUTUBE ↗</a>}</div>
   <p className="youtube-disclaimer">A reprodução depende das permissões do criador. Caso o vídeo não permita incorporação, abra-o no YouTube.</p>
 </section>
}
