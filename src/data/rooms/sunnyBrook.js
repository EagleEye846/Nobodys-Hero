// THE BROOK: a clear, quick brook across the whole meadow, and the only way
// over is a chain of stepping stones: one dry route, zig-zagging across (down
// from the north bank at column 12, across to 13, and out onto the south
// bank), with a second pair of stones leading to a small islet and a purse. The
// banks are the room's jumping: on the north side a stair of grassy banks
// (b, b, then B) up to a high ledge and a purse; on the south side the same
// kind of stair up to a terrace with a chest (the Daisy Ferrule, for Ves).
// Two dandy lions keep to the banks: one patrols the south lane that leads to
// the way on, the other wanders the north meadow.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   ~  the brook (solid)  j  stepping stones in it (walkable)
//   b  grassy bank (12 high)   B  grassy bank (24 high)
//   I  oak   T  apple tree   J  blossom tree (solid, standing)   F  flower bed (solid)
export const SUNNY_BROOK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_brook',
  // The room's name, for the Room Editor.
  name: 'THE BROOK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'sunnyside',
  // "Sunnyside" (src/data/music/sunnysideTheme.js).
  music: 'sunnyside',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'meadow',
  vesWell: true,
  birds: 3,

  tiles: [
    '##################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,bBBB,,,#',
    '#,,,,,,,,,,,,,,,,,T,,,,,,,bb,,,,,#',
    '#,,,,,,,I,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,FF,,,,,J,,,,,,,,,,#',
    '::::::::,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '::::::::,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#~~~~~j~~~~~j~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~j~~~~~jj~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~j~~~~~~~~~~~~~~~~~~~#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,::::::::::::::::::::',
    '#,,,,,,,,,,,,,::::::::::::::::::::',
    '#,,,T,,,,FF,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,bBBBBB,,#',
    '#,,,,,,,,,,,J,,,,,,,,,,,,,,,,,,,,#',
    '##################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates (the west door).
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'sunny_lane', spawn: { x: 36, y: 9 } },
    { x: 33, y: 13, w: 1, h: 2, to: 'sunny_soft_field', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The stones' sign, a purse on the islet, a purse on the north ledge, the
  // chest on the south terrace (Daisy Ferrule), a bench, a haystack, flowers.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sign', x: 11, y: 8, text: 'brook_sign' },
    { sprite: 'gold_pouch', x: 6, y: 10, text: 'brook_islet_pouch', gold: 70, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 28, y: 3, text: 'brook_ledge_pouch', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 27, y: 16, text: 'brook_chest', gives: 'daisy_ferrule', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'bench', x: 4, y: 12, text: 'brook_bench' },
    { sprite: 'haystack', x: 19, y: 16, text: 'brook_haystack' },
    { sprite: 'picnic_blanket', x: 20, y: 3, text: 'brook_picnic', walkable: true },
    { sprite: 'daisy_patch', x: 10, y: 4, walkable: true },
    { sprite: 'daisy_patch', x: 24, y: 7, walkable: true },
    { sprite: 'daisy_patch', x: 6, y: 16, walkable: true },
    { sprite: 'daisy_patch', x: 30, y: 12, walkable: true },
    { sprite: 'buttercups', x: 15, y: 3, walkable: true },
    { sprite: 'buttercups', x: 12, y: 15, walkable: true },
    { sprite: 'buttercups', x: 22, y: 12, walkable: true },
    { sprite: 'buttercups', x: 31, y: 8, walkable: true },
    { sprite: 'butterflies', x: 9, y: 6, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 22, y: 5, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 17, y: 14, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'bridge_plank', x: 8, y: 8, text: 'brook_plank', walkable: true },
  ],
  tileTexts: {
    '#': 'brook_hedge', W: 'brook_hedge', '~': 'brook_water', j: 'brook_stones',
    b: 'field_bank', B: 'field_bank', F: 'field_flowers', I: 'field_oak', T: 'field_apple', J: 'field_blossom',
  },

  // Two dandy lions and a bunting. The patroller walks the south lane between
  // the stones' landing (x 13) and the terrace (x 24); the wanderer keeps to the
  // north meadow, east of the oak; the bunting hops about the south bank's
  // west end (x 5 to 8, rows 15 to 17), clear of the bench, the apple tree and
  // the stones' landing. None is near a door. No cutscenes here.
  npcs: [
    { enemy: 'dandylion', x: 17, y: 14, patrol: [15, 25], behaviour: 'patrol' },
    { enemy: 'dandylion', x: 21, y: 5, patrol: [14, 24], behaviour: 'wander' },
    { enemy: 'bunting', x: 7, y: 16, patrol: [5, 8], behaviour: 'wander' },
  ],

  // CHAPTER 5 (src/overworld/chapterRooms.js): the brook, with the late summer
  // on it. Sunnyside's own monsters, as in chapter 4: a dandylion on the
  // south bank (row 14, x 15 to 25, clear of the stones at x 6 to 13), a seed sheep
  // grazing the north meadow and a bunting on the south-west bank.
  chapter5: {
    textSwap: { brook_sign: 'brook_sign_5', brook_water: 'brook_water_5' },
    addProps: [
      { sprite: 'sy_seed_heads', x: 4, y: 6, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 2, y: 4, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 20, y: 12, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 21, y: 16, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 12, y: 14, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 16, y: 3, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_heads', x: 31, y: 6, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 24, y: 17, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_heads', x: 10, y: 2, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 23, y: 6, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 10, y: 7, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 19, y: 2, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_drift', x: 14, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 29, y: 15, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 8, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 6, y: 17, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 21, y: 4, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 26, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 29, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 17, y: 17, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 18, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    ],
    npcs: [
      { enemy: 'dandylion', x: 18, y: 14, patrol: [15, 25], behaviour: 'patrol' },
      { enemy: 'seed_sheep', x: 21, y: 5, patrol: [18, 24], behaviour: 'patrol' },
      { enemy: 'bunting', x: 7, y: 16, patrol: [5, 8], behaviour: 'wander' },
    ],
  },
};
