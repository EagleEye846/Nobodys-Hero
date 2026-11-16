// THE HIGH STREET: Merrow's main street, a river now. The shop fronts along it are drowned to
// their sills, and the flood runs fast down the street in RACES (currents) either side of the old
// market hall's steps (the island, x 21 to 25), which stand up out of it. Nothing turns the water
// here: the races always run the same way, and the puzzle is reading them. A race carries you till
// something stops it, and only then lets you step off, sideways (Player.rideCurrent).
//   - West half: race A runs east along row 5 from the west quay to the island; race D runs west
//     along row 13 from the island back to the west quay. Plain rides, there and back.
//   - East half: the flood breaks on the drowned roofs standing out of it (B), and each roof is a
//     place where it lets you off. From the island, race E (row 5) runs east and breaks on a roof at
//     (29,5): step off DOWN into a race running south (column 28), which breaks on the roofs at
//     (28,9). Left from there (row 8) runs you back to the island; RIGHT (row 8) runs east and breaks
//     on the roof at (32,8). Down from there (column 31) runs you into the south race and back to
//     the island; UP (column 31) runs you into the last of row 5, which runs out onto the east quay.
//     So: E, down, right, up. Every wrong turn ends on the island, so nothing strands you.
//   - Back from the east quay: race C runs west along row 13 to the island, then D to the west quay.
// Each race is `current_*` props (`flow`), always running. There are no levers (2026-11-10: it was
// a three-lever sluice swapping pairs of races, the Soundings weight room's puzzle; the old file is
// in notes/room-backup-2026-11-10b/).
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  rock top (solid)   7 5 6  shop roofs, fronts and windows (solid)   .  cobbles
//   ;  shallows (and the races)   ~  green floodwater (solid)   J  a bollard   b B  drowned roofs

export const MERROW_HIGH_STREET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_high_street',
  // The room's name, for the Room Editor.
  name: 'THE HIGH STREET',
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
    '#77777777777###777777777777777##7777777#',
    '#777777777777#7777777777777777777777777#',
    '#56565565656556565565656556565655656565#',
    '#.XX..~~~~~~~~~~~~~~~.....~~~B~~~~.XX..#',
    '#.....;;;;;;;;;;;;;;;.....;;;B;;;;.....#',
    '#X....~~~~~~~~~~~~~~~.....~~;~~;~~..q..#',
    '#.q...~~~~~~~~~bb~~~~.....~~;~~;~~.....#',
    '#XX...~~~BBB~~~bBb~~~..J..;;;;;;B~..XX.#',
    '......~~BBBB~~~~~~~~~..::.~BBB~;B~......',
    '......~~~b~~~~~~BB~~~.X...I~bB~;~~......',
    '#.::..~~~~~~~~~~BB~~~.XX..~~~~~;~~.::..#',
    '#O.XX;~~~~~~~~~~~~~~~.....~~~~~;~~.....#',
    '#.....;;;;;;;;;;;;;;;.....;;;;;;;;...X.#',
    '#.q..;~~~~~~~~~~~~~~~;...;~~~~~~~~;....#',
    '#.....~~~~~~~~~~~~~~~~~~~~~~~~~~~~....O#',
    '#;;;;.~~~~~~~~~~~~~~~~~~~~~~~~~~~~;....#',
    '#;;;;;;~~~~~~~~~~~~~~~~~~~~~~~~~~;;;;;;#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'merrow_square', spawn: { x: 37, y: 9 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'merrow_tower_lane', spawn: { x: 2, y: 10 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'sign', x: 4, y: 7, text: 'street_sign' },
    { sprite: 'mw_sign_baker', x: 22, y: 4, text: 'street_hall_sign' },
    { sprite: 'mw_sign_post', x: 35, y: 12, text: 'street_post_sign' },
    { sprite: 'gold_pouch', x: 24, y: 12, text: 'street_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'mw_bubbles', x: 12, y: 9, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.25 },
    { sprite: 'mw_bubbles', x: 30, y: 16, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.28 },
    // What the flood left on the quays: its weed line, puddles, a torn net, stones down off the
    // shop fronts, chimney pots of the drowned houses standing out of the water, and a lamp still
    // lit on its hook on each bit of dry ground.
    { sprite: 'c5_wrack_line', x: 1, y: 15, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 34, y: 15, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 2, y: 9, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 36, y: 10, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 22, y: 13, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 3, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 37, y: 4, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 24, y: 9, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 1, y: 6 },
    { sprite: 'c5_lantern_hook', x: 25, y: 10 },
    { sprite: 'c5_lantern_hook', x: 38, y: 7 },
    { sprite: 'mw_chimney_pots', x: 11, y: 7, text: 'steps_chimney' },
    { sprite: 'mw_chimney_pots', x: 33, y: 10, text: 'steps_chimney' },
    // The races, always running (see the top of the file). West half: A east along row 5, D west along row 13.
    { sprite: 'current_right', x: 6, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 7, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 8, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 9, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 10, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 11, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 12, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 13, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 14, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 15, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 16, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 17, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 18, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 19, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 20, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_left', x: 6, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 7, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 8, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 9, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 10, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 11, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 12, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 13, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 14, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 15, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 16, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 17, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 18, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 19, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 20, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    // East half, from the island: E east along row 5 to the roof at 29.
    { sprite: 'current_right', x: 26, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 27, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 28, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    // ...off it, south down column 28 to the roofs at row 9.
    { sprite: 'current_down', x: 28, y: 6, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 28, y: 7, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 28, y: 8, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    // ...off those, west (row 8, back to the island) or east (row 8, to the roof at 32).
    { sprite: 'current_left', x: 26, y: 8, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 27, y: 8, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_right', x: 29, y: 8, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 30, y: 8, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 31, y: 8, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    // ...off that, north (column 31, into the last of row 5 and out on the east quay) or south (column 31, into race C).
    { sprite: 'current_up', x: 31, y: 6, text: 'street_current', flow: 'up', animation: 'sd_current_up', speed: 0.1 },
    { sprite: 'current_up', x: 31, y: 7, text: 'street_current', flow: 'up', animation: 'sd_current_up', speed: 0.1 },
    { sprite: 'current_right', x: 30, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 31, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 32, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_right', x: 33, y: 5, text: 'street_current', flow: 'right', animation: 'sd_current_right', speed: 0.1 },
    { sprite: 'current_down', x: 31, y: 9, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 31, y: 10, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 31, y: 11, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    { sprite: 'current_down', x: 31, y: 12, text: 'street_current', flow: 'down', animation: 'sd_current_down', speed: 0.1 },
    // Race C, the east quay back to the island along row 13.
    { sprite: 'current_left', x: 26, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 27, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 28, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 29, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 30, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 31, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 32, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    { sprite: 'current_left', x: 33, y: 13, text: 'street_current', flow: 'left', animation: 'sd_current_left', speed: 0.1 },
    // House fronts (2026-11-08): each run of the terrace a row of different houses, the
    // roofline going up and down; all on the solid front row, none in front of the quays.
    { sprite: 'mw_house_parapet', x: 1, y: 3, text: 'front_parapet' },
    { sprite: 'mw_ov_door_arched', x: 3, y: 3, text: 'front_door' },
    { sprite: 'mw_ov_shutters_open', x: 4, y: 3, text: 'front_shutters' },
    { sprite: 'mw_ov_wall_lamp', x: 5, y: 3, text: 'front_lamp', glow: [{ dx: 2, dy: -10, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_shop', x: 6, y: 3, text: 'front_shop' },
    { sprite: 'mw_ov_drainpipe', x: 8, y: 3, text: 'front_pipe' },
    { sprite: 'mw_ov_window_drowned', x: 9, y: 3, text: 'street_window' },
    { sprite: 'mw_ov_window_drowned', x: 11, y: 3, text: 'street_window' },
    { sprite: 'mw_ov_shutters_hanging', x: 11, y: 3, text: 'front_shutters' },
    { sprite: 'mw_house_dutch', x: 12, y: 3, text: 'front_dutch' },
    { sprite: 'mw_ov_window_drowned', x: 14, y: 3, text: 'street_window' },
    { sprite: 'mw_ov_sign_fish', x: 15, y: 3, text: 'front_sign_fish' },
    { sprite: 'mw_ov_shutters_shut', x: 16, y: 3, text: 'front_shutters' },
    { sprite: 'mw_house_narrow', x: 17, y: 3, text: 'front_narrow' },
    { sprite: 'mw_ov_awning_torn', x: 18, y: 3, text: 'front_awning' },
    { sprite: 'mw_ov_drainpipe', x: 20, y: 3, text: 'front_pipe' },
    { sprite: 'mw_house_gable', x: 21, y: 3, text: 'front_gable' },
    { sprite: 'mw_ov_window_box', x: 23, y: 3, text: 'front_window_box' },
    { sprite: 'mw_ov_door_knocker', x: 24, y: 3, text: 'front_door' },
    { sprite: 'mw_ov_drainpipe', x: 25, y: 3, text: 'front_pipe' },
    { sprite: 'mw_ov_awning', x: 26, y: 3, text: 'front_awning' },
    { sprite: 'mw_ov_shutters_shut', x: 28, y: 3, text: 'front_shutters' },
    { sprite: 'mw_ov_door_boarded', x: 29, y: 3, text: 'front_door_boarded' },
    { sprite: 'mw_house_gable_b', x: 30, y: 3, text: 'front_gable' },
    { sprite: 'mw_ov_sign_boot', x: 32, y: 3, text: 'front_sign_boot' },
    { sprite: 'mw_ov_window_drowned', x: 33, y: 3, text: 'street_window' },
    { sprite: 'mw_house_narrow_b', x: 34, y: 3, text: 'front_narrow' },
    { sprite: 'mw_ov_window_bricked', x: 35, y: 3, text: 'front_bricked' },
    { sprite: 'mw_ov_door_hanging', x: 36, y: 3, text: 'front_door_hanging' },
    { sprite: 'mw_ov_shutters_open', x: 37, y: 3, text: 'front_shutters' },
    { sprite: 'mw_ov_drainpipe', x: 38, y: 3, text: 'front_pipe' },
    { sprite: 'mw_dormer', x: 8, y: 2, text: 'merrow_roof' },
    { sprite: 'mw_dormer', x: 27, y: 2, text: 'merrow_roof' },
    { sprite: 'mw_chimney_short', x: 10, y: 2, text: 'merrow_chimney' },
    { sprite: 'mw_chimney_short', x: 36, y: 2, text: 'merrow_chimney' },
    { sprite: 'mw_chimney_short', x: 19, y: 2, text: 'merrow_chimney' },
    // In the flood (2026-11-08): a drowned stall and what floated off it, a lamp still burning
    // in the water, a cart nose-down. All on deep water, clear of the races, the wrackeel's row 11 and the kelpie's row 17.
    { sprite: 'mw_ripples', x: 11, y: 7, text: 'street_water', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_ripples', x: 33, y: 11, text: 'street_water', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_stall_drowned', x: 15, y: 16, text: 'water_stall' },
    { sprite: 'mw_weed_mat', x: 18, y: 17, text: 'street_water', flat: true, walkable: true },
    { sprite: 'mw_crate_drift', x: 14, y: 15, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_crate_drift', x: 19, y: 9, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_weed_mat', x: 18, y: 10, text: 'street_water', flat: true, walkable: true },
    { sprite: 'mw_barrel_bob', x: 30, y: 6, text: 'water_barrel', animation: 'mw_barrel_bob', speed: 0.28 },
    { sprite: 'mw_slates_afloat', x: 27, y: 6, text: 'street_water', flat: true, walkable: true },
    { sprite: 'mw_lamp_leaning', x: 27, y: 16, text: 'water_lamp', glow: [{ dx: 4, dy: -39, bloom: 12, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -4, pool: 50, strength: 0.4, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_cart_sunk', x: 30, y: 15, text: 'water_cart' },
    { sprite: 'mw_weed_mat', x: 33, y: 12, text: 'street_water', flat: true, walkable: true },
    { sprite: 'mw_barrel_bob', x: 7, y: 16, text: 'water_barrel', animation: 'mw_barrel_bob', speed: 0.28 },
    { sprite: 'mw_weed_mat', x: 8, y: 17, text: 'street_water', flat: true, walkable: true },
    // Weed and gutters off the drowned roofs, so they stop reading as boxes.
    { sprite: 'mw_eave_weed', x: 7, y: 10, text: 'street_water' },
    { sprite: 'mw_eave_weed', x: 16, y: 12, text: 'street_water' },
    { sprite: 'mw_eave_weed', x: 29, y: 10, text: 'street_water' },
    { sprite: 'mw_slates_afloat', x: 12, y: 10, text: 'street_water', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 22, y: 17, text: 'street_water', flat: true, walkable: true },
    { sprite: 'mw_crate_drift', x: 24, y: 16, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_slates_afloat', x: 11, y: 15, text: 'street_water', flat: true, walkable: true },
  ],
  tileTexts: { B: 'street_roof', b: 'street_roof', '#': 'merrow_stone', '7': 'merrow_roof', '5': 'street_front', '6': 'street_window', ';': 'street_shallows', '~': 'street_water', J: 'merrow_bollard' },

  // A wrackeel in the flood off the west quay (row 11, x 6 to 12: deep water, two rows clear of
  // race D on row 13 and four of race A), and a kelpie foal wading the shallows at the east
  // quay's foot (row 17, x 35 to 38). Clear of both doors (rows 9-10) and the races'
  // ends. No cutscenes in this room.
  npcs: [
    { enemy: 'wrackeel', x: 9, y: 11, patrol: [6, 12], behaviour: 'patrol' },
    { enemy: 'kelpie_foal', x: 36, y: 17, patrol: [35, 38], behaviour: 'patrol' },
  ],
};
