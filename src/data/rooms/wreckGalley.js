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
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  vesWell: true,
  indoors: true,

  tiles: [
    '########################',
    '#WWWWwWWWWWWWWWWWWwWWWW#',
    '#::::::v:::::::::v:::::#',
    '#::::::::::::::::::::::#',
    '#::::::::::::::::::::::#',
    '#::::::::::::::::::::::#',
    '#::::::::::::::::::::::#',
    '::::::::::::::::::::::::',
    '::::::::::::::::::::::::',
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
  ],
  tileTexts: { '#': 'hull_plate', W: 'hull_plate', w: 'galley_porthole', v: 'galley_pans' },

  // None: the cook's galley is a quiet room.
  npcs: [
  ],
};
