// THE OPEN HOUSE: the one house in the square with its door standing open. Inside it is dry.
// The table is laid for four, the chairs pushed back as if everybody had just got up, the
// grandfather clock stopped, four coats and a small hat on the pegs, the plates on the dresser.
// Nobody. The first time in, the scene `merrow_house` plays: a quiet look round, one line from
// Bramble and one from Ves. It is never explained (no note, no diary, no clue). PUZZLE-FREE, no
// monsters (a house). A purse in the teapot on the dresser.
// Tile key: #  the house's walls (solid)   h  inner wall (solid)   o  floorboards

export const MERROW_HOUSE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_house',
  // The room's name, for the Room Editor.
  name: 'THE OPEN HOUSE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  indoors: true,
  // "Bells Under Water", quieter under a roof, with the rain on it.
  music: 'merrowIndoor',
  // An empty house in a drowned place: no talk, no fire, the flood somewhere below.
  ambience: 'drowned_house',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_drowned_house' },
  vesWell: true,

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#######oo#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 11, w: 2, h: 1, to: 'merrow_square', spawn: { x: 5, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene: just inside the door (rows 8 and 9, x 5 to 10,
  // wider than the way in; you arrive on it, so it can't be missed).
  cutscenes: [
    { x: 5, y: 8, w: 6, h: 2, scene: 'merrow_house' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'mw_laid_table', x: 6, y: 5, text: 'house_table' },
    { sprite: 'mw_stopped_clock', x: 13, y: 2, text: 'house_clock' },
    { sprite: 'mw_dresser', x: 2, y: 2, text: 'house_dresser', gold: 80, taken: { sprite: 'mw_dresser', text: 'house_dresser_empty' } },
    { sprite: 'mw_coat_pegs', x: 9, y: 2, text: 'house_pegs' },
    // The hearth, long cold.
    { sprite: 'fireplace_cold', x: 5, y: 2 },
    { sprite: 'c5_doormat', x: 12, y: 9, text: 'house_mat', walkable: true },
    // Lived in (2026-11-08): four mugs on the rail, a window, a sketch; the rug under the table,
    // the cat's bowl still full, the boots by the door. (Clear of merrow_house's walks: Ves 6,10 to
    // 5,6 and Bramble 9,10 to 9,6 cross only the rug, which lies flat.)
    { sprite: 'in_mug_rail', x: 11, y: 1, text: 'in_mhouse_mugs' },
    { sprite: 'in_sketch_light', x: 8, y: 1, text: 'in_mhouse_sketch' },
    { sprite: 'in_window_storm', x: 4, y: 1, text: 'in_mhouse_window', until: 'the_light_answers' },
    { sprite: 'in_window_calm', x: 4, y: 1, text: 'in_mhouse_window', after: 'the_light_answers' },
    { sprite: 'in_rug_red', x: 6, y: 6, text: 'in_mhouse_rug', walkable: true, flat: true },
    { sprite: 'in_cat_bowl', x: 2, y: 9, text: 'in_mhouse_bowl', walkable: true, flat: true },
    { sprite: 'in_boots_dry', x: 10, y: 10, text: 'in_mhouse_boots' },
  ],
  tileTexts: { '#': 'house_wall', h: 'house_wall' },

  // None: a house.
  npcs: [],
};
