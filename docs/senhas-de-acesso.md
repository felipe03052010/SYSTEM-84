# SYSTEM 84 — convites de acesso

Os códigos de convite do Criador e do Administrador são **segredos do servidor**. Eles jamais devem aparecer em arquivos versionados, no JavaScript enviado ao navegador ou em capturas de tela públicas.

## Configurar

1. Crie dois valores aleatórios **diferentes**, com pelo menos 32 caracteres, em um gerenciador de senhas.
2. Configure `CREATOR_INVITE_CODE` e `ADMIN_INVITE_CODE` como segredos no Worker Cloudflare (ou no `server/.env.local` para testes locais).
3. Configure também `PIX_KEY` somente se quiser habilitar o procedimento Pix manual. Confirme a titularidade e as obrigações aplicáveis antes de receber pagamentos.
4. Cada pessoa criará seu próprio login e senha no aplicativo. Os convites são usados somente na criação de contas privilegiadas.

**Atenção — rotação obrigatória:** versões antigas deste repositório expuseram convites fracos no histórico público. Remover esses textos do commit atual **não os revoga** e **não apaga o histórico**. Substitua imediatamente quaisquer códigos antigos ainda usados no host existente, no Worker e nos ambientes locais. Revise as contas privilegiadas criadas anteriormente.
