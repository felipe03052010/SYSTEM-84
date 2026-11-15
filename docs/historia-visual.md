# SYSTEM 84 — a história visual do arquivo

Apresentação da evolução do site, do primeiro commit ao estado atual.
Cada slide corresponde a uma etapa real do histórico do repositório
(`felipe03052010/SYSTEM-84`), com o commit que a introduziu.

---

## Slide 1 — Capa
**SYSTEM 84 · A história visual de um arquivo**
Do primeiro deploy ao terminal retrofuturista.
26 commits · 111 registros no acervo · 7 abas programadas.

---

## Slide 2 — O ponto de partida (12/11/2026)
**"Publicar projeto SYSTEM 84 (React + Vite + Node + MySQL)"**
A base técnica: React + Vite no front, Node e MySQL no back, deploy no GitHub Pages.
Antes de qualquer estética, o problema era arquitetural: um site de acervo que
precisava caber em hospedagem estática e ainda assim guardar mídia.

> Aprendizado: estética sem base de dados vira slideshow. A base veio primeiro.

---

## Slide 3 — O limite de 100 MB
**"Dividir filmes longos em partes" + "Corrigir corrida de download"**
Filmes de domínio público são longos. A solução foi fatiar em partes menores que
o limite do GitHub Pages e baixar cada fonte compartilhada **uma única vez**
(single-flight), evitando baixar o mesmo arquivo três vezes em paralelo.

> Aprendizado: a maior parte do trabalho de um arquivo é logística, não vitrine.

---

## Slide 4 — Primeira identidade (13/11/2026)
**"Ampliar acervo livre e adicionar Analog Horror, ARG e interações retrô"**
O site ganha voz: ARG, fitas analógicas, enigmas. O visual começa a apontar para
o horror analógico, mas ainda é um tema sobre um layout convencional.

---

## Slide 5 — A primeira grande virada estética
**"Aprimorar estética retrofuturista de horror: scanlines, efeito CRT, glitch"**
Entram as scanlines dinâmicas, o efeito de monitor e o glitch inspirado no sadok.mx.
É o momento em que o site deixa de parecer um catálogo e começa a parecer um aparelho.

---

## Slide 6 — Curadoria e estrutura
**"Expansão para 122 registros", "Aba Comunidade + Painel Financeiro Admin"**
O acervo cresce e aparecem as abas de comunidade e administração. O problema passa
a ser outro: separar o que é real do que é invenção.

---

## Slide 7 — A correção de rumo
**"Remover conteúdos criados por IA e adicionar obras históricas reais"**
Registros inventados saem; entram obras históricas reais em domínio público, com
senhas exclusivas para Criador e Admin.

> Aprendizado: credibilidade é parte do design. Um arquivo que inventa o que guarda não é um arquivo.

---

## Slide 8 — Referências visuais
**"Incorporar estética X-Files / Retro Horror das referências do Pinterest"**
Carimbo TOP SECRET, malha de grade fosforescente, iluminação de monitor CRT.
A referência passa a vir de um board pessoal ("ideias oc"), não de um template.

---

## Slide 9 — Terror retrofuturista (13/11/2026)
**"Refazer estética do site: terror retrofuturista + aparelho portátil (sadok.mx)"**
Nova paleta de fósforo, âmbar e alarme; tipografia trocada; capa com aparelho
portátil de tela emoldurada, no espírito do sadok.mx.

---

## Slide 10 — Tipografia pixel e parede de CRTs
**"Tipografia 100% pixel" + "Logo nova a partir das referências"**
Pixelify Sans e Silkscreen em todo o site, sem antialias. A capa vira uma parede de
monitores bege com vidro curvo, poeira e cabos. A logo passa a ser desenhada em
blocos de pixel dentro de uma moldura de fósforo.

---

## Slide 11 — O ciclo de redesign do próprio projeto
**"Redesign como receptor Optical Memory"** (14/11)
O site foi redesenhado como um receptor: uma peça de hardware que se navega.
Depois, "substituir ilustrações de hardware por tema de tela CRT em todo o site".

> Aprendizado: hardware como metáfora funciona até o dia em que a metáfora fica maior que o conteúdo.

---

## Slide 12 — Entrada, BIOS e acesso
**"BIOS entrance, photoreal CRT signup room e acesso mensal protegido"**
A entrada ganha BIOS, sala de cadastro fotorrealista e fluxo de assinatura.
Em seguida, áudio de boot próprio: POST, cliques de drive e o chime de inicialização.

---

## Slide 13 — Estado atual (14/11/2026)
**"Filtros CRT, telas de carregamento por aba, sons e acervo ampliado"**
- **Acervo:** fichas reais de domínio público (Gutenberg, Internet Archive, Wikimedia)
  integradas ao catálogo, cada uma com fonte e licença.
- **Filtros de computador antigo:** fósforo, âmbar, papel de impressorora e VHS, mais
  scanlines, curvatura, ruído e cintilação.
- **Telas de carregamento:** uma por aba, cada uma com animação e som próprios
  (disquete, modem, fita, estática, energia, setor ruim, BBS).
- **Som em todo lugar:** clique, tecla, hover, abertura de painel.
- **Comunidade** como BBS com canais e fila de envios.

---

## Slide 14 — O que cada aba entrega
| Aba | O que faz |
| --- | --- |
| Capa (Estação) | Parede de monitores, pesquisa, atalhos e contagem do acervo |
| Filmes | Diretório com filtros de tela e período |
| Séries | Diretório com filtros de tela e período |
| Livros | Diretório com leitor interno e progresso salvo |
| Lost media | Dossiês de obras perdidas com fontes |
| Pesquisa | Busca global no acervo |
| Comunidade | Mural em BBS com canais e envios |
| Obra | Ficha, player, leitor e procedência |
| Admin | Painel financeiro restrito |

---

## Slide 15 — Próximos passos
1. Levantar o histórico de telas no Figma e casar cada aba com seu frame.
2. Ampliar o acervo de fichas reais mantendo fonte e licença em cada registro.
3. Medir o peso das telas de carregamento em conexões lentas.
4. Fechar o ciclo: cada aba do Figma com código e cada rota com frame.
