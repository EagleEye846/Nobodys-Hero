// THE HEALER'S: Bryony's house, which smells of steam and something green.
// Herbs hanging to dry, jars, a stove with a kettle on it, and two cots: one
// for whoever's hurt, and one for whoever brought them (the_healer). Sleep in
// the second and you dream; in the morning Ves is up on a crutch
// (lasthome_night, ves_on_her_feet).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   D  doorway (walk through it; see `doors`)
//   h  wall with wood panelling (solid)
//   o  wooden floorboards
//   r  rug
export const LASTHOME_HEALER = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lasthome_healer',
  // The room's name, for the Room Editor.
  name: 'THE HEALER\'S',
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
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#ooooooorrrro#',
    '#ooooooorrrro#',
    '#ooooooorrrro#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######D#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 11, w: 1, h: 1, to: 'lasthome_square', spawn: { x: 5, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 5, y: 9, w: 3, h: 1, scene: 'the_healer' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lasthome.txt',
  props: [
    { sprite: 'lh_bryony', x: 4, y: 4, npc: 'lh_bryony' },
    { sprite: 'herb_rack', x: 2, y: 2, text: 'healer_herbs' },
    { sprite: 'herb_rack', x: 4, y: 2, text: 'healer_herbs' },
    { sprite: 'stove_pot', x: 7, y: 2, text: 'healer_kettle' },
    { sprite: 'bookshelf', x: 10, y: 2, text: 'healer_jars' },
    // Ves's cot, once she's in it; and yours, where you dream.
    { sprite: 'bed_ves', x: 9, y: 4, text: 'healer_ves_bed', cast: 'ves_in_bed', after: 'the_healer', until: 'ves_on_her_feet' },
    { sprite: 'bed', x: 9, y: 4, text: 'healer_empty_bed', after: 'ves_on_her_feet' },
    { sprite: 'bed', x: 9, y: 8, text: 'healer_your_bed', rest: true, dream: 'lasthome_night' },
    { sprite: 'table', x: 2, y: 6, text: 'healer_table' },
    { sprite: 'chair', x: 4, y: 6, text: 'healer_chair' },
    { sprite: 'savepoint', x: 2, y: 9, save: true },
  ],
  tileTexts: { h: 'healer_wall', r: 'healer_rug' },

  // Nobody to fight.
  npcs: [],
};
