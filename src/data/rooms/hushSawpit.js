// THE SAWPIT: the woodcutters' old sawing pit, a long dip walled with
// bramble, with sawing benches left standing in it. The way out west is a
// gate held by two treadles at once, so neither of you can hold it for the
// other: two logs have to come to rest on them. A log rolls till something
// stops it, and the benches stop logs, though you can hop over them. Each log
// has one way round to its treadle, bench to boulder to bench. (7 pushes
// at best, and no way to get stuck.)
// Tile key (see src/overworld/tileset.js):
//   b  stump (jump up onto it)
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   O  boulder (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_SAWPIT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_sawpit',
  // The room's name, for the Room Editor.
  name: 'THE SAWPIT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hushwood',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.22,

  tiles: [
    'LLLyyLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LdyyyddZdddddddddddddddddddddddL',
    'LdyddddZdddddddddddddddddddddddL',
    'LdydLddZZZZZZZZZZZZZZZZZZZZddLdL',
    'LdyddddZddddddddddddddddddZddddL',
    'LdyddddZddddOdddddddddddddZddddL',
    'LdyyyyyddbddddddddddddddbdZddddL',
    'LddddddZddddddddddddbdddddZddddL',
    'LddddddZddddddddddddddddddZddddL',
    'LdLddddZdddddddddddddddddddyyyyy',
    'LddddddZdddbdddddddddddOdddddddy',
    'LddddddZddddddddOdddddddddZddddL',
    'LddddddZddddddbddddbddddddZddddL',
    'LddddddZdbddddddddddddddddZddddL',
    'LddLdddZdddddOddddddddddddZddddL',
    'LddddddZddddddddddbdddddddZdLddL',
    'LddddddZZZZZZZZZZZZZZZZZZZZddddL',
    'LddddddZddddddddddddddLddddddddL',
    'LddddddZddddLddddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 30, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 31, y: 9, w: 1, h: 2, to: 'hush_gorge', spawn: { x: 1, y: 18 } },
    { x: 3, y: 0, w: 2, h: 1, to: 'hush_notched', spawn: { x: 15, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Two logs, two treadles, and the gate they hold open together; benches stop
  // logs, not you.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'roll_log', x: 16, y: 5, text: 'roll_log', log: true },
    { sprite: 'treadle', x: 10, y: 6, text: 'treadle', treadle: 't1' },
    { sprite: 'treadle', x: 10, y: 13, text: 'treadle', treadle: 't2' },
    { sprite: 'roll_log', x: 21, y: 14, text: 'roll_log', log: true },
    { sprite: 'gate_narrow', x: 7, y: 6, text: 'sawpit_gate', opensWith: ['t1', 't2'] },
    { sprite: 'rock_stump', x: 29, y: 12, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 28, y: 8, text: 'sawpit_sign' },
    { sprite: 'axe_in_ground', x: 24, y: 12, text: 'sawpit_axe' },
    { sprite: 'chest', x: 1, y: 18, text: 'sawpit_chest', gives: 'lost_lunch', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 18, text: 'sawpit_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'notched_post', x: 5, y: 2, text: 'notched_post' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', b: 'sawpit_bench', O: 'mist_boulder' },

  // A Burrhog rolls about outside the pit, and a Knotling grumbles by the gate.
  npcs: [
    { enemy: 'burrhog', x: 28, y: 17, patrol: [24, 30] },
    { enemy: 'knotling', x: 3, y: 11, patrol: [2, 5] },
  ],
};
