// Everything the Studio reads from the game, found automatically: art files,
// enemies, rooms, songs and attack patterns. Nothing here needs updating when
// the game gets new content; the server's generated registries list it.
import { makeSprite } from '../src/engine/sprite.js';
import { listDir, readText, importFresh } from './api.js';
import { paletteNotes, valueText } from './source.js';
import { friendly } from './ui.js';

// Used when the Studio runs without its server (no folder listing).
const KNOWN_ART_FILES = ['player.js', 'props.js', 'portraits.js', 'icons.js', 'dummy.js', 'moth.js', 'bunny.js', 'waxling.js', 'shade.js', 'columneon.js'];

const isRows = (v) => Array.isArray(v) && v.length > 0 && v.every((r) => typeof r === 'string');
const isFrameSet = (v) => v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).length > 0 && Object.values(v).every(isRows);
const isPalette = (v) => v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).every((c) => typeof c === 'string' && c.startsWith('#'));

// The palette export for a sprite export: BUNNY_SPRITE -> BUNNY_PALETTE,
// PLAYER_RUN_SPRITES -> PLAYER_RUN_PALETTE, else PLAYER_PALETTE.
function paletteFor(module, base) {
  const parts = base.split('_');
  while (parts.length) {
    const name = `${parts.join('_')}_PALETTE`;
    if (isPalette(module[name])) return name;
    parts.pop();
  }
  return null;
}

// Every sprite in src/data/art/, as library entries:
//   { id, file, kind: 'single' | 'frames' | 'portrait' | 'icons', label, group,
//     paletteExport, spriteExport | spritesExport | portraitId, palette, frames: [{ name, rows }] }
// Palette entries carry the comment notes from the file ({ char: note }).
let artCache = null;
export function loadArt(fresh = false) {
  if (artCache && !fresh) return artCache;
  artCache = (async () => {
    const files = ((await listDir('src/data/art')) ?? KNOWN_ART_FILES).filter((f) => f.endsWith('.js'));
    const entries = [];
    await Promise.all(files.map(async (file) => {
      let module;
      let source;
      try {
        [module, source] = await Promise.all([importFresh(`src/data/art/${file}`), readText(`src/data/art/${file}`)]);
      } catch (error) {
        console.warn(`Studio: couldn't load src/data/art/${file}`, error);
        return;
      }
      const notesOf = (name) => paletteNotes(valueText(source, name));
      const frameSets = Object.entries(module).filter(([name, v]) => name.endsWith('_SPRITES') && isFrameSet(v));
      for (const [name, value] of Object.entries(module)) {
        if (name === 'PORTRAITS' && value && typeof value === 'object') {
          for (const [id, art] of Object.entries(value)) {
            const ref = valueText(source, 'PORTRAITS').match(new RegExp(`${id}\\s*:\\s*\\{\\s*palette\\s*:\\s*([A-Za-z_$][\\w$]*)`))?.[1];
            entries.push({
              id: `${file}:PORTRAITS.${id}`, file, kind: 'portrait', portraitId: id, group: 'Portraits',
              label: friendly(id), palette: art.palette, notes: ref ? notesOf(ref) : {},
              frames: Object.entries(art).filter(([, v]) => isRows(v)).map(([n, rows]) => ({ name: n, rows })),
            });
          }
        } else if (name === 'ICONS' && isFrameSet(value)) {
          entries.push({
            id: `${file}:ICONS`, file, kind: 'icons', group: 'Battle icons', label: 'Command icons',
            palette: { '#': '#ffe14d' }, notes: {}, frames: Object.entries(value).map(([n, rows]) => ({ name: n, rows })),
          });
        } else if (name.endsWith('_SPRITES') && isFrameSet(value)) {
          const base = name.slice(0, -'_SPRITES'.length);
          const paletteExport = paletteFor(module, base);
          if (!paletteExport) continue;
          entries.push({
            id: `${file}:${name}`, file, kind: 'frames', spritesExport: name, paletteExport, group: base === 'PROP' ? 'Room objects' : 'Characters',
            label: base === 'PROP' ? 'Room objects' : friendly(base), palette: module[paletteExport], notes: notesOf(paletteExport),
            frames: Object.entries(value).map(([n, rows]) => ({ name: n, rows })),
          });
        } else if (name.endsWith('_SPRITE') && isRows(value)) {
          // NAME_SPRITE = NAME_SPRITES.first is the same art as the frames entry.
          if (frameSets.some(([, set]) => Object.values(set).includes(value))) continue;
          const base = name.slice(0, -'_SPRITE'.length);
          const paletteExport = paletteFor(module, base);
          if (!paletteExport) continue;
          entries.push({
            id: `${file}:${name}`, file, kind: 'single', spriteExport: name, paletteExport, group: 'Enemies and things',
            label: friendly(base), palette: module[paletteExport], notes: notesOf(paletteExport),
            frames: [{ name: 'sprite', rows: value }],
          });
        }
      }
    }));
    const order = ['Characters', 'Enemies and things', 'Portraits', 'Room objects', 'Battle icons'];
    entries.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || a.label.localeCompare(b.label));
    return entries;
  })();
  return artCache;
}

// Art an enemy can wear: every file exporting NAME_PALETTE + NAME_SPRITE.
// [{ file, base, label, palette, rows }]
export async function loadEnemyArt(fresh = false) {
  const files = ((await listDir('src/data/art')) ?? KNOWN_ART_FILES).filter((f) => f.endsWith('.js'));
  const out = [];
  await Promise.all(files.map(async (file) => {
    try {
      const module = fresh ? await importFresh(`src/data/art/${file}`) : await import(`../src/data/art/${file}`);
      for (const [name, rows] of Object.entries(module)) {
        if (!name.endsWith('_SPRITE') || !isRows(rows)) continue;
        const base = name.slice(0, -'_SPRITE'.length);
        if (!isPalette(module[`${base}_PALETTE`])) continue;
        out.push({ file, base, label: friendly(base), palette: module[`${base}_PALETTE`], rows });
      }
    } catch (error) {
      console.warn(`Studio: couldn't load src/data/art/${file}`, error);
    }
  }));
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

// --- Enemies: { id: { enemy, file, constName, artFile, artBase } } ---
export async function loadEnemies(fresh = false) {
  const { ENEMIES } = fresh ? await importFresh('src/data/enemies/index.js') : await import('../src/data/enemies/index.js');
  const out = {};
  await Promise.all(Object.entries(ENEMIES).map(async ([id, enemy]) => {
    if (!enemy) return;
    const source = await readText(`src/data/enemies/${id}.js`);
    const art = source.match(/import\s*\{([^}]*)\}\s*from\s*'\.\.\/art\/([^']+)'/);
    const spriteName = art?.[1].split(',').map((s) => s.trim()).find((s) => s.endsWith('_SPRITE'));
    out[id] = {
      enemy,
      file: `${id}.js`,
      constName: source.match(/export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/)?.[1] ?? id.toUpperCase(),
      artFile: art?.[2] ?? null,
      artBase: spriteName ? spriteName.slice(0, -'_SPRITE'.length) : null,
    };
  }));
  // In the registry's order (the loads above finish in any order).
  return Object.fromEntries(Object.keys(ENEMIES).filter((id) => out[id]).map((id) => [id, out[id]]));
}

// Sprite canvases for each enemy, for thumbnails.
export function enemySprite(enemy) {
  return enemy?.sprite ? makeSprite(enemy.sprite.rows, enemy.sprite.palette) : null;
}

// --- Rooms ---
export async function loadRooms(fresh = false) {
  const module = fresh ? await importFresh('src/data/rooms/index.js') : await import('../src/data/rooms/index.js');
  return module.ROOMS;
}

// Every cutscene, by id (src/data/scenes/).
export async function loadScenes(fresh = false) {
  const module = fresh ? await importFresh('src/data/scenes/index.js') : await import('../src/data/scenes/index.js');
  return module.SCENES;
}

// Which file each room lives in: { id: { file, constName, header } }.
export async function roomFiles() {
  const files = (await listDir('src/data/rooms')) ?? ['startRoom.js', 'lanternHall.js'];
  const out = {};
  await Promise.all(files.filter((f) => f.endsWith('.js') && f !== 'index.js').map(async (file) => {
    const source = await readText(`src/data/rooms/${file}`);
    const re = /export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/g;
    let m;
    while ((m = re.exec(source))) {
      const body = valueText(source, m[1]);
      const id = body.match(/\bid\s*:\s*'([^']+)'/)?.[1];
      if (id) out[id] = { file, constName: m[1], source };
    }
  }));
  return out;
}

// --- Songs: { name: { song, file, constName } } ---
export async function loadSongs(fresh = false) {
  const { SONGS } = fresh ? await importFresh('src/data/music/index.js') : await import('../src/data/music/index.js');
  const files = (await listDir('src/data/music')) ?? Object.keys(SONGS).map((n) => `${n}Theme.js`);
  const out = {};
  await Promise.all(Object.entries(SONGS).map(async ([name, song]) => {
    if (!song) return;
    const file = files.find((f) => f.replace(/\.js$/, '').replace(/Theme$/, '') === name) ?? `${name}Theme.js`;
    const source = await readText(`src/data/music/${file}`);
    const names = [...source.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/g)].map((m) => m[1]);
    const constName = names.find((k) => /\bsections\s*:/.test(valueText(source, k))) ?? names[0] ?? `${name.toUpperCase()}_THEME`;
    out[name] = { song, file, constName };
  }));
  return Object.fromEntries(Object.keys(SONGS).filter((n) => out[n]).map((n) => [n, out[n]]));
}

// --- Attack patterns: built-in ones from bullets.js plus the Pattern Lab's. ---
export async function loadPatterns(fresh = false) {
  const bullets = await import('../src/battle/bullets.js');
  const initial = await import('../src/data/patterns/index.js');
  const { CUSTOM_PATTERNS } = fresh ? await importFresh('src/data/patterns/index.js') : initial;
  const builtin = bullets.PATTERN_NAMES.filter((n) => !(n in initial.CUSTOM_PATTERNS));
  // The enemies' own themed attacks (src/battle/attacks/), as opposed to the
  // plain generic patterns.
  const themed = new Set(bullets.ENEMY_ATTACK_NAMES ?? []);
  return { builtin, themed, custom: CUSTOM_PATTERNS, bullets };
}

// Builds any pattern by name, like createPattern() in bullets.js but also
// for custom patterns saved since the page loaded.
export function makePattern(patterns, name, box, { density = 1, speed = 1 } = {}) {
  const { bullets, custom } = patterns;
  if (patterns.builtin.includes(name)) return bullets.createPattern(name, box, { density, speed });
  return wrapFactory(custom[name], box, { density, speed }, bullets.PATTERN_TOOLS);
}

// The wrapping createPattern() gives every pattern: density slows the
// spawner's clock, speed scales each new bullet.
export function wrapFactory(factory, box, { density = 1, speed = 1 }, tools) {
  if (typeof factory !== 'function') throw new Error('That pattern has no factory function.');
  const made = factory(box, density, tools);
  if (!made || typeof made.update !== 'function') throw new Error('A pattern must return { duration, update(dt, bullets, soul) }.');
  const pattern = { mode: 'normal', duration: 6, ...made };
  const spawn = made.update.bind(made);
  pattern.update = (dt, bullets, soul) => {
    const before = bullets.length;
    spawn(dt * density, bullets, soul);
    for (let i = before; i < bullets.length; i++) {
      bullets[i].vx *= speed;
      bullets[i].vy = (bullets[i].vy ?? 0) * speed;
    }
  };
  return pattern;
}

// Text files of NPCs (text/npcs/*.txt) by id.
export async function npcIds() {
  const files = (await listDir('text/npcs')) ?? ['old_keeper.txt'];
  return files.filter((f) => f.endsWith('.txt')).map((f) => f.replace(/\.txt$/, ''));
}

// Plain descriptions of the built-in attack patterns.
export const PATTERN_INFO = {
  rain: 'Cotton falls from above, blown by the wind.',
  sweep: 'Rows fall with one gap that wanders about.',
  aimed: 'Little spreads of shots aimed right at you.',
  spiral: 'A spinning spiral pours out from the top.',
  bounce: 'Heavy yarn balls bounce around the box.',
  wanderer: 'Something roams the top edge, firing fans.',
  flutter: 'Glittering dust weaves in from the sides.',
  ember: 'Rings of embers burst around the box.',
  hop: 'Dust puffs hop up from the bottom corners.',
  drip: 'Hot wax drips, falling faster and faster.',
  orbit: 'A ring closes in on you: slip out the gap.',
  pillars: 'Boss only: jump over pillars sliding along the floor.',
};
