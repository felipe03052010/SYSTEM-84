import DossierArchive from '../components/DossierArchive'
import AnalogCatalogo from '../components/AnalogCatalogo'

export default function AnalogHorror() {
  return (
    <DossierArchive
      type="analog-horror"
      title="Analog Horror"
      titleLines={['ANALOG', 'HORROR']}
      kicker="ARQUIVO / FITAS SEM ETIQUETA"
      directory="DIRETÓRIO RESTRITO / FITAS"
      command="REBOBINANDO FITA 01..."
      description="Fitas originais do SYSTEM 84 e episódios selecionados de criadores de analog horror. Explore sinais misteriosos, transmissões e documentários fictícios com player do YouTube e créditos aos autores."
      figure="horror"
      panelTitle="PROTOCOLO DE FITAS"
      panelItems={[
        ['play', 'Assistir ou ler', 'vídeos incorporados e fitas transcritas'],
        ['eye', 'Nota do arquivo', 'o que a equipe conseguiu verificar'],
        ['loop', 'Conexões', 'fitas que levam a enigmas ARG'],
        ['lock', 'Direitos', 'CC0 nos originais; externos pertencem aos criadores'],
        ['archive', 'Créditos', 'fonte e autoria em cada registro'],
      ]}
      recordPage={11}
      recordTotal={13}
      extra={<AnalogCatalogo />}
    />
  )
}
