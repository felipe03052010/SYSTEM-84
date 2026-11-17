import DossierArchive from '../components/DossierArchive'

export default function Arg() {
  return (
    <DossierArchive
      type="arg"
      title="ARG"
      titleLines={['ENIGMAS', 'ARG']}
      kicker="ARQUIVO / JOGO DE REALIDADE ALTERNATIVA"
      directory="DIRETÓRIO / ENIGMAS"
      command="DESCRIPTOGRAFANDO SINAL..."
      description="Seis enigmas que só se resolvem explorando o próprio arquivo: cifras, código Morse, acrósticos e pistas espalhadas entre filmes, fitas e fichas. O progresso fica salvo no seu navegador."
      figure="arg"
      panelTitle="SISTEMA DE ENIGMAS"
      panelItems={[
        ['lock', 'Cofres', 'resposta conferida na hora'],
        ['search', 'Pistas', 'dicas opcionais em cada enigma'],
        ['archive', 'Acervo', 'respostas escondidas nas fichas'],
        ['loop', 'Progresso', 'enigmas resolvidos ficam salvos'],
        ['star', 'Final', 'complete os seis e vire guardião'],
      ]}
      recordPage={11}
      recordTotal={13}
    />
  )
}
