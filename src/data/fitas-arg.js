// Seleção de episódios publicados pelos próprios criadores.
const episodios = [
  ["LOCAL58TV","Kris Straub",2017,"Station ID","4MEHCJVhyZ0","As vinhetas da emissora dão ao espectador os primeiros sinais de que algo interfere na programação."],
  ["LOCAL58TV","Kris Straub",2017,"Contingency","3c66w6fVqOI","Um comunicado de emergência ocupa a grade de uma estação de televisão fictícia."],
  ["LOCAL58TV","Kris Straub",2019,"Skywatching","2BD-ba-aXQo","Uma câmera amadora acompanha o céu noturno. A aproximação da Lua transforma a observação em ameaça."],
  ["LOCAL58TV","Kris Straub",2022,"Close","oFl8ynCN3Ek","Especial de Halloween apresentado como uma transmissão da emissora Local 58."],
  ["Gemini Home Entertainment","Remy Abode",2020,"Wilderness Survival Guide","hAK9uxwCOM4","Uma fita instrucional enumera cuidados para sobreviver em uma floresta onde as ameaças desafiam os guias comuns."],
  ["Gemini Home Entertainment","Remy Abode",2020,"Deep Root Disease","kKdmoYtrEi0","Uma apresentação clínica descreve o avanço de uma doença fictícia que cria raízes no corpo."],
  ["Gemini Home Entertainment","Remy Abode",2020,"Christmas Eve Party","gPIN2Q-PBQs","A gravação de uma festa de Natal leva a série para dentro dos arquivos de uma família."],
  ["Gemini Home Entertainment","Remy Abode",2020,"Monthly Progress Report","mfW4WGMITCc","Um relatório mensal em vídeo documenta acontecimentos da série sob a aparência de rotina administrativa."],
  ["Gemini Home Entertainment","Remy Abode",2020,"Advanced Mining Vehicle","76TyOcRxH6Q","O vídeo de apresentação de um veículo de mineração acompanha a máquina sob o solo."],
  ["Gemini Home Entertainment","Remy Abode",2021,"Home Invasion Help","4yX55S8lGQ0","Um vídeo de segurança doméstica instrui o espectador diante de uma invasão incomum."],
  ["Gemini Home Entertainment","Remy Abode",2021,"Crusader Probe Mission","0sd2ahUfi9Y","Imagens transmitidas por uma sonda de exploração espacial compõem o registro da missão Crusader."],
  ["Gemini Home Entertainment","Remy Abode",2020,"Games for Kids","agg34__i384","Uma fita de entretenimento infantil transforma a explicação de brincadeiras em uma experiência inquietante."],
  ["The Mandela Catalogue","Alex Kister",2021,"Overthrone","q0EpOiu8YkI","Um desenho de temática bíblica ganha vozes e intervenções que alteram o sentido da anunciação."],
  ["The Mandela Catalogue","Alex Kister",2021,"Exhibition","n3M8qnsztvw","Imagens bíblicas e gravações fragmentadas aproximam dois períodos da história de Mandela County."],
  ["The Mandela Catalogue","Alex Kister",2021,"Intruder Alert","KL9Q0KItf-8","Um alerta televisivo associa uma figura na tela a uma sequência de desaparecimentos."],
  ["The Walten Files","Martin Walls",2020,"Company Introductory Tape","uShQXE1Dla8","Fitas de treinamento apresentam a Bunny Smiles. Esta edição foi republicada pela equipe em 2023."],
  ["The Walten Files","Martin Walls",2020,"Relocate Project","iTFnNOL4hwg","O segundo episódio reúne registros internos sobre a transferência de equipamentos da Bunny Smiles."],
  ["Backrooms","Kane Pixels",2022,"Motion Detected","4FDotUHfpWk","Câmeras de vigilância registram movimento nos corredores de um espaço aparentemente vazio."],
  ["Backrooms","Kane Pixels",2022,"Informational Video","ZIFhglHn3W0","Um vídeo de orientação da Async acompanha uma expedição pelos corredores do complexo."],
  ["Backrooms","Kane Pixels",2022,"Pitfalls","0XwlWXtpaCM","Uma equipe encontra uma sequência de vãos no piso. A câmera acompanha a exploração que se segue."],
]

export const fitasArg = episodios.map(([serie, author, year, episodio, youtubeId, description], index) => {
  const id = 85081 + index
  const title = serie + ' — ' + episodio
  const link = 'https://www.youtube.com/watch?v=' + youtubeId
  const license = 'Direitos do criador. Reprodução pelo player oficial do YouTube.'
  return {
    id, code: 'AH-' + id, type: 'analog-horror', title, author, year, description,
    tags: ['analog horror', serie, 'vídeo'], availability: 'available', language: 'Inglês',
    rightsNote: license, sources: [{ title: 'Episódio no canal oficial — ' + serie, url: link }],
    media: [{ kind: 'youtube', title: episodio, youtubeId, link, license, language: 'Inglês' }],
  }
})
