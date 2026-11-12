# Banco local do SYSTEM 84

O catálogo tem armazenamento MySQL local e uma cópia JSON para publicação no GitHub Pages. Os arquivos de vídeo e texto ficam em `public/media`; o banco guarda os títulos, caminhos, ordem, fontes e licenças. Os arquivos de mídia não são gravados como BLOBs no MySQL.

## Uso desta instalação

O MySQL 8.4.13 LTS foi baixado da Oracle para uma instalação isolada, sem serviço do Windows. Sua configuração usa apenas `127.0.0.1:3307`. Os caminhos e a conta da aplicação ficam no arquivo ignorado `.env.local` da raiz do projeto. Os dados e a conta administrativa ficam fora do repositório, na pasta local `work/mysql-data` do trabalho.

Iniciar novamente depois de reiniciar o computador:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-mysql.ps1
npm run db:check
```

Importar o catálogo incluído (transação, atualização por ID, preservando outros IDs):

```powershell
npm run db:seed
```

Depois de editar as tabelas no banco, gerar a cópia pública:

```powershell
npm run db:export
npm run build
```

O site publicado usa o JSON incluído no build. Ele não se conecta ao computador local. Para publicar alterações do banco, exporte o catálogo e envie o JSON atualizado ao GitHub.

## Estrutura

- `works`: títulos, categorias, ano, descrição, tags e campos adicionais.
- `media`: arquivos para cada obra, na ordem de leitura/reprodução, e origem/licença.
- `sources`: fontes documentais de cada obra.

Os campos adicionais são preservados em JSON na importação/exportação. O usuário `system84_app` tem somente SELECT, INSERT, UPDATE e DELETE no banco `system84`; não é administrador.

## Outro computador

Instale MySQL 8.4 LTS pela fonte oficial, execute `schema.sql` como administrador e crie uma conta limitada ao banco. Defina `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` e `MYSQL_PASSWORD` em `.env.local`. Para usar o script de inicialização, configure também `MYSQL_HOME` e `MYSQL_DATA`, com um arquivo `my.ini` apropriado. Não envie `.env.local`, credenciais administrativas ou o diretório de dados ao GitHub.

Fonte da distribuição: https://dev.mysql.com/downloads/mysql/8.4.html
