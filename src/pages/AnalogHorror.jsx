import DossierArchive from '../components/DossierArchive'

export default function AnalogHorror() {
  return (
    <DossierArchive
      type="analog-horror"
      title="Analog Horror"
      titleLines={['ANALOG', 'HORROR']}
      kicker="ARQUIVO / FITAS SEM ETIQUETA"
      directory="DIRETÓRIO RESTRITO / FITAS"
      command="REBOBINANDO FITA 01..."
      description="Alertas de emergência, programas educativos e fitas domésticas viram histórias de terror nas mãos de criadores independentes. Escolha um episódio para assistir ao vídeo publicado por seu autor."
      figure="horror"
      panelTitle="PROTOCOLO DE FITAS"
      panelItems={[
        ['play', 'Assistir', 'vídeo incorporado na ficha'],
        ['archive', 'Créditos', 'autoria e canal de publicação'],
        ['eye', 'Contexto', 'sinopse e data de cada episódio'],
      ]}
      recordPage={11}
      recordTotal={13}
    />
  )
}
