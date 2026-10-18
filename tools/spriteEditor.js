import { makeSprite } from '../src/engine/sprite.js';
import { loadArt, loadEnemies } from './library.js';
import { loadOrder } from './order.js';
import { listDir, readText, importFresh } from './api.js';
import {
  findDeclaration, replaceValue, valueText, paletteLiteral, rowsLiteral, framesLiteral, entryComments,
  objectKey, comment, isIdentifier,
} from './source.js';
import {
  el, setChildren, icon, btn, hint, field, textInput, slider, section, modal, confirmBox, pixelCanvas, thumbnail,
  isTyping, deepClone, lineCells, camelCase, constCase, snakeCase, codeView, emptyState, toast,
} from './ui.js';

// Sprite Editor: paints the game's character-grid sprites. Colours are
// swatches; the letters the game stores them under are picked automatically
// (and only shown in Advanced mode).

const MAX_UNDO = 200;
// Letters handed to new colours, in order ('.' is transparent, '#' is for icons).
const SPARE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@%&*+=?$';
const STARTER = [['k', '#120c1c', 'outline'], ['w', '#f2ecff', 'white'], ['g', '#9a86d8', 'lilac'], ['s', '#f1c49a', 'skin'], ['y', '#ffd25e', 'gold'], ['o', '#ff8c1a', 'orange'], ['t', '#4fe3d0', 'teal'], ['r', '#c0503a', 'red']];
const NEW_COLOURS = ['#ff5470', '#5fc27a', '#3e7bd6', '#b07cff', '#e8743b', '#ffffff', '#6b4423', '#2b2f4a'];
const PRESETS = [
  { id: 'enemy', title: 'Enemy', size: [16, 16], text: '16 x 16, one picture: enemies, critters, things.' },
  { id: 'character', title: 'Character', size: [12, 18], text: '12 x 18 like the hero. Add frames to animate it.' },
  { id: 'portrait', title: 'Portrait', size: [32, 32], text: '32 x 32 face for dialogue, with a blink frame.' },
  { id: 'custom', title: 'Custom size', size: [24, 24], text: 'Any size you like.' },
];
const TOOLS = [
  ['pencil', 'Pencil', 'B', 'pencil'],
  ['eraser', 'Eraser', 'E', 'eraser'],
  ['fill', 'Fill', 'F', 'fill'],
  ['picker', 'Pick a colour from the sprite', 'I', 'picker'],
];
const TOOL_KEYS = { KeyB: 'pencil', KeyP: 'pencil', KeyE: 'eraser', KeyF: 'fill', KeyI: 'picker' };

const blankRows = (w, h) => Array.from({ length: h }, () => Array(w).fill('.'));
const rowStrings = (rows) => rows.map((row) => row.join(''));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export async function mount(root, studio) {
  let library = [];
  let doc = null;
  let frameIndex = 0;
  let colour = 'k';
  let tool = 'pencil';
  let mirror = false;
  let showGrid = true;
  let zoom = 20;
  let hover = null;
  let stroke = null;
  let undoStack = [];
  let redoStack = [];
  let returnTo = null;
  let playing = true;
  let fps = 4;

  const frame = () => doc.frames[frameIndex];
  const size = () => ({ w: frame().rows[0]?.length ?? 0, h: frame().rows.length });
  const colours = () => Object.fromEntries(doc.palette.map(({ char, color }) => [char, color]));
  const entryOf = (id) => library.find((e) => e.id === id);
  const canEditFrames = () => doc && (doc.kind === 'frames' || (doc.isNew && doc.kind === 'single'));

  // --- Undo ---
  const snapshot = () => JSON.stringify({ palette: doc.palette, frames: doc.frames, frameIndex });
  function changed() {
    undoStack.push(lastSnapshot);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
    lastSnapshot = snapshot();
    studio.setDirty(true);
  }
  let lastSnapshot = null;
  // Call before an edit: remembers the state the edit starts from.
  const beginEdit = () => { lastSnapshot = snapshot(); };
  function restore(from, to) {
    if (!from.length) return;
    to.push(snapshot());
    const state = JSON.parse(from.pop());
    doc.palette = state.palette;
    doc.frames = state.frames;
    frameIndex = Math.min(state.frameIndex, doc.frames.length - 1);
    if (!doc.palette.some((p) => p.char === colour)) colour = doc.palette[0]?.char ?? '.';
    studio.setDirty(true);
    refreshAll();
  }
  const undo = () => doc && restore(undoStack, redoStack);
  const redo = () => doc && restore(redoStack, undoStack);

  // --- Layout ---
  const libraryList = el('div', { class: 'pick-list' });
  const left = el('aside', { class: 'sidebar left' },
    el('div', { class: 'row', style: 'margin-bottom:14px' }, el('h2', { class: 'grow' }, 'Sprites'), btn('plus', 'New', () => newSprite(), { kind: 'primary', title: 'Draw a new sprite' })),
    libraryList);

  const canvas = pixelCanvas(16, 16, { style: 'cursor:crosshair', 'aria-label': 'Sprite canvas' });
  const stage = el('div', { class: 'stage' }, el('div', { class: 'stage-inner' }, canvas));
  const toolButtons = {};
  const mirrorButton = btn('mirror', 'Mirror', () => setMirror(!mirror), { iconOnly: true, key: 'M', title: 'Mirror: paint both halves at once' });
  const gridButton = btn('grid', 'Grid', () => { showGrid = !showGrid; gridButton.classList.toggle('active', showGrid); drawCanvas(); }, { iconOnly: true, key: 'G', active: true, title: 'Show the pixel grid' });
  const zoomLabel = el('span', { class: 'muted', style: 'font:19px VT323,monospace;min-width:44px;text-align:center' });
  const titleLabel = el('span', { class: 'title' });
  const returnBanner = el('div', { class: 'notice warn', style: 'margin:0', hidden: true });
  const toolbar = el('div', { class: 'toolbar' },
    TOOLS.map(([id, label, key, iconName]) => {
      toolButtons[id] = btn(iconName, label, () => setTool(id), { iconOnly: true, key, title: label });
      return toolButtons[id];
    }),
    mirrorButton,
    el('span', { class: 'sep' }),
    btn('undo', 'Undo', undo, { iconOnly: true, key: 'Ctrl+Z' }),
    btn('redo', 'Redo', redo, { iconOnly: true, key: 'Ctrl+Y' }),
    el('span', { class: 'sep' }),
    gridButton,
    btn('minus', 'Zoom out', () => setZoom(zoom / 1.25), { iconOnly: true, key: '-' }),
    zoomLabel,
    btn('plus', 'Zoom in', () => setZoom(zoom * 1.25), { iconOnly: true, key: '+' }),
    btn('fit', 'Fit to the window', () => fit(), { iconOnly: true, key: '0' }),
    el('span', { class: 'spacer' }),
    titleLabel);
  const framesStrip = el('div', { class: 'frames' });
  const status = el('div', { class: 'statusbar' });
  const work = el('div', { class: 'work' }, toolbar, returnBanner, stage, framesStrip, status);

  const previewArea = el('div', { class: 'preview-box' });
  const swatchArea = el('div');
  const changeArea = el('div');
  const advancedArea = el('div', { class: 'adv' });
  const right = el('aside', { class: 'sidebar right' },
    section('Preview', previewArea),
    section('Colours', swatchArea),
    section('Change the whole frame', changeArea),
    advancedArea);

  root.append(el('div', { class: 'workspace' }, left, work, right));

  // --- Library ---
  // Sprites tied to a place in the game (an enemy's art, someone's portrait,
  // an animation or object first seen in a room) go under that area's heading,
  // in the order the player meets them. The rest (the player, the room object
  // sheet, battle icons...) keep their usual headings, first.
  let order = null;
  let enemies = {};
  async function refreshLibrary(fresh = false) {
    [library, order, enemies] = await Promise.all([loadArt(fresh), loadOrder(fresh), loadEnemies(fresh)]);
    renderLibrary();
  }

  function placeOfEntry(entry) {
    if (entry.kind === 'portrait') return order.where('portraits', entry.portraitId) ?? order.where('npcs', entry.portraitId);
    if (entry.kind === 'icons' || entry.spritesExport === 'PROP_SPRITES') return null;
    const base = (entry.spriteExport ?? entry.spritesExport ?? '').replace(/_SPRITES?$/, '');
    const owner = Object.keys(enemies).find((id) => enemies[id].artFile === entry.file && enemies[id].artBase === base)
      ?? Object.keys(enemies).find((id) => enemies[id].artFile === entry.file && entry.file !== 'props.js');
    if (owner) return order.where('enemies', owner);
    const name = base.toLowerCase();
    return order.where('animations', name) ?? order.where('props', name) ?? order.where('npcs', name);
  }

  function libraryGroups() {
    const byId = Object.fromEntries(library.map((e) => [e.id, e]));
    const placed = order.groups('sprites', library.map((e) => e.id), { placeOf: (id) => placeOfEntry(byId[id]), fallback: null })
      .filter((g) => g.group !== null)
      .map(({ group, ids }) => ({ group, entries: ids.map((id) => byId[id]) }));
    const placedIds = new Set(placed.flatMap((g) => g.entries.map((e) => e.id)));
    const rest = library.filter((e) => !placedIds.has(e.id));
    const general = [...new Set(rest.map((e) => e.group))].map((group) => ({ group, entries: rest.filter((e) => e.group === group) }));
    return [...general, ...placed];
  }

  function renderLibrary() {
    if (!order) return;
    setChildren(libraryList, ...libraryGroups().flatMap(({ group, entries }) => [
      el('div', { class: 'group-label' }, group),
      ...entries.map((entry) => {
        const first = entry.frames[0];
        const sprite = makeSprite(first.rows, entry.palette);
        return el('button', {
          type: 'button',
          class: `pick-item${doc?.entryId === entry.id ? ' active' : ''}`,
          onclick: () => openEntry(entry),
          tip: `${entry.file}${entry.frames.length > 1 ? ` · ${entry.frames.length} frames` : ''}`,
        }, el('span', { class: 'thumb-box' }, thumbnail(sprite, 36)), el('span', {}, entry.label));
      }),
    ]));
  }

  async function okToLeave() {
    if (!doc || !studio.isDirty()) return true;
    return confirmBox('Unsaved changes', `You have changes to "${doc.label}" that aren't saved. Throw them away?`, 'Throw away', 'danger');
  }

  async function openEntry(entry) {
    if (doc?.entryId === entry.id) return;
    if (!(await okToLeave())) return;
    returnTo = null;
    load({
      isNew: false,
      entryId: entry.id,
      kind: entry.kind,
      label: entry.label,
      file: entry.file,
      spriteExport: entry.spriteExport,
      spritesExport: entry.spritesExport,
      paletteExport: entry.paletteExport,
      portraitId: entry.portraitId,
      palette: Object.entries(entry.palette).map(([char, color]) => ({ char, color, note: entry.notes?.[char] ?? '' })),
      frames: entry.frames.map((f) => ({ name: f.name, rows: f.rows.map((row) => [...row]) })),
    });
  }

  function load(newDoc) {
    doc = newDoc;
    frameIndex = 0;
    undoStack = [];
    redoStack = [];
    colour = doc.palette.find((p) => p.char !== '.')?.char ?? '.';
    if (tool !== 'pencil') setTool('pencil');
    studio.setDirty(doc.isNew);
    refreshAll();
    requestAnimationFrame(fit);
  }

  function fileLabel() {
    if (!doc) return null;
    if (doc.kind === 'portrait') return `src/data/art/portraits.js${doc.isNew ? ' (new portrait)' : ''}`;
    return `src/data/art/${doc.file}${doc.isNew ? ' (new)' : ''}`;
  }

  // --- New sprite ---
  async function newSprite(prefill = {}) {
    if (!(await okToLeave())) return false;
    let preset = prefill.preset ?? 'enemy';
    const nameInput = el('input', { type: 'text', value: prefill.name ?? '', placeholder: 'e.g. Crystal Bat' });
    const wInput = el('input', { type: 'number', value: 24, min: 1, max: 96 });
    const hInput = el('input', { type: 'number', value: 24, min: 1, max: 96 });
    const custom = el('div', { class: 'row', hidden: preset !== 'custom' }, field('Width', wInput), field('Height', hInput));
    const presetButtons = PRESETS.map((p) => {
      const b = el('button', { type: 'button', class: `preset${p.id === preset ? ' active' : ''}`, onclick: () => {
        preset = p.id;
        presetButtons.forEach((x) => x.classList.toggle('active', x === b));
        custom.hidden = preset !== 'custom';
      } }, el('strong', {}, p.title), el('span', {}, p.text));
      return b;
    });
    const existing = (await listDir('src/data/art')) ?? library.map((e) => e.file);
    const result = await modal({
      title: 'New sprite',
      body: el('div', {}, field('What is it called?', nameInput), el('div', { class: 'field-label', style: 'margin-bottom:6px' }, 'What kind?'), el('div', { class: 'presets' }, presetButtons), custom),
      actions: [
        { label: 'Cancel', value: null },
        {
          label: 'Start drawing',
          kind: 'primary',
          icon: 'pencil',
          validate: () => {
            const name = nameInput.value.trim();
            if (!/[a-z]/i.test(name)) return 'Give it a name with some letters in it.';
            if (preset === 'portrait') {
              if (library.some((e) => e.kind === 'portrait' && e.portraitId === snakeCase(name))) return 'There is already a portrait with that name.';
            } else if (existing.includes(`${fileBase(name)}.js`)) {
              return `There is already a sprite file called ${fileBase(name)}.js. Pick another name.`;
            }
            const w = Number(wInput.value);
            const h = Number(hInput.value);
            if (preset === 'custom' && !(w >= 1 && w <= 96 && h >= 1 && h <= 96)) return 'Width and height must be between 1 and 96.';
            return null;
          },
          value: () => ({ name: nameInput.value.trim(), preset, w: Number(wInput.value), h: Number(hInput.value) }),
        },
      ],
    });
    if (!result) return false;
    const info = PRESETS.find((p) => p.id === result.preset);
    const [w, h] = result.preset === 'custom' ? [result.w, result.h] : info.size;
    const palette = STARTER.map(([char, color, note]) => ({ char, color, note }));
    const base = constBase(result.name);
    const frames = result.preset === 'portrait'
      ? [{ name: 'idle', rows: blankRows(w, h) }, { name: 'blink', rows: blankRows(w, h) }]
      : [{ name: result.preset === 'character' ? 'idle' : 'sprite', rows: blankRows(w, h) }];
    returnTo = prefill.returnTo ?? null;
    load({
      isNew: true,
      entryId: null,
      kind: result.preset === 'portrait' ? 'portrait' : result.preset === 'character' ? 'frames' : 'single',
      label: result.name,
      file: result.preset === 'portrait' ? 'portraits.js' : `${fileBase(result.name)}.js`,
      base,
      portraitId: snakeCase(result.name),
      palette,
      frames,
    });
    return true;
  }

  const fileBase = (name) => {
    const base = camelCase(name) || 'sprite';
    return /^\d/.test(base) ? `art${base}` : base;
  };
  const constBase = (name) => {
    const base = constCase(name) || 'SPRITE';
    return /^\d/.test(base) ? `ART_${base}` : base;
  };

  // --- Tools ---
  function setTool(id) {
    tool = id;
    for (const [name, b] of Object.entries(toolButtons)) b.classList.toggle('active', name === id);
    canvas.style.cursor = id === 'picker' ? 'copy' : 'crosshair';
  }
  function setMirror(on) {
    mirror = on;
    mirrorButton.classList.toggle('active', on);
    drawCanvas();
  }
  function setZoom(z) {
    zoom = clamp(Math.round(z), 2, 64);
    drawCanvas();
  }
  function fit() {
    if (!doc) return;
    const { w, h } = size();
    const room = { w: stage.clientWidth - 70, h: stage.clientHeight - 70 };
    setZoom(Math.max(2, Math.min(40, Math.floor(Math.min(room.w / w, room.h / h)))));
  }

  function setPixel(x, y, char) {
    const rows = frame().rows;
    const { w, h } = size();
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    rows[y][x] = char;
    if (mirror) rows[y][w - 1 - x] = char;
  }

  function floodFill(x, y, char) {
    const rows = frame().rows;
    const { w, h } = size();
    const target = rows[y][x];
    if (target === char) return;
    const queue = [[x, y]];
    while (queue.length) {
      const [cx, cy] = queue.pop();
      if (cx < 0 || cy < 0 || cx >= w || cy >= h || rows[cy][cx] !== target) continue;
      rows[cy][cx] = char;
      queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  const cellAt = (e) => {
    const r = canvas.getBoundingClientRect();
    const { w, h } = size();
    return { x: Math.floor(((e.clientX - r.left) / r.width) * w), y: Math.floor(((e.clientY - r.top) / r.height) * h) };
  };
  const inside = ({ x, y }) => { const { w, h } = size(); return x >= 0 && y >= 0 && x < w && y < h; };

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (!doc) return;
    const cell = cellAt(e);
    if (!inside(cell)) return;
    const erase = e.button === 2 || tool === 'eraser';
    if (tool === 'picker' && !erase) {
      const char = frame().rows[cell.y][cell.x];
      if (char !== '.' && doc.palette.some((p) => p.char === char)) pickColour(char);
      return;
    }
    beginEdit();
    const char = erase ? '.' : colour;
    if (tool === 'fill' && !erase) {
      floodFill(cell.x, cell.y, char);
      if (mirror) floodFill(size().w - 1 - cell.x, cell.y, char);
      changed();
      refreshPixels();
      return;
    }
    stroke = { char, last: cell };
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    setPixel(cell.x, cell.y, char);
    refreshPixels(true);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!doc) return;
    const cell = cellAt(e);
    hover = cell;
    if (stroke) {
      for (const c of lineCells(stroke.last, cell)) setPixel(c.x, c.y, stroke.char);
      stroke.last = cell;
      refreshPixels(true);
    } else {
      drawCanvas();
    }
    renderStatus();
  });
  const endStroke = () => {
    if (!stroke) return;
    stroke = null;
    changed();
    refreshPixels();
  };
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
  canvas.addEventListener('pointerleave', () => { hover = null; drawCanvas(); renderStatus(); });

  stage.addEventListener('wheel', (e) => {
    if (!doc) return;
    e.preventDefault();
    const before = canvas.getBoundingClientRect();
    const fx = (e.clientX - before.left) / before.width;
    const fy = (e.clientY - before.top) / before.height;
    const old = zoom;
    setZoom(e.deltaY < 0 ? Math.max(zoom + 1, zoom * 1.15) : Math.min(zoom - 1, zoom / 1.15));
    if (zoom === old) return;
    // Keep the pixel under the mouse where it was.
    const after = canvas.getBoundingClientRect();
    stage.scrollLeft += after.left + fx * after.width - e.clientX;
    stage.scrollTop += after.top + fy * after.height - e.clientY;
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!studio.isActive() || !doc || isTyping(e) || document.querySelector('.overlay')) return;
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
    if ((e.ctrlKey || e.metaKey) && (key === 'y' || (key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (TOOL_KEYS[e.code]) setTool(TOOL_KEYS[e.code]);
    else if (e.code === 'KeyM') setMirror(!mirror);
    else if (e.code === 'KeyG') gridButton.click();
    else if (key === '+' || key === '=') setZoom(zoom * 1.25);
    else if (key === '-') setZoom(zoom / 1.25);
    else if (key === '0') fit();
    else if (key === '[' || key === ']') { frameIndex = (frameIndex + (key === ']' ? 1 : -1) + doc.frames.length) % doc.frames.length; refreshAll(); }
  });

  // --- Drawing ---
  function drawCanvas() {
    zoomLabel.textContent = `${zoom}x`;
    if (!doc) return;
    const { w, h } = size();
    if (canvas.width !== w * zoom || canvas.height !== h * zoom) {
      canvas.width = w * zoom;
      canvas.height = h * zoom;
    }
    const ctx = canvas.getContext('2d');
    const map = colours();
    const half = Math.max(1, Math.floor(zoom / 2));
    frame().rows.forEach((row, y) => row.forEach((char, x) => {
      const color = map[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
        return;
      }
      // Transparent: a soft checkerboard.
      ctx.fillStyle = '#1c1530';
      ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
      ctx.fillStyle = '#231b3a';
      ctx.fillRect(x * zoom, y * zoom, half, half);
      ctx.fillRect(x * zoom + half, y * zoom + half, zoom - half, zoom - half);
      if (char !== '.') {
        // A letter missing from the palette: invisible in the game.
        ctx.strokeStyle = '#ff5470';
        ctx.beginPath();
        ctx.moveTo(x * zoom + 2, y * zoom + 2);
        ctx.lineTo((x + 1) * zoom - 2, (y + 1) * zoom - 2);
        ctx.stroke();
      }
    }));
    if (showGrid && zoom >= 6) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      for (let x = 1; x < w; x++) ctx.fillRect(x * zoom, 0, 1, h * zoom);
      for (let y = 1; y < h; y++) ctx.fillRect(0, y * zoom, w * zoom, 1);
    }
    if (mirror) {
      ctx.fillStyle = 'rgba(79, 227, 208, 0.75)';
      ctx.fillRect(Math.round((w * zoom) / 2) - 1, 0, 2, h * zoom);
    }
    if (hover && inside(hover)) {
      ctx.strokeStyle = '#ffe14d';
      ctx.lineWidth = 1;
      ctx.strokeRect(hover.x * zoom + 0.5, hover.y * zoom + 0.5, zoom - 1, zoom - 1);
      if (mirror) ctx.strokeRect((w - 1 - hover.x) * zoom + 0.5, hover.y * zoom + 0.5, zoom - 1, zoom - 1);
    }
  }

  function renderStatus() {
    if (!doc) { setChildren(status, ); return; }
    const { w, h } = size();
    const parts = [`${w} x ${h}`];
    if (hover && inside(hover)) {
      const char = frame().rows[hover.y][hover.x];
      const entry = doc.palette.find((p) => p.char === char);
      parts.unshift(`x ${hover.x}, y ${hover.y}  ${char === '.' ? 'empty' : entry?.note || entry?.color || `unknown "${char}"`}`);
    }
    setChildren(status, el('span', {}, parts.join('   ·   ')), el('span', { class: 'spacer' }), el('span', { class: 'hint', style: 'margin:0' }, 'Right-click erases · scroll to zoom · [ and ] switch frames'));
  }

  const spriteOf = (f = frame()) => {
    const strings = rowStrings(f.rows);
    return strings.length && strings[0].length ? makeSprite(strings, colours()) : null;
  };

  // --- Frames strip ---
  function renderFrames() {
    const many = doc.frames.length > 1;
    framesStrip.hidden = !many && !canEditFrames();
    setChildren(framesStrip, 
      ...doc.frames.map((f, i) => {
        const sprite = spriteOf(f);
        const removable = doc.frames.length > 1 && (doc.isNew || studio.advanced) && doc.kind !== 'portrait' && doc.kind !== 'icons';
        return el('div', {
          class: `frame${i === frameIndex ? ' active' : ''}`,
          onclick: () => { frameIndex = i; refreshAll(); },
          ondblclick: () => renameFrame(i),
          tip: canRename() ? 'Double-click to rename' : null,
        },
        el('span', { class: 'thumb-box' }, sprite ? thumbnail(sprite, 48) : null),
        el('span', {}, f.name),
        removable ? el('button', { type: 'button', class: 'frame-x', tip: 'Delete this frame', onclick: (e) => { e.stopPropagation(); deleteFrame(i); } }, icon('close', 10)) : null);
      }),
      canEditFrames() ? btn('plus', 'Add frame', addFrame, { kind: 'ghost', class: 'frame-add', title: 'Add a frame (a copy of this one) to animate' }) : null,
    );
  }

  const canRename = () => (doc.isNew || studio.advanced) && doc.kind !== 'portrait' && doc.kind !== 'icons';

  function addFrame() {
    beginEdit();
    if (doc.kind === 'single') doc.kind = 'frames';
    let n = doc.frames.length + 1;
    while (doc.frames.some((f) => f.name === `frame${n}`)) n++;
    doc.frames.splice(frameIndex + 1, 0, { name: `frame${n}`, rows: deepClone(frame().rows) });
    frameIndex++;
    changed();
    refreshAll();
  }

  async function renameFrame(i) {
    if (!canRename()) return;
    const input = el('input', { type: 'text', value: doc.frames[i].name });
    const name = await modal({
      title: 'Rename frame',
      body: field('Frame name', input, 'Letters and numbers only, like walk2.'),
      actions: [{ label: 'Cancel', value: null }, {
        label: 'Rename',
        kind: 'primary',
        validate: () => {
          const v = input.value.trim();
          if (!isIdentifier(v)) return 'Use letters and numbers only, starting with a letter.';
          if (doc.frames.some((f, j) => j !== i && f.name === v)) return 'Another frame already has that name.';
          return null;
        },
        value: () => input.value.trim(),
      }],
    });
    if (!name || name === doc.frames[i].name) return;
    beginEdit();
    doc.frames[i].name = name;
    changed();
    renderFrames();
  }

  async function deleteFrame(i) {
    if (!(await confirmBox('Delete frame', `Delete the frame "${doc.frames[i].name}"?`, 'Delete', 'danger'))) return;
    beginEdit();
    doc.frames.splice(i, 1);
    frameIndex = Math.min(frameIndex, doc.frames.length - 1);
    changed();
    refreshAll();
  }

  // --- Colours ---
  function pickColour(char) {
    colour = char;
    if (tool === 'picker' || tool === 'eraser') setTool('pencil');
    renderSwatches();
  }

  function usedIn(char, entries) {
    return entries.some((e) => e.frames.some((f) => f.rows.some((row) => row.includes(char))));
  }

  // Sprites that share this palette (like the hero's walking and running frames).
  const sharers = () => library.filter((e) => e.id !== doc.entryId && e.file === doc.file && e.paletteExport && e.paletteExport === doc.paletteExport);

  function addColour() {
    const char = [...SPARE].find((c) => !doc.palette.some((p) => p.char === c));
    if (!char) { toast('This sprite has as many colours as it can hold.', { kind: 'error' }); return; }
    beginEdit();
    const color = NEW_COLOURS.find((c) => !doc.palette.some((p) => p.color === c)) ?? '#ffffff';
    doc.palette.push({ char, color, note: '' });
    colour = char;
    changed();
    renderSwatches();
    swatchArea.querySelector('input[type=color]')?.click();
  }

  async function removeColour(entry) {
    if (sharers().length && usedIn(entry.char, sharers())) {
      toast(`That colour is also used by ${sharers().map((s) => s.label).join(', ')}, so it can't be removed here.`, { kind: 'error' });
      return;
    }
    const used = usedIn(entry.char, [doc]);
    if (used && !(await confirmBox('Remove colour', 'This colour is used in the drawing. Remove it and make those pixels empty?', 'Remove', 'danger'))) return;
    beginEdit();
    for (const f of doc.frames) for (const row of f.rows) row.forEach((c, i) => { if (c === entry.char) row[i] = '.'; });
    doc.palette = doc.palette.filter((p) => p !== entry);
    if (colour === entry.char) colour = doc.palette[0]?.char ?? '.';
    changed();
    refreshAll();
  }

  function renderSwatches() {
    const fixed = doc.kind === 'icons';
    const current = doc.palette.find((p) => p.char === colour);
    const swatches = doc.palette.map((entry) => el('button', {
      type: 'button',
      class: `swatch${entry.char === colour && tool !== 'eraser' ? ' active' : ''}`,
      style: `background:${entry.color}`,
      tip: entry.note || entry.color,
      onclick: () => pickColour(entry.char),
      ondblclick: () => swatchArea.querySelector('input[type=color]')?.click(),
    }, el('span', { class: 'char adv' }, entry.char)));
    const colourInput = current ? el('input', {
      type: 'color',
      value: current.color.length === 4 ? `#${[...current.color.slice(1)].map((c) => c + c).join('')}` : current.color.slice(0, 7),
      onfocus: () => beginEdit(),
      onclick: () => beginEdit(),
      oninput: (e) => { current.color = e.target.value; refreshPixels(true); },
      onchange: () => { changed(); renderSwatches(); },
      tip: 'Change this colour everywhere it is used',
    }) : null;
    setChildren(swatchArea, 
      el('div', { class: 'swatches' }, swatches, fixed ? null : el('button', { type: 'button', class: 'swatch add', onclick: addColour, tip: 'Add a colour' }, icon('plus', 16))),
      fixed
        ? hint('Icons are one colour: the game paints them itself.')
        : current ? el('div', { class: 'colour-edit' },
          colourInput,
          el('input', {
            type: 'text', class: 'grow', value: current.note, placeholder: 'Colour name (optional)',
            onchange: (e) => { beginEdit(); current.note = e.target.value.trim(); changed(); renderSwatches(); },
          }),
          btn('trash', 'Remove this colour', () => removeColour(current), { iconOnly: true, kind: 'ghost danger' })) : null,
      sharers().length ? hint(`These colours are shared with ${sharers().map((s) => s.label).join(', ')}.`) : null,
    );
  }

  // --- Whole-frame changes ---
  function renderChanges() {
    setChildren(changeArea, el('div', { class: 'row tight' },
      btn('mirror', 'Flip', () => edit(() => frame().rows.forEach((row) => row.reverse())), { kind: 'ghost', title: 'Flip left to right' }),
      btn('back', 'Nudge', () => edit(() => { frame().rows = frame().rows.map((r) => [...r.slice(1), r[0]]); }), { kind: 'ghost', title: 'Move everything one pixel left' }),
      btn('next', 'Nudge', () => edit(() => { frame().rows = frame().rows.map((r) => [r.at(-1), ...r.slice(0, -1)]); }), { kind: 'ghost', title: 'Move everything one pixel right' }),
      btn('resize', 'Size', resizeDialog, { kind: 'ghost', title: 'Change the canvas size' }),
      btn('trash', 'Clear', async () => {
        if (await confirmBox('Clear frame', 'Erase everything in this frame?', 'Clear', 'danger')) edit(() => { frame().rows = blankRows(size().w, size().h); });
      }, { kind: 'ghost danger', title: 'Erase this frame' })));
  }

  function edit(apply) {
    beginEdit();
    apply();
    changed();
    refreshAll();
  }

  async function resizeDialog() {
    const { w, h } = size();
    const wInput = el('input', { type: 'number', value: w, min: 1, max: 96 });
    const hInput = el('input', { type: 'number', value: h, min: 1, max: 96 });
    const result = await modal({
      title: 'Canvas size',
      body: el('div', {}, el('div', { class: 'row' }, field('Width', wInput), field('Height', hInput)), hint('Rows and columns are added or cut at the right and bottom. Every frame changes size.')),
      actions: [{ label: 'Cancel', value: null }, { label: 'Resize', kind: 'primary', value: () => ({ w: clamp(Math.round(Number(wInput.value)) || w, 1, 96), h: clamp(Math.round(Number(hInput.value)) || h, 1, 96) }) }],
    });
    if (!result) return;
    edit(() => {
      for (const f of doc.frames) f.rows = Array.from({ length: result.h }, (_, y) => Array.from({ length: result.w }, (_, x) => f.rows[y]?.[x] ?? '.'));
    });
    fit();
  }

  // --- Preview ---
  const previewBig = pixelCanvas(1, 1);
  const previewSmall = pixelCanvas(1, 1);
  const playButton = btn('pause', 'Pause', () => { playing = !playing; renderPreviewControls(); }, { iconOnly: true, kind: 'ghost' });
  const previewControls = el('div', { class: 'row', style: 'margin-top:10px' });
  function renderPreviewControls() {
    const many = doc?.frames.length > 1;
    previewControls.hidden = !many;
    setChildren(playButton, icon(playing ? 'pause' : 'play', 18));
    playButton.dataset.tip = playing ? 'Pause the animation' : 'Play the animation';
    setChildren(previewControls, playButton, el('div', { class: 'grow' }, slider({ label: 'Speed', min: 1, max: 12, value: fps, format: (v) => `${v} fps`, onInput: (v) => { fps = v; } })));
  }
  function renderPreview() {
    setChildren(previewArea, 
      el('figure', {}, previewBig, el('figcaption', {}, 'big')),
      el('figure', {}, previewSmall, el('figcaption', {}, 'real size')));
    previewArea.after(previewControls);
    renderPreviewControls();
    drawPreview(performance.now());
  }
  function drawPreview(now) {
    if (!doc) return;
    const many = doc.frames.length > 1;
    const shown = many && playing ? doc.frames[Math.floor((now / 1000) * fps) % doc.frames.length] : frame();
    const sprite = spriteOf(shown);
    const maxW = Math.max(...doc.frames.map((f) => f.rows[0]?.length ?? 1));
    const maxH = Math.max(...doc.frames.map((f) => f.rows.length));
    const scale = Math.max(1, Math.min(6, Math.floor(150 / Math.max(maxW, maxH))));
    for (const [c, s] of [[previewBig, scale], [previewSmall, 1]]) {
      if (c.width !== maxW * s || c.height !== maxH * s) { c.width = maxW * s; c.height = maxH * s; }
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, c.width, c.height);
      if (sprite) ctx.drawImage(sprite, Math.floor((maxW - sprite.width) / 2) * s, (maxH - sprite.height) * s, sprite.width * s, sprite.height * s);
    }
  }
  let lastShown = -1;
  (function animate(now) {
    requestAnimationFrame(animate);
    if (!studio.isActive() || !doc || doc.frames.length < 2 || !playing) return;
    const index = Math.floor((now / 1000) * fps);
    if (index === lastShown) return;
    lastShown = index;
    drawPreview(now);
  })(performance.now());

  // --- Advanced: names and the literal the save will write ---
  function renderAdvanced() {
    const rows = rowStrings(frame().rows);
    const names = doc.kind === 'portrait'
      ? `PORTRAITS.${doc.portraitId} in portraits.js`
      : doc.kind === 'icons' ? 'ICONS in icons.js'
        : doc.isNew ? `${doc.base}_PALETTE, ${doc.base}_SPRITE${doc.frames.length > 1 ? `, ${doc.base}_SPRITES` : ''} in ${doc.file}`
          : `${doc.paletteExport}, ${doc.spriteExport ?? doc.spritesExport} in ${doc.file}`;
    setChildren(advancedArea, section('Code',
      hint(`Saves as ${names}.`),
      codeView(`${paletteLiteral(doc.palette)}\n\n${objectKey(frame().name)}: ${rowsLiteral(rows)}`)));
  }

  // --- Refreshing ---
  function refreshPixels(quick = false) {
    drawCanvas();
    drawPreview(performance.now());
    if (!quick) {
      renderFrames();
      if (studio.advanced) renderAdvanced();
    }
  }

  function refreshAll() {
    if (!doc) {
      setChildren(stage, emptyState('heart', 'Pick a sprite to edit', 'Choose one from the list on the left, or make a new one.', btn('plus', 'New sprite', () => newSprite(), { kind: 'primary' })));
      return;
    }
    if (!stage.contains(canvas)) setChildren(stage, el('div', { class: 'stage-inner' }, canvas));
    titleLabel.textContent = doc.label;
    studio.setFile(fileLabel());
    returnBanner.hidden = !returnTo;
    if (returnTo) {
      setChildren(returnBanner, icon('info', 16), el('span', { class: 'grow' }, 'Drawing for the Enemy Maker. Press Save when it looks right and you\'ll go straight back.'),
        btn('back', 'Back without saving', () => { const to = returnTo; returnTo = null; refreshAll(); studio.open(to); }, { kind: 'ghost' }));
    }
    renderLibrary();
    renderSwatches();
    renderChanges();
    renderPreview();
    renderStatus();
    renderAdvanced();
    refreshPixels();
  }

  window.addEventListener('studio:advanced', () => { if (doc) { renderFrames(); renderAdvanced(); } });

  // --- Saving ---
  async function getFiles() {
    if (!doc) throw new Error('Open or make a sprite first.');
    const frames = doc.frames.map((f) => ({ name: f.name, rows: rowStrings(f.rows) }));
    if (frames.some((f) => !f.rows.length || !f.rows[0].length)) throw new Error('A frame is empty (0 pixels wide).');
    if (doc.kind === 'portrait') return [{ path: 'src/data/art/portraits.js', content: await portraitsFile(frames) }];
    if (doc.isNew) return [{ path: `src/data/art/${doc.file}`, content: newSpriteFile(frames) }];

    const path = `src/data/art/${doc.file}`;
    let code = await readText(path);
    if (!code) throw new Error(`Couldn't read ${path}.`);
    if (doc.kind === 'icons') {
      code = replaceValue(code, 'ICONS', framesLiteral(frames, entryComments(valueText(code, 'ICONS'))));
    } else {
      code = replaceValue(code, doc.paletteExport, paletteLiteral(doc.palette));
      if (doc.kind === 'single') {
        code = replaceValue(code, doc.spriteExport, rowsLiteral(frames[0].rows));
      } else {
        code = replaceValue(code, doc.spritesExport, framesLiteral(frames, entryComments(valueText(code, doc.spritesExport))));
        // NAME_SPRITE = NAME_SPRITES.first must still point at a frame.
        const base = doc.spritesExport.slice(0, -'_SPRITES'.length);
        const alias = findDeclaration(code, `${base}_SPRITE`);
        if (alias && !frames.some((f) => code.slice(alias.valueStart, alias.valueEnd).trim() === `${doc.spritesExport}.${f.name}`)) {
          code = replaceValue(code, `${base}_SPRITE`, frameAccess(doc.spritesExport, frames[0].name));
        }
      }
    }
    return [{ path, content: code }];
  }

  const frameAccess = (object, name) => (isIdentifier(name) ? `${object}.${name}` : `${object}[${JSON.stringify(name)}]`);

  // Only the colours the drawing uses (at least one), for new files.
  function usedPalette(frames) {
    const used = new Set(frames.flatMap((f) => [...f.rows.join('')]));
    const palette = doc.palette.filter((p) => used.has(p.char));
    return palette.length ? palette : doc.palette.slice(0, 1);
  }

  function newSpriteFile(frames) {
    const { w, h } = size();
    const parts = [
      comment(`${doc.label}, ${w}x${h}: drawn in the Ruins Studio Sprite Editor (tools/).`),
      `export const ${doc.base}_PALETTE = ${paletteLiteral(usedPalette(frames))};`,
      '',
    ];
    if (frames.length === 1) {
      parts.push(`export const ${doc.base}_SPRITE = ${rowsLiteral(frames[0].rows)};`);
    } else {
      parts.push(
        `export const ${doc.base}_SPRITES = ${framesLiteral(frames)};`,
        '',
        '// The first frame on its own, for anything that wants a single picture (like an enemy).',
        `export const ${doc.base}_SPRITE = ${frameAccess(`${doc.base}_SPRITES`, frames[0].name)};`,
      );
    }
    return `${parts.join('\n')}\n`;
  }

  // Rewrites the whole PORTRAITS export from the game's current portraits,
  // with this one replaced (or added). Named palette consts are kept and updated.
  async function portraitsFile(frames) {
    const path = 'src/data/art/portraits.js';
    let code = await readText(path);
    if (!code) throw new Error(`Couldn't read ${path}.`);
    const live = (await importFresh(path)).PORTRAITS ?? {};
    const refs = {};
    for (const m of valueText(code, 'PORTRAITS').matchAll(/(?:'([^']+)'|([A-Za-z_$][\w$]*))\s*:\s*\{\s*palette\s*:\s*([A-Za-z_$][\w$]*)/g)) refs[m[1] ?? m[2]] = m[3];
    const id = doc.portraitId;
    if (refs[id] && findDeclaration(code, refs[id])) code = replaceValue(code, refs[id], paletteLiteral(doc.palette));
    const comments = entryComments(valueText(code, 'PORTRAITS'));
    const ids = [...Object.keys(live).filter((k) => k !== id || !doc.isNew), ...(Object.hasOwn(live, id) ? [] : [id])];
    const entries = ids.map((pid) => {
      const mine = pid === id;
      const art = live[pid];
      const ref = refs[pid] && findDeclaration(code, refs[pid]) ? refs[pid] : null;
      const palette = ref ?? paletteLiteral(mine ? doc.palette : Object.entries(art.palette).map(([char, color]) => ({ char, color })), '    ');
      const rows = mine ? frames : Object.entries(art).filter(([, v]) => Array.isArray(v)).map(([name, r]) => ({ name, rows: r }));
      const lead = (comments[pid] ?? []).map((c) => `  ${c}\n`).join('');
      return `${lead}  ${objectKey(pid)}: {\n    palette: ${palette},\n${rows.map((f) => `    ${objectKey(f.name)}: ${rowsLiteral(f.rows, '    ')},`).join('\n')}\n  },`;
    });
    return replaceValue(code, 'PORTRAITS', `{\n${entries.join('\n\n')}\n}`);
  }

  async function afterSave() {
    studio.setDirty(false);
    const savedId = doc.kind === 'portrait' ? `portraits.js:PORTRAITS.${doc.portraitId}`
      : doc.isNew ? `${doc.file}:${doc.base}_${doc.frames.length > 1 ? 'SPRITES' : 'SPRITE'}` : doc.entryId;
    const wasNew = doc.isNew;
    await refreshLibrary(true);
    const entry = entryOf(savedId);
    if (entry && wasNew) {
      Object.assign(doc, { isNew: false, entryId: entry.id, kind: entry.kind, spriteExport: entry.spriteExport, spritesExport: entry.spritesExport, paletteExport: entry.paletteExport });
    }
    refreshAll();
    if (returnTo && wasNew) {
      const to = returnTo;
      returnTo = null;
      studio.open(to, { type: 'art', file: doc.file, base: doc.base });
    }
  }

  async function handle(request) {
    if (request?.type === 'new') {
      const made = await newSprite({ preset: request.preset ?? 'enemy', name: request.name, returnTo: request.returnTo });
      if (!made && request.returnTo) studio.open(request.returnTo);
    }
  }

  setTool('pencil');
  await refreshLibrary();
  refreshAll();
  const first = library.find((e) => e.group === 'Enemies and things') ?? library[0];
  if (first) await openEntry(first);

  return { getFiles, afterSave, handle, onShow: () => requestAnimationFrame(fit) };
}
