// UNDER THE AQUEDUCT: the old aqueduct crosses the city here on its arches,
// and its fallen end makes a way up onto its top. A wall cuts across the
// street below with a gate in it, and the gate's lever is up on the aqueduct,
// over the wall. Up you go (Ves can't climb, so she waits below), along the
// top, pull it, and come down the far side; she comes through the gate.
//
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   B  tall stone step (jump up onto it from a step)
//   b  old stone step (jump up onto it; Ves can not)
//   W  the old city's stone wall (solid)
//   ~  water (solid)
export const CITY_AQUEDUCT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_aqueduct',
  // The room's name, for the Room Editor.
  name: 'UNDER THE AQUEDUCT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "What They Built for Him" (valleyTheme.js).
  music: 'valley',
  // Its old flagstones crack under every landing, and give way in the end,
  // like the Ruins' floors (see OverworldScene.handleLanding). And the
  // street just past the gate is split from wall to wall (`!`, crumble.js):
  // you can run it; Ves won't. The lever up on the aqueduct that opens the
  // gate drops a span of planks across it too (`planks`), so she can follow.
  crumbles: true,
  crumble: { planks: [{ x: 17, y: 10, w: 3, h: 2, lever: 'span' }] },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#..............W.............#',
    '#.....BBBBBBBBBBBBBBBBB......#',
    '#.....bWWWWWWWWWWWWWWWb......#',
    '#..............W.!!!.........#',
    '#.~~...........W.!!!......~~.#',
    '#.~~...........W.!!!......~~.#',
    '#.~~...........W.!!!......~~.#',
    '#..............W.!!!.........#',
    '...............W.!!!..........',
    '.................!!!..........',
    '#..............W.!!!.........#',
    '#..............W.!!!.........#',
    '#..............W.!!!.........#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'city_crier_square', spawn: { x: 24, y: 7 } },
    { x: 29, y: 10, w: 1, h: 2, to: 'city_statue_court', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'gate_narrow', x: 15, y: 11, text: 'aqueduct_gate', opensWith: ['span'], openText: 'aqueduct_gate_open' },
    { sprite: 'lever', x: 18, y: 3, text: 'aqueduct_lever', lever: 'span' },
    { sprite: 'gold_pouch', x: 12, y: 2, text: 'aqueduct_purse', gold: 240, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 4, y: 9, text: 'aqueduct_sign' },
    { sprite: 'street_lamp_dead', x: 9, y: 13, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 20, y: 13, text: 'dead_lamp' },
    { sprite: 'chest', x: 1, y: 14, text: 'aqueduct_chest', gives: 'fountain_brass_handle', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { W: 'aqueduct_wall', '#': 'city_wall', '!': 'cracked_floor', B: 'aqueduct_top', b: 'city_step', '~': 'forum_water' },

  // A Cairn Hound under the arches.
  npcs: [
    { enemy: 'cairn_hound', x: 22, y: 12, patrol: [18, 27], behaviour: 'disguise' },
  ],
};
