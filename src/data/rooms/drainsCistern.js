// THE CISTERN: Hollin's great brick cistern under the square, where the well
// drew its water. Its basin is full to the brim, with a deep trench down the
// middle that never drains. A valve wheel on the west bank lets the water
// down; then a cask rolled across the dry basin floor sinks into the trench,
// and you can walk over on it. Roots have grown down through the bricks into
// the culvert out: Bramble chops them. And on the east bank another cask, and
// a chest on an island in a ring of deep water.
// Tile key (see src/overworld/tileset.js):
//   j  dry gutter (a current or sluice water can run in it)
//   K  brick culvert wall (solid)
//   k  dark overhead (solid)
//   q  wet brick walkway
//   ~  deep black water (solid, until a cask sinks into it)
export const DRAINS_CISTERN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_cistern',
  // The room's name, for the Room Editor.
  name: 'THE CISTERN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js): drips, and Ves's chalk.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.55,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kqqqqqqqqjjj~jjqqqqqqqqqqk',
    'kqqqqqqqqjjj~jjqqqqqqqqqqk',
    'kqqqqqqqqjjj~jjqqqqqqqqqqk',
    'kqqqqqqqqjjj~jjqqqqqqqqqqk',
    'qqqqqqqqqjjj~jjqqqqqqqKKKk',
    'qqqqqqqqqjjj~jjqqqqqqqqqqq',
    'kqqqqqqqqjjj~jjqqqqqqqKKKk',
    'kqqqqqqqqjjj~jjqqqqqqqqqqk',
    'kqqqqqqqqjjj~jjqqq~~~~qqqk',
    'kqqqqqqqqjjj~jjqqq~qq~qqqk',
    'kqqqqqqqqjjj~jjqqq~qq~qqqk',
    'kqqqqqqqqjjj~jjqqq~~~~qqqk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'hollin_well_bottom', spawn: { x: 16, y: 6 } },
    { x: 25, y: 7, w: 1, h: 1, to: 'drains_culvert', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The basin's water comes and goes with the wheel (a prop's `wet`).
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'light_shaft', x: 16, y: 4, text: 'cistern_grating', light: 40 },
    { sprite: 'chalk_rock_right', x: 3, y: 3, text: 'cistern_chalk' },
    { sprite: 'sign', x: 2, y: 10, text: 'cistern_sign' },
    { sprite: 'valve_wheel', x: 5, y: 3, text: 'cistern_wheel', lever: 'a' },
    { sprite: 'cask', x: 6, y: 8, text: 'cask', log: true },
    { sprite: 'cask', x: 19, y: 5, text: 'cask', log: true },
    { sprite: 'chest', x: 19, y: 11, text: 'cistern_chest', gives: 'mags_jam', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'root_plug', x: 23, y: 7, text: 'root_plug', chop: 'open', openText: 'roots_open' },
    { sprite: 'gold_pouch', x: 24, y: 2, text: 'cistern_purse', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'silt_heap', x: 2, y: 13, text: 'silt_heap' },
    // The basin's water, there until the wheel lets it down.
    { sprite: 'water_flow', x: 9, y: 2, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 2, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 2, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 2, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 2, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 3, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 3, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 3, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 3, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 3, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 4, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 4, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 4, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 4, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 4, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 5, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 5, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 5, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 5, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 5, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 6, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 6, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 6, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 6, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 6, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 7, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 7, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 7, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 7, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 7, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 8, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 8, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 8, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 8, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 8, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 9, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 9, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 9, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 9, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 9, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 10, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 10, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 10, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 10, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 10, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 11, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 11, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 11, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 11, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 11, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 12, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 12, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 12, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 12, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 12, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 9, y: 13, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 13, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 13, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 13, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 13, text: 'drain_water', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 15, y: 1, text: 'cistern_vault' },
    { x: 16, y: 1, text: 'cistern_vault' },
    { x: 17, y: 1, text: 'cistern_vault' },
    { x: 18, y: 1, text: 'cistern_vault' },
  ],
  tileTexts: { K: 'cistern_wall', k: 'cistern_wall', '~': 'cistern_trench', j: 'cistern_basin' },

  // A Siltling, settled on the east bank.
  npcs: [
    { enemy: 'siltling', x: 21, y: 3, patrol: [18, 23] },
  ],
};
