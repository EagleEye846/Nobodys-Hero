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
  music: 'lanesIndoor',
  // An empty house in a drowned place: no talk, no fire, the flood somewhere below.
  ambience: 'drowned_house',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_drowned_house' },
  vesWell: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#ooooooooooo##',
    '#oooooooooooo#',
    '#oo~~ooooooo.#',
    '#oo~~ooooooo.#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '##oooooooooo##',
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
    // QUEST PIECE 1 (the Fair Return's compass glass): a brass-rimmed glass in a teacup on the sill, only found by people who looked in a flooded house's attic.
    { sprite: 'gs_compass_glass', x: 6, y: 5, text: 'attic_compass', gives: 'compass_glass', taken: { gone: true } },
    { sprite: 'c5_chest', x: 10, y: 2, text: 'attic_chest', gives: 'bellbuoy_mantle', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'attic_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_barrels', x: 7, y: 2, text: 'attic_trunks' },
    { sprite: 'c5_rope_coil', x: 9, y: 6, text: 'attic_rope', walkable: true },
    { sprite: 'c5_buoy_red', x: 12, y: 7, text: 'attic_buoy' },
    { sprite: 'lamp_cold', x: 5, y: 2, text: 'attic_lamp' },
    // Lived in, once (2026-11-08): what somebody put up here to keep dry. A ship in a bottle and a
    // sketch on the wall, a little sea chest with a blanket on it, a pair of boots in the corner.
    { sprite: 'in_bottle_ship', x: 6, y: 1, text: 'in_attic_ship' },
    { sprite: 'in_sketch_boat', x: 11, y: 1, text: 'in_attic_sketch' },
    { sprite: 'in_sea_chest_small', x: 11, y: 8, text: 'in_attic_chest' },
    { sprite: 'in_boots_dry', x: 1, y: 2, text: 'in_attic_boots' },

    // (2026-11-09) The roof gives at the eaves now (the corners are beams), a pail under the
    // leak (its drip in touches.js), a chair set by the stairwell to watch the water come up,
    // and a plant somebody carried up and then forgot to water, in a house full of water.
    { sprite: 'sc_leak_bucket', x: 8, y: 4, text: 'in_attic_bucket' },
    { sprite: 'armchair', x: 5, y: 5, text: 'in_attic_chair' },
    { sprite: 'in_plant_pot', x: 1, y: 4, text: 'in_attic_plant' },
  ],
  tileTexts: { '#': 'attic_beams', h: 'attic_wall', '~': 'attic_stairwell' },

  // None: a secret.
  npcs: [],
};
