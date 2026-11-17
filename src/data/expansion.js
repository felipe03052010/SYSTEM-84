/**
 * Fichas de domínio público com mídia real e verificável.
 *
 * Regras desta fonte:
 * - Nenhuma obra inventada e nenhuma mídia gerada por IA.
 * - Todo arquivo aponta para uma URL https de origem pública conhecida
 *   (Project Gutenberg, Gutenberg Austrália, Internet Archive, Wikimedia
 *   Commons, Wikisource).
 * - O esquema é o mesmo do catálogo principal, para que
 *   scripts/check-catalog.mjs valide tudo igual.
 * - Nada aqui repete um registro que já existe no catálogo.
 */
export const expansion = [
  // ───────────────────────────── FILMES ─────────────────────────────
  {
    id: 501,
    title: 'O Encouraçado Potemkin',
    year: 1925,
    type: 'filme',
    code: 'FILM_1925_501',
    description:
      'Montagem soviética em estado puro: a sequência da escadaria de Odessa mudou a gramática do cinema. Cópia histórica sem trilha moderna.',
    tags: ['drama', 'montagem', 'mudo'],
    availability: 'available',
    language: 'Cinema mudo; intertítulos da cópia de acervo',
    rightsNote: 'Domínio público nos Estados Unidos; obra de 1925 em circulação pública.',
    sources: [
      { title: 'Internet Archive — Battleship Potemkin (1925)', url: 'https://archive.org/details/BattleshipPotemkin' },
    ],
    media: [
      {
        title: 'Filme completo',
        kind: 'video',
        path: 'media/film_1925_501.mp4',
        sourceUrl: 'https://archive.org/download/BattleshipPotemkin/Battleship_Potemkin_512kb.mp4',
        remoteUrl: 'https://archive.org/download/BattleshipPotemkin/Battleship_Potemkin_512kb.mp4',
        license: 'Domínio público — conforme identificação da fonte.',
        language: 'Cinema mudo',
        transform: { maxWidth: 320, videoBitrate: '250k', mute: true, duration: 4200 },
      },
    ],
  },
  {
    id: 502,
    title: 'O Fantasma da Ópera',
    year: 1925,
    type: 'filme',
    code: 'FILM_1925_502',
    description:
      'A máscara, o lustre e o lago subterrâneo: o horror gótico de Lon Chaney na versão mais lembrada, com o trecho em Technicolor.',
    tags: ['terror', 'gótico', 'mudo'],
    availability: 'available',
    language: 'Cinema mudo; intertítulos da cópia de acervo',
    rightsNote: 'Domínio público nos Estados Unidos (publicado em 1925).',
    sources: [
      { title: 'Internet Archive — The Phantom of the Opera (1925)', url: 'https://archive.org/details/ThePhantomoftheOpera' },
    ],
    media: [
      {
        title: 'Filme completo',
        kind: 'video',
        path: 'media/film_1925_502.mp4',
        sourceUrl: 'https://archive.org/download/ThePhantomoftheOpera/Phantom_of_the_Opera_512kb.mp4',
        remoteUrl: 'https://archive.org/download/ThePhantomoftheOpera/Phantom_of_the_Opera_512kb.mp4',
        license: 'Domínio público — conforme identificação da fonte.',
        language: 'Cinema mudo',
        transform: { maxWidth: 320, videoBitrate: '250k', mute: true, duration: 5600 },
      },
    ],
  },
  {
    id: 503,
    title: 'O Homem com a Câmera',
    year: 1929,
    type: 'filme',
    code: 'FILM_1929_503',
    description:
      'Dziga Vertov monta uma cidade inteira em cortes rápidos: câmeras, bondes, rostos e o próprio ato de filmar. Documentário experimental sem palavras.',
    tags: ['documentário', 'experimental', 'mudo'],
    availability: 'available',
    language: 'Cinema mudo',
    rightsNote: 'Domínio público nos Estados Unidos; obra de 1929 em circulação pública.',
    sources: [
      { title: 'Internet Archive — Man with a Movie Camera (1929)', url: 'https://archive.org/details/ChelovekskinoapparatomManWithAMovieCamera' },
    ],
    media: [
      {
        title: 'Filme completo',
        kind: 'video',
        path: 'media/film_1929_503.mp4',
        sourceUrl: 'https://archive.org/download/ChelovekskinoapparatomManWithAMovieCamera/Chelovek_s_kino-apparatom_512kb.mp4',
        remoteUrl: 'https://archive.org/download/ChelovekskinoapparatomManWithAMovieCamera/Chelovek_s_kino-apparatom_512kb.mp4',
        license: 'Domínio público — conforme identificação da fonte.',
        language: 'Cinema mudo',
        transform: { maxWidth: 320, videoBitrate: '250k', mute: true, duration: 4100 },
      },
    ],
  },
  {
    id: 504,
    title: 'A Chegada de um Trem à Estação',
    year: 1896,
    type: 'filme',
    code: 'FILM_1896_504',
    description:
      'Irmãos Lumière. Trinta e poucos segundos que assustaram a plateia: o primeiro susto coletivo do cinema.',
    tags: ['cinema primitivo', 'documentário', 'curta'],
    availability: 'available',
    language: 'Sem intertítulos',
    rightsNote: 'Domínio público — filme de 1896, autores falecidos há mais de 70 anos.',
    sources: [
      { title: 'Internet Archive — Arrival of a Train at La Ciotat', url: 'https://archive.org/details/11-arrival-of-a-train-at-la-ciotat' },
    ],
    media: [
      {
        title: 'Curta completo',
        kind: 'video',
        path: 'media/film_1896_504.mp4',
        sourceUrl: 'https://archive.org/download/11-arrival-of-a-train-at-la-ciotat/11%20Arrival%20of%20a%20train%20at%20La%20Ciotat.mp4',
        remoteUrl: 'https://archive.org/download/11-arrival-of-a-train-at-la-ciotat/11%20Arrival%20of%20a%20train%20at%20La%20Ciotat.mp4',
        license: 'Domínio público — Internet Archive.',
        language: 'Sem intertítulos',
        transform: { maxWidth: 320, videoBitrate: '250k', mute: true, duration: 50 },
      },
    ],
  },
  {
    id: 505,
    title: 'Um Cão Andaluz',
    year: 1929,
    type: 'filme',
    code: 'FILM_1929_505',
    description:
      'Buñuel e Dalí, dezessete minutos que partiram o cinema em dois. Surrealismo em estado bruto, com a navalha mais famosa da história.',
    tags: ['surrealismo', 'experimental', 'curta'],
    availability: 'available',
    language: 'Cinema mudo; cartelas em francês',
    rightsNote: 'Domínio público em várias jurisdições; cópia de acervo público.',
    sources: [
      { title: 'Internet Archive — Un Chien Andalou (1929)', url: 'https://archive.org/details/UnChienAndalou_313' },
    ],
    media: [
      {
        title: 'Curta completo',
        kind: 'video',
        path: 'media/film_1929_505.mp4',
        sourceUrl: 'https://archive.org/download/UnChienAndalou_313/Luis_Bu_uel_Un_Chien_Andalou_Un_perro_andaluz_1929.mp4',
        remoteUrl: 'https://archive.org/download/UnChienAndalou_313/Luis_Bu_uel_Un_Chien_Andalou_Un_perro_andaluz_1929.mp4',
        license: 'Domínio público — conforme identificação da fonte.',
        language: 'Cinema mudo',
        transform: { maxWidth: 320, videoBitrate: '250k', mute: true, duration: 1020 },
      },
    ],
  },

  // ───────────────────────────── LIVROS ─────────────────────────────
  {
    id: 506,
    title: 'O Grande Gatsby',
    year: 1925,
    type: 'livro',
    code: 'BOOK_1925_506',
    description:
      'A festa que nunca acaba e o sonho que já acabou. Texto integral em inglês, domínio público nos Estados Unidos desde 2021.',
    tags: ['romance', 'modernismo', 'anos 20'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público nos Estados Unidos; Project Gutenberg #64317.',
    sources: [{ title: 'Project Gutenberg — The Great Gatsby', url: 'https://www.gutenberg.org/ebooks/64317' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-64317.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/64317.txt.utf-8',
        license: 'Project Gutenberg — domínio público nos EUA.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 507,
    title: 'A Revolução dos Bichos',
    year: 1945,
    type: 'livro',
    code: 'BOOK_1945_507',
    description:
      'A fazenda que expulsa o dono e termina com novos donos de quatro patas. Texto integral em inglês, em domínio público na Austrália e no Canadá.',
    tags: ['sátira', 'política', 'alegoria'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público na Austrália e no Canadá (autor falecido em 1950). Verifique a lei do seu país.',
    sources: [{ title: 'Project Gutenberg Australia — Animal Farm', url: 'https://gutenberg.net.au/ebooks01/0100011h.html' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-1945-507.txt',
        sourceUrl: 'https://gutenberg.net.au/ebooks01/0100011h.html',
        license: 'Project Gutenberg Australia — domínio público na Austrália.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 508,
    title: '1984',
    year: 1949,
    type: 'livro',
    code: 'BOOK_1949_508',
    description:
      'O romance que deu nome ao nosso medo de câmera ligada. Texto integral em inglês, em domínio público na Austrália e no Canadá.',
    tags: ['distopia', 'política', 'ficção científica'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público na Austrália e no Canadá (autor falecido em 1950). Verifique a lei do seu país.',
    sources: [{ title: 'Project Gutenberg Australia — Nineteen Eighty-Four', url: 'https://gutenberg.net.au/ebooks01/0100021h.html' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-1949-508.txt',
        sourceUrl: 'https://gutenberg.net.au/ebooks01/0100021h.html',
        license: 'Project Gutenberg Australia — domínio público na Austrália.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 509,
    title: 'O Mundo Perdido',
    year: 1912,
    type: 'livro',
    code: 'BOOK_1912_509',
    description:
      'Arthur Conan Doyle leva uma expedição a um platô com dinossauros. O protótipo de toda aventura pré-histórica do século XX.',
    tags: ['aventura', 'ficção científica', 'clássico'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #139.',
    sources: [{ title: 'Project Gutenberg — The Lost World', url: 'https://www.gutenberg.org/ebooks/139' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-139.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/139.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 510,
    title: 'O Rei de Amarelo',
    year: 1895,
    type: 'livro',
    code: 'BOOK_1895_510',
    description:
      'A peça que enlouquece quem a lê. Robert W. Chambers inventou uma mitologia inteira que a cultura pop ainda saqueia.',
    tags: ['terror', 'weird fiction', 'decadentismo'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #8492.',
    sources: [{ title: 'Project Gutenberg — The King in Yellow', url: 'https://www.gutenberg.org/ebooks/8492' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-8492.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/8492.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 511,
    title: 'A Divina Comédia',
    year: 1320,
    type: 'livro',
    code: 'BOOK_1320_511',
    description:
      'Inferno, Purgatório e Paraíso em terça rima. Tradução de Henry Wadsworth Longfellow, em domínio público.',
    tags: ['poesia', 'épico', 'clássico'],
    availability: 'available',
    language: 'Inglês (tradução de Longfellow)',
    rightsNote: 'Domínio público — texto e tradução.',
    sources: [{ title: 'Project Gutenberg — The Divine Comedy', url: 'https://www.gutenberg.org/ebooks/1004' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-1004.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/1004.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 512,
    title: 'Ética',
    year: 1677,
    type: 'livro',
    code: 'BOOK_1677_512',
    description:
      'Espinosa prova Deus em proposições geométricas. O livro que obrigou a filosofia moderna a se explicar.',
    tags: ['filosofia', 'clássico', 'racionalismo'],
    availability: 'available',
    language: 'Inglês (tradução de R. H. M. Elwes)',
    rightsNote: 'Domínio público — texto e tradução.',
    sources: [{ title: 'Project Gutenberg — The Ethics', url: 'https://www.gutenberg.org/ebooks/3800' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-3800.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/3800.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 513,
    title: 'O Caminho do Peregrino',
    year: 1678,
    type: 'livro',
    code: 'BOOK_1678_513',
    description:
      'John Bunyan, escrito na prisão, virou o livro mais lido em inglês por dois séculos. Uma alegoria que atravessa o puritanismo.',
    tags: ['alegoria', 'religião', 'clássico'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #131.',
    sources: [{ title: 'Project Gutenberg — The Pilgrim\'s Progress', url: 'https://www.gutenberg.org/ebooks/131' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-131.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/131.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 514,
    title: 'A Riqueza das Nações',
    year: 1776,
    type: 'livro',
    code: 'BOOK_1776_514',
    description:
      'Smith e a "mão invisível". O texto fundador da economia moderna, integral, com as notas do próprio autor.',
    tags: ['economia', 'clássico', 'ensaio'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #3300.',
    sources: [{ title: 'Project Gutenberg — The Wealth of Nations', url: 'https://www.gutenberg.org/ebooks/3300' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-3300.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/3300.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 515,
    title: 'Meditações',
    year: 180,
    type: 'livro',
    code: 'BOOK_0180_515',
    description:
      'Marco Aurélio escrevendo para si mesmo, no acampamento, sobre o que se pode controlar. O estoicismo em primeira pessoa.',
    tags: ['filosofia', 'estoicismo', 'clássico'],
    availability: 'available',
    language: 'Inglês (tradução de George Long)',
    rightsNote: 'Domínio público — texto e tradução.',
    sources: [{ title: 'Project Gutenberg — Meditations', url: 'https://www.gutenberg.org/ebooks/2680' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-2680.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/2680.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 516,
    title: 'Contos de Canterbury',
    year: 1400,
    type: 'livro',
    code: 'BOOK_1400_516',
    description:
      'Chaucer e a língua inglesa nascendo na estrada. Versão em verso modernizado, em domínio público.',
    tags: ['poesia', 'medieval', 'clássico'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #2383.',
    sources: [{ title: 'Project Gutenberg — The Canterbury Tales', url: 'https://www.gutenberg.org/ebooks/2383' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-2383.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/2383.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 518,
    title: 'Histórias Extraordinárias',
    year: 1840,
    type: 'livro',
    code: 'BOOK_1840_518',
    description:
      'Poe reunido em volume: "A Queda da Casa de Usher", "O Gato Preto", "A Máscara da Morte Rubra" e a invenção do conto policial.',
    tags: ['terror', 'conto', 'gótico'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #2148.',
    sources: [{ title: 'Project Gutenberg — The Works of Edgar Allan Poe, Volume 1', url: 'https://www.gutenberg.org/ebooks/2148' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-2148.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/2148.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 520,
    title: 'A Metamorfose',
    year: 1915,
    type: 'livro',
    code: 'BOOK_1915_520',
    description:
      'Gregor Samsa acorda inseto. Kafka em alemão, texto integral de domínio público.',
    tags: ['ficção', 'modernismo', 'clássico'],
    availability: 'available',
    language: 'Alemão',
    rightsNote: 'Domínio público — autor falecido em 1924.',
    sources: [{ title: 'Project Gutenberg — Die Verwandlung', url: 'https://www.gutenberg.org/ebooks/22367' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-22367.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/22367.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Alemão',
      },
    ],
  },
  {
    id: 522,
    title: 'Poemas de Emily Dickinson',
    year: 1890,
    type: 'livro',
    code: 'BOOK_1890_522',
    description:
      'A primeira série organizada por Mabel Loomis Todd e T. W. Higginson, que apresentou Dickinson ao mundo em 1890.',
    tags: ['poesia', 'clássico', 'norte-americano'],
    availability: 'available',
    language: 'Inglês',
    rightsNote: 'Domínio público — Project Gutenberg #12242.',
    sources: [{ title: 'Project Gutenberg — Poems by Emily Dickinson, Series One', url: 'https://www.gutenberg.org/ebooks/12242' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-12242.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/12242.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 523,
    title: 'Contos de Fadas de Andersen',
    year: 1835,
    type: 'livro',
    code: 'BOOK_1835_523',
    description:
      'A Pequena Sereia, O Patinho Feio, A Roupa Nova do Imperador — os contos dinamarqueses que viraram patrimônio mundial.',
    tags: ['conto', 'infantil', 'clássico'],
    availability: 'available',
    language: 'Inglês (tradução de H. P. Paull)',
    rightsNote: 'Domínio público — Project Gutenberg #1597.',
    sources: [{ title: 'Project Gutenberg — Fairy Tales of Hans Christian Andersen', url: 'https://www.gutenberg.org/ebooks/1597' }],
    media: [
      {
        title: 'Texto integral',
        kind: 'text',
        path: 'media/book-1597.txt',
        sourceUrl: 'https://www.gutenberg.org/ebooks/1597.txt.utf-8',
        license: 'Project Gutenberg — domínio público.',
        language: 'Inglês',
      },
    ],
  },

  // ───────────────────────────── LOST MEDIA ─────────────────────────────
]
