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

// The light off a lump of sea-glass: a small bloom and a pool round it.
const GLASS_GLOW = [{ dy: -8, bloom: 10, strength: 0.45, flicker: 0.1, color: '120, 240, 220' }, { dy: 2, pool: 40, strength: 0.38, flicker: 0.05, color: '120, 240, 220' }];
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
  // After chapter 5 the storm is over (`calmAfter`): the same cave sounds, but the sky in the
  // cave mouth of its fights clears (coastBackdrops.js) and any `_calm` words are used.
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  vesWell: true,

  tiles: [
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.....xx.x..........x.......xx.....#',
    '#......x......................x....#',
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
    '#...;;;....W~~~~~~~~~~~W.......WW;W#',
    '#.;;;;;;;..WWWWWWWWWWWWWWWWWWWWWW;W#',
    '#;;;;;;;;;.W###########W#######W....',
    'Wx;;;;;;;xxW###########W#######W....',
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
    { sprite: 'c5_stone_gap', x: 14, y: 6, text: 'wells_crack', gap: true },
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
    // The sounders' gallery as they left it: their work lantern still on its post, a coil of line,
    // a spare weight, stones down from the roof and the wet coming up through the cracks.
    { sprite: 'c5_lantern_hook', x: 22, y: 2 },
    { sprite: 'c5_rope_coil', x: 12, y: 2, text: 'weight_line', walkable: true },
    { sprite: 'c5_sounding_weight', x: 26, y: 2 },
    { sprite: 'c5_crate', x: 34, y: 2 },
    { sprite: 'c5_rubble', x: 9, y: 3, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 17, y: 4, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 23, y: 4, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 29, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 2, y: 7, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 28, y: 8, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 25, y: 13, flat: true, walkable: true },
    // The cave round the wells: sea-glass and weed along the gallery's wall, rock fallen into
    // the corners of Bramble's pocket so it's a hole in the cave and not a tank, stones at the
    // feet of the yard walls, and the sounders' gear on Ves's side. None of it is in the
    // boulder's way (x 8 to 10, rows 8 to 13), on the currents, or by a windlass.
    { sprite: 'sd_glass_rock', x: 8, y: 2, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_weed_ledge', x: 14, y: 2, text: 'sound_weed_ledge' },
    { sprite: 'sd_scree', x: 18, y: 2, flat: true, walkable: true },
    { sprite: 'sd_rope_ladder', x: 24, y: 2, text: 'sound_rope_ladder' },
    { sprite: 'sd_stalagmites', x: 31, y: 2, text: 'sound_stalagmites' },
    { sprite: 'sd_glass_bed', x: 27, y: 3, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 12, y: 5, flat: true, walkable: true },
    { sprite: 'sd_sea_rock', x: 12, y: 7 },
    { sprite: 'sd_sea_rocks', x: 21, y: 7 },
    { sprite: 'sd_sea_rock', x: 12, y: 15 },
    { sprite: 'sd_sea_rock', x: 22, y: 15 },
    { sprite: 'sd_rock_pile', x: 10, y: 12, text: 'sound_rocks' },
    { sprite: 'sd_scree', x: 9, y: 15, flat: true, walkable: true },
    { sprite: 'sd_stalagmite', x: 1, y: 8, text: 'sound_stalagmites' },
    { sprite: 'sd_timbers', x: 5, y: 14, text: 'sound_timbers' },
    { sprite: 'sd_glass_bed', x: 2, y: 12, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 24, y: 7, flat: true, walkable: true },
    { sprite: 'sd_weed_ledge', x: 29, y: 7, text: 'sound_weed_ledge' },
    { sprite: 'sd_glass_rock', x: 24, y: 12, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_diver_gear', x: 29, y: 14, text: 'sound_diver_gear' },
    { sprite: 'sd_scree', x: 32, y: 18, flat: true, walkable: true },
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
    { sprite: 'col_glass_pink', x: 3, y: 17, walkable: true, flat: true, gives: 'glass_pink', taken: { gone: true } },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_lunch_pail', x: 2, y: 6, text: 'lp_marrow_pail', walkable: true, react: true, gives: 'marrow_pail', taken: { gone: true } },
    { sprite: 'lv_hymn_board', x: 6, y: 3, walkable: true, decor: true },
    { sprite: 'lv_echo_stone', x: 17, y: 3, text: 'lp_echo_stone3', walkable: true },
    { sprite: 'lv_glow_threads', x: 11, y: 3, walkable: true, animation: 'lv_glow_threads', speed: 0.35, decor: true },
    { sprite: 'lv_glow_threads', x: 22, y: 3, walkable: true, animation: 'lv_glow_threads', speed: 0.35, decor: true },
    { sprite: 'lv_cave_fern', x: 33, y: 3, walkable: true, decor: true },
    { sprite: 'lv_cave_fern', x: 2, y: 9, walkable: true, decor: true },
    { sprite: 'lv_midden', x: 4, y: 15, walkable: true, decor: true },
    { sprite: 'lv_pearl_pool', x: 3, y: 11, text: 'lp_pearl_wells', walkable: true },
    { sprite: 'lv_coil_line', x: 10, y: 4, walkable: true, decor: true },
    { sprite: 'lv_hook_lamp', x: 28, y: 5, text: 'lp_hook_lamp_wells', walkable: true },
    { sprite: 'lv_drip_column', x: 32, y: 4, walkable: true, decor: true },
    { sprite: 'lv_candle_stubs', x: 20, y: 5, text: 'lp_candle_wells', flat: true, walkable: true },
    { sprite: 'lv_chalk_arrow', x: 13, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'lv_boot', x: 30, y: 15, text: 'lp_boot_wells', walkable: true },
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
