// THE DROWNED SQUARE: Merrow's market square, the top half still above the water and the bottom
// half going down into it: the market cross, the well, the baker's and the post office signs,
// terraced houses round three sides. Everything is just where it was left. One house door is
// standing OPEN (5,4): it goes into merrow_house. PUZZLE-FREE: a fight room (a pack of three).
//
// THE SECRET (the bell tune, optional): in front of the old ringers' hall stand three practice
// bells on posts (low 17,7; middle 18,7; high 19,7) under the ringers' frame. They ring G4, C5
// and D5 (src/overworld/chimes.js, set `merrow`). Ring them the way the town's tower rings in
// the song (the peal you hear about every half minute: G C C D, so low, middle, middle, high) and
// the bar on the ringers' hall door (14,4, two wide) lifts on its own: up to the ringers' loft
// (secret_merrow_ringers). A wrong bell clinks and the tune starts over. The frame's words only
// hint ("They ring it the way the tower does"); the song is the clue.
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  rock top (solid)   7 5 6  house roof, wall, window (solid)   D  a doorway
//   :  flagstones   .  cobbles   ;  shallows (walk)   ~  green floodwater (solid)   J  a bollard

export const MERROW_SQUARE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_square',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED SQUARE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  // "Bells Under Water", and the storm over the water under it.
  music: 'merrow',
  ambience: 'drowned_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_drowned_town', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // No wreck masts or hulls on the skyline: the water here is the drowned town, not the open sea.
  skyline: false,

  tiles: [
    '########################################',
    '#77##777#777777777777#77777###777777777#',
    '#7777777#777777777777#777777#7777777777#',
    '#7777777#777777777777#77777777777777777#',
    '#5656D65#56565DD56565#56556565656565656#',
    '#::::::::::::::::::::::::::::::::::::::#',
    '#......................................#',
    '#......................................#',
    '#.............:::::.:::::::...........O#',
    '............::::::::::::::::............',
    '............::::::::::::::::............',
    '#........J..::::::::::::::::..J........#',
    '#;;..........:::::::::::::..........;;.#',
    '#;;;...;;;................;;;;;....;;;;#',
    '#O;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;~~#',
    '#~~~;;;;;;;;;;;;;;;;;~~~~;;;;;;;;;~~~~~#',
    '#~~~~~~~~~;;;;;;;~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~;;;;;~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~;;;;~~~~~~~~~~~~~~~BBB~~~~~~#',
    '#~~~BB~~~~~~~~~~~~~~~~~~~~~~~BBBB~~~~~~#',
    '#~~BBB~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'merrow_rooftops', spawn: { x: 37, y: 9 } },
    // The high street waits for the open house (merrow_house): until then the way east turns
    // you back with a look at its door. A save already past the tower lane goes through.
    { x: 39, y: 9, w: 1, h: 2, to: 'merrow_high_street', spawn: { x: 2, y: 9 }, after: ['merrow_house', 'tower_lane_grate'], notYet: 'square_house_not_yet' },
    // The open door.
    { x: 5, y: 4, w: 1, h: 1, to: 'merrow_house', spawn: { x: 7, y: 9 } },
    // The ringers' hall, behind its barred door (the bar lifts when the peal is rung).
    { x: 14, y: 4, w: 2, h: 1, to: 'secret_merrow_ringers', spawn: { x: 6, y: 7 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    // The ringers' hall door: barred until the bells are rung in the tower's order (listed
    // first, so Z finds it while it's shut). The open look stands under it (walkable), so the
    // doorway shows the door swung back once it's open.
    { sprite: 'mw_tower_door', x: 14, y: 4, text: 'square_ringers_door', opensWith: ['merrow_peal'] },
    { sprite: 'mw_tower_door_open', x: 14, y: 4, text: 'square_ringers_open', walkable: true },
    // The practice bells and their frame.
    { sprite: 'mw_ringers_frame', x: 17, y: 6, text: 'square_frame' },
    { sprite: 'mw_bell_low', x: 17, y: 7, text: 'square_bell_low', chime: { set: 'merrow', note: 0 } },
    { sprite: 'mw_bell_mid', x: 18, y: 7, text: 'square_bell_mid', chime: { set: 'merrow', note: 1 } },
    { sprite: 'mw_bell_high', x: 19, y: 7, text: 'square_bell_high', chime: { set: 'merrow', note: 2 } },
    // The square.
    { sprite: 'mw_market_cross', x: 19, y: 10, text: 'square_cross' },
    { sprite: 'mw_well', x: 13, y: 11, text: 'square_well' },
    { sprite: 'mw_sign_baker', x: 25, y: 5, text: 'square_baker' },
    { sprite: 'mw_sign_post', x: 33, y: 5, text: 'square_post' },
    { sprite: 'mw_laundry_line', x: 2, y: 7, text: 'square_washing' },
    { sprite: 'gold_pouch', x: 37, y: 6, text: 'square_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'mw_bubbles', x: 20, y: 17, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.26 },
    // House fronts (2026-11-08): the terraces round the square as different houses, the roofline
    // going up and down; on the solid front row only, both doorways (5,4 and 14,4) left bare.
    { sprite: 'mw_house_gable_c', x: 1, y: 4, text: 'front_gable' },
    { sprite: 'mw_ov_drainpipe', x: 3, y: 4, text: 'front_pipe' },
    { sprite: 'mw_ov_window_box', x: 4, y: 4, text: 'front_window_box' },
    { sprite: 'mw_ov_shutters_open', x: 6, y: 4, text: 'front_shutters' },
    { sprite: 'mw_ov_wall_lamp', x: 7, y: 4, text: 'front_lamp', glow: [{ dx: 2, dy: -10, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_narrow', x: 9, y: 4, text: 'front_narrow' },
    { sprite: 'mw_ov_shutters_shut', x: 10, y: 4, text: 'front_shutters' },
    { sprite: 'mw_ov_sign_boot', x: 11, y: 4, text: 'front_sign_boot' },
    { sprite: 'mw_ov_window_bricked', x: 12, y: 4, text: 'front_bricked' },
    { sprite: 'mw_ov_drainpipe', x: 13, y: 4, text: 'front_pipe' },
    { sprite: 'mw_ov_wall_lamp', x: 16, y: 4, text: 'front_lamp', glow: [{ dx: 2, dy: -10, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_ov_shutters_shut', x: 17, y: 4, text: 'front_shutters' },
    { sprite: 'mw_ov_window_box', x: 19, y: 4, text: 'front_window_box' },
    { sprite: 'mw_ov_door_knocker', x: 20, y: 4, text: 'front_door' },
    { sprite: 'mw_house_parapet_b', x: 22, y: 4, text: 'front_parapet' },
    { sprite: 'mw_ov_door_arched', x: 24, y: 4, text: 'front_door' },
    { sprite: 'mw_ov_awning', x: 25, y: 4, text: 'front_awning' },
    { sprite: 'mw_ov_drainpipe', x: 27, y: 4, text: 'front_pipe' },
    { sprite: 'mw_house_shop', x: 28, y: 4, text: 'front_shop' },
    { sprite: 'mw_ov_shutters_open', x: 30, y: 4, text: 'front_shutters' },
    { sprite: 'mw_ov_sign_fish', x: 31, y: 4, text: 'front_sign_fish' },
    { sprite: 'mw_house_gable', x: 32, y: 4, text: 'front_gable' },
    { sprite: 'mw_ov_shutters_hanging', x: 34, y: 4, text: 'front_shutters' },
    { sprite: 'mw_ov_door_boarded', x: 35, y: 4, text: 'front_door_boarded' },
    { sprite: 'mw_ov_window_bricked', x: 36, y: 4, text: 'front_bricked' },
    { sprite: 'mw_house_narrow_b', x: 37, y: 4, text: 'front_narrow' },
    { sprite: 'mw_ov_shutters_open', x: 38, y: 4, text: 'front_shutters' },
    { sprite: 'mw_dormer', x: 11, y: 3, text: 'merrow_roof' },
    { sprite: 'mw_dormer', x: 26, y: 3, text: 'merrow_roof' },
    { sprite: 'mw_chimney_short', x: 6, y: 2, text: 'merrow_chimney' },
    { sprite: 'mw_chimney_short', x: 24, y: 2, text: 'merrow_chimney' },
    { sprite: 'mw_chimney_short', x: 35, y: 2, text: 'merrow_chimney' },
    { sprite: 'mw_chimney_pots', x: 18, y: 3, text: 'steps_chimney' },
    // The square after the flood: its weed line, puddles, barrels and a crate by the fronts (row 5,
    // clear of both doorways' steps), a lamp on its post by the laundry.
    { sprite: 'c5_barrels', x: 9, y: 5, text: 'square_barrels' },
    { sprite: 'c5_crate', x: 11, y: 5, text: 'square_barrels' },
    { sprite: 'c5_sandbags', x: 22, y: 5 },
    { sprite: 'c5_lantern_hook', x: 8, y: 8, text: 'front_lamp' },
    { sprite: 'c5_puddle', x: 9, y: 8 },
    { sprite: 'c5_gull_marks', x: 10, y: 6 },
    { sprite: 'c5_wrack_line', x: 3, y: 12 },
    { sprite: 'c5_wrack_line', x: 22, y: 12 },
    { sprite: 'c5_wrack_line', x: 31, y: 13 },
    { sprite: 'c5_puddle', x: 30, y: 7 },
    { sprite: 'c5_rubble', x: 36, y: 5 },
    { sprite: 'c5_net_torn', x: 24, y: 8 },
    { sprite: 'c5_crab_trail', x: 6, y: 11 },
    // In the water: a drowned stall, a cart, a lamp still burning; clear of the pack (x 26 to 33, rows 12 to 15).
    { sprite: 'mw_stall_drowned', x: 5, y: 17, text: 'water_stall' },
    { sprite: 'mw_crate_drift', x: 9, y: 18, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_weed_mat', x: 7, y: 19, text: 'square_water', flat: true, walkable: true },
    { sprite: 'mw_eave_weed', x: 3, y: 18, text: 'square_water' },
    { sprite: 'mw_cart_sunk', x: 22, y: 16, text: 'water_cart' },
    { sprite: 'mw_lamp_leaning', x: 27, y: 17, text: 'water_lamp', glow: [{ dx: 4, dy: -39, bloom: 12, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -4, pool: 50, strength: 0.4, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_weed_mat', x: 24, y: 18, text: 'square_water', flat: true, walkable: true },
    { sprite: 'mw_barrel_bob', x: 35, y: 19, text: 'water_barrel', animation: 'mw_barrel_bob', speed: 0.28 },
    { sprite: 'mw_eave_weed', x: 30, y: 17, text: 'square_water' },
    { sprite: 'mw_slates_afloat', x: 33, y: 17, text: 'square_water', flat: true, walkable: true },
    { sprite: 'mw_ripples', x: 20, y: 17, text: 'square_water', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_weed_mat', x: 15, y: 19, text: 'square_water', flat: true, walkable: true },
  ],
  tileTexts: { '#': 'merrow_stone', '7': 'merrow_roof', '5': 'merrow_house', '6': 'square_window', D: 'square_doorway', ';': 'square_shallows', '~': 'square_water', J: 'merrow_bollard' },

  // A PACK in the south-east, where the square goes down into the water: a shellac on the
  // cobbles (row 12, x 29 to 33), a net wraith over the shallows (home 28,13) and a salt shade
  // in them (row 15, x 26 to 30), close enough to come as three. Clear of the east door (rows
  // 9-10), the bells and the doors on the north side, and the pouch. No cutscenes in this room.
  npcs: [
    { enemy: 'shellac', x: 31, y: 12, patrol: [29, 33], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 28, y: 13, patrol: [27, 30], behaviour: 'wander' },
    { enemy: 'salt_shade', x: 28, y: 15, patrol: [26, 30], behaviour: 'patrol' },
  ],
};
