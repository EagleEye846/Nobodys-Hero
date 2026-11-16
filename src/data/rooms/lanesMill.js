// THE MILL: the hamlet's old water mill, its race still running fast and deep down the middle of
// the yard (one footbridge over it). The way on is a narrow gate in the east wall, and the gate
// is the mill's tail gate: it hangs from three paddles, and each paddle is held up by its own
// wheel. Let go of one and the gate drops. So it's a TRIO SPLIT: all three of you hold a wheel at
// once, and the hero's wheel is right beside the gate, so he can step from it straight through.
//   - The hero's wheel (plate 32,14), at the gate (33,14).
//   - Bramble's wheel (plate 26,3), in the sluice pit; the only way in is a hole in the pit wall
//     (26,6) that only a small body fits (E steers him).
//   - Ves's wheel (plate 17,11), on the far bank of the race beside the old mill wheel; its spokes
//     are rusted stiff, and it wants an umbrella crook through them (Q steers her).
// With all three held the gate rises; step off the plate into the gate and you're through (it
// won't drop on someone standing in it). Then R brings the other two through to you. The stump
// (2,3) puts everyone back at the door if it goes wrong.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   .  cobbles   :  mud   q  shingle
//   ~  the race and the pond (solid)   ;  shallows   g  footbridge   5 6 7 8  the mill house
//   x  barnacle rock   O  boulder   F  weed

export const LANES_MILL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_mill',
  // The room's name, for the Room Editor.
  name: 'THE MILL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  tiles: [
    '########################################',
    '#WW####WWWW###WWWWWWWWWWWWWWWWWWWWW##WW#',
    '#,,W##W,,,,WWW,,,,~~~..#qqqqq#...#,WW,,#',
    '#,,,WW,,,,,,,,,,,,~~~..#qqqqq#x..#,,,,,#',
    '::::::::::::::::::ggg..#qqqqq#...#,,,,,#',
    '::::::::::::::::::ggg..#qqqqq#...#:::::#',
    '#..,.:..,,..:...,.~~~..###.###...#:::::#',
    '#,,,,,,,,77777777,~~~..........F.#,:O:,#',
    '#,,,,,,,,55555555,~~~..::......F.#,:::.#',
    '#,,,,,,,,55655655,~~~.::.....,,..#.::,,#',
    '#,,,,,,,,55585555,~~~x:......,,..#,:::,#',
    '#,,,.,,,,,,,,,,,,,~~~......;;.,,.#:::.,#',
    '#,,,,,,::,,,,,,,,,~~~,......;....#::::,#',
    '#x;;;;;;,:,,,,,,,,~~~............#::::::',
    '#,~~~~~~~,,,,,,,,,~~~..,,,........::::::',
    '#,~~~~~,,,,,,,,,,,~~~.,,,,,......#,:::.#',
    '#,,~~~~,,,,,,,,,,,~~~.O,,,,......#,.:F:#',
    '#x,,,,,,,,,,,,,,x,~~~x....,,,...O#,,:x,#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 4, w: 1, h: 2, to: 'lanes_hamlet', spawn: { x: 41, y: 4 } },
    { x: 39, y: 13, w: 1, h: 2, to: 'lanes_bubble', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The three wheels, each with the plate you stand on to hold it, and the tail gate they hold up.
    { sprite: 'c5_sluice_wheel', x: 32, y: 13, text: 'mill_wheel_hero' },
    { sprite: 'treadle', x: 32, y: 14, text: 'mill_plate_hero', treadle: 'mill_h', who: 'hero' },
    { sprite: 'c5_sluice_wheel', x: 26, y: 2, text: 'mill_wheel_bramble' },
    { sprite: 'treadle', x: 26, y: 3, text: 'mill_plate_bramble', treadle: 'mill_b', who: 'bramble' },
    { sprite: 'c5_sluice_wheel', x: 17, y: 10, text: 'mill_wheel_ves' },
    { sprite: 'treadle', x: 17, y: 11, text: 'mill_plate_ves', treadle: 'mill_v', who: 'vesper' },
    { sprite: 'gate_narrow', x: 33, y: 14, text: 'mill_gate', opensWith: ['mill_h', 'mill_v', 'mill_b'], openText: 'mill_gate_open', jamsOpen: true },
    // The hole into the sluice pit (a small body only), and a chest in the pit.
    { sprite: 'c5_stone_gap', x: 26, y: 6, text: 'mill_hole', gap: true },
    { sprite: 'c5_chest', x: 24, y: 2, text: 'mill_chest', gives: 'winkle_skewer', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    // The old mill wheel in the race, turning.
    { sprite: 'c5_mill_wheel', x: 18, y: 9, text: 'mill_millwheel', animation: 'c5_mill_wheel', speed: 0.35 },
    { sprite: 'rock_stump', x: 2, y: 3, text: 'mill_stump', rockReset: true },
    { sprite: 'sign', x: 4, y: 6, text: 'mill_sign' },
    { sprite: 'sign', x: 30, y: 15, text: 'mill_gate_sign' },
    { sprite: 'street_lamp', x: 22, y: 7, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 35, y: 12, text: 'fork_lamp' },
    { sprite: 'c5_barrels', x: 13, y: 12, text: 'mill_sacks' },
    { sprite: 'gold_pouch', x: 37, y: 3, text: 'mill_pouch', gold: 70, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (2026-11-08): the night the race burst its banks. Sandbags at the mill door, the
    // flood's line of weed across the yard, stones knocked out of the pit wall (Bramble's hole),
    // a net torn off the pond and left on the grass, and a lantern on a hook by the pond.
    { sprite: 'c5_sandbags', x: 14, y: 11 },
    { sprite: 'c5_wrack_line', x: 24, y: 12, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 6, y: 9, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 27, y: 7, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 9, y: 15, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 8, y: 13 },
    { sprite: 'c5_puddle', x: 28, y: 9, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 35, y: 9, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 22, y: 16, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 35, y: 16, flat: true, walkable: true },
    { sprite: 'c5_barrel', x: 21, y: 15 },
    { sprite: 'c5_gull_marks', x: 30, y: 6, flat: true, walkable: true },
    // Second pass: the mill's field south of the house (off Ves's way down to her plate), with a
    // spare millstone and a cart that lost a wheel; reeds and weed on the pond; the washing
    // still out; moss coming up between the yard's cobbles.
    { sprite: 'cart_broken', x: 10, y: 16, text: 'dress_mill_cart' },
    { sprite: 'grindstone', x: 14, y: 16, text: 'dress_millstone' },
    { sprite: 'mw_laundry_line', x: 2, y: 10, text: 'dress_washing' },
    { sprite: 'sy_reeds', x: 8, y: 14, text: 'dress_reeds' },
    { sprite: 'sy_reeds', x: 2, y: 16, text: 'dress_reeds' },
    { sprite: 'ln_lily_mat_b', x: 3, y: 16, flat: true, walkable: true },
    { sprite: 'ln_lily_small', x: 6, y: 14, flat: true, walkable: true },
    { sprite: 'ln_moss_a', x: 22, y: 13, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 29, y: 16, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 25, y: 10, flat: true, walkable: true },
    { sprite: 'ln_wall_weed', x: 23, y: 6, flat: true, walkable: true },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_sign_bakery', x: 10, y: 4, text: 'lp_flour_sign' },
    { sprite: 'lv_milestone', x: 29, y: 15, text: 'lp_milestone_mill' },
    { sprite: 'lv_bench', x: 5, y: 9, text: 'lp_bench_mill' },
    { sprite: 'lv_barrow', x: 14, y: 6, text: 'lp_barrow_mill' },
    { sprite: 'lv_lunch_pail', x: 36, y: 8, text: 'lp_worm_tin', react: true, gives: 'lane_worm', taken: { gone: true } },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'mill_race', 5: 'mill_house', 6: 'mill_window', 7: 'mill_house', 8: 'mill_door', g: 'mill_bridge', x: 'lanes_stone', O: 'lanes_stone', F: 'fork_weed', ';': 'fork_shallows' },

  // A PAIR at the pond in the south-west: a wrackeel in the deep water (row 15, x 3 to 6) and a net
  // wraith hanging over the pond's shallow edge just north of it (row 13, x 3 to 6), two rows apart,
  // so they fight together. Both keep well away from the three plates, the hole, the gate, the stump
  // and the doors, and from Ves's way to her plate. No cutscenes in this room.
  // AMBUSH: the wrackeel lies under the pond (4,15) and bursts out when you come within two and a
  // half tiles (bubbles come up over it, and now and then a fin: `look: 'eel_pond'`, src/overworld/
  // hideouts.js). Only the pond's own shallow edge (rows 12 to 16, x 1 to 7) is that close.
  npcs: [
    { enemy: 'wrackeel', x: 4, y: 15, patrol: [4, 4], behaviour: 'burrow', look: 'eel_pond', reach: 2.5 },
    { enemy: 'net_wraith', x: 5, y: 13, patrol: [3, 6], behaviour: 'patrol' },
  ],
};
