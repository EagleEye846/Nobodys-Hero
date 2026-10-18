import { readText, listDir } from './api.js';
import { npcIds } from './library.js';
import { loadOrder } from './order.js';
import { setSection, parseTextFile } from './textfile.js';
import { el, setChildren, icon, btn, hint, field, section, modal, toast, pixelCanvas, thumbnail, snakeCase, friendly, emptyState } from './ui.js';
import { TextBox, TEXTBOX_LINES, pageLineCount } from '../src/ui/textbox.js';
import { loadUiFont } from '../src/ui/text.js';
import { makeSprite } from '../src/engine/sprite.js';
import { PORTRAITS } from '../src/data/art/portraits.js';
import { UI_WIDTH, UI_HEIGHT, UI_SCALE } from '../src/config.js';

// Dialogue Maker: write what an NPC says, page by page, and see it in the
// game's own text box (portrait and all) as you type. NPCs live in
// text/npcs/<id>.txt: [first] is said the first time you talk to them, and
// [repeat] every time after. Put them in a room with the Room Editor.

const SECTIONS = [
  { key: 'first', title: 'First time', help: 'What they say the first time you talk to them.' },
  { key: 'repeat', title: 'After that', help: 'What they say every time after. Leave it empty to repeat the first time.' },
];
// The part of the 640x480 screen the text box sits in.
const BOX_AREA = { y: 300, h: 180 };

const newFileText = (id) => `# ${friendly(id).toUpperCase()}: made in Ruins Studio (tools/).
# Each entry (separated by a blank line) is one page of the textbox.

# Said the first time you talk to them.
[first]

# Said every time after that.
[repeat]
`;

export async function mount(root, studio) {
  await loadUiFont();
  let ids = await npcIds();
  // People under the area of the first room they stand in, in the order you meet them.
  let order = await loadOrder();
  let id = null; // the NPC being edited
  let source = ''; // its file as it was loaded
  let isNew = false;
  let pages = { first: [], repeat: [] };
  let selected = { key: 'first', index: 0 };
  let playing = null; // a running preview

  // --- Layout ---
  const list = el('div', { class: 'list-buttons' });
  const left = el('aside', { class: 'sidebar left' },
    section('People', list, el('div', { style: 'margin-top:10px' }, btn('plus', 'New person', () => newNpc(), { kind: 'ghost' }))),
    hint('Put someone in a room with the Room Editor: Place, Keeper / NPC, then pick who it is.'));
  const editor = el('div', { class: 'scroll-column' });
  const work = el('div', { class: 'work' }, editor);
  const preview = pixelCanvas(UI_WIDTH, BOX_AREA.h);
  const offscreen = pixelCanvas(UI_WIDTH, UI_HEIGHT);
  const previewInfo = el('div');
  const right = el('aside', { class: 'sidebar right' },
    section('In the game', el('div', { class: 'preview-box' }, preview),
      el('div', { class: 'row', style: 'margin-top:10px' },
        btn('play', 'Play it all', () => play(), { kind: 'primary' }),
        btn('next', 'Next page', () => playing?.press(), { kind: 'ghost', title: 'Like pressing Z' }),
        btn('stop', 'Stop', () => stop(), { kind: 'ghost', iconOnly: true }))),
    previewInfo);
  root.append(el('div', { class: 'workspace wide-right' }, left, work, right));

  // --- Opening ---
  function renderList() {
    const button = (npc) => {
      const face = PORTRAITS[npc] ? thumbnail(makeSprite(PORTRAITS[npc].idle, PORTRAITS[npc].palette), 28) : icon('person', 22);
      return el('button', { type: 'button', class: `list-button${npc === id ? ' active' : ''}`, onclick: () => openNpc(npc) }, face, el('span', {}, friendly(npc)));
    };
    setChildren(list, order.groups('npcs', ids).map(({ group, ids: people }) => [el('div', { class: 'group-label' }, group), people.map(button)]));
  }

  async function okToLeave() {
    if (!studio.isDirty()) return true;
    return modal({ title: 'Leave without saving?', body: hint('Your changes to this person haven\'t been saved.'), actions: [{ label: 'Stay', value: false }, { label: 'Leave', value: true, kind: 'danger' }] });
  }

  async function openNpc(npc, { fresh = false } = {}) {
    if (npc !== id && !(await okToLeave())) return;
    stop();
    id = npc;
    isNew = fresh;
    source = fresh ? newFileText(npc) : await readText(`text/npcs/${npc}.txt`);
    const parsed = parseTextFile(source);
    pages = { first: [...(parsed.first ?? [])], repeat: [...(parsed.repeat ?? [])] };
    if (!pages.first.length) pages.first.push('');
    selected = { key: 'first', index: 0 };
    studio.setFile(`text/npcs/${npc}.txt${fresh ? ' (new)' : ''}`);
    studio.setDirty(fresh);
    renderList();
    renderEditor();
    drawPreview();
  }

  async function newNpc() {
    const name = el('input', { type: 'text', placeholder: 'e.g. Lantern Kid' });
    const answer = await modal({
      title: 'Someone new',
      body: el('div', {}, field('Their name', name, 'Used for the file name. You can change what they say any time.')),
      actions: [{ label: 'Cancel', value: null }, { label: 'Make them', value: true, kind: 'primary' }],
      onOpen: () => name.focus(),
    });
    if (!answer) return;
    const npc = snakeCase(name.value);
    if (!npc) { toast('Give them a name first.', { kind: 'error' }); return; }
    if (ids.includes(npc)) { toast(`There's already someone called ${friendly(npc)}.`, { kind: 'error' }); openNpc(npc); return; }
    if (!(await okToLeave())) return;
    studio.setDirty(false);
    await openNpc(npc, { fresh: true });
  }

  // --- Editing ---
  function changed() {
    studio.setDirty(true);
    drawPreview();
  }

  function renderEditor() {
    if (!id) {
      setChildren(editor, emptyState('chat', 'Pick someone to write for', 'Or make someone new on the left.'));
      return;
    }
    const portraitNote = PORTRAITS[id]
      ? hint('Their portrait shows beside their words.')
      : hint(`No portrait yet. Draw one in the Sprite Editor (New, Portrait) named "${id}" and it shows beside their words.`);
    setChildren(editor,
      el('h2', { class: 'section-title' }, friendly(id)),
      portraitNote,
      hint('Each page is one box of text. Each line you write starts with "* ". Long lines wrap by themselves.'),
      SECTIONS.map(({ key, title, help }) => el('div', {},
        el('h3', { class: 'section-title', style: 'margin-top:22px' }, title),
        hint(help),
        pages[key].map((text, index) => pageCard(key, index, text)),
        btn('plus', 'Add a page', () => { pages[key].push(''); selected = { key, index: pages[key].length - 1 }; changed(); renderEditor(); focusSelected(); }, { kind: 'ghost' }))));
  }

  function pageCard(key, index, text) {
    const list = pages[key];
    const warning = el('p', { class: 'warn-text' });
    const card = el('div', { class: 'page-card' });
    const area = el('textarea', {
      value: text,
      placeholder: 'What do they say?',
      onfocus: () => { selected = { key, index }; markSelected(); drawPreview(); },
      oninput: (e) => { list[index] = e.target.value; checkLength(); changed(); },
    });
    const checkLength = () => {
      const lines = measure(list[index]);
      card.classList.toggle('too-long', lines > TEXTBOX_LINES);
      warning.textContent = lines > TEXTBOX_LINES ? `Too long for the box: it needs ${lines} lines and ${TEXTBOX_LINES} fit. Split it into two pages.` : '';
    };
    const move = (by) => {
      const to = index + by;
      if (to < 0 || to >= list.length) return;
      [list[index], list[to]] = [list[to], list[index]];
      selected = { key, index: to };
      changed();
      renderEditor();
    };
    setChildren(card,
      el('div', { class: 'card-head' },
        el('span', { class: 'num' }, `${index + 1}`),
        el('span', { class: 'grow' }, 'page'),
        btn('back', 'Move up', () => move(-1), { iconOnly: true, kind: 'ghost' }),
        btn('next', 'Move down', () => move(1), { iconOnly: true, kind: 'ghost' }),
        btn('trash', 'Remove page', () => { list.splice(index, 1); if (key === 'first' && !list.length) list.push(''); selected = { key, index: Math.max(0, index - 1) }; changed(); renderEditor(); }, { iconOnly: true, kind: 'ghost danger' })),
      area, warning);
    card.dataset.key = key;
    card.dataset.index = index;
    checkLength();
    return card;
  }

  function markSelected() {
    for (const card of editor.querySelectorAll('.page-card')) {
      card.classList.toggle('selected', card.dataset.key === selected.key && Number(card.dataset.index) === selected.index);
    }
  }

  function focusSelected() {
    editor.querySelector(`.page-card[data-key="${selected.key}"][data-index="${selected.index}"] textarea`)?.focus();
  }

  const measureCtx = offscreen.getContext('2d');
  const measure = (text) => (text.trim() ? pageLineCount(measureCtx, text, PORTRAITS[id] ? id : null) : 0);

  // --- Preview: the game's own text box ---
  const box = new TextBox();
  function render() {
    const ctx = offscreen.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0b0614';
    ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
    ctx.setTransform(UI_SCALE, 0, 0, UI_SCALE, 0, 0);
    box.draw(ctx);
    const out = preview.getContext('2d');
    out.drawImage(offscreen, 0, BOX_AREA.y, UI_WIDTH, BOX_AREA.h, 0, 0, UI_WIDTH, BOX_AREA.h);
  }

  function drawPreview() {
    if (playing || !id) { if (!id) render(); return; }
    const page = pages[selected.key]?.[selected.index] ?? '';
    box.open([page.trim() || ' '], PORTRAITS[id] ? id : null);
    box.visibleCharacters = Infinity;
    render();
    setChildren(previewInfo, hint(`Showing ${selected.key === 'first' ? 'first-time' : 'after-that'} page ${selected.index + 1}. Press Play to watch it type out, like in the game.`));
  }

  // Plays every page of the selected part with the typewriter, like talking to them.
  function play() {
    if (!id) return;
    stop();
    const all = pages[selected.key].map((p) => p.trim()).filter(Boolean);
    if (!all.length) { toast('Write something first.', { kind: 'info' }); return; }
    box.open(all, PORTRAITS[id] ? id : null);
    let pressed = false;
    const input = { wasPressed: (action) => pressed && action === 'confirm', isDown: () => false };
    playing = { press: () => { pressed = true; } };
    let last = performance.now();
    const frame = (now) => {
      if (!playing) return;
      box.update(Math.min(0.05, (now - last) / 1000), input);
      last = now;
      pressed = false;
      if (!box.isOpen) { stop(); return; }
      render();
      playing.raf = requestAnimationFrame(frame);
    };
    playing.raf = requestAnimationFrame(frame);
    setChildren(previewInfo, hint('Press Next page (or Z with the preview clicked) to go on, like in the game.'));
  }

  function stop() {
    if (!playing) return;
    cancelAnimationFrame(playing.raf);
    playing = null;
    drawPreview();
  }

  preview.tabIndex = 0;
  preview.addEventListener('keydown', (e) => {
    if (e.code === 'KeyZ' || e.code === 'Enter') { e.preventDefault(); playing?.press(); }
  });

  // --- Saving ---
  async function getFiles() {
    if (!id) return [];
    let text = isNew ? newFileText(id) : await readText(`text/npcs/${id}.txt`) || source;
    for (const { key } of SECTIONS) text = setSection(text, key, pages[key].map((p) => p.trim()).filter(Boolean).join('\n\n'));
    return [{ path: `text/npcs/${id}.txt`, content: text }];
  }

  async function afterSave() {
    isNew = false;
    ids = (await listDir('text/npcs'))?.filter((f) => f.endsWith('.txt')).map((f) => f.replace(/\.txt$/, '')) ?? ids;
    if (!ids.includes(id)) ids.push(id);
    source = await readText(`text/npcs/${id}.txt`);
    studio.setFile(`text/npcs/${id}.txt`);
    renderList();
  }

  async function handle(request) {
    if (request?.npc) await openNpc(request.npc);
  }

  // Back from the Room Editor: someone may stand somewhere new.
  async function onShow() {
    order = await loadOrder(true);
    renderList();
  }

  renderList();
  renderEditor();
  if (ids.length) await openNpc(order.sorted('npcs', ids)[0]);
  else render();

  return { getFiles, afterSave, handle, onShow, onHide: stop };
}
