// THE ATTIC (a secret): the top floor of a cottage in the drowned hamlet, the only dry room left
// in it. The stairs go down into black water; up here the family's last things are where they
// were carried when the flood came up the stairs a step at a time. A chest under the eaves holds
// the Bellbuoy Mantle (the best magic coat of the chapter), and there is a purse in a teapot.
// Reached from the hamlet's north-west bank (the second rope ring) through the attic window.
// Tile key: #  roof beams (solid)   h  board wall (solid)   o  floorboards   ~  the stairwell's water (solid)

export const SECRET_LANES_ATTIC = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_lanes_attic',
  // The room's name, for the Room Editor.
  name: 'THE ATTIC',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  indoors: true,
  // The Sunken Lanes' song, quieter under a roof, with the rain on it.
  music: 'lanes',
  ambience: 'stilt_inside',
  vesWell: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oo~~ooooooo.#',
    '#oo~~ooooooo.#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######oo######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'lanes_hamlet', spawn: { x: 5, y: 2 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    { sprite: 'c5_chest', x: 10, y: 2, text: 'attic_chest', gives: 'bellbuoy_mantle', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'attic_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_barrels', x: 7, y: 2, text: 'attic_trunks' },
    { sprite: 'c5_rope_coil', x: 9, y: 6, text: 'attic_rope', walkable: true },
    { sprite: 'c5_buoy_red', x: 12, y: 7, text: 'attic_buoy' },
    { sprite: 'lamp_cold', x: 5, y: 2, text: 'attic_lamp' },
  ],
  tileTexts: { '#': 'attic_beams', h: 'attic_wall', '~': 'attic_stairwell' },

  // None: a secret.
  npcs: [],
};
