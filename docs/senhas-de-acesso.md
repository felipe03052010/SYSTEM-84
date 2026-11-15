# SYSTEM 84 — senhas de acesso

**Criador:** `creator84`
**Administrador:** `admin84`

Esses dois códigos são o que o site chama de *senha de convite*: no cadastro, quem
escolhe "Criador" ou "Administrador" precisa digitá-los, e depois define uma senha
pessoal para entrar no dia a dia.

## Onde eles ficam

Nunca no código do site. O servidor lê:

- `CREATOR_INVITE_CODE` → `creator84`
- `ADMIN_INVITE_CODE` → `admin84`

O arquivo com esses valores foi criado na raiz do projeto (`.env`) e está fora do
Git pelo `.gitignore`, então não sobe para o repositório público.

## O que falta para funcionarem no site publicado

1. Abrir o painel do host do Site (`appgprj_6af847d5660c8191b713548e0e92af88`,
   `https://system84-optical-memory.felipegabrielpessoa8.chatgpt.site`).
2. Em **secrets / variáveis de ambiente**, criar as duas entradas com exatamente
   esses valores (e também `PIX_KEY`).
3. Publicar de novo para o Worker pegar as variáveis.

Depois disso: entrar em **ENVIAR → CRIADOR** (ou **ADMINISTRADOR**), digitar
`creator84` (ou `admin84`), escolher e-mail e senha pessoal. A conta fica com papel
de criador ou administrador.

## Atenção

`creator84` e `admin84` são curtos e fáceis de adivinhar, e criador/admin podem
publicar e aprovar pagamentos. Se o site ficar público, troque por algo longo e
aleatório (por exemplo, 20+ caracteres aleatórios) — a troca é só no arquivo `.env`
e no painel do host, nenhuma linha de código muda.
