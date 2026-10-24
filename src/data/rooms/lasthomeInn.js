// THE KETTLE AND STRAW: Lasthome's inn. Mabb keeps it: a fire, a long table, a
// kettle that never comes off the hook, and beds of clean straw for anyone, no
// questions. Sleep in one and your HP comes back.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   D  doorway (walk through it; see `doors`)
//   h  wall with wood panelling (solid)
//   o  wooden floorboards
//   r  rug
export const LASTHOME_INN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lasthome_inn',
  // The room's name, for the Room Editor.
  name: 'THE KETTLE AND STRAW',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'lasthome',
  // "The Ones Who Stopped Waiting" (lasthomeTheme.js).
  music: 'lasthome',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhh#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#ooorrrrrrroooo#',
    '#ooorrrrrrroooo#',
    '#ooorrrrrrroooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#######D########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 12, w: 1, h: 1, to: 'lasthome_square', spawn: { x: 28, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lasthome.txt',
  props: [
    { sprite: 'fireplace', x: 6, y: 2, text: 'inn_fire', animation: 'fireplace', speed: 0.18 },
    { sprite: 'counter', x: 11, y: 4, text: 'inn_counter' },
    { sprite: 'lh_mabb', x: 12, y: 3, npc: 'lh_mabb' },
    { sprite: 'stove_pot', x: 13, y: 2, text: 'inn_kettle', gives: 'lasthome_stew', taken: { sprite: 'stove', text: 'inn_kettle_empty' } },
    { sprite: 'long_table', x: 5, y: 6, text: 'inn_table' },
    { sprite: 'bench', x: 5, y: 7, text: 'inn_bench' },
    { sprite: 'bed', x: 1, y: 9, text: 'inn_bed', rest: true },
    { sprite: 'bed', x: 1, y: 11, text: 'inn_bed', rest: true },
    { sprite: 'bed', x: 13, y: 9, text: 'inn_bed', rest: true },
    { sprite: 'barrel', x: 14, y: 4, text: 'inn_barrel' },
    { sprite: 'sign', x: 10, y: 11, text: 'inn_rules' },
  ],
  tileTexts: { h: 'inn_wall', r: 'inn_rug' },

  // Nobody to fight.
  npcs: [],
};
