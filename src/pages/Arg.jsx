import DossierArchive from '../components/DossierArchive'

export default function Arg() {
  return (
    <DossierArchive
      type="arg"
      title="ARG"
      titleLines={['ARQUIVOS', 'ARG']}
      kicker="ARQUIVO / JOGO DE REALIDADE ALTERNATIVA"
      directory="DIRETÓRIO / EPISÓDIOS"
      command="DESCRIPTOGRAFANDO SINAL..."
      description="Acompanhe narrativas de realidade alternativa pelos episódios publicados por seus criadores. Abra a ficha para assistir e consultar os créditos."
      figure="arg"
      panelTitle="GUIA DE EXIBIÇÃO"
      panelItems={[
        ['play', 'Episódios', 'reprodução na ficha'],
        ['archive', 'Procedência', 'canal e autoria identificados'],
        ['search', 'Pesquisa', 'localize um episódio pelo título'],
      ]}
      recordPage={11}
      recordTotal={13}
    />
  )
}
