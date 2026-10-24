// THE WATERGATE: the old city's road comes back up out of the fen through a
// wall with two watergates in it, each held open by a treadle on the far side
// of the other. Bramble squeezes in through a grating to stand on the first;
// you go through, and stand on the second while he comes round.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
export const MARSH_WATERGATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_watergate',
  // The room's name, for the Room Editor.
  name: 'THE WATERGATE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.35,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#$$$$$$$$$$$$$W..............#',
    '#$$$$$$$$$$$$$W..............#',
    '#............................#',
    '#.............W..............#',
    '#.....WWWWWWWWW..............#',
    '#.....W.......W...............',
    '#.............W...............',
    '......W.......W..............#',
    '......WWWWWWWWW..............#',
    '#............................#',
    '#$$$$.........W..............#',
    '#$$$$.........W$$$$$$$$$$$$$$#',
    '#$$$$.........W$$$$$$$$$$$$$$#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'marsh_heron_flats', spawn: { x: 28, y: 12 } },
    { x: 29, y: 7, w: 1, h: 2, to: 'marsh_far_shore', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'gate_narrow', x: 14, y: 4, text: 'watergate', opensWith: ['inner'] },
    { sprite: 'gate_narrow', x: 14, y: 11, text: 'watergate', opensWith: ['outer'] },
    { sprite: 'drain_grate', x: 6, y: 8, text: 'drain_grate', gap: true },
    { sprite: 'treadle', x: 10, y: 8, text: 'treadle', treadle: 'inner' },
    { sprite: 'treadle', x: 21, y: 6, text: 'treadle', treadle: 'outer' },
    { sprite: 'conduit_carving', x: 20, y: 2, text: 'watergate_carving' },
    { sprite: 'sign', x: 3, y: 5, text: 'watergate_sign' },
    { sprite: 'marsh_lantern', x: 2, y: 11, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 27, y: 6, text: 'marsh_lantern', light: 60 },
    { sprite: 'gold_pouch', x: 12, y: 7, text: 'watergate_purse', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'watergate_wall', '#': 'watergate_wall', $: 'fen_water' },

  // A Reed Stalker past the gates.
  npcs: [
    { enemy: 'reed_stalker', x: 24, y: 10, patrol: [18, 27] },
  ],
};
