import DossierArchive from '../components/DossierArchive'

export default function Livros() {
  return (
    <DossierArchive
      type="livro"
      title="Livros"
      titleLines={['LIVROS']}
      kicker="ARQUIVO / LEITURA E CATÁLOGO"
      directory="DIRETÓRIO / LIVROS"
      command="MONTANDO /ARQUIVO/LIVROS..."
      description="Este sistema reúne a leitura direta dos títulos de domínio público com a ficha de cada obra: edição de referência, idioma original, fonte verificável e o estado de preservação da cópia."
      figure="livro"
      panelTitle="SISTEMA DE LEITURA"
      panelItems={[
        ['book', 'Leitor unificado', 'texto direto da fonte'],
        ['list', 'Catálogo', '63 títulos indexados'],
        ['eye', 'Temas', 'tamanho e página lembrados'],
        ['star', 'Favoritos', 'marcar para voltar depois'],
        ['loop', 'Progresso', 'marcador por livro'],
      ]}
      recordPage={6}
      recordTotal={13}
    />
  )
}
