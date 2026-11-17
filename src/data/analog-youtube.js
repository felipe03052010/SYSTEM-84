/* Curadoria de vídeos de terceiros: URLs públicas, sem download ou relicenciamento. */
// Cada novo registro será acrescentado em um commit separado.
const videos = [
  ['M75VLQuFPrY','yt-alerta',2017,'LOCAL58TV — Weather Service','Kris Straub / LOCAL58TV','Alerta meteorológico fictício transmitido com a estética de uma emissora analógica.',['local58','televisão','transmissão']],
  ['vyDvpwpRPM4','yt-fauna',2019,"Gemini Home Entertainment — World’s Weirdest Animals",'Remy Abode / Gemini Home Entertainment','Documentário fictício de natureza com visual de fita educativa.',['gemini','natureza','documentário']],
  ['qez0S2omPFE','yt-tempestade',2019,'Gemini Home Entertainment — Storm Safety Tips','Remy Abode / Gemini Home Entertainment','Vídeo fictício de orientação sobre tempestades em estilo VHS.',['gemini','tempestades','sinal']],
  ['2zOtDvHP8Kw','yt-computador',2019,'Gemini Home Entertainment — Artificial Computer Learning','Remy Abode / Gemini Home Entertainment','Apresentação ficcional de inteligência artificial como gravação institucional.',['gemini','computadores','tecnologia']],
  ['6gCUsOfgjvs','yt-orbita',2020,'Gemini Home Entertainment — Our Solar System','Remy Abode / Gemini Home Entertainment','Documentário ficcional de astronomia, apresentado como aula audiovisual.',['gemini','sistema solar','astronomia']],
  ['R19PMnU9g1A','yt-camp',2020,'Gemini Home Entertainment — Camp Information Video','Remy Abode / Gemini Home Entertainment','Fita informativa fictícia sobre um acampamento e seu passado.',['gemini','acampamento','vhs']],
]
export const analogYoutube = videos.map(([id,glyph,year,title,author,description,tags],i)=>{
  const url='https://www.youtube.com/watch?v='+id
  return {
    id:'yt-'+id,code:'AH-YT-'+String(i+1).padStart(3,'0'),type:'analog-horror',
    title,author,year,description,tags:['analog horror','youtube','obra externa',...tags],
    glyph,availability:'available',language:'Inglês',
    rightsNote:'Obra de '+author+'. Reprodução incorporada pelo YouTube. O SYSTEM 84 não hospeda o vídeo e não declara propriedade intelectual sobre ele.',
    sources:[{title:'Vídeo original publicado pelo criador',url}],
    media:[{kind:'youtube',youtubeId:id,link:url,title,language:'Inglês',license:'Direitos reservados ao criador original; incorporação sujeita às permissões do YouTube.'}],
  }
})
