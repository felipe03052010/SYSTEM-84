import DossierArchive from '../components/DossierArchive'
import { countOf } from '../components/Chassis'

export default function Livros() {
  return (
    <DossierArchive
      type="livro"
      title="Livros"
      titleLines={['LIVROS']}
      kicker="ARQUIVO / LEITURA E CATÁLOGO"
      directory="DIRETÓRIO / LIVROS"
      command="MONTANDO /ARQUIVO/LIVROS..."
      description="Clássicos de domínio público com texto integral dentro do site: de Homero a Lima Barreto, com uma estante inteira de literatura brasileira e portuguesa. Cada ficha traz edição de referência, idioma, fonte verificável e licença."
      figure="livro"
      panelTitle="SISTEMA DE LEITURA"
      panelItems={[
        ['book', 'Leitor unificado', 'texto direto da fonte'],
        ['list', 'Catálogo', `${countOf('livro')} títulos indexados`],
        ['search', 'Busca no livro', 'ache uma palavra em qualquer página'],
        ['eye', 'Conforto', 'tamanho da fonte lembrado'],
        ['loop', 'Progresso', 'marcador por livro'],
      ]}
      recordPage={6}
      recordTotal={13}
    />
  )
}
