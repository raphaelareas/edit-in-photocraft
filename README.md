# PhotoCraft on Figma

**English** · [Português](#português) · [Español](#español)

A free Figma plugin: select an image, edit it in **PhotoCraft** (a full image editor, similar to
Photoshop) without leaving Figma and, when you save with **⌘S**, the image is replaced right away.
Your original is never lost: it stays in the same layer, hidden.

Nothing to install besides the plugin. Works on Mac and Windows. Available in English, Portuguese
and Spanish (it follows your computer's language).

Made by [@raphaelareas](https://www.linkedin.com/in/raphaelareas/) ·
[LinkedIn](https://www.linkedin.com/in/raphaelareas/) · [Instagram](https://www.instagram.com/rapha.ux)

## How to use

1. Select a layer with an image.
2. Run **Edit in PhotoCraft**. The editor opens inside Figma with your image.
3. Edit and save with **⌘S** (Ctrl+S on Windows). The image updates in Figma.
4. Click **Done** when you finish.

The edited image goes on top, in the layer's **Fill** panel, and the original stays right below with
the eye closed, like Figma's "Remove background". To go back, turn the original's eye on and delete
the edited one.

Shortcut: select the image and press **⌘⌥P** (Ctrl+Alt+P) to run the last plugin again.

## Install

**From the Figma Community:** _(link coming soon)_

**From GitHub (development mode), in Figma desktop:**
1. Download [`photocraft-on-figma-plugin.zip`](https://github.com/raphaelareas/photocraft-on-figma/releases/latest/download/photocraft-on-figma-plugin.zip) and unzip it somewhere permanent.
2. In Figma: **Plugins > Development > Import plugin from manifest…**
3. Pick `manifest.json` from the unzipped folder.

## Privacy

The image goes from Figma to the editor and back, all on your computer. No server receives or stores
your images: this site only delivers the editor's files, which run in your browser.

## How it works

- `plugin/`: the Figma plugin.
- `editor/`: the official web version of PhotoCraft (0.23.1), **unmodified**, as published by its
  authors. Only difference: a copy of `snippets/…/inline0.js` also in `app/snippets/`, because the
  official package for this version looks for the file there and doesn't ship it.
- `ponte.html`: a page that opens the editor and talks to it: it hands over the image from Figma and,
  when you save, sends the file back to the plugin instead of downloading it.

The editor's ⌘S saves a PSD. The plugin reads the final image inside the PSD and sends it to Figma as PNG.

## Credits and licenses

- The editor is **PhotoCraft**, an open-source project by the ArtCraft team
  ([github.com/storytold/photocraft](https://github.com/storytold/photocraft)), under the MIT or
  Apache 2.0 licenses. The original licenses and notices are in `editor/` (`LICENSE-MIT`,
  `LICENSE-APACHE`, `NOTICE`, `ATTRIBUTION.md`).
- This plugin is independent: it is not made, sponsored or endorsed by the ArtCraft team or by Figma.
- The plugin and bridge code (`plugin/`, `ponte.html`, `index.html`) is MIT licensed, see `LICENSE`.

Made with love and tokens.

---

## Português

Plugin gratuito para o Figma: selecione uma imagem, edite no **PhotoCraft** (um editor de imagens
completo, parecido com o Photoshop) sem sair do Figma e, ao salvar com **⌘S**, a imagem é trocada na
hora. A original não se perde: fica guardada, oculta, na mesma camada.

Não precisa instalar nada além do plugin. Funciona no Mac e no Windows, em português, inglês e
espanhol (segue o idioma do seu computador).

**Como usar**
1. Selecione uma camada com imagem.
2. Rode o **Editar no PhotoCraft**. O editor abre dentro do Figma, já com a imagem.
3. Edite e salve com **⌘S** (Ctrl+S no Windows). A imagem atualiza no Figma.
4. Clique em **Concluir** quando terminar.

A editada entra por cima, no painel **Fill** da camada, e a original fica logo abaixo com o olho
fechado, como no "Remover fundo" do Figma. Atalho: selecione a imagem e use **⌘⌥P** (Ctrl+Alt+P)
para rodar o último plugin de novo.

**Instalar:** pela Comunidade do Figma _(link em breve)_ ou pelo GitHub: baixe o
[zip do plugin](https://github.com/raphaelareas/photocraft-on-figma/releases/latest/download/photocraft-on-figma-plugin.zip), descompacte num lugar fixo e, no Figma desktop, use **Plugins >
Development > Import plugin from manifest…** escolhendo o `manifest.json`.

**Privacidade:** a imagem vai do Figma para o editor e volta, tudo no seu computador. Nenhum servidor
recebe ou guarda suas imagens.

**Créditos:** o editor é o PhotoCraft, de código aberto, do time ArtCraft (licenças MIT ou Apache
2.0, em `editor/`). Este plugin é independente, sem vínculo com o time ArtCraft nem com a Figma.

---

## Español

Plugin gratuito para Figma: selecciona una imagen, edítala en **PhotoCraft** (un editor de imágenes
completo, parecido a Photoshop) sin salir de Figma y, al guardar con **⌘S**, la imagen se reemplaza
al instante. La original no se pierde: queda oculta en la misma capa.

**Cómo usar:** selecciona una capa con imagen, ejecuta **Editar en PhotoCraft**, edita y guarda con
**⌘S** (Ctrl+S en Windows), y haz clic en **Listo** al terminar.

**Instalar:** desde la Comunidad de Figma _(enlace próximamente)_ o desde el código: descarga el
repositorio y, en Figma desktop, usa **Plugins > Development > Import plugin from manifest…** con
`plugin/manifest.json`.

**Créditos:** el editor es PhotoCraft, de código abierto, del equipo ArtCraft (licencias MIT o Apache
2.0, en `editor/`). Este plugin es independiente.
