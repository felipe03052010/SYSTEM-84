import DossierArchive from '../components/DossierArchive'

export default function LostMedia() {
  return (
    <DossierArchive
      type="lost-media"
      title="Lost media"
      titleLines={['LOST', 'MEDIA']}
      kicker="ARQUIVO / OBRAS EM RECUPERAÇÃO"
      directory="DIRETÓRIO ESPECIAL / LOST_MEDIA"
      command="RECUPERAR MEMÓRIA CULTURAL"
      description="Obras desaparecidas, incompletas e em recuperação: cada dossiê reúne as pistas documentais, a trajetória da busca e o estado atual da cópia. O que se perdeu também tem história."
      figure="lost"
      panelTitle="DOSSIÊS DE PRESERVAÇÃO"
      panelItems={[
        ['lost', 'Status', 'recuperada, fragmentária, desaparecida'],
        ['search', 'Pistas', 'fontes e citações catalogadas'],
        ['archive', 'Dossiê', 'história da busca completa'],
        ['previous', 'Revisão', 'atualização de estado'],
        ['loop', 'Restauração', 'projetos e acervos parceiros'],
      ]}
      recordPage={7}
      recordTotal={13}
    />
  )
}
