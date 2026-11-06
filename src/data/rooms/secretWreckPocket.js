// THE POCKET: the secret of the Wreck Yard, down the hatch in the fog deck's railed-off
// foredeck (Bramble unbolts its gate from inside). A pocket of dry air under the deck,
// where the bosun kept the good things: a diving suit's chest with the BRASS DIVER'S
// PLATE in it, a purse, and the crew's swear jar (full). Indoors, no monsters, no puzzle.
// The ladder at the bottom (7..8, row 9) goes back up to the foredeck.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   W  hull plate (solid)   :  deck planks   ~  bilge (solid)

export const SECRET_WRECK_POCKET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_wreck_pocket',
  // The room's name, for the Room Editor.
  name: 'THE POCKET',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  vesWell: true,
  indoors: true,

  tiles: [
    '################',
    '#WWWWWWWWWWWWWW#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#::~~::::::::::#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#######::#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 9, w: 2, h: 1, to: 'wreck_fog', spawn: { x: 39, y: 4 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    { sprite: 'c5_chest', x: 12, y: 3, text: 'pocket_chest', gives: 'brass_divers_plate', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 2, text: 'pocket_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_barrels', x: 9, y: 2, text: 'pocket_barrels' },
    { sprite: 'sign', x: 6, y: 2, text: 'pocket_note' },
    { sprite: 'c5_rope_coil', x: 11, y: 7, text: 'hull_rope', walkable: true },
    { sprite: 'c5_anchor', x: 2, y: 7, text: 'hull_anchor' },
  ],
  tileTexts: { '#': 'hull_plate', W: 'hull_plate', '~': 'hull_bilge' },

  // None: a secret.
  npcs: [
  ],
};
