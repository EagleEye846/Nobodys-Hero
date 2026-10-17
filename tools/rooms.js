// Room helpers shared by the Room Editor and the Enemy Maker: friendly tile
// names, drawing a room with the game's own tiles, writing a room module, and
// a "click a tile" picker.
import { TILE_SIZE as T } from '../src/config.js';
import { makeSprite } from '../src/engine/sprite.js';
import { TILES, floorUnder } from '../src/overworld/tileset.js';
import { PROP_PALETTE, PROP_SPRITES, PROP_FOOTPRINTS } from '../src/data/art/props.js';
import { PLAYER_PALETTE, PLAYER_SPRITES } from '../src/data/art/player.js';
import { quote, inline, comment, headerComment } from './source.js';
import { el, modal, pixelCanvas, hint, deepClone } from './ui.js';

export { T, TILES, PROP_SPRITES };

// Friendly names for the tile characters. Unknown ones get a generic name.
export const TILE_INFO = {
  '.': { name: 'Floor', note: 'floor' },
  r: { name: 'Rug', note: 'rug' },
  W: { name: 'Wall', note: 'wall face' },
  '#': { name: 'Wall top', note: 'wall top' },
  P: { name: 'Lantern pillar', note: 'pillar with a lantern' },
  p: { name: 'Plant', note: 'potted plant' },
  D: { name: 'Doorway', note: 'doorway (walk through it; see `doors`)' },
  V: { name: 'Ivy wall', note: 'wall face with ivy' },
  H: { name: 'Banner wall', note: 'wall face with a faded banner' },
  c: { name: 'Cracked floor', note: 'cracked floor (safe)' },
  R: { name: 'Rubble', note: 'fallen stones' },
  F: { name: 'Flower bed', note: 'flower bed' },
  o: { name: 'Wood floor', note: 'wooden floorboards' },
  h: { name: 'Home wall', note: 'papered wall with wood panelling' },
  U: { name: 'Stairs up', note: 'stairs up (walk through it; see `doors`)' },
  u: { name: 'Stairs down', note: 'stairs down (walk through it; see `doors`)' },
  '~': { name: 'Water', note: 'water' },
  I: { name: 'Tall pillar', note: 'tall pillar (walk or hide behind)' },
  J: { name: 'Broken pillar', note: 'broken pillar (walk or hide behind)' },
  S: { name: 'Hero statue', note: 'statue (walk or hide behind)' },
  C: { name: 'Candelabra', note: 'candle stand (walk or hide behind)' },
  b: { name: 'Low block', note: 'low stone block (jump up onto it)' },
  B: { name: 'Tall block', note: 'tall stone block (jump onto it from a low block)' },
};
export const tileName = (char) => TILE_INFO[char]?.name ?? `Tile "${char}"`;

export const propSprites = Object.fromEntries(Object.entries(PROP_SPRITES).map(([name, rows]) => [name, makeSprite(rows, PROP_PALETTE)]));
export const playerSprite = makeSprite(PLAYER_SPRITES.downIdle, PLAYER_PALETTE);

// Draws one tile as the game does.
export function drawTile(ctx, char, x, y, tx, ty, tileAt) {
  const tile = TILES[char];
  if (!tile) {
    ctx.fillStyle = '#ff3d9a';
    ctx.fillRect(x, y, T, T);
    return;
  }
  // Standing tiles (tall pillars, statues) paint only themselves, over floor.
  if (tile.standing) TILES[floorUnder({ tileAt }, tx, ty)].draw(ctx, x, y, tx, ty, { tileAt });
  tile.draw(ctx, x, y, tx, ty, { tileAt });
}

// A tile on its own, for swatches. Tall standing tiles are shrunk to fit.
export function tileSwatch(char, size = T) {
  const canvas = pixelCanvas(T, T, { class: 'tile-swatch', style: `width:${size}px;height:${size}px` });
  const ctx = canvas.getContext('2d');
  const height = TILES[char]?.height ?? T;
  if (height > T) {
    const scale = T / height;
    ctx.translate((T - T * scale) / 2, T - T * scale);
    ctx.scale(scale, scale);
  }
  drawTile(ctx, char, 0, 0, 0, 0, (tx, ty) => (tx === 0 && ty === 0 ? char : char === 'W' ? '#' : null));
  return canvas;
}

const rowsOf = (room) => room.tiles.map((row) => (typeof row === 'string' ? [...row] : row));

// The room's tiles painted at world scale (1 pixel per world pixel).
export function renderTiles(room) {
  const tiles = rowsOf(room);
  const h = tiles.length;
  const w = tiles[0]?.length ?? 0;
  const canvas = pixelCanvas(w * T, h * T);
  const ctx = canvas.getContext('2d');
  const tileAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= w || ty >= h ? null : tiles[ty][tx]);
  for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++) drawTile(ctx, tiles[ty][tx], tx * T, ty * T, tx, ty, tileAt);
  return canvas;
}

// Pixel bounds (world units) of a prop: it stands on its tile's bottom edge,
// centred over its footprint (big furniture covers tiles to the right too).
export function propBounds(prop) {
  const sprite = propSprites[prop.sprite];
  const w = sprite?.width ?? T;
  const h = sprite?.height ?? T;
  const footprint = (PROP_FOOTPRINTS[prop.sprite] ?? 1) * T;
  return { x: prop.x * T + Math.floor((footprint - w) / 2), y: prop.y * T + T - h, w, h, sprite };
}

// Like Npc in the game, (x, y) is the tile under the feet.
export function npcBounds(npc, sprite) {
  const w = sprite?.width ?? T;
  const h = sprite?.height ?? T;
  const footX = (npc.x + 0.5) * T;
  const footY = (npc.y + 1) * T;
  return { x: footX - Math.floor(w / 2), y: footY - h - 2, w, h, sprite, footX, footY };
}

export function startBounds(start) {
  return { x: start.x * T + T / 2 - Math.floor(playerSprite.width / 2), y: (start.y + 1) * T - playerSprite.height, w: playerSprite.width, h: playerSprite.height };
}

// Draws props, enemies and the player start over a tile canvas (world scale).
// enemySprites: { enemyId: canvas }.
export function drawThings(ctx, room, enemySprites) {
  const things = [
    ...(room.props ?? []).map((prop) => ({ b: propBounds(prop) })),
    ...(room.npcs ?? []).map((npc) => ({ npc: true, b: npcBounds(npc, enemySprites[npc.art] ?? enemySprites[npc.enemy]) })),
    { start: true, b: startBounds(room.playerStart ?? { x: 1, y: 1 }) },
  ].sort((a, b) => (a.b.y + a.b.h) - (b.b.y + b.b.h));
  for (const { b, npc, start } of things) {
    if (npc) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(b.footX - 5, b.footY - 3, 10, 3);
    }
    if (start) {
      ctx.globalAlpha = 0.9;
      ctx.drawImage(playerSprite, b.x, b.y);
      ctx.globalAlpha = 1;
    } else if (b.sprite) {
      ctx.drawImage(b.sprite, b.x, b.y);
    } else {
      ctx.fillStyle = '#ff3d9a';
      ctx.fillRect(b.x + 3, b.y + 3, b.w - 6, b.h - 6);
    }
  }
}

// An editing copy of a game room: tiles become arrays of characters.
export function editableRoom(room) {
  const copy = deepClone(room);
  copy.tiles = room.tiles.map((row) => [...row]);
  copy.doors ??= [];
  copy.cutscenes ??= [];
  copy.looks ??= [];
  copy.tileTexts ??= {};
  copy.props ??= [];
  copy.npcs ??= [];
  copy.playerStart ??= { x: 1, y: 1 };
  copy.textFile ??= 'interactions/the_ruins.txt';
  copy.area ??= 'ruins';
  return copy;
}

// --- Writing a room module ---

// A room file's top comment without its tile key (a save writes a fresh one).
export function roomHeader(source) {
  const lines = headerComment(source ?? '').split('\n');
  const cut = lines.findIndex((l) => /^\/\/\s*Tile key/.test(l));
  return (cut < 0 ? lines : lines.slice(0, cut)).join('\n');
}

function tileKey(room) {
  const used = [...new Set(room.tiles.join(''))].filter((c) => TILES[c]);
  const order = Object.keys(TILES);
  used.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const entries = used.map((c) => `${c}  ${TILE_INFO[c]?.note ?? '(see tileset.js)'}${TILES[c].solid ? ' (solid)' : ''}`);
  const lines = ['// Tile key (see src/overworld/tileset.js):'];
  const column = Math.max(0, ...entries.filter((_, i) => i % 2 === 0 && entries[i + 1]).map((e) => e.length)) + 3;
  for (let i = 0; i < entries.length; i += 2) {
    lines.push(`//   ${entries[i + 1] ? entries[i].padEnd(column) + entries[i + 1] : entries[i]}`.trimEnd());
  }
  return lines.join('\n');
}

function list(name, items, format) {
  if (!items.length) return `  ${name}: [],`;
  return `  ${name}: [\n${items.map((item) => `    ${format(item)},`).join('\n')}\n  ],`;
}

const propLiteral = (prop) => {
  const out = { sprite: prop.sprite, x: prop.x, y: prop.y };
  if (prop.text) out.text = prop.text;
  if (prop.npc) out.npc = prop.npc;
  if (prop.shop) out.shop = prop.shop;
  if (prop.save) out.save = true;
  if (prop.animation) out.animation = prop.animation;
  if (prop.animation && prop.speed) out.speed = prop.speed;
  if (prop.lever) out.lever = prop.lever;
  if (prop.opensWith?.length) out.opensWith = prop.opensWith;
  if (prop.opensWith?.length && prop.inOrder) out.inOrder = true;
  if (prop.opensWith?.length && prop.openText) out.openText = prop.openText;
  if (prop.opensWith?.length && prop.resetText) out.resetText = prop.resetText;
  if (prop.gives) out.gives = prop.gives;
  if (prop.gives && prop.taken) out.taken = prop.taken;
  if (prop.until) out.until = prop.until;
  if (prop.after) out.after = prop.after;
  if (prop.walkable) out.walkable = true;
  if (prop.light) out.light = prop.light;
  if (prop.seenInLight) out.seenInLight = true;
  return inline(out);
};
const doorLiteral = ({ x, y, w, h, to, spawn }) => inline({ x, y, w, h, to, spawn: { x: spawn.x, y: spawn.y } });
const cutsceneLiteral = ({ x, y, w, h, scene }) => inline({ x, y, w, h, scene });
const npcLiteral = ({ art, enemy, x, y, patrol, behaviour, ambush, reach }) => {
  const how = behaviour ?? (ambush ? 'ambush' : 'patrol');
  return inline({ art, enemy, x, y, patrol: [patrol[0], patrol[1]], behaviour: how === 'patrol' ? undefined : how, reach });
};

// room: tiles as strings or arrays. header: the file's comment block to keep.
export function roomModule(room, constName, header) {
  const tiles = room.tiles.map((row) => (typeof row === 'string' ? row : row.join('')));
  const data = { ...room, tiles };
  const top = header?.trim() ? header.trim() : comment(`${room.name || room.id}: made in Ruins Studio (tools/).`);
  const lines = [
    top,
    tileKey(data),
    `export const ${constName} = {`,
    '  // Used to remember things about this room (like beaten enemies) and for doors.',
    `  id: ${quote(room.id)},`,
    '  // The room\'s name, for the Room Editor.',
    `  name: ${quote(room.name ?? '')},`,
    '  // The region it\'s in (see src/data/areas.js): names the title card you see',
    '  // on arriving from another region, and picks the battle background.',
    `  area: ${quote(room.area ?? 'ruins')},`,
    '  // The song that plays here (a file in src/data/music/).',
    `  music: ${room.music ? quote(room.music) : 'null'},`,
    ...(room.dark ? ['  // Dark: you only see what light reaches (your candle, lanterns). 0 to 1, how dark.', `  dark: ${room.dark},`] : []),
    '',
    '  tiles: [',
    tiles.map((row) => `    ${quote(row)},`).join('\n'),
    '  ],',
    '',
    '  // Where the player starts, in tile coordinates.',
    `  playerStart: ${inline({ x: room.playerStart.x, y: room.playerStart.y })},`,
    '',
    '  // Walking onto a door\'s tiles takes you to another room; `spawn` is where you arrive.',
    list('doors', room.doors ?? [], doorLiteral),
    '',
    '  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).',
    list('cutscenes', room.cutscenes ?? [], cutsceneLiteral),
    '',
    '  // Things you can press Z on. `text` names a section of this room\'s text file;',
    '  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.',
    `  textFile: ${quote(room.textFile)},`,
    list('props', room.props ?? [], propLiteral),
    '',
    '  // Words for tiles, shown when you press Z on them: `looks` for one spot,',
    '  // `tileTexts` for every tile of a kind (by its letter). Both name sections',
    '  // of the text file, like signs.',
    list('looks', room.looks ?? [], ({ x, y, text }) => inline({ x, y, text })),
    `  tileTexts: ${inline(room.tileTexts ?? {})},`,
    '',
    '  // Enemies wandering the room, by their file name in src/data/enemies/.',
    '  // patrol is the leftmost and rightmost tile they walk between. `behaviour`',
    '  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go',
    '  // just above a tall pillar or statue, and `reach` is how many tiles away they',
    '  // leap from.',
    list('npcs', room.npcs ?? [], npcLiteral),
    '};',
  ];
  return `${lines.join('\n')}\n`;
}

// --- A modal that shows a room and lets you click a tile. Resolves {x, y} or null. ---
export async function pickTile(room, { title = 'Pick a spot', text = 'Click a floor tile.', current = null, enemySprites = {} } = {}) {
  const tiles = renderTiles(room);
  const w = tiles.width / T;
  const h = tiles.height / T;
  const scale = Math.max(1, Math.min(3, Math.floor(Math.min(760 / tiles.width, 460 / tiles.height))));
  const canvas = pixelCanvas(tiles.width * scale, tiles.height * scale, { class: 'pick-canvas' });
  let chosen = current ? { ...current } : null;
  let hover = null;
  const rows = rowsOf(room);
  const solid = (x, y) => TILES[rows[y]?.[x]]?.solid ?? true;
  const status = el('p', { class: 'hint' });
  const draw = () => {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.drawImage(tiles, 0, 0);
    drawThings(ctx, room, enemySprites);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const s = T * scale;
    if (hover) {
      ctx.strokeStyle = solid(hover.x, hover.y) ? '#ff5470' : '#ffe14d';
      ctx.lineWidth = 2;
      ctx.strokeRect(hover.x * s + 1, hover.y * s + 1, s - 2, s - 2);
    }
    if (chosen) {
      ctx.strokeStyle = '#4fe3d0';
      ctx.lineWidth = 3;
      ctx.strokeRect(chosen.x * s + 1.5, chosen.y * s + 1.5, s - 3, s - 3);
    }
    status.textContent = chosen ? `Chosen: tile ${chosen.x}, ${chosen.y}${solid(chosen.x, chosen.y) ? ' (that tile blocks walking!)' : ''}` : text;
  };
  const cell = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * w);
    const y = Math.floor(((e.clientY - r.top) / r.height) * h);
    return x >= 0 && y >= 0 && x < w && y < h ? { x, y } : null;
  };
  canvas.addEventListener('pointermove', (e) => { hover = cell(e); draw(); });
  canvas.addEventListener('pointerdown', (e) => { chosen = cell(e) ?? chosen; draw(); });
  draw();
  return modal({
    title,
    wide: true,
    body: el('div', {}, hint(text), el('div', { class: 'pick-stage' }, canvas), status),
    actions: [{ label: 'Cancel', value: null }, { label: 'Use this spot', kind: 'primary', value: () => chosen, validate: () => (chosen ? null : 'Click a tile first.') }],
  });
}
