// THE GALLEY: the cook's room of the big wreck, still dry, still laid for a crew that
// went down forty years ago. The stove is stone cold. The cook is not: he's a ghost, and
// he has not noticed. He floats over his pot stirring nothing, delighted to have diners at
// last. Puzzle-free and no monsters: a laugh, a bowl of chowder (the pot is a gift), a
// menu board, and the crew's places still set. Ves is unimpressed; Bramble likes him.
//
// Stepping in plays the_ghost_cook (once; trigger the column at x 3). The cook stands at
// (15,4) and nobody walks past x 6 in it.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   W  hull plate (solid)   w  porthole (solid)   :  deck planks
//   v  ropes and pans hung from the beams (walk under)

export const WRECK_GALLEY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_galley',
  // The room's name, for the Room Editor.
  name: 'THE GALLEY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Under Her Ribs" (src/data/music/wreckHullsTheme.js): inside the beached wrecks.
  music: 'wreckHulls',
  ambience: 'hulk_storm',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_hulk' },
  vesWell: true,
  indoors: true,

  tiles: [
    '########################',
    '#WWWWwWWWWWWWWWWWWwWWWW#',
    '#::::::v:::::::::v:::::#',
    '#:::::::::::..::..:::::#',
    '#:::::::::.........::::#',
    '#::::::::::.........:::#',
    '#:::::::::::::..:.:::::#',
    '...::::::::::::::::::...',
    '...:::::::::::::::::::..',
    '#::::::::::::::::::::::#',
    '#::::::::::::::::::::::#',
    '#::::::::::::::::::::::#',
    '#::::::::::::::::::::::#',
    '########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'wreck_fog', spawn: { x: 41, y: 9 } },
    { x: 23, y: 7, w: 1, h: 2, to: 'wreck_mast', spawn: { x: 2, y: 16 } },
  ],

  // Stepping in: the cook says hello.
  cutscenes: [
    { x: 3, y: 2, w: 1, h: 11, scene: 'the_ghost_cook' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The cook, over his cold stove, with his pot (a gift: a bowl of chowder, once).
    { sprite: 'c5_galley_stove', x: 14, y: 3, text: 'galley_stove' },
    { sprite: 'wy_ghost_cook', x: 15, y: 4, text: 'galley_cook', cast: 'ghost_cook', animation: 'wy_ghost_cook', speed: 0.4, glow: [{ dx: 0, dy: -14, bloom: 16, strength: 0.5, flicker: 0.2, color: '170, 255, 220' }] },
    { sprite: 'wy_pot', x: 13, y: 4, text: 'galley_pot', gives: 'cockle_chowder', taken: { sprite: 'wy_pot_empty', text: 'galley_pot_empty' } },
    { sprite: 'sign', x: 10, y: 2, text: 'galley_menu' },
    // The crew's table, still laid (no candle: nothing burns in here), and the benches along its near side.
    { sprite: 'wy_crew_table', x: 8, y: 9, text: 'galley_table' },
    { sprite: 'bench', x: 8, y: 10, text: 'galley_bench' },
    { sprite: 'bench', x: 10, y: 10, text: 'galley_bench' },
    { sprite: 'c5_barrels', x: 19, y: 3, text: 'galley_barrels' },
    { sprite: 'c5_barrel', x: 21, y: 11, text: 'galley_barrels' },
    { sprite: 'c5_crates_stack', x: 2, y: 3, text: 'galley_stores' },
    { sprite: 'c5_rope_coil', x: 18, y: 11, text: 'hull_rope', walkable: true },
    // Lived in, once (2026-11-08): the crew's mugs on their rail, pans on hooks, the cook's
    // bottles, tins on a crate, and the ship's cat's bowl, still put out. (All east of x 6 or up
    // on the wall, clear of the_ghost_cook.)
    { sprite: 'in_mug_rail', x: 3, y: 1, text: 'in_galley_mugs' },
    { sprite: 'in_pans_rail', x: 11, y: 1, text: 'in_galley_pans' },
    { sprite: 'in_shelf_bottles', x: 21, y: 1, text: 'in_galley_bottles' },
    { sprite: 'in_tins_crate', x: 22, y: 4, text: 'in_galley_tins' },
    { sprite: 'in_cat_bowl', x: 16, y: 6, text: 'in_galley_bowl', walkable: true, flat: true },
    // The second mess table, laid too, and the lantern they ate by, still lit on its hook; a
    // leak under the porthole, more stores along the walls.
    { sprite: 'wy_crew_table', x: 14, y: 10, text: 'galley_table' },
    { sprite: 'bench', x: 14, y: 11, text: 'galley_bench' },
    { sprite: 'bench', x: 16, y: 11, text: 'galley_bench' },
    { sprite: 'c5_lantern_hook', x: 12, y: 9 },
    { sprite: 'in_shelf_tins', x: 7, y: 1, text: 'in_galley_bottles' },
    { sprite: 'in_oilskin_peg', x: 20, y: 1, text: 'galley_stores' },
    { sprite: 'c5_puddle', x: 17, y: 3, flat: true, walkable: true },
    { sprite: 'c5_crate', x: 22, y: 10, text: 'galley_stores' },
    { sprite: 'c5_barrel', x: 22, y: 3, text: 'galley_barrels' },
    { sprite: 'in_stool_mugs', x: 19, y: 10, text: 'galley_table' },
    { sprite: 'c5_puddle', x: 1, y: 10, flat: true, walkable: true },
    { sprite: 'in_rug_red', x: 3, y: 5, flat: true, walkable: true },
    // (Second pass.) The dark along the foot of the north wall, a scupper's rust under the leak,
    // a sack of the cook's beans gone over by his stores, the crew's sea chests along the south
    // wall, and a grating in the boards over the bilge.
    { sprite: 'wy_rail_shadow', x: 2, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 5, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 8, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 11, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 15, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 18, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 21, y: 2, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 18, y: 2, flat: true, walkable: true },
    { sprite: 'wy_cargo_spill', x: 20, y: 6, flat: true, walkable: true },
    { sprite: 'wy_grating', x: 5, y: 11, flat: true, walkable: true },
    { sprite: 'in_sea_chest_small', x: 8, y: 12, text: 'galley_sea_chests' },
    { sprite: 'in_sea_chest_small', x: 12, y: 12, text: 'galley_sea_chests' },
    { sprite: 'in_boots', x: 13, y: 12, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'hull_plate', W: 'hull_plate', w: 'galley_porthole', v: 'galley_pans' },

  // None: the cook's galley is a quiet room.
  npcs: [
  ],
};
