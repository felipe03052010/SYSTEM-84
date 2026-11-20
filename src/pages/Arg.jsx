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
      description="Decifre mensagens, reconstrua sequências e cruze pistas do acervo. Cada ficha traz um desafio e uma dica opcional. O progresso fica salvo no seu navegador."
      figure="arg"
      panelTitle="SISTEMA DE ENIGMAS"
      panelItems={[
        ['lock', 'Cofres', 'resposta conferida na hora'],
        ['search', 'Pistas', 'dicas opcionais em cada enigma'],
        ['archive', 'Acervo', 'respostas escondidas nas fichas'],
        ['loop', 'Progresso', 'enigmas resolvidos ficam salvos'],
        ['star', 'Final', 'descubra o desfecho de cada ficha'],
      ]}
      recordPage={11}
      recordTotal={13}
    />
  )
}
