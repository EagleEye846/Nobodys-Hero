import { BACKDROPS } from '../src/battle/backdrops.js';
import { SHOPS } from '../src/data/shops.js';
import { loadRooms, roomFiles, loadEnemies, enemySprite, loadSongs, npcIds } from './library.js';
import { listDir, readText } from './api.js';
import { setSection, sectionText, freeSectionName, parseTextFile } from './textfile.js';
import {
  T, TILES, TILE_INFO, tileName, tileSwatch, renderTiles, propSprites, propBounds, npcBounds, startBounds,
  drawThings, editableRoom, roomModule, roomHeader, pickTile, playerSprite,
} from './rooms.js';
import {
  el, setChildren, icon, btn, hint, field, select, slider, section, segmented, modal, confirmBox, pixelCanvas, thumbnail,
  isTyping, deepClone, lineCells, camelCase, constCase, snakeCase, friendly, codeView, toast,
} from './ui.js';

// Room Editor: paint tiles with the game's own tile art, then place the
// player start, doors, signs, save points, NPCs, shops and enemies.
// Everything is in tile coordinates, like the room files.

const MAX_UNDO = 120;
const ZOOMS = [1, 1.5, 2, 2.5, 3, 4, 5, 6];
const SIZES = { small: [16, 12], medium: [20, 15], large: [30, 20] };
const PAINT_TOOLS = [['brush', 'Brush', 'pencil', 'B'], ['box', 'Box', 'box', 'X'], ['fill', 'Fill', 'fill', 'F']];
const TILE_HELP = {
  '.': 'Walkable ground',
  r: 'Walkable carpet',
  W: 'The face of a wall',
  '#': 'The dark top of a wall',
  P: 'A pillar with a lantern',
  p: 'A potted plant',
  D: 'Dark doorway: put a Door on it',
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// What a prop is, from its fields.
const propType = (prop) => (prop.save ? 'save' : prop.shop ? 'shop' : prop.npc ? 'npc' : prop.text ? 'sign' : 'decor');
const TYPE_INFO = {
  start: { label: 'Player start', icon: 'person' },
  door: { label: 'Door', icon: 'door' },
  sign: { label: 'Sign', sprite: 'sign' },
  save: { label: 'Save point', sprite: 'savepoint' },
  npc: { label: 'Keeper / NPC', sprite: 'keeper' },
  shop: { label: 'Shop', sprite: 'merchant' },
  decor: { label: 'Object' },
};

export async function mount(root, studio) {
  let rooms = await loadRooms();
  let files = await roomFiles();
  const enemies = await loadEnemies();
  const enemySprites = Object.fromEntries(Object.entries(enemies).map(([id, info]) => [id, enemySprite(info.enemy)]));
  const songs = Object.keys(await loadSongs());
  const npcs = await npcIds();
  const shops = Object.keys(SHOPS);
  const areas = Object.keys(BACKDROPS);

  let room = null;
  let meta = null; // { isNew, file, constName, header }
  let signs = {}; // text-file section -> what the sign says
  let textSource = '';
  let originalSigns = {};
  let mode = 'paint';
  let paintTool = 'brush';
  let tileChar = '.';
  let armed = null; // a place card waiting for a click: 'sign', 'enemy:moth', ...
  let selected = null; // { type: 'start' | 'door' | 'prop' | 'npc', index }
  let zoom = 2;
  let showGrid = true;
  let hover = null;
  let drag = null;
  let background = null;
  let undoStack = [];
  let redoStack = [];
  let lastSnapshot = null;

  const width = () => room.tiles[0].length;
  const height = () => room.tiles.length;
  const tileAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= width() || ty >= height() ? null : room.tiles[ty][tx]);
  const enemyName = (id) => friendly(enemies[id]?.enemy.name ?? id);
  const roomLabel = (id) => {
    const r = id === room?.id ? room : rooms[id];
    return r ? friendly(r.name || id) : id;
  };

  // --- Undo ---
  const snapshot = () => JSON.stringify({ room, signs, selected });
  const beginEdit = () => { lastSnapshot = snapshot(); };
  function changed() {
    if (lastSnapshot) undoStack.push(lastSnapshot);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
    lastSnapshot = null;
    studio.setDirty(true);
  }
  function edit(apply, { all = false } = {}) {
    beginEdit();
    apply();
    changed();
    if (all) refreshAll(); else refreshObjects();
  }
  function restore(from, to) {
    if (!from.length) return;
    to.push(snapshot());
    ({ room, signs, selected } = JSON.parse(from.pop()));
    studio.setDirty(true);
    refreshAll();
  }
  const undo = () => room && restore(undoStack, redoStack);
  const redo = () => room && restore(redoStack, undoStack);

  // --- Layout ---
  const modeSwitch = segmented([['paint', 'Paint', 'pencil', 'Paint floors and walls  (1)'], ['place', 'Place', 'cursor', 'Place and move things  (2)']], mode, (v) => setMode(v));
  const leftBody = el('div');
  const left = el('aside', { class: 'sidebar left' }, el('div', { style: 'margin-bottom:18px' }, modeSwitch), leftBody);

  const roomSelect = el('select', { onchange: (e) => openRoom(e.target.value), tip: 'Open a room' });
  const canvas = pixelCanvas(16, 16, { 'aria-label': 'Room map' });
  const stage = el('div', { class: 'stage' }, el('div', { class: 'stage-inner' }, canvas));
  const gridButton = btn('grid', 'Grid', () => { showGrid = !showGrid; gridButton.classList.toggle('active', showGrid); draw(); }, { iconOnly: true, key: 'G', active: true, title: 'Show the tile grid' });
  const toolbar = el('div', { class: 'toolbar' },
    roomSelect,
    btn('plus', 'New room', () => newRoom(), { kind: 'ghost' }),
    el('span', { class: 'sep' }),
    btn('undo', 'Undo', undo, { iconOnly: true, key: 'Ctrl+Z' }),
    btn('redo', 'Redo', redo, { iconOnly: true, key: 'Ctrl+Y' }),
    el('span', { class: 'sep' }),
    gridButton,
    btn('minus', 'Zoom out', () => zoomStep(-1), { iconOnly: true, key: '-' }),
    btn('plus', 'Zoom in', () => zoomStep(1), { iconOnly: true, key: '+' }),
    btn('fit', 'Fit to the window', () => fit(), { iconOnly: true, key: '0' }));
  const status = el('div', { class: 'statusbar' });
  const work = el('div', { class: 'work' }, toolbar, stage, status);
  const inspector = el('div');
  const checks = el('div');
  const advanced = el('div', { class: 'adv' });
  const right = el('aside', { class: 'sidebar right' }, inspector, section('Check', checks), advanced);
  root.append(el('div', { class: 'workspace' }, left, work, right));

  // --- Opening rooms ---
  function renderRoomSelect() {
    const ids = Object.keys(rooms);
    const options = ids.map((id) => el('option', { value: id }, `${friendly(rooms[id].name || id)}`));
    if (meta?.isNew) options.push(el('option', { value: room.id }, `${friendly(room.name || room.id)} (new)`));
    setChildren(roomSelect, options);
    roomSelect.value = room?.id ?? '';
  }

  async function okToLeave() {
    if (!room || !studio.isDirty()) return true;
    return confirmBox('Unsaved changes', `You have changes to "${friendly(room.name || room.id)}" that aren't saved. Throw them away?`, 'Throw away', 'danger');
  }

  async function openRoom(id) {
    if (room && id === room.id) return;
    if (!(await okToLeave())) { renderRoomSelect(); return; }
    const info = files[id];
    await load(editableRoom(rooms[id]), {
      isNew: false,
      file: info?.file ?? `${camelCase(id)}.js`,
      constName: info?.constName ?? constCase(id),
      header: roomHeader(info?.source ?? ''),
    });
  }

  async function load(data, info, signText = null) {
    room = data;
    meta = info;
    selected = null;
    armed = null;
    undoStack = [];
    redoStack = [];
    textSource = await readText(`text/${room.textFile}`);
    const parsed = parseTextFile(textSource);
    signs = {};
    for (const prop of room.props) {
      if (prop.text) signs[prop.text] = signText?.[prop.text] ?? (parsed[prop.text] ?? []).join('\n\n');
    }
    originalSigns = info.isNew ? {} : { ...signs };
    studio.setDirty(Boolean(info.isNew));
    renderRoomSelect();
    refreshAll();
    requestAnimationFrame(fit);
  }

  // --- New room wizard ---
  async function newRoom() {
    if (!(await okToLeave())) return;
    const nameInput = el('input', { type: 'text', placeholder: 'e.g. Crystal Cave' });
    let sizeKey = 'medium';
    const sizePick = segmented([['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']], sizeKey, (v) => { sizeKey = v; });
    const fromSelect = select([['', 'An empty room (walls and floor)'], ...Object.keys(rooms).map((id) => [id, `A copy of ${friendly(rooms[id].name || id)}`])], '', () => {});
    const existing = (await listDir('src/data/rooms')) ?? Object.values(files).map((f) => f.file);
    const result = await modal({
      title: 'New room',
      body: el('div', {},
        field('Room name', nameInput, 'Shown on a title card when the player walks in.'),
        el('div', { class: 'field' }, el('span', { class: 'field-label' }, 'Size'), sizePick, hint('Small 16 x 12, Medium 20 x 15, Large 30 x 20 tiles. You can change it later.')),
        field('Start from', fromSelect)),
      actions: [{ label: 'Cancel', value: null }, {
        label: 'Make room',
        kind: 'primary',
        validate: () => {
          const id = snakeCase(nameInput.value);
          if (!id || !/^[a-z]/.test(id)) return 'Give the room a name that starts with a letter.';
          if (rooms[id]) return 'There is already a room with that name.';
          if (existing.includes(`${camelCase(id)}.js`)) return `There is already a file called ${camelCase(id)}.js.`;
          return null;
        },
        value: () => ({ name: nameInput.value.trim(), from: fromSelect.value }),
      }],
    });
    if (!result) return;
    const id = snakeCase(result.name);
    const [w, h] = SIZES[sizeKey];
    let data;
    const signText = {};
    if (result.from) {
      data = editableRoom(rooms[result.from]);
      data.id = id;
      data.name = result.name.toUpperCase();
      // Signs get their own copies of the words.
      const source = await readText(`text/${data.textFile}`);
      const taken = [];
      for (const prop of data.props) {
        if (!prop.text) continue;
        const words = sectionText(source, prop.text);
        prop.text = freeSectionName(source, `${id}_${prop.text}`, taken);
        taken.push(prop.text);
        signText[prop.text] = words;
      }
    } else {
      data = emptyRoom(id, result.name.toUpperCase(), w, h);
    }
    await load(data, { isNew: true, file: `${camelCase(id)}.js`, constName: constCase(id) || 'NEW_ROOM', header: '' }, signText);
  }

  function emptyRoom(id, name, w, h) {
    const tiles = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => {
      if (y === 0 || y === h - 1 || x === 0 || x === w - 1) return '#';
      return y <= 2 ? 'W' : '.';
    }));
    return editableRoom({
      id, name, area: areas[0] ?? 'ruins', music: songs.includes('ruins') ? 'ruins' : songs[0] ?? null,
      tiles: tiles.map((r) => r.join('')), playerStart: { x: Math.floor(w / 2), y: h - 3 },
      doors: [], textFile: 'interactions/the_ruins.txt', props: [], npcs: [],
    });
  }

  // --- Left panel: Paint or Place ---
  function setMode(next) {
    mode = next;
    modeSwitch.set(next);
    armed = null;
    renderLeft();
    draw();
  }

  function renderLeft() {
    if (mode === 'paint') {
      setChildren(leftBody,
        section('Brush', segmented(PAINT_TOOLS.map(([id, label, iconName, k]) => [id, label, iconName, `${label}  (${k})`]), paintTool, (v) => { paintTool = v; renderStatus(); })),
        section('Tiles', el('div', { class: 'tile-grid' }, Object.keys(TILES).map((char) => el('button', {
          type: 'button',
          class: `tile-btn${char === tileChar ? ' active' : ''}`,
          onclick: () => { tileChar = char; renderLeft(); },
          tip: `${TILE_HELP[char] ?? ''}${TILES[char].solid ? '\nBlocks walking' : '\nYou can walk on it'}`,
        }, tileSwatch(char, 32), el('span', {}, tileName(char), el('small', {}, TILES[char].solid ? 'blocks walking' : 'walkable')))))),
        hint('Right-click a tile on the map to pick it up.'));
      return;
    }
    const card = (key, label, picture, tip) => el('button', {
      type: 'button',
      class: `place-card${armed === key ? ' active' : ''}`,
      onclick: () => { armed = armed === key ? null : key; renderLeft(); renderStatus(); draw(); },
      tip,
    }, picture, el('span', {}, label));
    const sprite = (name) => (propSprites[name] ? thumbnail(propSprites[name], 40) : icon('star', 28));
    setChildren(leftBody,
      section('Things', el('div', { class: 'place-grid' },
        card('start', 'Player start', thumbnail(playerSprite, 40), 'Where the player appears'),
        card('door', 'Door', icon('door', 32), 'Click or drag on the map: walking in takes you to another room'),
        card('sign', 'Sign', sprite('sign'), 'Something to read'),
        card('save', 'Save point', sprite('savepoint'), 'A crystal the player can save at'),
        card('npc', 'Keeper / NPC', sprite('keeper'), 'Someone to talk to'),
        card('shop', 'Shop', sprite('merchant'), 'A shopkeeper'))),
      section('Enemies', el('div', { class: 'place-grid' }, Object.keys(enemies).map((id) => card(`enemy:${id}`, enemyName(id), enemySprites[id] ? thumbnail(enemySprites[id], 40) : icon('enemy', 28), 'Wanders left and right; touching it starts a battle')))),
      hint(armed ? 'Now click on the map. Esc cancels.' : 'Pick a thing, then click the map. Click things on the map to select them, drag to move.'));
  }

  // --- Drawing ---
  function setZoom(z) {
    zoom = ZOOMS.reduce((best, step) => (Math.abs(step - z) < Math.abs(best - z) ? step : best), ZOOMS[0]);
    draw();
  }
  const zoomStep = (dir) => setZoom(ZOOMS[clamp(ZOOMS.indexOf(zoom) + dir, 0, ZOOMS.length - 1)]);
  function fit() {
    if (!room) return;
    const z = Math.min((stage.clientWidth - 60) / (width() * T), (stage.clientHeight - 60) / (height() * T));
    zoom = [...ZOOMS].reverse().find((step) => step <= Math.min(z, 4)) ?? ZOOMS[0];
    draw();
  }

  function renderBackground() {
    background = renderTiles(room);
  }

  function doorRect(door) { return { x: door.x * T, y: door.y * T, w: door.w * T, h: door.h * T }; }

  function boundsOf(sel) {
    if (!sel) return null;
    if (sel.type === 'start') return startBounds(room.playerStart);
    if (sel.type === 'prop') return room.props[sel.index] && propBounds(room.props[sel.index]);
    if (sel.type === 'npc') return room.npcs[sel.index] && npcBounds(room.npcs[sel.index], spriteForNpc(room.npcs[sel.index]));
    return room.doors[sel.index] && doorRect(room.doors[sel.index]);
  }
  const spriteForNpc = (npc) => enemySprites[npc.art] ?? enemySprites[npc.enemy];

  // Patrol handles of the selected enemy, in screen pixels.
  function patrolHandles() {
    if (selected?.type !== 'npc') return [];
    const npc = room.npcs[selected.index];
    if (!npc) return [];
    const s = T * zoom;
    const y = (npc.y + 1) * s - zoom * 2;
    return npc.patrol.map((p, i) => ({ i, x: (p + 0.5) * s, y }));
  }

  function draw() {
    if (!room || !background) return;
    const W = Math.round(width() * T * zoom);
    const H = Math.round(height() * T * zoom);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
    ctx.drawImage(background, 0, 0);
    for (const door of room.doors) {
      ctx.fillStyle = 'rgba(79, 227, 208, 0.22)';
      const r = doorRect(door);
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
    if (mode === 'paint') ctx.globalAlpha = 0.55;
    drawThings(ctx, room, enemySprites);
    ctx.globalAlpha = 1;

    // Overlays in screen pixels.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const s = T * zoom;
    if (showGrid) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
      for (let x = 1; x < width(); x++) ctx.fillRect(x * s, 0, 1, H);
      for (let y = 1; y < height(); y++) ctx.fillRect(0, y * s, W, 1);
    }
    ctx.font = `${Math.max(14, 8 * zoom)}px VT323, monospace`;
    room.doors.forEach((door) => {
      ctx.strokeStyle = '#4fe3d0';
      ctx.lineWidth = 2;
      ctx.strokeRect(door.x * s + 1, door.y * s + 1, door.w * s - 2, door.h * s - 2);
      ctx.fillStyle = '#4fe3d0';
      ctx.fillText(`to ${roomLabel(door.to)}`, door.x * s + 3, door.y * s - 4 < 10 ? door.y * s + 14 : door.y * s - 4);
    });
    room.npcs.forEach((npc, i) => {
      const sel = selected?.type === 'npc' && selected.index === i;
      const y = (npc.y + 1) * s - zoom * 2;
      const [x0, x1] = npc.patrol.map((p) => (p + 0.5) * s);
      ctx.fillStyle = sel ? '#ffe14d' : 'rgba(255, 225, 77, 0.45)';
      ctx.fillRect(Math.min(x0, x1), y - 1, Math.abs(x1 - x0) + 1, 2);
      const size = sel ? 10 : 6;
      for (const x of [x0, x1]) ctx.fillRect(x - size / 2, y - size / 2, size, size);
    });
    ctx.strokeStyle = '#ff8c1a';
    ctx.lineWidth = 2;
    ctx.strokeRect(room.playerStart.x * s + 1, room.playerStart.y * s + 1, s - 2, s - 2);

    const sel = boundsOf(selected);
    if (sel) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(sel.x * zoom - 2, sel.y * zoom - 2, sel.w * zoom + 4, sel.h * zoom + 4);
      ctx.setLineDash([]);
    }
    if (drag?.kind === 'box' || drag?.kind === 'door') {
      const r = dragRect();
      ctx.strokeStyle = drag.kind === 'door' ? '#4fe3d0' : '#ffe14d';
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x * s + 1, r.y * s + 1, r.w * s - 2, r.h * s - 2);
    } else if (hover && tileAt(hover.x, hover.y) !== null) {
      ghost(ctx, s);
      ctx.strokeStyle = 'rgba(255, 225, 77, 0.85)';
      ctx.lineWidth = 1;
      ctx.strokeRect(hover.x * s + 0.5, hover.y * s + 0.5, s - 1, s - 1);
    }
  }

  // A see-through preview of what a click would place.
  function ghost(ctx, s) {
    if (mode !== 'place' || !armed) return;
    let sprite = null;
    if (armed === 'start') sprite = playerSprite;
    else if (armed.startsWith('enemy:')) sprite = enemySprites[armed.slice(6)];
    else if (TYPE_INFO[armed]?.sprite) sprite = propSprites[TYPE_INFO[armed].sprite];
    if (!sprite) return;
    ctx.globalAlpha = 0.6;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, hover.x * s + (s - sprite.width * zoom) / 2, (hover.y + 1) * s - sprite.height * zoom, sprite.width * zoom, sprite.height * zoom);
    ctx.globalAlpha = 1;
  }

  // --- Mouse ---
  function dragRect(d = drag) {
    const x = Math.min(d.from.x, d.to.x);
    const y = Math.min(d.from.y, d.to.y);
    return { x, y, w: Math.abs(d.to.x - d.from.x) + 1, h: Math.abs(d.to.y - d.from.y) + 1 };
  }
  const inside = (b, px, py) => b && px >= b.x && py >= b.y && px < b.x + b.w && py < b.y + b.h;

  function objectAt(px, py) {
    for (let i = room.npcs.length - 1; i >= 0; i--) if (inside(npcBounds(room.npcs[i], spriteForNpc(room.npcs[i])), px, py)) return { type: 'npc', index: i };
    for (let i = room.props.length - 1; i >= 0; i--) if (inside(propBounds(room.props[i]), px, py)) return { type: 'prop', index: i };
    if (inside(startBounds(room.playerStart), px, py)) return { type: 'start', index: 0 };
    for (let i = room.doors.length - 1; i >= 0; i--) if (inside(doorRect(room.doors[i]), px, py)) return { type: 'door', index: i };
    return null;
  }
  function positionOf(sel) {
    if (sel.type === 'start') return room.playerStart;
    return { door: room.doors, prop: room.props, npc: room.npcs }[sel.type][sel.index];
  }

  function cellOf(e) {
    const r = canvas.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * canvas.width;
    const py = ((e.clientY - r.top) / r.height) * canvas.height;
    return { x: Math.floor(px / (T * zoom)), y: Math.floor(py / (T * zoom)), px, py };
  }

  function paintTile(tx, ty) {
    if (tileAt(tx, ty) === null || room.tiles[ty][tx] === tileChar) return false;
    room.tiles[ty][tx] = tileChar;
    return true;
  }

  function floodFill(x, y) {
    const target = room.tiles[y][x];
    if (target === tileChar) return;
    const queue = [[x, y]];
    while (queue.length) {
      const [cx, cy] = queue.pop();
      if (tileAt(cx, cy) !== target) continue;
      room.tiles[cy][cx] = tileChar;
      queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  function place(kind, x, y) {
    if (kind === 'start') { room.playerStart = { x, y }; return { type: 'start', index: 0 }; }
    if (kind === 'door') {
      const to = Object.keys(rooms).find((id) => id !== room.id) ?? room.id;
      room.doors.push({ x, y, w: 1, h: 1, to, spawn: { ...(rooms[to]?.playerStart ?? { x: 1, y: 1 }) } });
      return { type: 'door', index: room.doors.length - 1 };
    }
    if (kind.startsWith('enemy:')) {
      room.npcs.push({ enemy: kind.slice(6), x, y, patrol: [clamp(x - 2, 1, width() - 2), clamp(x + 2, 1, width() - 2)] });
      return { type: 'npc', index: room.npcs.length - 1 };
    }
    const prop = { sprite: TYPE_INFO[kind].sprite, x, y };
    if (kind === 'sign') {
      prop.text = freeSectionName(textSource, `${room.id}_sign`, Object.keys(signs));
      signs[prop.text] = '';
    } else if (kind === 'save') prop.save = true;
    else if (kind === 'npc') prop.npc = npcs[0] ?? 'old_keeper';
    else if (kind === 'shop') prop.shop = shops[0] ?? 'ruins_shop';
    room.props.push(prop);
    return { type: 'prop', index: room.props.length - 1 };
  }

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (!room) return;
    const { x, y, px, py } = cellOf(e);
    if (tileAt(x, y) === null) return;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    if (mode === 'paint') {
      if (e.button === 2) { tileChar = room.tiles[y][x]; renderLeft(); return; }
      beginEdit();
      if (paintTool === 'fill') {
        floodFill(x, y);
        changed();
        renderBackground();
        refreshObjects();
      } else if (paintTool === 'box') {
        drag = { kind: 'box', from: { x, y }, to: { x, y } };
        draw();
      } else {
        drag = { kind: 'brush', last: { x, y } };
        if (paintTile(x, y)) { renderBackground(); draw(); }
      }
      return;
    }
    // Place mode
    if (e.button === 2) { armed = null; renderLeft(); draw(); return; }
    if (armed) {
      beginEdit();
      if (armed === 'door') {
        drag = { kind: 'door', from: { x, y }, to: { x, y } };
        draw();
        return;
      }
      selected = place(armed, x, y);
      armed = null;
      changed();
      renderLeft();
      refreshObjects();
      focusWords();
      return;
    }
    const handle = patrolHandles().find((h) => Math.abs(h.x - px) <= 8 && Math.abs(h.y - py) <= 10);
    if (handle) {
      beginEdit();
      drag = { kind: 'patrol', i: handle.i };
      return;
    }
    selected = objectAt(px / zoom, py / zoom);
    if (selected) {
      beginEdit();
      const pos = positionOf(selected);
      drag = { kind: 'move', offset: { x: x - pos.x, y: y - pos.y }, moved: false };
    }
    refreshObjects();
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!room) return;
    const { x, y } = cellOf(e);
    hover = { x, y };
    renderStatus();
    if (!drag) { draw(); return; }
    const cx = clamp(x, 0, width() - 1);
    const cy = clamp(y, 0, height() - 1);
    if (drag.kind === 'brush') {
      let any = false;
      for (const c of lineCells(drag.last, { x, y })) any = paintTile(c.x, c.y) || any;
      drag.last = { x, y };
      if (any) renderBackground();
      draw();
    } else if (drag.kind === 'box' || drag.kind === 'door') {
      drag.to = { x: cx, y: cy };
      draw();
    } else if (drag.kind === 'patrol') {
      const npc = room.npcs[selected.index];
      npc.patrol[drag.i] = cx;
      draw();
    } else if (drag.kind === 'move' && selected) {
      const pos = positionOf(selected);
      const nx = clamp(x - drag.offset.x, 0, width() - 1);
      const ny = clamp(y - drag.offset.y, 0, height() - 1);
      if (nx !== pos.x || ny !== pos.y) {
        if (selected.type === 'npc') pos.patrol = pos.patrol.map((p) => clamp(p + nx - pos.x, 0, width() - 1));
        pos.x = nx;
        pos.y = ny;
        drag.moved = true;
        draw();
      }
    }
  });

  canvas.addEventListener('pointerup', () => {
    if (!drag) return;
    const finished = drag;
    drag = null;
    if (finished.kind === 'box') {
      const r = dragRect(finished);
      for (let ty = r.y; ty < r.y + r.h; ty++) for (let tx = r.x; tx < r.x + r.w; tx++) room.tiles[ty][tx] = tileChar;
      changed();
      renderBackground();
    } else if (finished.kind === 'door') {
      const r = dragRect(finished);
      selected = place('door', r.x, r.y);
      Object.assign(room.doors[selected.index], { w: r.w, h: r.h });
      armed = null;
      changed();
      renderLeft();
    } else if (finished.kind === 'brush') {
      changed();
    } else if (finished.kind === 'patrol') {
      const npc = room.npcs[selected.index];
      npc.patrol.sort((a, b) => a - b);
      changed();
    } else if (finished.kind === 'move') {
      if (finished.moved) changed();
      else lastSnapshot = null;
    }
    refreshObjects();
  });
  canvas.addEventListener('pointerleave', () => { hover = null; if (!drag) draw(); renderStatus(); });
  stage.addEventListener('wheel', (e) => {
    if (!room) return;
    e.preventDefault();
    const before = canvas.getBoundingClientRect();
    const fx = (e.clientX - before.left) / before.width;
    const fy = (e.clientY - before.top) / before.height;
    const old = zoom;
    zoomStep(e.deltaY < 0 ? 1 : -1);
    if (zoom === old) return;
    const after = canvas.getBoundingClientRect();
    stage.scrollLeft += after.left + fx * after.width - e.clientX;
    stage.scrollTop += after.top + fy * after.height - e.clientY;
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!studio.isActive() || !room || isTyping(e) || document.querySelector('.overlay')) return;
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
    if ((e.ctrlKey || e.metaKey) && (key === 'y' || (key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Delete' || e.key === 'Backspace') { if (selected) { e.preventDefault(); deleteSelected(); } return; }
    if (e.key === 'Escape') { armed = null; selected = null; renderLeft(); refreshObjects(); return; }
    if (key === '1') setMode('paint');
    else if (key === '2') setMode('place');
    else if (key === 'g') gridButton.click();
    else if (key === '+' || key === '=') zoomStep(1);
    else if (key === '-') zoomStep(-1);
    else if (key === '0') fit();
    else if (mode === 'paint' && { b: 1, x: 1, f: 1 }[key]) { paintTool = { b: 'brush', x: 'box', f: 'fill' }[key]; renderLeft(); }
  });

  function deleteSelected() {
    if (!selected || selected.type === 'start') return;
    edit(() => {
      const list = { door: room.doors, prop: room.props, npc: room.npcs }[selected.type];
      const [removed] = list.splice(selected.index, 1);
      if (removed?.text && !room.props.some((p) => p.text === removed.text) && !(removed.text in originalSigns)) delete signs[removed.text];
      selected = null;
    });
  }

  function renderStatus() {
    if (!room) return;
    const parts = [`${width()} x ${height()} tiles`];
    if (hover && tileAt(hover.x, hover.y) !== null) parts.unshift(`tile ${hover.x}, ${hover.y}: ${tileName(tileAt(hover.x, hover.y))}`);
    const tip = mode === 'paint'
      ? 'Drag to paint · right-click picks a tile · scroll to zoom'
      : armed ? 'Click the map to place it · Esc to cancel' : 'Click to select · drag to move · Delete removes';
    setChildren(status, el('span', {}, parts.join('   ·   ')), el('span', { class: 'spacer' }), el('span', { class: 'hint', style: 'margin:0' }, tip));
  }

  // --- Inspector ---
  const describe = (sel) => {
    if (sel.type === 'start') return TYPE_INFO.start;
    if (sel.type === 'door') return TYPE_INFO.door;
    if (sel.type === 'npc') return { label: enemyName(room.npcs[sel.index].enemy), icon: 'enemy' };
    return TYPE_INFO[propType(room.props[sel.index])];
  };

  function focusWords() {
    const area = inspector.querySelector('textarea');
    if (area) area.focus();
  }

  function renderInspector() {
    if (!selected || !boundsOf(selected)) {
      selected = null;
      renderRoomSettings();
      return;
    }
    const info = describe(selected);
    const body = [];
    const coords = (p) => el('p', { class: 'hint' }, `On tile ${p.x}, ${p.y}. Drag it on the map to move it.`);
    if (selected.type === 'start') {
      body.push(hint('Where the player appears when a new game starts here.'), coords(room.playerStart));
    } else if (selected.type === 'door') {
      const door = room.doors[selected.index];
      body.push(
        field('Leads to', select(Object.keys(rooms).map((id) => [id, roomLabel(id)]), door.to, (v) => edit(() => {
          door.to = v;
          door.spawn = { ...(rooms[v]?.playerStart ?? door.spawn) };
        }))),
        el('div', { class: 'field' },
          el('span', { class: 'field-label' }, 'You arrive at'),
          el('div', { class: 'row' }, el('span', { class: 'grow' }, `tile ${door.spawn.x}, ${door.spawn.y}`),
            btn('flag', 'Pick on the map', async () => {
              const target = door.to === room.id ? room : rooms[door.to];
              if (!target) { toast('That room does not exist yet.', { kind: 'error' }); return; }
              const spot = await pickTile(target, { title: `Where do you arrive in ${roomLabel(door.to)}?`, text: 'Click the tile the player should appear on (not on the door back, or they will bounce).', current: door.spawn, enemySprites });
              if (spot) edit(() => { door.spawn = spot; });
            }, { kind: 'ghost' }))),
        slider({ label: 'Width', min: 1, max: 8, value: door.w, format: (v) => `${v} tiles`, onChange: (v) => edit(() => { door.w = v; }) }),
        slider({ label: 'Height', min: 1, max: 8, value: door.h, format: (v) => `${v} tiles`, onChange: (v) => edit(() => { door.h = v; }) }),
        hint('Paint Doorway tiles under it so it looks like a way out.'));
    } else if (selected.type === 'npc') {
      const npc = room.npcs[selected.index];
      body.push(
        field('Which enemy', select(Object.keys(enemies).map((id) => [id, enemyName(id)]), npc.enemy, (v) => edit(() => { npc.enemy = v; delete npc.art; }, { all: true }))),
        slider({ label: 'Walks from', min: 0, max: width() - 1, value: npc.patrol[0], format: (v) => `tile ${v}`, onChange: (v) => edit(() => { npc.patrol = [Math.min(v, npc.patrol[1]), Math.max(v, npc.patrol[1])]; }) }),
        slider({ label: 'Walks to', min: 0, max: width() - 1, value: npc.patrol[1], format: (v) => `tile ${v}`, onChange: (v) => edit(() => { npc.patrol = [Math.min(v, npc.patrol[0]), Math.max(v, npc.patrol[0])]; }) }),
        hint('Or drag the yellow handles on the map. Touching it starts a battle; enemies close together fight as a group.'),
        coords(npc));
    } else {
      const prop = room.props[selected.index];
      const type = propType(prop);
      const spritePick = field('Looks like', select(Object.keys(propSprites).map((n) => [n, friendly(n)]), prop.sprite, (v) => edit(() => { prop.sprite = v; })));
      if (type === 'sign') {
        const words = el('textarea', {
          rows: 7,
          value: signs[prop.text] ?? '',
          placeholder: 'What does it say? Leave an empty line to start a new page.',
          onfocus: () => beginEdit(),
          oninput: (e) => { signs[prop.text] = e.target.value; studio.setDirty(true); renderChecks(); },
          onchange: () => changed(),
        });
        const nameInput = el('input', {
          type: 'text', value: prop.text,
          onchange: (e) => {
            const name = snakeCase(e.target.value);
            if (!name || name === prop.text) { e.target.value = prop.text; return; }
            edit(() => {
              signs[name] = signs[prop.text] ?? '';
              if (!room.props.some((p) => p !== prop && p.text === prop.text) && !(prop.text in originalSigns)) delete signs[prop.text];
              prop.text = name;
              if (!(name in signs) || signs[name] === '') signs[name] = sectionText(textSource, name) || signs[name];
            });
          },
        });
        body.push(field('What it says', words, 'Each line is a new "*" line; an empty line starts a new page.'),
          el('div', { class: 'adv' }, field('Text section', nameInput, `The [${prop.text}] section of text/${room.textFile}.`)));
      } else if (type === 'save') {
        body.push(hint('Players press Z here to save. It shows the [save_point] words from this area\'s text file.'));
      } else if (type === 'npc') {
        body.push(field('Who is it', select(npcs.map((n) => [n, friendly(n)]), prop.npc, (v) => edit(() => { prop.npc = v; }))), spritePick,
          hint(`What they say is in text/npcs/${prop.npc}.txt.`));
      } else if (type === 'shop') {
        body.push(field('Which shop', select(shops.map((s) => [s, friendly(s)]), prop.shop, (v) => edit(() => { prop.shop = v; }))), spritePick);
      } else {
        body.push(spritePick, hint('Just for looks: nothing happens when you press Z on it.'));
      }
      if (type !== 'decor' && type !== 'npc' && type !== 'shop') body.push(el('div', { class: 'adv' }, spritePick));
      body.push(coords(prop));
    }
    setChildren(inspector,
      el('div', { class: 'inspector-head' }, icon(info.icon ?? 'star', 22), el('h2', {}, info.label),
        selected.type === 'start' ? null : btn('trash', 'Remove', deleteSelected, { iconOnly: true, kind: 'ghost danger', key: 'Delete' }),
        btn('close', 'Done', () => { selected = null; refreshObjects(); }, { iconOnly: true, kind: 'ghost', key: 'Esc' })),
      body);
  }

  function renderRoomSettings() {
    const sizeTarget = { w: width(), h: height() };
    setChildren(inspector,
      el('div', { class: 'inspector-head' }, icon('room', 22), el('h2', {}, 'This room')),
      field('Name', el('input', { type: 'text', value: room.name ?? '', onchange: (e) => edit(() => { room.name = e.target.value.trim().toUpperCase(); }, { all: true }) }), 'Shown on a title card when you walk in.'),
      field('Music', select([['', 'No music'], ...songs.map((s) => [s, friendly(s)])], room.music ?? '', (v) => edit(() => { room.music = v || null; }))),
      field('Battle background', select(areas.map((a) => [a, friendly(a)]), room.area, (v) => edit(() => { room.area = v; }))),
      el('div', { class: 'field' },
        el('span', { class: 'field-label' }, 'Size in tiles'),
        el('div', { class: 'row' },
          el('input', { type: 'number', value: sizeTarget.w, min: 3, max: 120, onchange: (e) => { sizeTarget.w = Number(e.target.value); } }), 'x',
          el('input', { type: 'number', value: sizeTarget.h, min: 3, max: 120, onchange: (e) => { sizeTarget.h = Number(e.target.value); } }),
          btn('resize', 'Resize', () => resize(sizeTarget.w, sizeTarget.h), { kind: 'ghost' })),
        hint('Grows or shrinks at the right and bottom edges.')),
      hint(mode === 'paint' ? 'Switch to Place to add signs, doors and enemies.' : 'Click something on the map to change it.'));
  }

  function resize(w, h) {
    w = clamp(Math.round(w) || width(), 3, 120);
    h = clamp(Math.round(h) || height(), 3, 120);
    edit(() => {
      const old = room.tiles;
      room.tiles = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => old[y]?.[x] ?? (y === h - 1 || x === w - 1 ? '#' : '.')));
    }, { all: true });
    fit();
  }

  function renderAdvanced() {
    setChildren(advanced, section('Advanced',
      field('Room id', el('input', {
        type: 'text', value: room.id,
        onchange: (e) => {
          const id = snakeCase(e.target.value);
          if (!id || (id !== room.id && rooms[id])) { e.target.value = room.id; toast('That id is empty or taken.', { kind: 'error' }); return; }
          edit(() => { room.id = id; }, { all: true });
        },
      }), 'Doors and saves find the room by this. Other rooms\' doors still use the old id.'),
      field('Text file', el('input', { type: 'text', value: room.textFile, onchange: (e) => edit(() => { room.textFile = e.target.value.trim(); }) }), 'Where the signs\' words live, under text/.'),
      hint(`Saves to src/data/rooms/${meta.file} as ${meta.constName}.`),
      codeView(roomModule(room, meta.constName, meta.header))));
  }

  // --- Checks, in plain words ---
  function problems() {
    const list = [];
    const solid = (r, x, y) => {
      const t = r.tiles[y]?.[x];
      return t === undefined || Boolean(TILES[t]?.solid);
    };
    const unknown = [...new Set(room.tiles.flat().filter((c) => !TILES[c]))];
    if (unknown.length) list.push({ text: `Some tiles aren't real tiles (pink): ${unknown.join(' ')}. Paint over them.`, fatal: true });
    const start = room.playerStart;
    if (tileAt(start.x, start.y) === null) list.push({ text: 'The player start is outside the room.', sel: { type: 'start', index: 0 }, fatal: true });
    else if (solid(room, start.x, start.y)) list.push({ text: 'The player start is inside a wall.', sel: { type: 'start', index: 0 } });
    room.doors.forEach((d, i) => {
      const target = d.to === room.id ? room : rooms[d.to];
      if (!target) list.push({ text: `A door leads to "${d.to}", but there's no room called that.`, sel: { type: 'door', index: i } });
      else if (solid(target, d.spawn.x, d.spawn.y)) list.push({ text: `A door drops the player inside a wall in ${roomLabel(d.to)}. Pick another arrival spot.`, sel: { type: 'door', index: i } });
    });
    room.props.forEach((p, i) => {
      if (!propSprites[p.sprite]) list.push({ text: `Something uses a picture called "${p.sprite}" that doesn't exist.`, sel: { type: 'prop', index: i }, fatal: true });
      if (p.text && !(signs[p.text] ?? '').trim()) list.push({ text: 'A sign has no words yet.', sel: { type: 'prop', index: i } });
      if (p.shop && !SHOPS[p.shop]) list.push({ text: `A shop uses "${p.shop}", which isn't in the shop list.`, sel: { type: 'prop', index: i } });
      if (p.npc && !npcs.includes(p.npc)) list.push({ text: `An NPC uses "${p.npc}", but there's no text/npcs/${p.npc}.txt.`, sel: { type: 'prop', index: i } });
    });
    room.npcs.forEach((n, i) => {
      if (!enemies[n.enemy]) list.push({ text: `An enemy is "${n.enemy}", which isn't one of the game's enemies.`, sel: { type: 'npc', index: i }, fatal: true });
      const [a, b] = n.patrol;
      for (let x = Math.min(a, b); x <= Math.max(a, b); x++) {
        if (solid(room, x, n.y)) { list.push({ text: `${enemyName(n.enemy)} walks through a wall. Shorten its walk.`, sel: { type: 'npc', index: i } }); break; }
      }
    });
    const edge = [];
    for (let x = 0; x < width(); x++) edge.push([x, 0], [x, height() - 1]);
    for (let y = 0; y < height(); y++) edge.push([0, y], [width() - 1, y]);
    if (edge.some(([x, y]) => !solid(room, x, y) && !room.doors.some((d) => x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h))) {
      list.push({ text: 'The edge of the room has a gap: the player could walk off the map. Close it with walls or put a door there.' });
    }
    return list;
  }

  function renderChecks() {
    const list = problems();
    setChildren(checks, list.length
      ? el('div', { class: 'problems' }, list.map((p) => el('div', {
        class: `problem${p.sel ? ' clickable' : ''}`,
        onclick: p.sel ? () => { setMode('place'); selected = p.sel; refreshObjects(); } : null,
      }, icon('warn', 14), el('span', {}, p.text))))
      : el('div', { class: 'all-good' }, icon('check', 16), 'Everything looks good.'));
  }

  // --- Refreshing ---
  function refreshObjects() {
    draw();
    renderInspector();
    renderChecks();
    renderStatus();
    if (studio.advanced) renderAdvanced();
  }
  function refreshAll() {
    if (!room) return;
    studio.setFile(`src/data/rooms/${meta.file}${meta.isNew ? ' (new)' : ''}`);
    renderBackground();
    renderLeft();
    renderRoomSelect();
    renderAdvanced();
    refreshObjects();
  }
  window.addEventListener('studio:advanced', () => { if (room) { renderAdvanced(); renderInspector(); } });

  // --- Saving ---
  async function getFiles() {
    if (!room) throw new Error('Open or make a room first.');
    const fatal = problems().filter((p) => p.fatal);
    if (fatal.length) throw new Error(`Fix this first: ${fatal[0].text}`);
    const out = [];
    const path = `src/data/rooms/${meta.file}`;
    if (meta.isNew) {
      const existing = (await listDir('src/data/rooms')) ?? [];
      if (existing.includes(meta.file)) throw new Error(`There's already a file called ${meta.file}. Rename the room (Advanced) and try again.`);
    }
    out.push({ path, content: roomModule(room, meta.constName, meta.header) });
    const changedSigns = Object.entries(signs).filter(([name, words]) => room.props.some((p) => p.text === name) && words.trim() !== (originalSigns[name] ?? '').trim());
    if (changedSigns.length) {
      let text = await readText(`text/${room.textFile}`);
      if (!text) text = `# ${room.name || room.id}: signs and other things you can inspect.\n# Each entry (separated by a blank line) is one page of the textbox.\n`;
      for (const [name, words] of changedSigns) text = setSection(text, name, words.trim() || '...');
      out.push({ path: `text/${room.textFile}`, content: text });
    }
    return out;
  }

  async function afterSave() {
    const id = room.id;
    meta.isNew = false;
    originalSigns = { ...signs };
    textSource = await readText(`text/${room.textFile}`);
    rooms = await loadRooms(true);
    files = await roomFiles();
    studio.setDirty(false);
    if (!rooms[id]) toast('Saved, but the game did not list the room yet: refresh the Studio.', { kind: 'info' });
    refreshAll();
  }

  // --- Start ---
  const startId = Object.keys(rooms).includes('ruins_entrance') ? 'ruins_entrance' : Object.keys(rooms)[0];
  if (startId) await openRoom(startId);
  setMode('paint');

  return { getFiles, afterSave, onShow: () => requestAnimationFrame(fit) };
}
