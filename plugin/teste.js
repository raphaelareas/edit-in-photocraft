// node plugin-web/teste.js — simula o Figma e confere as telas e o salvamento do plugin web.
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const espera = (t) => new Promise((r) => setTimeout(r, t));
const guardado = {}, dados = {};
const no = { id: '1', name: 'foto', removed: false, fills: [{ type: 'SOLID' }, { type: 'IMAGE', imageHash: 'h1', scaleMode: 'CROP', opacity: 0.5 }],
  getPluginData: (k) => dados[k] || '', setPluginData: (k, v) => (dados[k] = v), setRelaunchData() {} };
let n = 0;
async function rodar(selecao) {
  const f = { out: [], av: [], visivel: false, fechou: null, tamanho: null };
  const figma = {
    showUI() {}, notify(m, o) { f.av.push([m, o && o.timeout]); }, on() {}, openExternal() {}, closePlugin(m) { f.fechou = m || ''; },
    ui: { postMessage: (m) => f.out.push(m), show() { f.visivel = true; }, resize(w, h) { f.tamanho = [w, h]; }, reposition(x, y) { f.pos = [x, y]; } },
    viewport: { center: { x: 1000, y: 500 }, zoom: 0.5 },
    clientStorage: { getAsync: async (k) => guardado[k], setAsync: async (k, v) => { guardado[k] = v; } },
    currentPage: { selection: selecao }, getImageByHash: () => ({ getBytesAsync: async () => new Uint8Array([1]) }),
    createImage: () => ({ hash: 'novo' + ++n }),
  };
  vm.runInNewContext(fs.readFileSync(__dirname + '/code.js', 'utf8'), { figma, console, __html__: '' });
  await espera(10);
  assert.equal(f.out[0].tipo, 'config');
  await figma.ui.onmessage({ tipo: 'idioma', idioma: 'pt' });
  await espera(10);
  f.figma = figma; f.ultima = () => f.out.filter((m) => m.tipo === 'tela').pop();
  return f;
}
const imgs = () => no.fills.filter((p) => p.type === 'IMAGE').map((p) => p.imageHash + (p.visible === false ? '(oculta)' : ''));
(async () => {
  // 1a vez: boas-vindas; Começar abre o editor grande
  let f = await rodar([no]);
  assert.equal(f.ultima().tela, 'boasvindas'); assert.deepEqual(f.tamanho, [480, 480]); assert.deepEqual(f.pos, [520, 20]);
  await f.figma.ui.onmessage({ tipo: 'comecar' });
  assert.equal(f.ultima().tela, 'editor'); assert.deepEqual(f.tamanho, [1280, 820]); assert.equal(f.ultima().arquivo, 'foto.png');
  // 1o salvamento: original oculta, editada por cima; aviso de 6 s; convite fica pendente
  await f.figma.ui.onmessage({ tipo: 'aplicar', bytes: new Uint8Array([2]) });
  assert.deepEqual(imgs(), ['h1(oculta)', 'novo1']); assert.equal(no.fills[2].scaleMode, 'CROP');
  assert.equal(f.av.at(-1)[1], 6000); assert.equal(guardado.convitePendente, true);
  // 2o salvamento: só troca a editada
  await f.figma.ui.onmessage({ tipo: 'aplicar', bytes: new Uint8Array([3]) });
  assert.deepEqual(imgs(), ['h1(oculta)', 'novo2']);
  // Concluir: mostra o convite (botão Fechar) e depois fecha
  await f.figma.ui.onmessage({ tipo: 'concluir' });
  assert.equal(f.ultima().tela, 'convite'); assert.equal(f.ultima().depois, 'fechar'); assert.deepEqual(f.pos, [600, 80]); assert.equal(guardado.convite, true);
  await f.figma.ui.onmessage({ tipo: 'fechar' }); assert.equal(f.fechou, '');
  // 2a vez: abre direto no editor e continua trocando a mesma editada
  f = await rodar([no]);
  assert.equal(f.ultima().tela, 'editor');
  await f.figma.ui.onmessage({ tipo: 'aplicar', bytes: new Uint8Array([4]) });
  assert.deepEqual(imgs(), ['h1(oculta)', 'novo3']);
  assert.notEqual(guardado.convitePendente, true); // convite não volta
  await f.figma.ui.onmessage({ tipo: 'concluir' }); assert.equal(f.fechou, '');
  // Sem seleção: tela "sobre"
  f = await rodar([]); assert.equal(f.ultima().tela, 'sobre');
  // Fechou no X depois de salvar a 1a vez (outro computador): convite na próxima vez, com "Continuar"
  for (const k of Object.keys(guardado)) delete guardado[k];
  guardado.boasVindas = true; guardado.convitePendente = true;
  f = await rodar([no]); assert.equal(f.ultima().tela, 'convite'); assert.equal(f.ultima().depois, 'continuar');
  await f.figma.ui.onmessage({ tipo: 'continuar' }); assert.equal(f.ultima().tela, 'editor');
  const ui = fs.readFileSync(__dirname + '/ui.html', 'utf8');
  new Function(ui.split('<script>')[1].split('</script>')[0]);
  // Idioma escolhido no seletor fica guardado e muda os avisos
  await f.figma.ui.onmessage({ tipo: 'idioma', idioma: 'en', escolhido: true });
  assert.equal(guardado.idioma, 'en');
  await f.figma.ui.onmessage({ tipo: 'aplicar', bytes: new Uint8Array([5]) });
  assert(f.av.at(-1)[0].includes('updated at'));
  console.log('TODOS OS TESTES PASSARAM');
})().catch((e) => { console.error(e); process.exitCode = 1; });
