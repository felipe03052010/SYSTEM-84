import DossierArchive from '../components/DossierArchive'

export default function Filmes() {
  return (
    <DossierArchive
      type="filme"
      title="Filmes"
      titleLines={['FILMES']}
      kicker="ARQUIVO / DO MUDO AO DIGITAL"
      directory="DIRETÓRIO / FILMES"
      command="MONTANDO /ARQUIVO/FILMES..."
      description="O cinema como memória coletiva: expressionismo alemão, ficção científica de Fritz Lang e Georges Méliès, horror independente e animação livre que atravessou a fronteira do domínio público."
      figure="filme"
      panelTitle="SISTEMA DE CINEMA"
      panelItems={[
        ['film', 'Player unificado', 'vídeo direto da fonte'],
        ['archive', 'Catálogo', 'cópia, ano e procedência'],
        ['eye', 'Ficha de obra', 'sinopse, tags e direitos'],
        ['lock', 'Acesso', 'público, sem cadastro'],
        ['loop', 'Progresso', 'retomada no mesmo ponto'],
      ]}
      recordPage={5}
      recordTotal={13}
    />
  )
}
