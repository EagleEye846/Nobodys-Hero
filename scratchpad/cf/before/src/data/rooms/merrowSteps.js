// THE TOWN STEPS: the broad stair down from the Sunken Lanes (lanes_down) comes out at the top
// street of Merrow, the town the green storm drowned. The street is the last of the town above
// the water: below its rail the rest of Merrow stands in clear green flood, slate roofs and
// chimneys sticking out of it, a weathercock, a spire, and across the water the bell tower. Two
// slipways run down off the street into the water and keep going. A save crystal.
// The first time down, the scene `merrow_in` plays: a bell rings somewhere below, though there's
// nobody in any tower. PUZZLE-FREE, and no monsters (an area's first room).
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  rock top (solid)   W  dressed stone face (solid)   s  the stair   :  flagstones   .  cobbles
//   f  the street's rail (solid)   ;  a slipway into the water   ~  green floodwater (solid)
//   B  a slate roof standing out of the water (out of reach)   I  a chimney   J  a bollard   ^  a spire

export const MERROW_STEPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_steps',
  // The room's name, for the Room Editor.
  name: 'THE TOWN STEPS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  // "Bells Under Water" (src/data/music/merrowTheme.js), and the storm over the water under it.
  music: 'merrow',
  ambience: 'drowned_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_drowned_town', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // No wreck masts or hulls on the skyline: the water here is the drowned town, not the open sea.
  skyline: false,

  tiles: [
    '###############ssss#################',
    '#WWWWWWWWWWWWWWssssWWWWWWWWWWWWWWWW#',
    '#O:::XX::::::::ssss:::::::::XX::::O#',
    '#.XXX..........::::.........XXX...q#',
    '#..J...........................J...#',
    '#q.......::....................XX..#',
    '#XX...;...::::..........::..........',
    '#X...........;;;.....::::...........',
    '#O..q.........;......;;......q....O#',
    '#ff;;fff::ffffffffffffffff;;;fff::f#',
    '#~~;;~~~~~~~~~~~~~~~~~~~~~~;;~~~~~~#',
    '#~~;;~~bBB~~~~~~I~~~~~~~BBbb~~~~~~~#',
    '#~~~~~~BBb~~~~~bBB~~~~~~BBBB~~~I~~~#',
    '#~~~I~~~~~~~~~~bBB~~~~~~~~bb~~~~bB~#',
    '#~~bBB~~~~~~~~~~~~~~~~~bBB~~~~~bBB~#',
    '#~~bBb~~~~~~~~~^~~~~~~~bBB~~~~~bb~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates (the foot of the stair).
  playerStart: { x: 16, y: 3 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 0, w: 4, h: 1, to: 'lanes_down', spawn: { x: 15, y: 13 } },
    { x: 35, y: 6, w: 1, h: 2, to: 'merrow_rooftops', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/). The whole of row 4,
  // so the street can't be walked along without it.
  cutscenes: [
    { x: 1, y: 4, w: 34, h: 1, scene: 'merrow_in' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'savepoint', x: 9, y: 3, save: true },
    { sprite: 'mw_sign_post', x: 22, y: 3, text: 'steps_sign' },
    { sprite: 'mw_laundry_line', x: 26, y: 8, text: 'steps_washing' },
    // Out in the water: what's left above it of the streets below.
    { sprite: 'mw_weathercock', x: 11, y: 13, text: 'steps_weathercock' },
    { sprite: 'mw_chimney_pots', x: 20, y: 11, text: 'steps_chimney' },
    { sprite: 'mw_chimney_pots', x: 27, y: 15, text: 'steps_chimney' },
    // The top street after the flood: it came up as far as the rail and left its line along
    // the street; the rail's gone in two places. Sandbags at a slipway's head, a boat dragged up
    // and turned over, a net torn off its frame, a lamp still lit on its hook by the stair.
    { sprite: 'c5_wrack_line', x: 9, y: 8, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 29, y: 8, flat: true, walkable: true },
    { sprite: 'c5_sandbags', x: 24, y: 8 },
    { sprite: 'c5_boat_upturned', x: 4, y: 6 },
    { sprite: 'c5_net_torn', x: 28, y: 6, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 20, y: 2 },
    { sprite: 'c5_puddle', x: 11, y: 6, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 17, y: 7, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 32, y: 5, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 1, y: 7, flat: true, walkable: true },
    { sprite: 'c5_oar_stuck', x: 13, y: 8 },
    { sprite: 'mw_bubbles', x: 6, y: 13, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.25 },
    { sprite: 'mw_bubbles', x: 19, y: 15, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.27 },
    // House fronts (2026-11-08): the top street's terrace along the back wall, each house its own;
    // on the solid wall row only, the stair (x 15 to 18) left bare.
    { sprite: 'mw_house_gable', x: 1, y: 1, text: 'front_gable' },
    { sprite: 'mw_ov_drainpipe', x: 3, y: 1, text: 'front_pipe' },
    { sprite: 'mw_house_shop', x: 4, y: 1, text: 'front_shop' },
    { sprite: 'mw_house_narrow_b', x: 6, y: 1, text: 'front_narrow' },
    { sprite: 'mw_house_parapet', x: 7, y: 1, text: 'front_parapet' },
    { sprite: 'mw_ov_wall_lamp', x: 9, y: 1, text: 'front_lamp', glow: [{ dx: 2, dy: -10, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_dutch', x: 10, y: 1, text: 'front_dutch' },
    { sprite: 'mw_ov_sign_boot', x: 12, y: 1, text: 'front_sign_boot' },
    { sprite: 'mw_house_narrow', x: 13, y: 1, text: 'front_narrow' },
    { sprite: 'mw_ov_door_hanging', x: 14, y: 1, text: 'front_door_hanging' },
    { sprite: 'mw_ov_drainpipe', x: 19, y: 1, text: 'front_pipe' },
    { sprite: 'mw_house_parapet_b', x: 20, y: 1, text: 'front_parapet' },
    { sprite: 'mw_ov_door_arched', x: 22, y: 1, text: 'front_door' },
    { sprite: 'mw_house_gable_c', x: 23, y: 1, text: 'front_gable' },
    { sprite: 'mw_house_narrow', x: 25, y: 1, text: 'front_narrow' },
    { sprite: 'mw_house_dutch', x: 26, y: 1, text: 'front_dutch' },
    { sprite: 'mw_ov_door_knocker', x: 28, y: 1, text: 'front_door' },
    { sprite: 'mw_ov_wall_lamp', x: 29, y: 1, text: 'front_lamp', glow: [{ dx: 2, dy: -10, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_gable_b', x: 30, y: 1, text: 'front_gable' },
    { sprite: 'mw_ov_door_boarded', x: 32, y: 1, text: 'front_door_boarded' },
    { sprite: 'mw_house_narrow_b', x: 33, y: 1, text: 'front_narrow' },
    { sprite: 'mw_ov_drainpipe', x: 34, y: 1, text: 'front_pipe' },
    // In the flood below the rail (2026-11-08): a lamp still burning, a cart, a drowned stall,
    // weed and gutters off the drowned roofs; all on deep water, off the slipways.
    { sprite: 'mw_lamp_leaning', x: 9, y: 10, text: 'water_lamp', glow: [{ dx: 4, dy: -39, bloom: 12, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -4, pool: 50, strength: 0.4, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_crate_drift', x: 13, y: 12, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_weed_mat', x: 12, y: 11, text: 'steps_flood', flat: true, walkable: true },
    { sprite: 'mw_eave_weed', x: 7, y: 13, text: 'steps_flood' },
    { sprite: 'mw_cart_sunk', x: 29, y: 12, text: 'water_cart' },
    { sprite: 'mw_eave_weed', x: 24, y: 13, text: 'steps_flood' },
    { sprite: 'mw_slates_afloat', x: 21, y: 13, text: 'steps_flood', flat: true, walkable: true },
    { sprite: 'mw_barrel_bob', x: 22, y: 14, text: 'water_barrel', animation: 'mw_barrel_bob', speed: 0.28 },
    { sprite: 'mw_stall_drowned', x: 18, y: 16, text: 'water_stall' },
    { sprite: 'mw_weed_mat', x: 5, y: 16, text: 'steps_flood', flat: true, walkable: true },
    { sprite: 'mw_ripples', x: 20, y: 11, text: 'steps_flood', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_ripples', x: 11, y: 13, text: 'steps_flood', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_ripples', x: 27, y: 15, text: 'steps_flood', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_slates_afloat', x: 9, y: 15, text: 'steps_flood', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 30, y: 16, text: 'steps_flood', flat: true, walkable: true },
  ],
  tileTexts: { '#': 'merrow_stone', W: 'merrow_stone', s: 'steps_stair', f: 'steps_rail', ';': 'steps_slipway', '~': 'steps_flood', B: 'steps_roofs', I: 'merrow_chimney', J: 'merrow_bollard', '^': 'steps_spire' },

  // None: an area's first room.
  npcs: [],
};
