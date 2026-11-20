// Histórias ambientadas numa emissora fictícia. O ano identifica esta edição.
const originals = {
  author: 'SYSTEM 84',
  year: 2026,
  language: 'Português',
  availability: 'available',
  rightsNote: 'Ficção original do SYSTEM 84. Texto disponibilizado sob CC0 1.0.',
  sources: [{ title: 'CC0 1.0 — termos da dedicação', url: 'https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br' }],
  media: [],
}

function tape(id, title, description, tags, article) {
  return { ...originals, id, code: `AH-${id}`, type: 'analog-horror', title, description, tags, article }
}

function riddle(id, title, description, tags, article, question, answer, hint, ending) {
  return { ...originals, id, code: `ARG-${id}`, type: 'arg', title, description, tags, article, puzzle: { question, answer, hint, ending } }
}

export const fitasArg = [
  tape(85081, 'O intervalo das cadeiras', 'Uma câmera fixa acompanha a arrumação do auditório depois da última sessão.', ['auditório', 'cadeiras', 'câmera fixa'], [
    '[00:00] Joana dobra as cadeiras de madeira em grupos de cinco. A quarta de cada grupo range. Ela marca as que precisam de óleo com giz amarelo.',
    '[00:32] As luzes se apagam. O microfone recolhe cinco rangidos espaçados, como se alguém se levantasse por etapas.',
    '[01:10] Na luz da manhã todas as cadeiras continuam dobradas. Há uma marca de giz na cadeira vazia da cabine.',
    '[01:24] Joana se senta para rever a fita. O rangido já está na gravação, um segundo antes de ela puxar o banco.',
  ]),
  tape(85082, 'Boletim da chuva interna', 'Uma gravação de previsão do tempo divide uma sala em três zonas de precipitação.', ['chuva', 'meteorologia', 'boletim'], [
    '[00:00] Sobre o mapa, alguém colou a planta da emissora. A locutora aponta chuva passageira na copa. Seu dedo sai do papel com uma gota na unha.',
    '[00:21] No corredor faz sol, segundo ela. Um rapaz põe os sapatos molhados na faixa desenhada sob a porta. A água evapora só até a ponta do cadarço.',
    '[00:48] A última previsão é para dentro do microfone. A locutora abre o guarda-chuva do lado errado da mesa.',
    '[01:02] A imagem termina seca. No canal esquerdo ainda se ouvem gotas batendo, de dentro para fora, contra a cápsula de metal.',
  ]),
  tape(85083, 'Chamada para a plataforma de dentro', 'A fita de avisos de uma estação registra um embarque que cabe dentro do alto-falante.', ['estação', 'alto-falante', 'anúncio'], [
    '[00:00] A funcionária testa o anúncio dizendo três nomes de cidades. Voltam dois ecos. O terceiro é um apito comprido de trem.',
    '[00:18] Da grade do alto-falante cai um bilhete de papel, enrolado justo como um macarrão. Tem um furo de alicate e a palavra VOLTA.',
    '[00:50] A funcionária encosta o bilhete na grade. Rodinhas de bagagem atravessam o canal esquerdo. Pelo direito uma criança pede para ficar junto da janela.',
    '[01:17] O alto-falante perde o chiado. Do papel, agora liso, vem uma voz pequena pedindo que se afastem da borda.',
  ]),
  tape(85084, 'A fita que precisava respirar', 'O operador improvisa uma solução para um cassete que incha ao ser rebobinado.', ['cassete', 'respiração', 'oficina'], [
    '[00:00] Rui apoia uma régua sobre a carcaça do cassete. Entre duas palavras gravadas, o plástico arqueia e levanta a ponta da régua.',
    '[00:29] Ele abre um furo na etiqueta com a tampa de uma caneta. O ar que escapa assobia a vinheta da emissora na velocidade errada.',
    '[01:04] Com o furo tampado por um dedo, a voz da fita completa a frase. Sem o dedo, ela só suspira.',
    '[01:33] Rui deixa a tampa no balcão. Depois que ele sai, a régua volta a levantar. Desta vez é a madeira que respira.',
  ]),
  tape(85085, 'Dublagem para uma rua vazia', 'Uma técnica de som grava os passos de uma personagem que já saiu de quadro.', ['dublagem', 'passos', 'rua'], [
    '[00:00] Projetam uma rua deserta. Nara calça um sapato de salto numa das mãos e bate numa bandeja de cascalho para acompanhar a atriz que acabou de virar a esquina.',
    '[00:34] No fundo da projeção, o cascalho salta a cada batida. Nara troca a bandeja por uma bacia de água. A sarjeta da imagem enche.',
    '[01:08] Ela para. A água continua a mexer. Dois sulcos atravessam a poça, viram a esquina e se aproximam da lente.',
    '[01:31] Sobre a mesa, o outro sapato pinga água. A projeção ficou com uma única pegada seca.',
  ]),
  tape(85086, 'O carimbo de ontem', 'Uma arquivista confere o que acontece com as datas de uma folha de ponto.', ['papel', 'arquivo', 'carimbo'], [
    '[00:00] Lúcia carimba a folha com a data de hoje. A câmera vê a tinta roxa se reunir numa gota e subir de volta para a borracha.',
    '[00:23] Ela experimenta a data de ontem. A marca fica no papel, e no pulso de Lúcia aparece uma mancha de tinta já seca.',
    '[00:57] A folha seguinte já tem sua assinatura. Está escrito que ontem ela saiu uma hora mais cedo para comprar sabonete.',
    '[01:13] Lúcia abre a gaveta. Lá dentro há um sabonete usado, com o sulco de um pulso e a data de amanhã no fundo.',
  ]),
  tape(85087, 'Uma janela a mais no mapa', 'O levantamento fotográfico de um prédio revela um cômodo com vista para o laboratório.', ['fotografia', 'mapa', 'janela'], [
    '[00:00] Do lado da rua o prédio tem doze janelas. Na mesa de luz, duas fotografias se sobrepõem e surge uma décima terceira, fina como uma fenda.',
    '[00:36] O técnico afasta uma das folhas. A fenda se alarga. Por trás do vidro há uma mesa igual à dele, com duas fotografias.',
    '[00:58] Ele cobre a lâmpada para espiar melhor. Na outra mesa, uma mão acende uma lanterna e bate três vezes no vidro.',
    '[01:21] O técnico separa as folhas. A janela some. A lanterna fica acesa debaixo da mesa de luz, mesmo depois que ele tira o plugue.',
  ]),
  tape(85088, 'Inventário dos nomes emprestados', 'Etiquetas de objetos trocadas por engano mudam o som do almoxarifado.', ['etiqueta', 'objetos', 'som'], [
    '[00:00] A etiqueta do sino diz CHAVE. Quando Dito balança o sino, ouve dentes de metal roçando uma fechadura.',
    '[00:30] Na chave puseram COPO. Ele a deixa cair num pano. O barulho de vidro quebrado faz a moça da limpeza voltar com a pá.',
    '[00:54] Para arrumar a confusão, Dito descola as etiquetas. Por três segundos não há som nenhum, nem o motor da câmera.',
    '[01:20] A moça cola SINO no próprio crachá. Ao abrir a boca para dar boa-noite faz um som claro que demora a morrer.',
  ]),
  tape(85089, 'A tesoura da ilha de edição', 'Uma emenda física numa fita corta o som de outra sala.', ['edição', 'fita magnética', 'silêncio'], [
    '[00:00] Mauro procura uma pausa no depoimento de uma senhora. Marca a fita com lápis branco e corta o trecho em que ela respira.',
    '[00:15] No corredor, o ventilador para pelo exato comprimento do corte. A bandeirola presa à grade fica reta no ar.',
    '[00:42] Mauro cola a sobra na ponta de outra entrevista. A voz de um ferroviário ganha um suspiro que não combina com o peito dele.',
    '[01:06] O ventilador recomeça. A bandeirola continua parada até o fim do depoimento, quando finalmente despenca.',
  ]),
  tape(85090, 'Prova de cor para um domingo', 'O ajuste de saturação de um programa infantil apaga as cores do camarim.', ['cor', 'camarim', 'calibração'], [
    '[00:00] Uma apresentadora segura um tomate diante da câmera. O técnico reduz o vermelho. Atrás dela, o batom sobre a penteadeira fica cor de cinza.',
    '[00:31] Ele aumenta o vermelho até a barra de referência. O tomate permanece pálido. A boca de uma boneca no camarim ganha um brilho de verniz fresco.',
    '[01:00] A apresentadora toca o tomate no rosto da boneca. O monitor satura, a imagem volta ao normal e o técnico encerra o teste.',
    '[01:18] Nos créditos de calibração, um guardanapo entra em quadro com duas marcas distintas: uma de polpa, outra de beijo.',
  ]),
  tape(85091, 'O elevador entre anúncios', 'Um anúncio de elevador só cabe nos segundos de silêncio de um comercial.', ['elevador', 'intervalo', 'rádio'], [
    '[00:00] Entre o preço do café e o nome da mercearia sobra meio segundo. Nele cabe um sino de elevador ao fundo.',
    '[00:24] Bia alonga a pausa na edição. O sino ganha duas portas e um ascensorista perguntando por qual andar ela prefere começar.',
    '[00:48] Ela restaura a velocidade. No intervalo, agora curto outra vez, alguém prende o pé na porta. O comercial recomeça com um tropeço.',
    '[01:10] Bia guarda a bobina na prateleira mais alta. À noite, cada reprise do anúncio a faz descer um nível.',
  ]),
  tape(85092, 'Caligrafia do sismógrafo', 'Uma ponta de registro começa a imitar os movimentos da mão da plantonista.', ['traçado', 'papel', 'plantão'], [
    '[00:00] O rolo de papel avança sem tremores. De costas para a máquina, a plantonista copia a lista de compras e esquece o acento em café.',
    '[00:37] A agulha do registro escreve somente o acento. A mulher folheia seu caderno antigo; ao passar por cada erro, a agulha faz outra pequena correção.',
    '[01:12] Ela fecha o caderno em uma página em branco. A agulha levanta do papel e espera com a ponta suspensa.',
    '[01:49] Antes do corte ouve-se o arranhar de um lápis. A mão da plantonista, vazia, está corrigindo uma letra no ar.',
  ]),
  tape(85093, 'Mensagem depois do último bip', 'Uma secretária eletrônica devolve os pequenos ruídos que seus usuários acharam que ninguém ouviu.', ['telefone', 'mensagem', 'eco'], [
    '[00:00] A primeira mensagem tem o estalo de uma xícara pousando. A segunda começa com o mesmo estalo e acrescenta uma colher.',
    '[00:28] A cada chamada, a cozinha que se escuta fica mais completa. No décimo bip alguém puxa uma cadeira; no seguinte, serve mais um prato.',
    '[01:11] A dona da casa ergue o fone e pergunta quantas pessoas vêm. Em resposta, a fita toca todos os ruídos de trás para a frente até só restar a xícara.',
    '[01:37] Na cozinha real há um lugar posto. O fone repousa no pires, ainda morno.',
  ]),
  tape(85094, 'Manual da sombra reserva', 'Um filme de treinamento ensina o que fazer quando uma sombra falta ao trabalho.', ['treinamento', 'projeção', 'sombra'], [
    '[00:00] Um funcionário atravessa o pátio ao meio-dia. A voz do instrutor recomenda conferir se a sombra chega junto. A dele já estava junto ao portão.',
    '[00:33] Do armário saem silhuetas de papelão em três tamanhos. Ele escolhe a média. Tem o recorte de uma orelha dobrada igual à sua.',
    '[01:01] Na volta para o pátio, a silhueta de papel acompanha os sapatos. A outra continua no portão e, quando bate o ponto, entra sozinha.',
    '[01:29] A câmera permanece no corredor vazio. O relógio de ponto cospe um cartão preto com um retângulo claro no lugar da fotografia.',
  ]),
  tape(85095, 'A piscina da faixa azul', 'Uma nadadora percebe que a linha pintada no azulejo continua para além da piscina.', ['piscina', 'vídeo esportivo', 'faixa'], [
    '[00:00] A câmera submersa acompanha a mão de Iara sobre a faixa azul. A parede do fundo aparece no tempo esperado; a faixa, em vez de subir, passa por baixo.',
    '[00:24] Iara toca a borda. Pelo alto-falante, o comentarista ainda narra três braçadas. As bolhas dessas braçadas saem de uma junta seca no azulejo.',
    '[00:47] Na reprise, a câmera segue as bolhas. Do outro lado da junta o som da torcida fica mais alto, como num ginásio vizinho.',
    '[01:15] O quadro final mostra o pódio. Sobre o degrau vazio, três gotas avançam devagar na mesma direção.',
  ]),
  tape(85096, 'O varal dos negativos', 'Uma fotógrafa tenta secar uma paisagem revelada durante a maré cheia.', ['fotografia', 'maré', 'laboratório'], [
    '[00:00] Ainda no pregador, o negativo do cais solta água salgada. A fotógrafa põe uma bacia embaixo para não molhar os demais rolos.',
    '[00:35] A água da bacia sobe até uma marca de ferrugem. Na foto, os barcos agora estão baixos demais e as cordas dos mastros, esticadas.',
    '[01:02] Ela despeja a água de volta no tanque de revelação. No negativo a boia sobe, aos trancos, como um elevador velho.',
    '[01:26] Uma sirene de barco vibra dentro do pregador. A fotógrafa o abre e ouve, por um segundo inteiro, o mar ao meio-dia.',
  ]),
  tape(85097, 'Contagem regressiva no avesso', 'Na transparência de um contador de cinema alguém ensaia uma despedida de nove gestos.', ['projeção', 'contagem', 'película'], [
    '[00:00] A contagem para a sessão vai de nove a um. Dentro da barriga do nove há um homem tirando o chapéu, pequeno demais para se notar na velocidade normal.',
    '[00:27] A operadora para no oito. Pelos dois buracos do número o homem olha para a cabine. No sete, usa a barra superior como corrimão.',
    '[01:00] Ela passa o filme ao contrário. O homem repõe o chapéu mas não solta o corrimão. A aba prende na emenda e vem parar do lado de fora do quadro.',
    '[01:32] Na estreia ele aparece sem chapéu em todos os números. Pende um fio de feltro do carretel recolhedor.',
  ]),
  tape(85098, 'Receita para um prato sem fundo', 'A cozinheira de um programa de bairro mede o eco de uma tigela herdada.', ['culinária', 'eco', 'estúdio'], [
    '[00:00] Dona Neide bate na borda da tigela para mostrar que é louça fina. O toque retorna com uma tossida lá no fundo.',
    '[00:22] Ela põe um punhado de arroz. Na caixa de som os grãos parecem cair por vários andares. Alguém lá embaixo começa a varrer.',
    '[00:50] Neide inclina a tigela para a lente. Num reflexo do esmalte se vê uma vassoura encostada do lado de uma porta. Ela despeja também o feijão.',
    '[01:14] A fita termina com duas batidas educadas por baixo da bancada. Uma voz pergunta se na cozinha de cima tem sal.',
  ]),
  tape(85099, 'A página que segurava a antena', 'Uma folha de jornal dobrada estabelece a ordem dos programas que a emissora consegue receber.', ['jornal', 'antena', 'grade de programação'], [
    '[00:00] Para firmar o pé da antena, Celso enfia um jornal dobrado. A tela sintoniza o jogo anunciado na primeira página, antigo o bastante para o placar ainda ser de madeira.',
    '[00:34] Ele vira o calço para a coluna de cinema. O locutor troca de voz no meio do gol e passa a ler os horários da matinê.',
    '[01:09] No verso faltava um pedaço, recortado para embrulhar pão. Quando a antena toca a falha, a tela mostra o interior de um saco pardo.',
    '[01:38] Por uma fresta entram migalhas e luz de manhã. Celso deixa a antena assim enquanto toma café.',
  ]),
  tape(85100, 'O corredor que ficou na legenda', 'Uma legendista descreve um ruído e acaba acrescentando metros ao prédio da emissora.', ['legenda', 'corredor', 'máquina de escrever'], [
    '[00:00] Na imagem, um homem atravessa o corredor em quatro passos. Lia escreve na legenda: passos ao longe. O homem dá mais quatro antes de alcançar a porta.',
    '[00:27] Lia troca longe por perto. O homem esbarra na porta quase de imediato. A maçaneta balança por cima da palavra recém-digitada.',
    '[01:00] Ela apaga tudo e espera. O homem para num lugar que parece ser o meio, mas ambas as pontas do corredor estão fora do quadro.',
    '[01:32] Lia escreve saída. Uma nesga de luz abre embaixo da legenda. O homem se abaixa, passa por ela e deixa um pouco de poeira branca no teclado.',
  ]),
  riddle(85101, 'A senha dos quatro bilhetes', 'A arquivista anotou a chave no começo de quatro bilhetes.', ['acróstico', 'plantão'], [
    'Leia os bilhetes na ordem em que foram presos ao mural. O alfinete atravessa sempre a primeira letra da primeira palavra.',
    'Fechem a janela antes da chuva.', 'Iluminem a saída lateral.', 'Tragam a lanterna da cabine.', 'Avisem quando o vigia chegar.',
  ], 'Que palavra formam as letras perfuradas?', 'FITA', 'O primeiro alfinete atravessa o F de Fechem.', 'Com a palavra no estojo, a arquivista acha a fita que procurava sob o papel de embrulho.'),
  riddle(85102, 'O armário de três lâmpadas', 'Três fileiras de lâmpadas substituem o teclado de um armário.', ['binário', 'lâmpadas'], [
    'Cada fileira tem três lâmpadas. Da esquerda para a direita elas valem 4, 2 e 1. Some apenas as que acenderam, usando cada fileira para escrever um algarismo.',
    'Primeira fileira: acesa, apagada, acesa. Segunda: apagada, acesa, acesa. Terceira: acesa, acesa, apagada.',
  ], 'Qual é o código de três algarismos?', '536', 'A primeira fileira vale 4 + 1.', 'A luz do armário recebe você. O terceiro soquete estava vazio; a lâmpada de reserva esperava dentro dele.'),
  riddle(85103, 'A bobina do espelho', 'A etiqueta de um carretel foi escrita para ser lida durante o rebobinamento.', ['inversão', 'bobina'], [
    'A bobina de teste traz ARAC. Ao rebobinar se lê CARA. A última letra gravada é a primeira recuperada.',
    'Na bobina definitiva está gravado OTELUA. A etiqueta borrada mostra que falta um M entre o U e o A: leia, portanto, O T E L U M A do fim para o começo.',
  ], 'Que objeto a etiqueta descreve?', 'AMULETO', 'Comece pela ponta solta: as duas primeiras letras recuperadas são A e M.', 'Há uma ferradura minúscula no eixo da bobina. O operador a deixa onde estava.'),
  riddle(85104, 'A gaveta das coordenadas', 'Um mapa de gavetas serve de teclado para uma fechadura de papel.', ['grade', 'coordenadas'], [
    'Há três gavetas por fila. Fila 1: M, A, R. Fila 2: E, S, T. Fila 3: I, L, O.',
    'Cada par indica primeiro a fila, depois a posição a partir da esquerda. Leia 2/2, 1/2, 3/2, 1/2.',
  ], 'Que palavra indicam as quatro coordenadas?', 'SALA', 'A posição 2/2 é o centro da segunda fila.', 'Dentro da gaveta há uma planta. Com a palavra recuperada, a porta sem número ganha um nome.'),
  riddle(85105, 'Os lacres do porteiro', 'Das quatro chaves de um molho, só uma combina com o livro da portaria.', ['dedução', 'portaria'], [
    'Chave LESTE: fita verde, dois furos. Chave NORTE: fita azul, um furo. Chave SUL: fita azul, dois furos. Chave OESTE: fita verde, um furo.',
    'O recibo confirma uma fita azul. A folha de inspeção registra que dois pinos passaram pelo lacre da mesma chave.',
  ], 'Qual é o nome gravado na chave retirada?', 'SUL', 'Elimine as duas fitas verdes. Depois conte os furos nas restantes.', 'Na portaria sul, os dois pinos ainda guardam um fiapo azul.'),
  riddle(85106, 'O almoço da cabine', 'Um recibo serve de registro da ordem em que quatro pessoas entraram na cabine.', ['ordenação', 'recibo'], [
    'Entrou primeiro quem trouxe o suco. A última pessoa trouxe o pão. Quem levou a uva chegou logo depois de quem levou o queijo.',
    'Recibos: Leda trouxe pão, Mara trouxe suco, Nilo trouxe uva e Ivo trouxe queijo. Para abrir a caixa, o bilhete pede o nome da terceira pessoa.',
  ], 'Quem entrou em terceiro lugar?', 'NILO', 'Entre o suco e o pão há só duas posições livres.', 'Nilo identifica o copo com a marca roxa e devolve a chave ao fundo da caixa.'),
  riddle(85107, 'A fila das imagens pares', 'Um projetor captura um segundo texto entre seus fotogramas.', ['intercalação', 'película'], [
    'O projetor da escola exibe apenas os quadros de posição par. O contador começa em 1 e cada quadro traz uma letra.',
    '1 X · 2 L · 3 T · 4 U · 5 M · 6 Z.',
  ], 'Que palavra o projetor exibe?', 'LUZ', 'Consulte os quadros 2, 4 e 6.', 'A palavra passa no vidro e a lâmpada projeta o contorno de um interruptor esquecido.'),
  riddle(85108, 'O armário dos fusos', 'Dois relógios e uma ficha de empréstimo recompõem um horário apagado.', ['horário', 'registro'], [
    'O relógio da oficina adianta sete minutos em relação ao relógio correto da portaria. Na oficina, o empréstimo começa às 13h04 e dura exatos dezoito minutos.',
    'A ficha de devolução usa o horário da portaria. O terminal pede quatro dígitos no formato HHMM.',
  ], 'Qual horário entra na ficha de devolução?', '1315', 'O início real foi às 12h57. Some os dezoito minutos.', 'O livro de devoluções abre na hora certa e o intervalo volta a ter o tamanho da fita.'),
  riddle(85109, 'A bússola dos assentos', 'Um percurso simples nas poltronas termina sobre a senha de uma sessão vazia.', ['percurso', 'auditório'], [
    'Vista do teto: as fileiras de cima para baixo são A B C / D E F / G H I. Norte é para o alto. Comece no assento central E.',
    'Ande um assento para oeste e copie a letra. Depois um para norte, dois para leste e um para sul. Copie somente a letra em que termina cada instrução.',
  ], 'Quais são as quatro letras anotadas em ordem?', 'DACF', 'A primeira parada fica à esquerda de E. Ao andar dois para leste, anote só o destino.', 'As quatro letras marcam os lugares que ainda precisam de encosto. O projecionista pode finalmente abrir a sessão.'),
  riddle(85110, 'A fita com dentes de colher', 'Uma gravação de cozinha usa o talher como um telégrafo rudimentar.', ['Morse', 'cozinha'], [
    'A transcrição usa ponto para toque curto, traço para longo e espaço para separar letras. Legenda encontrada no pires: A .- | I .. | L .-.. | O --- | P .--. | S ...',
    'Mensagem gravada: .--. .. ... ---',
  ], 'Que palavra de quatro letras foi enviada?', 'PISO', 'O primeiro grupo, .--., corresponde a P. O espaço delimita cada letra.', 'O azulejo solto fica debaixo da pia. Dentro dele há uma colher pequena, igual à da fita.'),
  riddle(85111, 'Passe do operador de domingo', 'O livro de ponto registra entradas e saídas, mas a última linha ficou sem nome.', ['turno', 'conjuntos'], [
    'À abertura, a cabine estava vazia. Entraram ANA, EVA e CAIO. Saiu EVA. Entrou BIA. Saíram ANA e BIA. Cada saída só retira da cabine a pessoa citada.',
    'O último formulário pede a assinatura de quem ficou para fechar.',
  ], 'Quem restou na cabine?', 'CAIO', 'Risque da lista de entradas cada pessoa que tem uma saída.', 'Caio assina a folha e prende o lápis no barbante da porta.'),
  riddle(85112, 'Os retalhos da cartazista', 'As bordas rasgadas de quatro retalhos indicam a ordem das letras de um letreiro.', ['encaixe', 'cartaz'], [
    'Um retalho só encaixa no seguinte quando o símbolo de saída coincide com o de entrada. Cada retalho tem uma letra no meio.',
    'lua [R] estrela; início [P] sol; estrela [A] fim; sol [A] lua. Monte o caminho de início até fim.',
  ], 'Que palavra fica no letreiro?', 'PARA', 'O primeiro retalho termina no sol. O segundo precisa começar no sol.', 'A cartazista pendura o letreiro. Ele marca a parada em que seu bonde passava sem frear.'),
  riddle(85113, 'O pano da janela de teste', 'Dobras em uma folha quadriculada deixam passar um nome pela janela de luz.', ['máscara', 'grade'], [
    'As três linhas da folha são: L U A / F I O / V E R. O pano por cima deixa passar só as posições 1, 2 e 3 das linhas 1, 2 e 3, respectivamente.',
    'O funcionário pede a leitura das letras iluminadas, de cima para baixo.',
  ], 'Qual é a sequência luminosa?', 'LIR', 'Comece no canto superior esquerdo e siga na diagonal para baixo e à direita.', 'LIR está impresso no tecido: era a sigla da lavanderia que também lavava a tela de projeção.'),
  riddle(85114, 'O calendário sem feriados', 'Uma única bobina precisa ser trocada antes da sessão marcada no calendário.', ['ciclo', 'calendário'], [
    'Quatro bobinas entram em serviço numa sequência que se repete todos os dias: cobre, vidro, couro, linho. No dia 1 coube à bobina cobre.',
    'O caderno tem um círculo em volta do dia 19. A troca segue a sequência inclusive aos sábados e domingos.',
  ], 'Que material identifica a bobina do dia 19?', 'COURO', 'Os dias 17 a 20 repetem os dias 1 a 4.', 'A caixa de couro tem duas alças gastas. Uma traz a data, a outra, o nome de quem a devolveu.'),
  riddle(85115, 'Ruídos cancelados em pares', 'Uma fita tem cinco estalos ímpares escondidos entre sons que se anulam.', ['contagem', 'cancelamento'], [
    'Em cada bloco, cancele duas ocorrências da mesma letra até que sobre uma só. Não misture letras de blocos diferentes.',
    'Blocos em ordem: A A P / I L L / S S L / H T T / O A O.',
  ], 'Qual é a palavra composta pelas cinco sobras?', 'PILHA', 'No primeiro bloco os dois A se anulam, restando P.', 'A última pilha estava dentro do microfone de reserva. O plantão recupera a voz.'),
  riddle(85116, 'O ensaio das cinco vogais', 'Um teclado de legendagem perdeu a tecla de retrocesso e passou a deslocar vogais.', ['substituição', 'teclado'], [
    'A máquina escreve E no lugar de A, I no lugar de E, O no lugar de I, U no lugar de O e A no lugar de U. As consoantes permanecem como foram digitadas.',
    'No aviso que saiu do teclado está escrito PUNTE. Reconstrua a palavra que a operadora digitou.',
  ], 'Qual era a palavra antes da troca?', 'PONTA', 'O U impresso veio de um O digitado.', 'A bilheteira toca a ponta da chave no papel e faz um furo no lugar do acento que a máquina também perdia.'),
  riddle(85117, 'O nome no terceiro furo', 'Um perfurador de ingressos escondeu letras em palavras da sessão.', ['índice', 'ingresso'], [
    'Conte sempre da esquerda para a direita, começando em 1. O furo de cada ingresso deixa ler apenas a letra naquela posição.',
    'Ingressos em ordem: pista (3), tela (2), mala (3), foco (4).',
  ], 'O que se lê pelos quatro furos?', 'SELO', 'A terceira letra de pista é S.', 'O bilhete perfurado traz exatamente o selo da cabine. Na sala, o rolo já está montado.'),
  riddle(85118, 'As prateleiras que mudaram de andar', 'Um bilhete de transporte acompanha uma caixa trocada de lugar duas vezes.', ['permutação', 'depósito'], [
    'No começo, a prateleira 1 guardava cera, a 2 guardava veludo, a 3 guardava cola e a 4 guardava giz.',
    'Primeiro trocaram entre si todo o conteúdo das prateleiras 1 e 4. Em seguida fizeram o mesmo com 2 e 4.',
  ], 'Que material terminou na prateleira 2?', 'CERA', 'Acompanhe o conteúdo da prateleira 1 até a 4 na primeira troca.', 'O cheiro de cera identifica a caixa antes mesmo de o contínuo ler a etiqueta.'),
  riddle(85119, 'A lâmpada que media a fala', 'Um ensaio de locução transforma o comprimento de três palavras num código de acesso.', ['contagem', 'locução'], [
    'O medidor acende uma lâmpada por letra pronunciada no ensaio escrito. Para o ensaio da noite ele lê exatamente as palavras SAL, NUVEM e CHUVA.',
    'Use a quantidade de letras de cada palavra em sua ordem original. Junte os três algarismos.',
  ], 'Qual é o código do ensaio?', '355', 'Em CHUVA, o C e o H ocupam lâmpadas distintas.', 'Os três números revelam uma fotografia do painel: algumas lâmpadas ainda estavam quentes.'),
  riddle(85120, 'Os cartões da maré', 'Quatro cartões enviados por uma estação costeira chegaram em envelopes trocados.', ['ordenação', 'maré'], [
    'O livro do cais manda ordenar os cartões pela altura registrada da água, da menor para a maior, e ler a letra de cada um.',
    'Cartão R: 1,20 m. Cartão M: 0,40 m. Cartão E: 1,35 m. Cartão A: 0,85 m.',
  ], 'Qual palavra o cais enviou?', 'MARE', 'Os dois cartões abaixo de um metro vêm antes dos outros.', 'A palavra chega com a primeira onda do turno seguinte. O carteiro leva os envelopes para secar.'),
]
