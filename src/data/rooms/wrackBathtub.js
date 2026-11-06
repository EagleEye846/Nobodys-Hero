// THE BATHTUB: a wide bay of shingle with a mat laid out on it, and a notice. This is the
// Dowager Crab's beach. Step in from the west and the scene the_dowager_crab plays: she hauls
// herself out of her bathtub, insists you wipe your feet (the hero does, on the mat), and is
// then very polite and very angry about trespass. Win her round with manners or beat her: both
// scenes (dowager_spared, dowager_beaten) give the Bathtub Bell and send her back to sea. The
// east end is a pinch with a gate across it and a bell post: with the bell, the scene
// bathtub_gate rings it and the gate swings open onto the boardwalk.
// No monsters here (the boss room).
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass   :  shell path
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   O  boulder   F  weed pile

export const WRACK_BATHTUB = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_bathtub',
  // The room's name, for the Room Editor.
  name: 'THE BATHTUB',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  vesWell: true,
  // The fight has its own song (crabBattle, src/data/music/crabBattleTheme.js).

  tiles: [
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##~#',
    '#;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;##;#',
    '#........x................F...x.....##.#',
    '#....;;.........................;;..##.#',
    '#.....;..........................;..WW.#',
    '..:::::::::::::::::::::::::::::::::::::.',
    '..:::::::::::::::::::::::::::::::::::::.',
    '#...................................##.#',
    '#...................................##.#',
    '#,,,,,,,O,,,,,,,,,,,,,,,,,,,,,,O,,,,##,#',
    '#,,,x,,,,,,,,,,,,,,,,,,,,,,,,,,,,,x,##,#',
    '#,,,,,,,,,,,;;,,,,,,,F,,,,,,,,,,,,,,##,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,##,#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wrack_tide_clock', spawn: { x: 42, y: 9 } },
    { x: 39, y: 8, w: 1, h: 2, to: 'wrack_boardwalk', spawn: { x: 2, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // Stepping in from the west: the Dowager (the whole of the column x 3, rows 4 to 15, so it
    // can't be walked round along the shallows or the grass).
    { x: 3, y: 4, w: 1, h: 12, scene: 'the_dowager_crab' },
    // At the gate, once you have the bell (either way the fight ended).
    { x: 34, y: 8, w: 2, h: 2, scene: 'bathtub_gate', after: 'dowager_beaten' },
    { x: 34, y: 8, w: 2, h: 2, scene: 'bathtub_gate', after: 'dowager_spared' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // The mat, the notices, the gate with its bell post, and a purse. The gate is two props (it
    // closes the two-tile pinch) and goes when the scene bathtub_gate has played.
    { sprite: 'c5_rope_coil', x: 10, y: 9, text: 'bath_mat', walkable: true },
    { sprite: 'sign', x: 6, y: 10, text: 'bath_sign' },
    { sprite: 'sign', x: 33, y: 10, text: 'bath_sign_east' },
    { sprite: 'gate_narrow', x: 37, y: 8, text: 'bath_gate', until: 'bathtub_gate' },
    { sprite: 'gate_narrow', x: 37, y: 9, text: 'bath_gate', until: 'bathtub_gate' },
    // The bell frame stands empty until bathtub_gate hangs the Dowager's bell on it.
    { sprite: 'c5_bell_frame_empty', x: 35, y: 10, text: 'bath_bell_post', until: 'bathtub_gate' },
    { sprite: 'c5_harbour_bell', x: 35, y: 10, text: 'bath_bell_hung', animation: 'c5_harbour_bell', speed: 0.9, after: 'bathtub_gate' },
    { sprite: 'c5_bathtub_wreck', x: 16, y: 13, text: 'bath_spare_tub' },
    { sprite: 'c5_driftwood', x: 24, y: 14, text: 'landing_driftwood' },
    { sprite: 'gold_pouch', x: 3, y: 14, text: 'bath_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'landing_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // None: the Dowager is cast by the scenes (the_dowager_crab, dowager_beaten, dowager_spared).
  npcs: [
  ],
};
