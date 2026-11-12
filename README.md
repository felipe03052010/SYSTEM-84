# SYSTEM 84 — React + Vite

Catálogo de filmes, séries, livros e lost media, com interface de terminal retrô e tela de inicialização. O conteúdo do catálogo é demonstrativo.

## 1. Extrair o projeto

No Windows, clique com o botão direito em `SYSTEM-84-GitHub-VSCode.zip` e escolha **Extrair tudo**. Abra a pasta extraída: ela deve conter `package.json`, `index.html` e a pasta `src`.

Este ZIP é um pacote para transportar o projeto. Para que o GitHub mostre os códigos, envie os arquivos extraídos. Enviar somente o ZIP armazena o arquivo compactado no repositório.

## 2. Adicionar ao GitHub

1. No GitHub, crie um repositório com o nome `system84`. Escolha a visibilidade que preferir. O pacote já contém README e `.gitignore`.
2. No repositório vazio, clique em **uploading an existing file**. Se já houver arquivos, use **Add file → Upload files**.
3. Abra a pasta extraída, selecione **todos os itens dentro dela** e arraste-os para a área de upload. Inclua a pasta `src` e os arquivos que começam com ponto, como `.gitignore`.
4. Confira se `package.json`, `index.html`, `vite.config.js` e `src` estão na raiz do repositório, sem outra pasta envolvendo o projeto.
5. Escreva uma mensagem, por exemplo `Adicionar projeto SYSTEM 84`, e confirme o commit.

Não use **Import repository** para esse ZIP: esse fluxo importa um repositório Git existente por uma URL.

## 3. Abrir no VS Code

Você pode abrir a pasta extraída em **Arquivo → Abrir Pasta**, ou abrir o arquivo `SYSTEM-84.code-workspace`.

Para trabalhar em uma cópia conectada ao GitHub:

1. Instale o [Git](https://git-scm.com/downloads) e o [VS Code](https://code.visualstudio.com/).
2. No GitHub, clique em **Code → HTTPS** e copie a URL do seu repositório.
3. No VS Code, pressione **Ctrl+Shift+P**, procure **Git: Clone**, cole a URL e escolha onde salvar.
4. Abra a pasta clonada quando o VS Code oferecer essa opção.

## 4. Executar o site

Instale o [Node.js](https://nodejs.org/en/download) com npm. Você pode usar Node.js 24; o Vite 7 requer Node.js 20.19+ ou 22.12+ nas respectivas linhas compatíveis. Reinicie o VS Code depois da instalação.

Abra **Terminal → Novo Terminal** na pasta que contém `package.json` e execute um comando por vez:

```bash
npm install
npm run dev
```

Abra o endereço `Local` mostrado no terminal, normalmente `http://localhost:5173`. Para encerrar o servidor, pressione **Ctrl+C**.

Use o servidor do Vite para visualizar o projeto. Abrir `index.html` com dois cliques ou pela extensão Live Server não compila os componentes React.

Se o PowerShell bloquear `npm.ps1`, selecione **Command Prompt / Prompt de Comando** no menu de perfis do terminal do VS Code e execute os mesmos comandos.

## Comandos disponíveis

| Comando | Função |
| --- | --- |
| `npm install` | Instalar as dependências |
| `npm run dev` | Iniciar o servidor de desenvolvimento |
| `npm run build` | Gerar a versão de produção em `dist` |
| `npm run preview` | Visualizar o build localmente, depois de gerá-lo |

## Onde editar

| Arquivo ou pasta | Conteúdo |
| --- | --- |
| `index.html` | Documento HTML principal |
| `src/main.jsx` | Inicialização do React |
| `src/App.jsx` | Definição das rotas |
| `src/pages/` | Início, filmes, séries, livros, pesquisa e lost media |
| `src/components/` | Cabeçalho, rodapé, cartões e tela de inicialização |
| `src/styles/` | Arquivos CSS |
| `src/data/records.js` | Dados demonstrativos do catálogo |
| `src/utils/audio.js` | Efeitos sonoros |

As rotas disponíveis são `/`, `/filmes`, `/series`, `/livros`, `/pesquisa` e `/lost-media`. Em React, essas páginas são componentes `.jsx` que usam um único `index.html`.

O `.gitignore` exclui dependências instaladas, builds e arquivos locais de configuração. O projeto não inclui backend nem banco de dados. As fontes são carregadas do Google Fonts quando há conexão.

Guardar o código no GitHub não publica o site. A hospedagem deve compilar o projeto e servir `dist`; como as rotas usam `BrowserRouter`, acessos diretos às páginas precisam retornar `index.html`.

## Documentação

- [Adicionar arquivos ao GitHub](https://docs.github.com/pt/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Clonar repositórios no VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview)
- [Documentação do Vite 7](https://v7.vite.dev/guide/)
