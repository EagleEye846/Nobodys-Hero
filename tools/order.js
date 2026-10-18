// The order the player meets things in, worked out from the game's own data,
// so every list in the Studio can show rooms, enemies, songs and the rest
// under area headings ("Ruins Rooms", "Mount Vigil Enemies"...) in the order
// you come across them. Nothing here is a hand-written list: new rooms,
// enemies and songs slot in by themselves.
//
//   const order = await loadOrder();            // loadOrder(true) after a save
//   order.groups('rooms', Object.keys(rooms))   // [{ group: 'Ruins Rooms', ids: [...] }, ...]
//   order.options('rooms', ids, labelOf)        // the same, for ui.js select()
//
// How it's worked out:
// - Rooms: a walk from the start room through doors, wind geysers and the
//   rooms cutscenes send you on to (end_chapter). It finishes each area before
//   crossing into the next, so the areas come out in the order you reach them.
//   An area you come back to later (Mount Vigil again, past Heralds' Rest) gets
//   a heading of its own. Rooms no door reaches go at the end of their area.
// - Enemies: the first room that places them (or a cutscene battle there).
//   One placed nowhere yet can say where it belongs with `home: '<room id>'`
//   or `area: '<area id>'` in its data; otherwise it's under "Unplaced".
// - Songs: where they're first heard: the title and menus, then each room's
//   music, its battles (an enemy's `music`, or 'battle'), its shop and its
//   cutscenes' music steps. Songs nothing plays are under "Unused".
// - Cutscenes by their room; people (text/npcs), portraits, objects,
//   animations and shops by the first room that uses them; attack patterns by
//   the first enemy that uses them.
import { AREA_NAMES } from '../src/data/areas.js';
import { importFresh, readText } from './api.js';

// What each kind of thing is called in its headings.
const WORDS = {
  rooms: 'Rooms',
  enemies: 'Enemies',
  songs: 'Music',
  scenes: 'Cutscenes',
  npcs: 'People',
  portraits: 'Portraits',
  props: 'Objects',
  animations: 'Animations',
  shops: 'Shops',
  patterns: 'Attacks',
  sprites: 'Sprites',
};

// Heading for things that belong nowhere yet, per kind.
const FALLBACK = {
  enemies: 'Unplaced Enemies',
  songs: 'Unused Music',
  npcs: 'Unplaced People',
  portraits: 'Other Portraits',
  props: 'Other Objects',
  animations: 'Other Animations',
  shops: 'Unplaced Shops',
  patterns: 'Basic Patterns',
  scenes: 'Other Cutscenes',
  rooms: 'Other Rooms',
};

// Game code (not data) that plays songs outside the world: the intro and
// title, the end of a chapter, the credits and the skills menu. Their songs
// are found by reading these files, so a song swapped in here moves too.
const ENGINE_SONG_FILES = ['src/main.js', 'src/title/titleScene.js', 'src/title/chapterEndScene.js', 'src/title/creditsScene.js', 'src/ui/skillsMenu.js'];
const TITLE_SECTION = { id: 'title', area: null, name: 'Title, Menus and Credits', note: '' };

// "HERALDS' REST" -> "Heralds' Rest", "THE RUINS" -> "Ruins".
export function areaName(area) {
  const raw = AREA_NAMES[area] ?? String(area ?? '').replace(/[_-]+/g, ' ');
  const words = raw.replace(/^the\s+/i, '').trim().split(/\s+/).filter(Boolean);
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Other';
}

const load = (path, fresh) => (fresh ? importFresh(path) : import(`../${path}`));

let cache = null;
export function loadOrder(fresh = false) {
  if (cache && !fresh) return cache;
  cache = (async () => {
    const [rooms, scenes, enemies, songs, shops] = await Promise.all([
      load('src/data/rooms/index.js', fresh),
      load('src/data/scenes/index.js', fresh),
      load('src/data/enemies/index.js', fresh),
      load('src/data/music/index.js', fresh),
      load('src/data/shops.js', fresh).catch(() => ({ SHOPS: {} })),
    ]);
    const engineSongs = [];
    for (const path of ENGINE_SONG_FILES) {
      const source = await readText(path);
      for (const name of songsNamedIn(source)) if (!engineSongs.includes(name)) engineSongs.push(name);
    }
    return computeOrder({
      rooms: rooms.ROOMS,
      startRoom: rooms.START_ROOM?.id,
      scenes: scenes.SCENES,
      enemies: enemies.ENEMIES,
      songs: songs.SONGS,
      shops: shops.SHOPS ?? {},
      engineSongs: engineSongs.filter((name) => name in songs.SONGS),
    });
  })();
  return cache;
}

// Song names in music.play(...) calls, `song: '...'` and `SONG = '...'`.
function songsNamedIn(source) {
  const names = [];
  const add = (text) => { for (const m of text.matchAll(/'([A-Za-z_]\w*)'/g)) names.push(m[1]); };
  for (const m of source.matchAll(/music\.play\(([^;\n]*)\)/g)) add(m[1]);
  for (const m of source.matchAll(/\b(?:song|SONG)\s*[:=]\s*'([A-Za-z_]\w*)'/g)) names.push(m[1]);
  return names;
}

// The cutscenes a room plays, in order: its triggers (each followed by the
// scenes its battles lead to), then any other scene set in the room.
function roomSceneIds(room, scenes) {
  const out = [];
  const add = (id) => {
    if (!id || out.includes(id) || !scenes[id]) return;
    out.push(id);
    for (const step of scenes[id].steps ?? []) {
      if (step.do === 'battle') { add(step.spared); add(step.defeated); }
    }
  };
  for (const trigger of room.cutscenes ?? []) add(trigger.scene);
  for (const [id, scene] of Object.entries(scenes)) if (scene.room === room.id) add(id);
  return out;
}

export function computeOrder({ rooms, startRoom, scenes = {}, enemies = {}, songs = {}, shops = {}, engineSongs = [] }) {
  // --- Rooms: finish each area before crossing into the next. ---
  const exits = (room) => {
    const out = [];
    for (const door of room.doors ?? []) out.push(door.to);
    for (const geyser of room.geysers ?? []) out.push(geyser.to);
    for (const id of roomSceneIds(room, scenes)) {
      for (const step of scenes[id].steps ?? []) if (step.do === 'end_chapter') out.push(step.room);
    }
    return out.filter((to) => to && to !== room.id && rooms[to]);
  };
  const segments = []; // { area, from, rooms: [] }
  const seen = new Set();
  let seeds = startRoom && rooms[startRoom] ? [{ id: startRoom, from: null }] : [];
  while (seeds.length) {
    const next = [];
    for (const seed of seeds) {
      if (seen.has(seed.id)) continue;
      const area = rooms[seed.id].area ?? null;
      const segment = { area, from: seed.from, rooms: [] };
      seen.add(seed.id);
      const queue = [seed.id];
      while (queue.length) {
        const id = queue.shift();
        segment.rooms.push(id);
        for (const to of exits(rooms[id])) {
          if (seen.has(to)) continue;
          if ((rooms[to].area ?? null) === area) { seen.add(to); queue.push(to); } else next.push({ id: to, from: area });
        }
      }
      const last = segments[segments.length - 1];
      if (last && last.area === area) last.rooms.push(...segment.rooms);
      else segments.push(segment);
    }
    seeds = next;
  }
  // Rooms no door reaches: at the end of their area (its last heading).
  for (const [id, room] of Object.entries(rooms)) {
    if (seen.has(id)) continue;
    const area = room.area ?? null;
    let segment = [...segments].reverse().find((s) => s.area === area);
    if (!segment) { segment = { area, from: null, rooms: [] }; segments.push(segment); }
    segment.rooms.push(id);
  }

  // Sections: the headings, in order. An area met again gets "(past X)".
  const sections = [TITLE_SECTION];
  const met = new Set();
  const sectionOfRoom = new Map();
  const roomOrder = [];
  for (const segment of segments) {
    const again = met.has(segment.area);
    met.add(segment.area);
    const index = sections.length;
    sections.push({
      id: `${segment.area}#${index}`,
      area: segment.area,
      name: areaName(segment.area),
      note: again && segment.from !== null ? `past ${areaName(segment.from)}` : '',
    });
    for (const id of segment.rooms) { sectionOfRoom.set(id, index); roomOrder.push(id); }
  }

  // --- Everything placed in rooms, in the order the rooms come. ---
  const place = Object.fromEntries(Object.keys(WORDS).map((kind) => [kind, new Map()]));
  let rank = 0;
  const put = (kind, key, section) => {
    if (key === undefined || key === null || key === '' || place[kind].has(key)) return;
    place[kind].set(key, { section, rank: rank++ });
  };
  const battleSong = (enemyId) => (enemies[enemyId] ? enemies[enemyId].music ?? 'battle' : null);

  for (const name of engineSongs) put('songs', name, 0);
  for (const id of roomOrder) {
    const room = rooms[id];
    const s = sectionOfRoom.get(id);
    put('rooms', id, s);
    put('songs', room.music, s);
    for (const npc of room.npcs ?? []) {
      put('enemies', npc.enemy, s);
      put('songs', battleSong(npc.enemy), s);
    }
    for (const prop of room.props ?? []) {
      put('props', prop.sprite, s);
      put('props', prop.taken?.sprite, s);
      put('animations', prop.animation, s);
      if (prop.npc) { put('npcs', prop.npc, s); put('portraits', prop.npc, s); }
      if (prop.shop) { put('shops', prop.shop, s); put('songs', shops[prop.shop]?.music, s); }
    }
    for (const sceneId of roomSceneIds(room, scenes)) {
      const scene = scenes[sceneId];
      put('scenes', sceneId, sectionOfRoom.get(scene.room) ?? s);
      for (const actor of scene.actors ?? []) {
        if (actor.look?.startsWith('prop:')) put('props', actor.look.slice(5), s);
        if (actor.look?.startsWith('enemy:')) put('enemies', actor.look.slice(6), s);
        put('portraits', actor.portrait, s);
        put('animations', actor.animation, s);
      }
      for (const step of scene.steps ?? []) {
        if (step.do === 'music') put('songs', step.song, s);
        if (step.do === 'animate') put('animations', step.animation, s);
        if (step.do === 'battle') { put('enemies', step.enemy, s); put('songs', battleSong(step.enemy), s); }
      }
    }
  }
  // Cutscenes whose room is never reached (or that nothing plays).
  for (const [id, scene] of Object.entries(scenes)) put('scenes', id, sectionOfRoom.get(scene.room) ?? null);

  // Enemies not in any room yet: their own `home` room or `area`, if they say.
  const firstSectionOf = (area) => sections.findIndex((sec) => sec.area === area && sec !== TITLE_SECTION);
  for (const [id, enemy] of Object.entries(enemies)) {
    if (!enemy || place.enemies.has(id)) continue;
    let s = enemy.home && sectionOfRoom.has(enemy.home) ? sectionOfRoom.get(enemy.home) : -1;
    if (s < 0 && enemy.area) s = firstSectionOf(enemy.area);
    if (s < 0 && enemy.backdrop) s = firstSectionOf(enemy.backdrop);
    if (s >= 0) {
      put('enemies', id, s);
      put('songs', enemy.music, s);
    }
  }

  // Attack patterns: with the first enemy (in that order) that uses them.
  const enemyIds = Object.keys(enemies).filter((id) => place.enemies.has(id))
    .sort((a, b) => place.enemies.get(a).rank - place.enemies.get(b).rank);
  for (const id of enemyIds) {
    for (const p of enemies[id].patterns ?? []) put('patterns', typeof p === 'string' ? p : p?.name, place.enemies.get(id).section);
  }

  return new Order({ sections, place, roomOrder, enemies });
}

class Order {
  constructor({ sections, place, roomOrder, enemies }) {
    this.sections = sections;
    this.place = place;
    this.roomOrder = roomOrder;
    this.enemies = enemies;
  }

  // "Mount Vigil Enemies (past Heralds' Rest)"
  heading(section, kind) {
    const sec = this.sections[section];
    return `${sec.name} ${WORDS[kind] ?? friendlyWord(kind)}${sec.note ? ` (${sec.note})` : ''}`;
  }

  // Where one thing goes: { section, rank } or null.
  where(kind, id) {
    return this.place[kind]?.get(id) ?? null;
  }

  // The areas in the order you reach them (each once).
  areas() {
    return [...new Set(this.sections.filter((s) => s.area !== null && s !== TITLE_SECTION).map((s) => s.area))];
  }

  // Sorts `ids` into headed groups: [{ group, ids }]. Each id may instead be
  // given a place by `placeOf(id)` (returning { section, rank } or null), for
  // things known only to the caller (a sprite tied to its enemy). Anything
  // with no place goes under `fallback` (default: "Unused Music",
  // "Unplaced Enemies"...), keeping the order it was given in.
  groups(kind, ids, { placeOf = null, fallback = FALLBACK[kind] ?? `Other ${WORDS[kind] ?? friendlyWord(kind)}` } = {}) {
    const placed = [];
    const rest = [];
    ids.forEach((id, index) => {
      const at = placeOf?.(id) ?? this.where(kind, id);
      if (at && at.section !== null && at.section !== undefined && this.sections[at.section]) placed.push({ id, index, ...at });
      else rest.push(id);
    });
    placed.sort((a, b) => a.section - b.section || a.rank - b.rank || a.index - b.index);
    const out = [];
    for (const item of placed) {
      const group = this.heading(item.section, kind);
      if (out[out.length - 1]?.group !== group) out.push({ group, ids: [] });
      out[out.length - 1].ids.push(item.id);
    }
    if (rest.length) out.push({ group: fallback, ids: rest });
    return out;
  }

  // groups(), shaped for ui.js select(): [{ group, options: [[id, label], ...] }].
  options(kind, ids, labelOf = (id) => id, opts = {}) {
    return this.groups(kind, ids, opts).map(({ group, ids: list }) => ({ group, options: list.map((id) => [id, labelOf(id)]) }));
  }

  // The ids in order, without the headings.
  sorted(kind, ids, opts = {}) {
    return this.groups(kind, ids, opts).flatMap((g) => g.ids);
  }
}

const friendlyWord = (kind) => kind[0].toUpperCase() + kind.slice(1);
