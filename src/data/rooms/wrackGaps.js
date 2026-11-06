// THE GAPS: a corridor of shingle between two rock walls, and one narrow place with a gate
// across it. The wheel that opens the gate is on a ledge in a pocket of rock-pool north of the
// ridge. The only way into the pocket is a gap under a heap of weed, where only Bramble fits
// (E steers him). Through the gap he wades the shallows to the wheel (it is heavy: only he
// can reach it, because the hero cannot get past the weed) and turns it; the gate opens. R
// brings everyone back together; the reset stump (2,12) does too.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   F  weed pile

export const WRACK_GAPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_gaps',
  // The room's name, for the Room Editor.
  name: 'THE GAPS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  vesWell: true,

  tiles: [
    '######################################',
    '############################~~~~~~~~~#',
    '############################~~~~~~~~~#',
    '#####################WWW####~~~~~~~~~#',
    '#####################...####~~~~~~~~~#',
    '######################;#####~~~~~~~~~#',
    '#########WWWWWWWWWWWWW;#####~~~~~~~~~#',
    '#########.....;;;;;;;;;#####~~~~~~~~~#',
    '#########.....;#############~~~~~~~~~#',
    '#WWWWWWWWWW.WWWWWWWWWWWWWWW#WWWWWWWWW#',
    '#.F........................W,,,,,,,,,#',
    '................x...........,,,,,,,,,#',
    '...;;...................x..#,.........',
    '#...;...............;;.....#,...;.....',
    '#.....x....................#,....F...#',
    '#..........................#.........#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '######################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 11, w: 1, h: 2, to: 'wrack_pools', spawn: { x: 42, y: 9 } },
    { x: 37, y: 12, w: 1, h: 2, to: 'wrack_dunes', spawn: { x: 2, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // The weed gap (Bramble only), the wheel beyond it, the gate it opens, and a stump to start over.
    { sprite: 'c5_seaweed_heap', x: 11, y: 9, text: 'gaps_weed', gap: true },
    { sprite: 'valve_wheel', x: 22, y: 4, text: 'gaps_wheel', lever: 'gaps_gate', by: 'bramble', byText: 'gaps_wheel_heavy' },
    { sprite: 'gate_narrow', x: 27, y: 11, text: 'gaps_gate', opensWith: ['gaps_gate'], openText: 'gaps_gate_open' },
    { sprite: 'rock_stump', x: 2, y: 13, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 5, y: 11, text: 'gaps_sign' },
    { sprite: 'c5_driftwood_tall', x: 18, y: 11, text: 'gaps_driftwood' },
    { sprite: 'c5_barrels', x: 33, y: 14, text: 'landing_barrel' },
    { sprite: 'c5_rope_coil', x: 30, y: 12, text: 'landing_pots', walkable: true },
    { sprite: 'gold_pouch', x: 35, y: 10, text: 'gaps_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'landing_sea', x: 'gaps_rock', F: 'landing_weed', ';': 'gaps_shallows' },

  // A pinwheel in the west corridor (row 13, x 5 to 14), a limpet knight beside the gate
  // (row 13, x 24 to 25) and a shellac east of it (row 14, x 29 to 34). The pocket north of the ridge
  // is empty (Bramble's way). No cutscenes in this room.
  npcs: [
    { enemy: 'pinwheel', x: 8, y: 13, patrol: [5, 14], behaviour: 'wander' },
    { enemy: 'limpet_knight', x: 24, y: 13, patrol: [24, 25], behaviour: 'patrol' },
    { enemy: 'shellac', x: 31, y: 14, patrol: [29, 34], behaviour: 'patrol' },
  ],
};
