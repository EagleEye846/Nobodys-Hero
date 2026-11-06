// THE LANDING: the first of the Wrack Shore, and the first green sky. Haddock's boat
// is drawn up in the shallows at the west end, Haddock beside it on the shingle. A
// wide grey beach runs east under a low cliff; out in the bay the sea heaves, and a
// long way off to the north-east, on the skyline, stands the Last Light: a tall
// black lighthouse with a crown of spikes. Puzzle-free, and no monsters (the first
// room of an area): a place to look at the storm. The way on is the east door.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass
//   :  shell path   ;  shallows   j  stepping stones   ~  sea (solid)   x  barnacle rock (solid)
//   O  boulder (solid)   F  weed pile (solid)

export const WRACK_LANDING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_landing',
  // The room's name, for the Room Editor.
  name: 'THE LANDING',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  vesWell: true,
  // The Last Light's foot, on the skyline (src/overworld/atmosphere.js: `lastLight`).
  lastLight: { x: 31, y: 7 },

  tiles: [
    '########################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~;;;;;jj;;;;~~~~~~;;;;~~~~~~~~~~~#',
    '#................................,,,...#',
    '#..O.................................::.',
    '#.....:::::::::::::::::::::::::::::::::.',
    '#,,,,,..............x.x....F..,,,,,O,..#',
    '#,,,,,...F....O......x........,,,,,,,..#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 39, y: 10, w: 1, h: 2, to: 'wrack_pools', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // Haddock and the Bother, tied to a post at the west end, until the Dowager's room
    // (then he has rowed round to Saltcombe, where the Bother is at the quay).
    { sprite: 'cf_haddock', x: 8, y: 9, npc: 'haddock_wrack', animation: 'cf_haddock', speed: 0.5, until: 'the_dowager_crab' },
    { sprite: 'cf_bother_moored', x: 2, y: 8, text: 'landing_bother', animation: 'cf_bother_moored', speed: 0.5, until: 'the_dowager_crab' },
    { sprite: 'sign', x: 12, y: 10, text: 'landing_sign' },
    { sprite: 'c5_driftwood', x: 16, y: 12, text: 'landing_driftwood' },
    { sprite: 'c5_lobster_pots', x: 19, y: 10, text: 'landing_pots' },
    { sprite: 'c5_tattered_flag', x: 26, y: 10, text: 'landing_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_seaweed_heap_big', x: 24, y: 13, text: 'landing_weed' },
    { sprite: 'c5_buoy_red', x: 30, y: 10, text: 'landing_buoy' },
    { sprite: 'c5_snapped_mast', x: 36, y: 10, text: 'landing_mast' },
    { sprite: 'c5_barrel', x: 32, y: 13, text: 'landing_barrel' },
    { sprite: 'gold_pouch', x: 3, y: 13, text: 'landing_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'landing_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // None: the first room of an area.
  npcs: [
  ],
};
