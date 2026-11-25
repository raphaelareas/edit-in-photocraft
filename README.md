# Editar no PhotoCraft

Plugin gratuito para o Figma: selecione uma imagem, edite no **PhotoCraft** (um editor de imagens
completo, parecido com o Photoshop) sem sair do Figma e, ao salvar com **⌘S**, a imagem é trocada
na hora. A original não se perde: fica guardada, oculta, na mesma camada.

Não precisa instalar nada além do plugin. Funciona no Mac e no Windows.

Criado por [@raphaelareas](https://www.linkedin.com/in/raphaelareas/) ·
[LinkedIn](https://www.linkedin.com/in/raphaelareas/) · [Instagram](https://www.instagram.com/rapha.ux)

## Como usar

1. Selecione uma camada com imagem.
2. Rode o plugin **Editar no PhotoCraft**. O editor abre dentro do Figma, já com a imagem.
3. Edite e salve com **⌘S** (Ctrl+S no Windows). A imagem atualiza no Figma.
4. Clique em **Concluir** quando terminar.

A imagem editada entra por cima, no painel **Fill** da camada, e a original fica logo abaixo com o
olho fechado, como faz o "Remover fundo" do Figma. Para voltar, ligue o olho da original e apague a
editada.

Atalho: selecione a imagem e use **⌘⌥P** para rodar o último plugin de novo.

## Instalar

**Pela Comunidade do Figma:** _(link em breve)_

**Pelo código (modo desenvolvimento), no Figma desktop:**
1. Baixe este repositório (botão verde **Code** > **Download ZIP**) e descompacte num lugar fixo.
2. No Figma: menu **Plugins > Development > Import plugin from manifest…**
3. Escolha o arquivo `plugin/manifest.json`.

## Privacidade

A imagem vai do Figma para o editor e volta, tudo no seu computador. Nenhum servidor recebe ou
guarda suas imagens: este site só entrega os arquivos do editor, que roda no seu navegador.

## Como funciona

- `plugin/`: o plugin do Figma.
- `editor/`: a versão web oficial do PhotoCraft (0.23.1), **sem nenhuma modificação**, como
  publicada pelos autores. Única diferença: uma cópia do arquivo `snippets/…/inline0.js` também em
  `app/snippets/`, porque o pacote oficial desta versão procura o arquivo nesse lugar e não o traz.
- `ponte.html`: página que abre o editor e conversa com ele: entrega a imagem do Figma e, quando
  você salva, devolve o arquivo ao plugin em vez de baixar.

O ⌘S do editor salva em PSD. O plugin lê a imagem final de dentro do PSD e a envia ao Figma como PNG.

## Créditos e licenças

- O editor é o **PhotoCraft**, um projeto de código aberto do time ArtCraft
  ([github.com/storytold/photocraft](https://github.com/storytold/photocraft)), sob as licenças MIT
  ou Apache 2.0. As licenças e avisos originais estão em `editor/` (`LICENSE-MIT`, `LICENSE-APACHE`,
  `NOTICE`, `ATTRIBUTION.md`).
- Este plugin é independente: não é feito, patrocinado nem apoiado pelo time ArtCraft nem pela Figma.
- O código do plugin e da ponte (`plugin/`, `ponte.html`, `index.html`) está sob a licença MIT,
  no arquivo `LICENSE`.

Feito com amor e tokens.
