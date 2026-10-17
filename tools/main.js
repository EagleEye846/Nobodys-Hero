import { el, setChildren, icon, btn, toast, modal, popupMenu, copyText, downloadText, codeView, isTyping } from './ui.js';
import { hasServer, saveFile } from './api.js';
import { checkBalanced } from './source.js';

// The Studio shell: a home screen, a tab per tool, and one Save button that
// writes whatever the open tool is editing into the game's files.
//
// A tool module exports mount(root, studio) and returns (or resolves to)
//   { getFiles(): Promise<[{ path, content }]>, afterSave?(files), handle?(request), onShow?(), onHide?() }
// getFiles throws an Error with a plain-language message when something needs fixing first.
const TOOLS = [
  { id: 'sprites', label: 'Sprites', name: 'Sprite Editor', icon: 'heart', module: './spriteEditor.js', blurb: 'Draw and animate heroes, enemies, portraits and icons.' },
  { id: 'rooms', label: 'Rooms', name: 'Room Editor', icon: 'room', module: './roomEditor.js', blurb: 'Paint floors and walls, then place signs, doors and enemies.' },
  { id: 'music', label: 'Music', name: 'Music Maker', icon: 'note', module: './musicMaker.js', blurb: 'Write tunes on a piano roll and a drum grid.' },
  { id: 'patterns', label: 'Patterns', name: 'Pattern Lab', icon: 'pattern', module: './patternLab.js', blurb: 'Build bullet attacks from blocks, then dodge them yourself.' },
  { id: 'enemies', label: 'Enemies', name: 'Enemy Maker', icon: 'enemy', module: './enemyMaker.js', blurb: 'Make a new foe step by step: look, stats, attacks and words.' },
  { id: 'dialogue', label: 'Dialogue', name: 'Dialogue Maker', icon: 'chat', module: './dialogueMaker.js', blurb: 'Write what people say, page by page, and see it in the game\'s text box.' },
  { id: 'scenes', label: 'Cutscenes', name: 'Cutscene Maker', icon: 'film', module: './sceneMaker.js', blurb: 'Script scenes in a room: walking, talking, emotes and camera moves.' },
];
const GAME_URL = '../';
const SERVER_HINT = 'Start the Studio with `python tools/serve.py` to save.';

const tabBar = document.getElementById('tabs');
const panelArea = document.getElementById('panels');
const fileChip = document.getElementById('file');
const saveArea = document.getElementById('save-area');
const serverHint = document.getElementById('server-hint');
const advancedSwitch = document.getElementById('advanced');

let server = false;
let activeId = null;
const state = {}; // per tool: { panel, tab, api, file, dirty, pending: [] }

// --- Advanced mode: shows code and extra settings everywhere. ---
function setAdvanced(on) {
  document.body.classList.toggle('advanced', on);
  advancedSwitch.checked = on;
  try { localStorage.setItem('studio.advanced', on ? '1' : ''); } catch { /* private window */ }
  window.dispatchEvent(new CustomEvent('studio:advanced', { detail: on }));
}
advancedSwitch.addEventListener('change', () => setAdvanced(advancedSwitch.checked));
try { setAdvanced(localStorage.getItem('studio.advanced') === '1'); } catch { setAdvanced(false); }

// --- Save and export buttons ---
const saveButton = btn('save', 'Save', () => save(), { kind: 'primary save-button', key: 'Ctrl+S', title: 'Save into the game' });
const exportButton = btn('download', 'Export', (e) => exportMenu(e.currentTarget), { kind: 'ghost', iconOnly: true, title: 'Copy or download the file instead' });
saveArea.append(exportButton, saveButton);

function refreshTopbar() {
  const tool = state[activeId];
  const onTool = Boolean(tool);
  saveArea.hidden = !onTool;
  fileChip.hidden = !onTool || !tool.file;
  if (onTool) {
    setChildren(fileChip, 
      el('span', { class: `dot${tool.dirty ? ' on' : ''}`, tip: tool.dirty ? 'Unsaved changes' : 'Everything saved' }),
      el('span', { class: 'file-name' }, tool.file ?? ''),
    );
    saveButton.disabled = !server || !tool.api?.getFiles;
    saveButton.dataset.tip = server ? 'Save into the game  (Ctrl+S)' : SERVER_HINT;
  }
  for (const t of TOOLS) state[t.id]?.tab.classList.toggle('dirty', Boolean(state[t.id]?.dirty));
}

function contextFor(id) {
  return {
    setFile(label) { state[id].file = label; refreshTopbar(); },
    setDirty(dirty = true) {
      if (state[id].dirty === dirty) return;
      state[id].dirty = dirty;
      refreshTopbar();
    },
    isDirty: () => state[id].dirty,
    isActive: () => activeId === id,
    get server() { return server; },
    get advanced() { return document.body.classList.contains('advanced'); },
    open: (toolId, request) => open(toolId, request),
    save: () => save(),
    gameUrl: GAME_URL,
  };
}

async function collectFiles(tool) {
  const files = await tool.api.getFiles();
  for (const file of files) {
    if (file.path.endsWith('.js')) {
      const check = checkBalanced(file.content);
      if (!check.ok) throw new Error(`Didn't save: ${file.path} would come out broken (${check.message}). This is a Studio bug; your work is still here.`);
    }
  }
  return files;
}

let saving = false;
async function save() {
  const tool = state[activeId];
  if (!tool?.api?.getFiles || saving) return;
  if (!server) {
    toast(SERVER_HINT, { kind: 'info' });
    return;
  }
  saving = true;
  saveButton.classList.add('busy');
  try {
    const files = await collectFiles(tool);
    if (!files.length) { toast('Nothing to save yet.', { kind: 'info' }); return; }
    for (const file of files) {
      const result = await saveFile(file.path, file.content);
      if (!result.ok) throw new Error(`Couldn't save ${file.path}: ${result.error}`);
    }
    tool.dirty = false;
    refreshTopbar();
    const where = files.map((f) => f.path).join(', ');
    toast(`Saved to ${where}. Refresh the game to see it.`, { link: { href: GAME_URL, label: 'Open game' } });
    await tool.api.afterSave?.(files);
  } catch (error) {
    console.warn('Studio save:', error);
    toast(error.message, { kind: 'error', seconds: 12 });
  } finally {
    saving = false;
    saveButton.classList.remove('busy');
  }
}

async function exportMenu(anchor) {
  const tool = state[activeId];
  if (!tool?.api?.getFiles) return;
  let files;
  try {
    files = await collectFiles(tool);
  } catch (error) {
    toast(error.message, { kind: 'error' });
    return;
  }
  const base = (path) => path.split('/').pop();
  popupMenu(anchor, [
    { icon: 'copy', label: files.length > 1 ? `Copy ${files.length} files` : 'Copy the code', hint: 'Paste it into the file named below', onClick: () => copyFiles(files) },
    { icon: 'code', label: 'Show the code', hint: files.map((f) => f.path).join(', '), onClick: () => showCode(files) },
    { icon: 'download', label: files.length > 1 ? `Download ${files.length} files` : 'Download the file', hint: 'Then put it in the folder shown above', onClick: () => files.forEach((f) => downloadText(base(f.path), f.content)) },
  ]);
}

async function copyFiles(files) {
  if (files.length > 1) { showCode(files); return; }
  if (await copyText(files[0].content)) toast(`Copied. Paste it into ${files[0].path}.`);
  else showCode(files);
}

function showCode(files) {
  modal({
    title: files.length > 1 ? 'The files this would save' : 'The file this would save',
    wide: true,
    body: el('div', { class: 'stack' }, files.map((f) => el('div', { class: 'code-file' },
      el('div', { class: 'row', style: 'margin-bottom:6px' }, el('code', { class: 'grow' }, f.path), btn('copy', 'Copy', async () => toast((await copyText(f.content)) ? `Copied ${f.path}` : 'Copy failed: select the text and press Ctrl+C.', {}), { kind: 'ghost' })),
      codeView(f.content)))),
    actions: [{ label: 'Close', value: null, kind: 'primary' }],
  });
}

// --- Navigation ---
const homeTab = el('button', { type: 'button', class: 'tab home-tab', onclick: () => open('home'), tip: 'Home' }, icon('home', 18));
tabBar.append(homeTab);
const homePanel = el('section', { class: 'tool-panel home' });
panelArea.append(homePanel);
document.getElementById('brand').addEventListener('click', () => open('home'));

for (const tool of TOOLS) {
  const tab = el('button', { type: 'button', class: 'tab', onclick: () => open(tool.id), tip: tool.blurb }, icon(tool.icon, 18), el('span', {}, tool.label), el('span', { class: 'tab-dot' }));
  const panel = el('section', { class: 'tool-panel' });
  tabBar.append(tab);
  panelArea.append(panel);
  state[tool.id] = { panel, tab, api: null, file: null, dirty: false, pending: [], mounting: null };
}

function renderHome() {
  setChildren(homePanel, 
    el('div', { class: 'home-inner' },
      el('h1', {}, 'What do you want to make?'),
      el('p', { class: 'lead' }, 'Pick a tool. When you press Save, your work goes straight into the game: refresh the game to play with it.'),
      el('div', { class: 'cards' }, TOOLS.map((tool) => el('button', { type: 'button', class: 'card', onclick: () => open(tool.id) },
        el('span', { class: 'card-icon' }, icon(tool.icon, 40)),
        el('span', { class: 'card-title' }, tool.name),
        el('span', { class: 'card-text' }, tool.blurb)))),
      el('div', { class: 'home-foot' },
        el('span', { class: `status-pill ${server ? 'ok' : 'off'}` }, icon(server ? 'check' : 'warn', 14), server ? 'Saving is on' : 'Saving is off'),
        el('span', {}, server ? 'Saves keep a backup of the old file in .studio-backups/.' : SERVER_HINT.replace(/`/g, '')),
        el('a', { href: GAME_URL, target: '_blank', rel: 'noopener', class: 'btn ghost' }, icon('play', 16), el('span', {}, 'Open the game'))),
    ),
  );
}

async function open(id, request) {
  if (id !== 'home' && !state[id]) id = 'home';
  const previous = activeId;
  activeId = id;
  if (location.hash.slice(1) !== id) history.replaceState(null, '', `#${id}`);
  homeTab.classList.toggle('active', id === 'home');
  homePanel.classList.toggle('active', id === 'home');
  for (const tool of TOOLS) {
    state[tool.id].tab.classList.toggle('active', tool.id === id);
    state[tool.id].panel.classList.toggle('active', tool.id === id);
  }
  if (previous && previous !== id) state[previous]?.api?.onHide?.();
  refreshTopbar();
  if (id === 'home') { renderHome(); return; }

  const tool = state[id];
  if (request) tool.pending.push(request);
  if (!tool.api) {
    tool.mounting ??= mountTool(id);
    await tool.mounting;
  }
  if (!tool.api) return;
  if (activeId === id) tool.api.onShow?.();
  while (tool.pending.length) await tool.api.handle?.(tool.pending.shift());
}

async function mountTool(id) {
  const info = TOOLS.find((t) => t.id === id);
  const tool = state[id];
  setChildren(tool.panel, el('p', { class: 'loading' }, `Opening the ${info.name}...`));
  try {
    const module = await import(info.module);
    setChildren(tool.panel, );
    tool.api = (await module.mount(tool.panel, contextFor(id))) ?? {};
    refreshTopbar();
  } catch (error) {
    console.error(error);
    tool.mounting = null;
    setChildren(tool.panel, el('div', { class: 'empty' },
      icon('warn', 40),
      el('h3', {}, `The ${info.name} couldn't open`),
      el('p', {}, 'Usually a game file it reads has a mistake in it, or the page was opened as a file instead of through the Studio server.'),
      el('pre', { class: 'error' }, String(error?.stack || error))));
  }
}

// Ctrl+S saves; the browser warns before leaving with unsaved work.
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    save();
  }
}, true);
window.addEventListener('beforeunload', (e) => {
  if (Object.values(state).some((t) => t.dirty)) {
    e.preventDefault();
    e.returnValue = '';
  }
});
// Keep Space and the arrows from scrolling the page while a tool uses them.
window.addEventListener('keydown', (e) => {
  if (activeId !== 'home' && !isTyping(e) && e.code === 'Space' && e.target === document.body) e.preventDefault();
});

hasServer().then((ok) => {
  server = ok;
  serverHint.hidden = ok;
  setChildren(serverHint, icon('info', 16), el('span', {}, 'Start the Studio with ', el('code', {}, 'python tools/serve.py'), ' to save. Until then, the Export button next to Save copies or downloads your work.'));
  refreshTopbar();
  if (activeId === 'home') renderHome();
});

const fromHash = location.hash.slice(1);
open(state[fromHash] ? fromHash : 'home');
