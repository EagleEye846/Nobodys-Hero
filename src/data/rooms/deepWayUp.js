// THE WAY UP: the old stair from the root to the town, the way the Hero came
// back up (it only opens when the root is lit, so it has been shut since the
// light last failed). Cut into the rock in eight long switchbacks, and lit
// again for the first time since anyone can say: the root's light has gone up
// through the rock and come down the walls like a string of lamps. The veins
// glow between the flights. The Hero climbed it after lighting the root and
// left a pile of flat stones at every turn, marking the way for whoever came
// down next. It is a long way. Nothing lives on it. (Gubb never saw them
// again for this reason: they never went back across the lake.)
//
// The door at the bottom is back to the root; the door at the top comes out
// in Belowtown square, among the noise. There is a chest at the corner of the
// second flight (one of the Belowtown foods) and a purse on the top landing.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid)
//   .  black stone floor   ^  black stalagmite (solid)   O  glossy black boulder
export const DEEP_WAY_UP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_way_up',
  // The room's name, for the Room Editor.
  name: 'THE WAY UP',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "Eight Flights" (src/data/music/wayUpTheme.js): the Deep's song turned
  // to the major, climbing a step at a time.
  music: 'wayUp',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // How it rings (a narrow drift: ECHOES in src/audio/music.js).
  echo: 'tunnel',
  // Dim, not dark: the root's veins light the stair now.
  dark: 0.55,

  tiles: [
    '#WW#####################',
    '#..WW###################',
    '#....###################',
    '#....###################',
    '#....###################',
    '#....WWWWWWWWWWWWWWWWW##',
    '#.....................##',
    '#........^............##',
    '####################..##',
    '####################..##',
    '#WWWWWWWWWWWWWWWWWWW..##',
    '#.....................##',
    '#..............^......##',
    '#..#####################',
    '#..#####################',
    '#..WWWWWWWWWWWWWWWWWWW##',
    '#.....................##',
    '#........^............##',
    '####################..##',
    '####################..##',
    '#WWWWWWWWWWWWWWWWWWW..##',
    '#.....................##',
    '#...........^.........##',
    '#..#####################',
    '#..#####################',
    '#..W#WWWWWWWWWWWWWWWWW##',
    '#...O.................##',
    '#................^....##',
    '####################..##',
    '####################..##',
    '#WWWWWWW#WWWWWWWWWWW..##',
    '#.......O.............##',
    '#.....^...............##',
    '#..#####################',
    '#..#####################',
    '#..WWWWWWWWWWWWWWWW#WW##',
    '#..................O..##',
    '#...............^.....##',
    '####################..##',
    '####################..##',
    'WWWWWWWWWWWWWWWWWWWW..##',
    '......................##',
    '...O......^...........##',
    '########################',
    '########################',
    '########################',
  ],

  // Where the player starts, in tile coordinates (the bottom of the stair).
  playerStart: { x: 1, y: 41 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 41, w: 1, h: 2, to: 'deep_root', spawn: { x: 32, y: 22 } },
    { x: 1, y: 1, w: 2, h: 1, to: 'belowtown_square', spawn: { x: 30, y: 20 } },
  ],

  // The way up from the fourth flight to the fifth (x 1-2, row 23), the only
  // way on: stones_on_the_stair. Once the light is up, and not for saves
  // already home in the square.
  cutscenes: [
    { x: 1, y: 23, w: 2, h: 1, scene: 'stones_on_the_stair', after: 'the_light_goes_up', until: ['homecoming', 'rumbolds_duel'] },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Lit root veins in the rock between the flights, the Hero's little cairns
  // (still there, now plainly seen), a chest and a purse.
  textFile: 'interactions/deep.txt',
  props: [
    { sprite: 'root_vein_lit', x: 5, y: 40, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 12, y: 40, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.34 },
    { sprite: 'root_vein_lit', x: 16, y: 35, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.32 },
    { sprite: 'root_vein_lit', x: 9, y: 35, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 6, y: 30, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.36 },
    { sprite: 'root_vein_lit', x: 14, y: 30, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 10, y: 25, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.32 },
    { sprite: 'root_vein_lit', x: 17, y: 25, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 5, y: 20, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.34 },
    { sprite: 'root_vein_lit', x: 12, y: 20, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 8, y: 15, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.36 },
    { sprite: 'root_vein_lit', x: 15, y: 15, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 6, y: 10, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.32 },
    { sprite: 'root_vein_lit', x: 13, y: 10, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'little_cairn', x: 14, y: 42, text: 'wu_cairn_first' },
    { sprite: 'little_cairn', x: 3, y: 36, text: 'wu_cairn' },
    { sprite: 'little_cairn', x: 18, y: 31, text: 'wu_cairn' },
    { sprite: 'little_cairn', x: 6, y: 26, text: 'wu_cairn_mid' },
    { sprite: 'little_cairn', x: 18, y: 21, text: 'wu_cairn' },
    { sprite: 'little_cairn', x: 4, y: 16, text: 'wu_cairn' },
    { sprite: 'little_cairn', x: 18, y: 11, text: 'wu_cairn' },
    { sprite: 'smooth_stone_a', x: 4, y: 3, text: 'wu_top' },
    { sprite: 'chest', x: 21, y: 36, text: 'wu_chest', gives: 'glowworm_honey', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 5, text: 'wu_purse', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'deep_rock', W: 'wu_face', '^': 'deep_stalagmite', O: 'deep_boulder' },

  // Nobody, nothing: a quiet stair (so stones_on_the_stair has nothing to keep clear of).
  npcs: [],
};
