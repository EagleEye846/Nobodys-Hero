// LADLE'S NOOK: a dry brick chamber where three culverts meet, swept clean,
// with a fire in an old hearth-grate and a kettle on it. Old Ladle lives here,
// the cistern's hob, who has kept Hollin's water sweet for fifty years for a
// village that isn't there any more. A rest, a save, and his stall of things
// that wash down the drains. No enemies.
// Tile key (see src/overworld/tileset.js):
//   j  dry gutter (a current or sluice water can run in it)
//   K  brick culvert wall (solid)
//   k  dark overhead (solid)
//   q  wet brick walkway
export const DRAINS_LADLE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_ladle',
  // The room's name, for the Room Editor.
  name: 'LADLE\'S NOOK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js), which has Ladle's warm tune in it.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.3,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKKKKKKk',
    'kqqqqqqqqqqqjjjjjjjjqk',
    'qqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqq',
    'kqqqqqqqqqqqqqqqqqqqqq',
    'kqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 3 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 3, w: 1, h: 1, to: 'drains_gratings', spawn: { x: 28, y: 3 } },
    { x: 21, y: 8, w: 1, h: 2, to: 'drains_sumps', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 2, w: 1, h: 9, scene: 'ladle_meets' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Ladle keeps his stall here once you've met him (the scene ladle_meets plays
  // him till then).
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'ladle', x: 12, y: 6, shop: 'ladle_stall', after: 'ladle_meets' },
    { sprite: 'campfire', x: 9, y: 4, text: 'ladle_fire', light: 60 },
    { sprite: 'soot_kettle', x: 10, y: 4, text: 'ladle_kettle' },
    { sprite: 'bed', x: 3, y: 8, text: 'ladle_cot', rest: true },
    { sprite: 'savepoint', x: 15, y: 9, save: true },
    { sprite: 'crates', x: 18, y: 4, text: 'ladle_crates' },
    { sprite: 'barrel', x: 19, y: 4, text: 'ladle_barrel' },
    { sprite: 'silt_heap', x: 6, y: 10, text: 'silt_heap' },
    { sprite: 'chalk_rock_right', x: 20, y: 7, text: 'ladle_chalk' },
    // The clean gutter he keeps.
    { sprite: 'water_flow', x: 12, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 15, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 16, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 17, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 18, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
    { sprite: 'water_flow', x: 19, y: 2, text: 'ladle_gutter', animation: 'water_flow_side', speed: 0.3 },
  ],
  tileTexts: { K: 'ladle_wall', k: 'ladle_wall' },

  // Nobody but Ladle.
  npcs: [],
};
