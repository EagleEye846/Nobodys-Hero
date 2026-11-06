// THE THREE WELLS: a gallery above three old sounding wells, each with its own windlass, sunk
// through the rock to the sea. Behind the last of them, the sluice that floods or drains the
// Drowned Chapel, and a chute down to the Echo Hall. A TRIO room: each of you works a well.
//   - The HERO's well (west yard): a boulder (9,9) shoved onto the plate by it (8,13) holds its
//     windlass down for good while it sits there: push it west once, then south four times.
//   - BRAMBLE's well: through a crack in the gallery wall (14,6) only he fits, and a current takes
//     him down and round the pocket to his plate (19,13). While he stands on it his windlass holds
//     the grille to Ves's side open (25,6). The current only goes one way: R brings him back.
//   - VES's well: through that grille, a windlass too high and too stiff for anyone without a crook
//     on the end of an umbrella (27,10, `high`). Once she has wound it up, it stays.
// With the hero's boulder down and Ves's windlass up, the last grille (33,6) lifts: the CHAPEL
// SLUICE wheel (34,8) drains the Drowned Chapel (`group: 'soundings_chapel'`, LOW), and the chute
// (x 33, rows 10 to 16, a current) runs down to a door into the Echo Hall's south-east corner. The
// chute can't be climbed; coming in from the hall by that door, you can only go back out.
// The stump (1,3) puts every rock and everyone back. The tide here is a formality: this room has
// no water that moves (the wheel needs a tide to belong to), so the gauge is off.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   ;  shallows (and the currents)
//   ~  the wells and the pocket's water (solid)   x  glowing sea-glass (solid)

export const SOUNDINGS_THREE_WELLS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_three_wells',
  // The room's name, for the Room Editor.
  name: 'THE THREE WELLS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  tiles: [
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#........x..........x..............#',
    '#.............................x....#',
    '...................................#',
    '...................................#',
    '#W.........WWW.WWWWWWWWWW.WWWWWWW.W#',
    '#..........W~~.~~~~~~~~W.......W...#',
    '#..........W~~;~~~~~~~~W.......W...#',
    '#.x........W~~;~~~~~~~~W.......W...#',
    '#..x..x....W~~;~~~~~~~~W.......WW;W#',
    '#...~~.....W~~;~~~~...~W...~~x.WW;W#',
    '#...~~.....W~~;~~~~...~W...~~..WW;W#',
    '#..x..x....W~~;;;;;...~W..x..x.WW;W#',
    '#..........W~~~~~~~...~W.......WW;W#',
    '#..........W~~~~~~~~~~~W.......WW;W#',
    '#;;;;;;;;;;WWWWWWWWWWWWWWWWWWWWWW;W#',
    '#;;;;;;;;;;W###########W#######W....',
    'W;;;;;;;;;;W###########W#######W....',
    '####################################',
  ],

  // No water moves in this room; the tide is here so the chapel sluice (a tide wheel for another
  // group) has a room tide to belong to. The low map is the same as the high one.
  tide: {
    start: 'high',
    hud: false,
    low: [
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    '                                    ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 4, w: 1, h: 2, to: 'soundings_tide_stair', spawn: { x: 27, y: 2 } },
    // The chute's foot: down to the Echo Hall's south-east corner (the shortcut back).
    { x: 35, y: 17, w: 1, h: 2, to: 'soundings_echo_hall', spawn: { x: 41, y: 17 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    // The hero's well: its windlass, the plate and the boulder.
    { sprite: 'sd_windlass', x: 4, y: 10, text: 'wells_windlass_hero' },
    { sprite: 'treadle', x: 8, y: 13, text: 'wells_plate_hero', treadle: 'wh' },
    { sprite: 'push_rock', x: 9, y: 9, text: 'wells_boulder', rock: true },
    // Bramble's: the crack, his plate, his windlass.
    { sprite: 'kid_gap', x: 14, y: 6, text: 'wells_crack', gap: true },
    { sprite: 'treadle', x: 19, y: 13, text: 'wells_plate_bramble', treadle: 'wb', who: 'bramble' },
    { sprite: 'sd_windlass', x: 20, y: 11, text: 'wells_windlass_bramble' },
    { sprite: 'gate_narrow', x: 25, y: 6, text: 'wells_grille_ves', opensWith: ['wb'], openText: 'wells_grille_ves_open' },
    // Ves's: the stiff windlass she winds with her umbrella.
    { sprite: 'sd_windlass', x: 27, y: 10, text: 'wells_windlass_ves', lever: 'wv', high: true },
    // The last grille, the chapel sluice beyond it, and the chute.
    { sprite: 'gate_narrow', x: 33, y: 6, text: 'wells_grille_last', opensWith: ['wh', 'wv'], openText: 'wells_grille_last_open' },
    { sprite: 'c5_sluice_wheel', x: 34, y: 8, text: 'wells_sluice', tideWheel: { to: 'low', group: 'soundings_chapel', text: 'wells_sluice_turn' } },
    { sprite: 'sign', x: 32, y: 8, text: 'wells_chute_sign' },
    { sprite: 'rock_stump', x: 1, y: 3, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 3, y: 2, text: 'wells_sign' },
    { sprite: 'c5_stalactite_drip', x: 16, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'gold_pouch', x: 29, y: 15, text: 'wells_pouch', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 33, y: 18, text: 'wells_chute_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Bramble's current round the pocket, and the chute.
    { sprite: 'current_down', x: 14, y: 8, text: 'wells_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 14, y: 9, text: 'wells_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 14, y: 10, text: 'wells_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 14, y: 11, text: 'wells_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 14, y: 12, text: 'wells_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_right', x: 14, y: 13, text: 'wells_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 15, y: 13, text: 'wells_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 16, y: 13, text: 'wells_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 17, y: 13, text: 'wells_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 18, y: 13, text: 'wells_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 10, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 11, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 12, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 13, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 14, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 15, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 33, y: 16, text: 'wells_chute', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'wells_water', ';': 'wells_shallows', x: 'sound_glass' },

  // A kelpie foal wading the shallow pool in the hero's yard (row 17, x 2 to 9: shallows, so it
  // wades rather than walks on water), well south of the boulder's column (x 8, rows 9 to 13) and
  // the plate; and a net wraith on Ves's side (row 15, x 24 to 26), clear of the grille (25,6) and
  // her windlass (27,10). Nothing in the gallery, the pocket or the chute. No cutscenes here.
  npcs: [
    { enemy: 'kelpie_foal', x: 5, y: 17, patrol: [2, 9], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 25, y: 15, patrol: [24, 26], behaviour: 'patrol' },
  ],
};
