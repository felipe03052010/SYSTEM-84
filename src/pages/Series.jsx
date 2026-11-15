import DossierArchive from '../components/DossierArchive'

export default function Series() {
  return (
    <DossierArchive
      type="série"
      title="Séries"
      titleLines={['SÉRIES']}
      kicker="ARQUIVO / SERIAIS E EPISÓDIOS"
      directory="DIRETÓRIO / SÉRIES"
      command="MONTANDO /ARQUIVO/SERIES..."
      description="Seriais de matinê, episódios sobreviventes e capítulos que atravessaram décadas: dramas de aventura espacial, cidades subterrâneas e capuzes que assombram a televisão dos anos 1930."
      figure="serie"
      panelTitle="SISTEMA DE SÉRIES"
      panelItems={[
        ['list', 'Capítulos', 'episódios na ordem original'],
        ['film', 'Player', 'cópia disponível de cada parte'],
        ['archive', 'Dossiê', 'temporada, estúdio e estado'],
        ['eye', 'Leitura', 'descrição do arco completo'],
        ['loop', 'Continuidade', 'retoma do último capítulo'],
      ]}
      recordPage={8}
      recordTotal={13}
    />
  )
}
