// Editar no PhotoCraft (versão web): abre a imagem selecionada no PhotoCraft web, dentro do Figma.
// Ao salvar (Cmd+S), a imagem editada entra por cima, na mesma camada, e a original fica oculta embaixo.
// Telas: boas-vindas (só na 1a vez), sobre (sem imagem selecionada), editor e convite para seguir
// (depois da 1a edição salva, ao clicar em Concluir; se a pessoa fechar no X, aparece na próxima vez).
const TAMANHO = {
  boasvindas: { width: 480, height: 480 },
  sobre: { width: 480, height: 480 },
  editor: { width: 1280, height: 820 },
  convite: { width: 400, height: 400 },
};
const AVISO_MS = 6000;

figma.showUI(__html__, Object.assign({ visible: false, themeColors: true, title: 'Editar no PhotoCraft' }, TAMANHO.boasvindas));

let alvo = null; // { no, hash, copia, nome }

const imagemDe = (no) =>
  no && 'fills' in no && Array.isArray(no.fills)
    ? no.fills.filter((p) => p.type === 'IMAGE' && p.imageHash && p.visible !== false).pop()
    : null;
const selecaoOk = () => figma.currentPage.selection.length === 1 && !!imagemDe(figma.currentPage.selection[0]);
const lerEdicao = (no) => { try { return JSON.parse(no.getPluginData('edicao') || '{}'); } catch (e) { return {}; } };
const hora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const ler = (k) => figma.clientStorage.getAsync(k);
const gravar = (k, v) => figma.clientStorage.setAsync(k, v);

// Põe a janela no meio da área do canvas que a pessoa está vendo.
function centralizar(w, h) {
  if (typeof figma.ui.reposition !== 'function') return;
  const c = figma.viewport.center, z = figma.viewport.zoom;
  figma.ui.reposition(c.x - w / 2 / z, c.y - h / 2 / z);
}

function mostrar(tela, extra) {
  const { width, height } = TAMANHO[tela];
  figma.ui.resize(width, height);
  centralizar(width, height);
  figma.ui.postMessage(Object.assign({ tipo: 'tela', tela, selecaoOk: selecaoOk() }, extra));
  figma.ui.show();
}

async function abrirEditor() {
  if (!selecaoOk()) return false;
  const no = figma.currentPage.selection[0];
  const hash = imagemDe(no).imageHash;
  // Se a imagem visível já é uma edição nossa, os próximos salvamentos só trocam ela.
  alvo = { no, hash, copia: lerEdicao(no).copia === hash ? hash : null, nome: no.name };
  const bytes = await figma.getImageByHash(hash).getBytesAsync();
  no.setRelaunchData({ editar: '' });
  mostrar('editor', { titulo: no.name, arquivo: no.name.replace(/[\\/:*?"<>|]/g, '-') + '.png', bytes });
  return true;
}

async function aplicar(bytes) {
  const no = alvo && alvo.no;
  if (!no || no.removed) throw new Error('A camada que estava sendo editada foi apagada.');
  const fills = no.fills.slice();
  const i = fills.findIndex((p) => p.type === 'IMAGE' && p.imageHash === alvo.hash);
  if (i < 0) throw new Error(`A imagem de "${alvo.nome}" mudou por fora. Feche e abra de novo.`);
  const imagem = figma.createImage(bytes);
  if (alvo.copia === alvo.hash) {
    fills[i] = Object.assign({}, fills[i], { imageHash: imagem.hash });
  } else {
    fills.splice(i + 1, 0, Object.assign({}, fills[i], { imageHash: imagem.hash, visible: true }));
    fills[i] = Object.assign({}, fills[i], { visible: false });
  }
  no.fills = fills;
  no.setPluginData('edicao', JSON.stringify({ copia: imagem.hash }));
  alvo.hash = alvo.copia = imagem.hash;
  const quando = hora();
  figma.notify(`"${alvo.nome}" atualizada às ${quando}. A original está guardada, oculta, na mesma camada.`, { timeout: AVISO_MS });
  figma.ui.postMessage({ tipo: 'salvo', hora: quando });
  if (!(await ler('convite'))) await gravar('convitePendente', true);
}

async function mostrarConvite(depois) {
  await gravar('convitePendente', false);
  await gravar('convite', true);
  mostrar('convite', { depois });
}

figma.on('selectionchange', () => figma.ui.postMessage({ tipo: 'selecao', selecaoOk: selecaoOk() }));

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.tipo === 'comecar') {
      await gravar('boasVindas', true);
      if (!(await abrirEditor())) figma.closePlugin('Selecione uma camada com imagem e rode o Editar no PhotoCraft de novo.');
    } else if (msg.tipo === 'aplicar') {
      await aplicar(msg.bytes);
    } else if (msg.tipo === 'concluir') {
      if (await ler('convitePendente')) await mostrarConvite('fechar');
      else figma.closePlugin();
    } else if (msg.tipo === 'continuar') {
      if (!(await abrirEditor())) figma.closePlugin();
    } else if (msg.tipo === 'fechar') {
      figma.closePlugin();
    } else if (msg.tipo === 'erro') {
      figma.notify(msg.texto, { error: true, timeout: AVISO_MS });
    } else if (msg.tipo === 'link') {
      if (/^https:\/\//.test(msg.url)) figma.openExternal(msg.url);
    }
  } catch (e) {
    figma.notify(e.message, { error: true, timeout: AVISO_MS });
  }
};

(async () => {
  if (!(await ler('boasVindas'))) return mostrar('boasvindas');
  // Fechou no X depois de salvar a 1a vez: o convite aparece agora, e depois segue para o editor.
  if (await ler('convitePendente')) return mostrarConvite(selecaoOk() ? 'continuar' : 'fechar');
  if (!(await abrirEditor())) mostrar('sobre', { aviso: 'Selecione uma camada com imagem e clique em Começar.' });
})();
