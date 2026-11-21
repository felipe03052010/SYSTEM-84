// Nomes canônicos das cópias e diretórios de armazenamento do Wikimedia Commons.
const arquivos = {
  85006: ["Winsor_McCay_(1914)Gertie_the_Dinosaur.webm","a/ac"],
  85008: ["The_Country_Doctor_(1909).webm","a/a3"],
  85009: ["From_the_Manger_to_the_Cross_(1912).webm","9/9a"],
  85010: ["The_Kiss_(1900).webm","4/4a"],
  85061: ["A_Bashful_Bigamist_(1920).webm","0/08"],
  85062: ["Billy_and_His_Pal_(1911).webm","7/73"],
  85063: ["Brillantino_the_Bullfighter_(1922).webm","7/7c"],
  85064: ["Captain_Jinks_the_Cobbler_(1916).webm","c/c7"],
  85065: ["The_Sergeant_(1910)_preserved.webm","d/d7"],
  85066: ["China_and_the_Chinese_(1917).webm","3/37"],
  85067: ["Colonel_Heeza_Liar's_Forbidden_Fruit.ogv","b/b5"],
  85068: ["Defying_destiny_(1923).webm","9/94"],
  85070: ["An_Easter_Lily_(1914).webm","7/71"],
  85071: ["The_Girl_Stage_Driver_(1914).webm","1/1f"],
  85072: ["The_Greater_Call_(1910).webm","1/1d"],
  85073: ["Hollywood_Snapshots_(1922).webm","d/d1"],
  85074: ["Idle_Wives_(1916).webm","0/0a"],
  85075: ["Jean_the_Matchmaker_(1910).webm","b/be"],
  85077: ["A_modern_Cinderella_(1910).webm","d/dc"],
  85078: ["Reckless_Youth_(1922).webm","f/f6"],
  85080: ["A_Window_on_Washington_Park_(1913).webm","8/89"]
}

const fitas = {
  "85069": [
    "zm27-XHAES0",
    "Cópia de The Diver (1911)"
  ],
  "85076": [
    "qzHfW8CUg-k",
    "Material sobrevivente de Maytime (1923)"
  ],
  "85079": [
    "7ZfMzW5vX-k",
    "Cópia de Unseen Forces (1920)"
  ]
}

export function copiaPreservada(id, titulo) {
  if (fitas[id]) {
    const [youtubeId, title] = fitas[id]
    const link = 'https://www.youtube.com/watch?v=' + youtubeId
    return {kind:'youtube', youtubeId, link, title, license:'Exibição pelo player do canal de origem.'}
  }
  if (!arquivos[id]) return null
  const [nome, pasta] = arquivos[id]
  const arquivo = encodeURIComponent(nome)
  return {
    kind: 'video', title: titulo, path: 'media/acervo-' + id + '.' + nome.split('.').pop(),
    remoteUrl: 'https://upload.wikimedia.org/wikipedia/commons/' + pasta + '/' + arquivo,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:' + arquivo,
    license: 'Créditos e situação dos direitos desta cópia na ficha do Wikimedia Commons.'
  }
}
