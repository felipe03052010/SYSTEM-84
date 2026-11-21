// Publicações da websérie no canal Marble Hornets, em ordem numérica.
const videos = [
  [1, 2009, 'Bn59FJ4HrmU'],
  [2, 2009, 'JVECb0bYq8w'],
  [3, 2009, 'b52bwPam7O8'],
  [4, 2009, 'yBNQZvOkSCw'],
  [5, 2009, '6GMQ_FULc4M'],
  [6, 2009, 'lQGvn82NNQw'],
  [7, 2009, '0q3cQjeerNU'],
  [8, 2009, 'rfAL3hubpoA'],
  [9, 2009, 'OT25GyRBHy8'],
  [10, 2009, '1icUgVa7EYg'],
  [11, 2009, '5a4Tm34wwck'],
  [12, 2009, 'UXKZlwoPfBU'],
  [13, 2009, 'j-YEsCFM100'],
  [14, 2009, '1lxsMHeOGjE'],
  [15, 2009, 'BFb7eTQmVA8'],
  [16, 2009, '5agHXjRdb_8'],
  [17, 2009, 'IqsAWxVUUIU'],
  [18, 2009, '6BsPPQSwdVw'],
  [19, 2009, 'x-qZUgxShlM'],
  [20, 2009, '1VKridtP5FQ'],
  [21, 2009, 'N-TCS5_yQj0'],
  [22, 2009, '-Y7_WP9HOME'],
  [23, 2010, 'SzdZyZgCY58'],
  [24, 2010, 'B_rA7gQl95w'],
  [25, 2010, 'OCASnK9F4DI'],
  [26, 2010, 'tLIpL26ztFo'],
  [27, 2010, 'Hn7Qow98Gr4'],
  [28, 2010, 'MM_2_9fUcfs'],
  [29, 2010, 'bxCVvI7kgR0'],
  [30, 2010, 'rPCEaa7-Hrw'],
  [31, 2011, 'LL0URnfDBos'],
  [32, 2011, 'wjFnujnjC8M'],
  [33, 2011, 'h_lgYbjAKG4'],
  [34, 2011, 'MaR4NbfyzAc'],
  [35, 2011, 'cJ3Orif19ew'],
  [36, 2011, 'O6p-8Lu-Hm8'],
  [37, 2011, 'hE8aZZx1dTI'],
  [38, 2011, 'FMcgL3hgMYM'],
  [39, 2011, '6eDQUXD7G3Y'],
  [40, 2011, 'p2Jo6yrUVwM'],
]

export const enigmas = videos.map(([numero, year, youtubeId]) => {
  const episodio = numero === 37 ? 'enttry #37' : numero === 15 ? 'Entry #15 - Interview with Tim' : 'Entry #' + numero
  const title = 'Marble Hornets — ' + episodio
  const url = 'https://www.youtube.com/watch?v=' + youtubeId
  const credit = 'Marble Hornets'
  return {
    id: 85100 + numero,
    code: 'ARG-MH-' + String(numero).padStart(3, '0'),
    type: 'arg',
    title, year,
    author: credit,
    description: 'Registro ' + numero + ' da narrativa de terror em vídeo Marble Hornets. A série acompanha Jay enquanto ele examina as gravações de um projeto de cinema interrompido.',
    tags: ['ARG', 'websérie', 'found footage', 'Marble Hornets'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Publicação externa do canal Marble Hornets. Direitos pertencentes aos criadores.',
    sources: [{ title: episodio + ' — canal Marble Hornets', url }],
    media: [{ kind: 'youtube', youtubeId, link: url, title: episodio, language: 'Inglês', license: 'Direitos dos criadores. Reprodução pelo player oficial do YouTube.' }],
  }
})
