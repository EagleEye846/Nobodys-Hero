// THE TOWER LANE: the lane under Merrow's bell tower, the flood lapping along its north side.
// The tower's porch door (17,6, two wide) is barred from the inside. The only other way in is the
// old flood grating at the waterline beside it (20,6): its bars rusted out, just big enough for
// somebody ten years old, and full of sea. BRAMBLE'S MOMENT:
//   - Walking up the lane, the scene `tower_lane_grate` plays (the trigger is the whole of
//     column 12, so it can't be walked round): Ves sees it's a Bramble-sized hole; Bramble
//     doesn't want to.
//   - Press E and walk Bramble through it yourself: into the water at (20,7), through the grating
//     (a `gap`, he alone fits), along the drain (20,5) into the porch, and lift the bar (16,5,
//     `by: 'bramble'`, lever `tower_bar`) from (17,5). The door (a gate, `opensWith:
//     ['tower_bar']`) swings open.
//   - R brings everyone together (Bramble walks out through the open door). Step onto the tiles
//     in front of the door (x 16 to 19, rows 7-8, `when: 'tower_bar'`) and `tower_lane_soaked`
//     plays: he comes back soaked through and pleased with himself; Ves says one nice thing.
// Then in at the door, through the porch, and up by its inner door (17,2) into the bell tower.
// No soft lock: R (or Z beside him) always brings Bramble back, and the stump (3,13) puts all
// three back at the west door. The bar stays lifted once it's lifted.
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  the tower's masonry and the town wall (solid)   W  dressed stone face (solid)
//   :  flagstones   .  cobbles   ;  shallows (walk)   ~  green floodwater (solid)   J  a bollard
//   7  slate roofs   5 6  house fronts (wall, window): the terraces lining the lane (all solid)

export const MERROW_TOWER_LANE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_tower_lane',
  // The room's name, for the Room Editor.
  name: 'THE TOWER LANE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  // "Bells Under Water", and the storm over the water under it.
  music: 'merrow',
  ambience: 'drowned_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_drowned_town', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // The porch (x 16 to 20, rows 2 to 5, and the doorway): its front wall and door go see-through while the party is in it.
  porch: { x: 16, y: 2, w: 5, h: 5, cover: 'mw_tower_porch', doors: ['mw_tower_door', 'mw_tower_door_open'] },
  // No wreck masts or hulls on the skyline: the water here is the drowned town, not the open sea.
  skyline: false,

  tiles: [
    '####################################',
    '#77777777777777#######7777777777777#',
    '#77777777777777##::###7777777777777#',
    '#77777777777777#:::::#7777777777777#',
    '#55555555555555#:::::#5555555555555#',
    '#55555555555555#:::::#5555555555555#',
    '#56556556556556WW..W;W5655655655655#',
    '#::::::::::::::::::;;;;;;;;;;;;;;;;#',
    '#..XX.........::...;;;;;;;;;;;;;;;;#',
    '#.XXX..q..............;;;....;;;;..#',
    '.....::.....::.........J..XX..;;...#',
    '.......XXX.......::.......XXX......#',
    '#.....J...XXX.............;;;;...q.#',
    '#..q......XX...::.......;~~~~~~~~~~#',
    '#;;.;.........::::......~~~~~~~~~~~#',
    '#~~~~~;........::......~~~~~~~~~~~~#',
    '#~~~~~~~...XX.....q....~~~~~~~~~~~~#',
    '#~~~~~~~...XXX.....q....;~~~~~~~~~~#',
    '#~~~~~;............qq....;;;..;;...#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'merrow_high_street', spawn: { x: 37, y: 9 } },
    // The porch's inner door, up into the bell tower.
    { x: 17, y: 2, w: 2, h: 1, to: 'merrow_belfry', spawn: { x: 14, y: 21 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // Coming up the lane: the grating (the whole of column 12).
    { x: 12, y: 7, w: 1, h: 12, scene: 'tower_lane_grate' },
    // In front of the door once the bar is up (and everyone is together again).
    { x: 16, y: 7, w: 4, h: 2, scene: 'tower_lane_soaked', when: 'tower_bar', after: 'tower_lane_grate' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    // The tower, standing behind its porch (drawn only; its foot, the inner door, is the back wall).
    { sprite: 'mw_bell_tower', x: 16, y: 1, text: 'lane_tower', walkable: true },
    // The porch door: barred inside until Bramble lifts the bar. Its open look stands under it.
    { sprite: 'mw_tower_door', x: 17, y: 6, text: 'lane_door', opensWith: ['tower_bar'], openText: 'lane_door_open' },
    { sprite: 'mw_tower_door_open', x: 17, y: 6, text: 'lane_door_opened', walkable: true },
    // The grating: only Bramble fits.
    { sprite: 'mw_flood_grate', x: 20, y: 6, text: 'lane_grate', gap: true },
    // The bar, inside the porch.
    { sprite: 'lever', x: 16, y: 5, text: 'lane_bar', lever: 'tower_bar', by: 'bramble', byText: 'lane_bar_not_you' },
    { sprite: 'mw_ropes_coiled', x: 19, y: 3, text: 'lane_porch_ropes', walkable: true },
    // The tower's front wall over the porch: seen from the lane it is the wall the door is in; it
    // fades out while anyone is inside (`porch` below). Listed after everything in the porch.
    { sprite: 'mw_tower_porch', x: 16, y: 5, walkable: true },
    { sprite: 'rock_stump', x: 3, y: 13, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 10, y: 8, text: 'lane_sign' },
    { sprite: 'mw_laundry_line', x: 4, y: 8, text: 'square_washing' },
    { sprite: 'gold_pouch', x: 33, y: 18, text: 'lane_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The lane after the flood: sandbags along the house fronts where they tried to keep it out,
    // its line of weed left along the cobbles, a boat dragged up out of the pool and turned over,
    // puddles, stones down off the tower, and a lamp on its hook at each end of the lane.
    { sprite: 'c5_sandbags', x: 7, y: 7 },
    { sprite: 'c5_sandbags', x: 24, y: 9 },
    { sprite: 'c5_wrack_line', x: 26, y: 13, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 8, y: 14, flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 9, y: 17 },
    { sprite: 'c5_net_torn', x: 2, y: 12, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 6, y: 10, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 19, y: 13, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 15, y: 7, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 22, y: 10, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 30, y: 17, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 21, y: 16, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 1, y: 9 },
    { sprite: 'c5_lantern_hook', x: 34, y: 9 },
    // Chimney pots along the terraces' roofs, so the slates read as houses.
    { sprite: 'mw_chimney_pots', x: 4, y: 3, text: 'steps_chimney' },
    { sprite: 'mw_chimney_pots', x: 11, y: 3, text: 'steps_chimney' },
    { sprite: 'mw_chimney_pots', x: 25, y: 3, text: 'steps_chimney' },
    { sprite: 'mw_chimney_pots', x: 31, y: 3, text: 'steps_chimney' },
    { sprite: 'mw_bubbles', x: 29, y: 15, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.25 },
    // House fronts (2026-11-08): the two terraces as different houses, the roofline going up and
    // down; on the solid front row only (x 1 to 14 and 22 to 34), the tower's porch and the grating left bare.
    { sprite: 'mw_house_parapet', x: 1, y: 6, text: 'front_parapet' },
    { sprite: 'mw_ov_door_boarded', x: 3, y: 6, text: 'front_door_boarded' },
    { sprite: 'mw_house_shop', x: 4, y: 6, text: 'front_shop' },
    { sprite: 'mw_ov_drainpipe', x: 6, y: 6, text: 'front_pipe' },
    { sprite: 'mw_ov_door_knocker', x: 7, y: 6, text: 'front_door' },
    { sprite: 'mw_ov_shutters_open', x: 8, y: 6, text: 'front_shutters' },
    { sprite: 'mw_house_gable_b', x: 9, y: 6, text: 'front_gable' },
    { sprite: 'mw_ov_window_box', x: 11, y: 6, text: 'front_window_box' },
    { sprite: 'mw_ov_wall_lamp', x: 12, y: 6, text: 'front_lamp', glow: [{ dx: 2, dy: -23, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_narrow', x: 13, y: 6, text: 'front_narrow' },
    { sprite: 'mw_ov_shutters_hanging', x: 14, y: 6, text: 'front_shutters' },
    { sprite: 'mw_ov_drainpipe', x: 22, y: 6, text: 'front_pipe' },
    { sprite: 'mw_ov_window_drowned', x: 23, y: 6, text: 'square_window' },
    { sprite: 'mw_house_dutch', x: 24, y: 6, text: 'front_dutch' },
    { sprite: 'mw_ov_shutters_shut', x: 26, y: 6, text: 'front_shutters' },
    { sprite: 'mw_ov_sign_fish', x: 27, y: 6, text: 'front_sign_fish' },
    { sprite: 'mw_ov_awning_torn', x: 28, y: 6, text: 'front_awning' },
    { sprite: 'mw_house_narrow_b', x: 30, y: 6, text: 'front_narrow' },
    { sprite: 'mw_ov_door_arched', x: 31, y: 6, text: 'front_door' },
    { sprite: 'mw_house_gable_c', x: 32, y: 6, text: 'front_gable' },
    { sprite: 'mw_ov_wall_lamp', x: 34, y: 6, text: 'front_lamp', glow: [{ dx: 2, dy: -23, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_dormer', x: 7, y: 3, text: 'merrow_roof' },
    { sprite: 'mw_dormer', x: 28, y: 3, text: 'merrow_roof' },
    { sprite: 'mw_chimney_short', x: 14, y: 2, text: 'merrow_chimney' },
    { sprite: 'mw_chimney_short', x: 22, y: 2, text: 'merrow_chimney' },
    // In the water (2026-11-08): a cart, a lamp still burning, a drowned stall in the west pool.
    // Clear of the bellbuoy's row 15, the stump and every walk.
    { sprite: 'mw_cart_sunk', x: 33, y: 13, text: 'water_cart' },
    { sprite: 'mw_lamp_leaning', x: 25, y: 14, text: 'water_lamp', glow: [{ dx: 4, dy: -39, bloom: 12, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -4, pool: 50, strength: 0.4, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_weed_mat', x: 27, y: 17, text: 'square_water', flat: true, walkable: true },
    { sprite: 'mw_barrel_bob', x: 34, y: 16, text: 'water_barrel', animation: 'mw_barrel_bob', speed: 0.28 },
    { sprite: 'mw_slates_afloat', x: 31, y: 14, text: 'square_water', flat: true, walkable: true },
    { sprite: 'mw_stall_drowned', x: 1, y: 16, text: 'water_stall' },
    { sprite: 'mw_crate_drift', x: 5, y: 17, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_weed_mat', x: 4, y: 15, text: 'square_water', flat: true, walkable: true },
  ],
  tileTexts: { '#': 'lane_masonry', W: 'merrow_stone', '7': 'merrow_roof', '5': 'merrow_house', '6': 'square_window', ';': 'lane_flood', '~': 'square_water', J: 'merrow_bollard' },

  // A salt shade on the cobbles east of the tower (row 11, x 27 to 31) and a bellbuoy in the
  // pool below it (row 15, x 26 to 32). Both well clear of Bramble's way to the grating (x 19 to
  // 22, rows 7-8), the door, both triggers (column 12; x 16 to 19, rows 7-8), the scene walks
  // (x 13 to 21, rows 7 to 10), the stump and the west door.
  npcs: [
    { enemy: 'salt_shade', x: 29, y: 11, patrol: [27, 31], behaviour: 'patrol' },
    { enemy: 'bellbuoy', x: 29, y: 15, patrol: [26, 32], behaviour: 'patrol' },
  ],
};
