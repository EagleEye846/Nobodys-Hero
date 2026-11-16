// THE ROOFTOPS: the streets of Merrow are under the water here, so the only way across is over
// the roofs. Four slate roofs (B, two steps high) stand out of the flood between the end of the
// top street (west) and the far street (east), with planks laid between them (g) where somebody
// once needed to get across. A jump only gets you one step (12 px), so you get up onto each roof
// by its eave or porch roof (b, one step), and down off it the same way onto the next plank.
// THE PUZZLE (jumps): west street -> the eave (5,9) -> roof one -> its east eave (9,5) -> plank
// -> the eave of roof two (14,5) -> over the ridge past the stranded boat -> the eave (20,6) ->
// plank -> the eave (25,6) -> roof three, round the washing line -> its east eave (31,10) ->
// plank -> the east street. Every plank lands on an eave, so you can always get back.
// The purse is on a chimney stack in the water north of the second plank (22,3 to 23,4). It
// looks out of reach from the ridges; the way up is the little dormer roof (22,5) on the plank
// itself: jump onto the dormer, then onto the stack.
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  rock top (solid)   W  dressed stone face (solid)   .  cobbles   ~  green floodwater (solid)
//   b  an eave, porch roof or dormer (12 px)   B  a roof (24 px)   g  a plank   I  a chimney (solid)

export const MERROW_ROOFTOPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_rooftops',
  // The room's name, for the Room Editor.
  name: 'THE ROOFTOPS',
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
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#....~~~~~~~~~~BBBBB~~~~~~~~~~~~~~;....#',
    '#....~~~~~~~~~~BBBBB~~BB~~~~~~~~~~;....#',
    '#....~BBB~~~~~~BBBBB~~BB~~BBBBB~~~.....#',
    '#....~BBBbggggbBBBBB~~b~~~BBBBB~~~.....#',
    '#....~BBB~~~~~~BBBBBbggggbBBBBB~~~.....#',
    '#....~BIB~~~~~~BBBBB~~~~~~BBBBB~~~.....#',
    '#....~BBB~~~~~~~~~~~~~~~~~BBBBB~~~.....#',
    '.....bBBB~~~~~~~~~~~~~~~~~BBBBB~~~......',
    '.....bBBB~~~~~~~~~~~~~~~~~BBBBBbgg......',
    '#....~BBB~~~~~~~~~~~~~~~~~BBIBB~~~.....#',
    '#....~BIB~~~~~~~~~~~~~~~~~BBBBB~~~.....#',
    '#...;~BBB~~~~~~~~~~~~~~~~~~~~~~~~~.....#',
    '#..;;~BBB~~~~~~~~~~~~~BB~~~~~~~~~~.....#',
    '#....~~~~~~~~~~BBB~~~~B~~~~~~~~~~~;....#',
    '#...;~~~~~~~~~~BB~~~~~~~~~~~~~~~~~;;...#',
    '#~;;;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;;;.~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'merrow_steps', spawn: { x: 33, y: 6 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'merrow_square', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'sign', x: 3, y: 7, text: 'roofs_sign' },
    // Up on the roofs: the boat left on the ridge when the water went down again, the washing.
    { sprite: 'mw_laundry_line', x: 27, y: 8, text: 'roofs_washing' },
    // The chimney stack in the water, the purse on it, and its pots.
    { sprite: 'mw_chimney_pots', x: 23, y: 3, text: 'roofs_stack' },
    { sprite: 'gold_pouch', x: 23, y: 4, text: 'roofs_pouch', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Down in the water.
    { sprite: 'mw_weathercock', x: 13, y: 11, text: 'steps_weathercock' },
    { sprite: 'mw_bubbles', x: 18, y: 14, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.25 },
    { sprite: 'mw_bubbles', x: 11, y: 8, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.23 },
    { sprite: 'c5_rope_coil', x: 36, y: 4, text: 'roofs_rope', walkable: true },
    { sprite: 'mw_sign_post', x: 37, y: 13, text: 'roofs_post_sign' },
    // House fronts (2026-11-08): the far side of the drowned street, along the north wall, each house
    // its own (solid wall row only; nothing on a roof, an eave or a plank).
    { sprite: 'mw_house_parapet_b_low', x: 1, y: 1, text: 'front_parapet' },
    { sprite: 'mw_ov_door_arched', x: 3, y: 1, text: 'front_door' },
    { sprite: 'mw_ov_wall_lamp', x: 4, y: 1, text: 'front_lamp', glow: [{ dx: 2, dy: -23, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_shop_low', x: 5, y: 1, text: 'front_shop' },
    { sprite: 'mw_house_narrow_low', x: 7, y: 1, text: 'front_narrow' },
    { sprite: 'mw_house_gable_b_low', x: 8, y: 1, text: 'front_gable' },
    { sprite: 'mw_ov_drainpipe', x: 10, y: 1, text: 'front_pipe' },
    { sprite: 'mw_house_dutch_low', x: 11, y: 1, text: 'front_dutch' },
    { sprite: 'mw_ov_door_hanging', x: 13, y: 1, text: 'front_door_hanging' },
    { sprite: 'mw_house_narrow_b_low', x: 14, y: 1, text: 'front_narrow' },
    { sprite: 'mw_house_parapet_low', x: 15, y: 1, text: 'front_parapet' },
    { sprite: 'mw_ov_sign_key', x: 17, y: 1, text: 'front_sign_key' },
    { sprite: 'mw_house_gable_low', x: 18, y: 1, text: 'front_gable' },
    { sprite: 'mw_ov_drainpipe', x: 20, y: 1, text: 'front_pipe' },
    { sprite: 'mw_house_narrow_low', x: 21, y: 1, text: 'front_narrow' },
    { sprite: 'mw_house_shop_low', x: 22, y: 1, text: 'front_shop' },
    { sprite: 'mw_ov_wall_lamp', x: 24, y: 1, text: 'front_lamp', glow: [{ dx: 2, dy: -23, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_house_dutch_low', x: 25, y: 1, text: 'front_dutch' },
    { sprite: 'mw_ov_door_boarded', x: 27, y: 1, text: 'front_door_boarded' },
    { sprite: 'mw_house_gable_c_low', x: 28, y: 1, text: 'front_gable' },
    { sprite: 'mw_house_narrow_b_low', x: 30, y: 1, text: 'front_narrow' },
    { sprite: 'mw_house_parapet_low', x: 31, y: 1, text: 'front_parapet' },
    { sprite: 'mw_ov_door_knocker', x: 33, y: 1, text: 'front_door' },
    { sprite: 'mw_ov_drainpipe', x: 34, y: 1, text: 'front_pipe' },
    { sprite: 'mw_house_gable_b_low', x: 35, y: 1, text: 'front_gable' },
    { sprite: 'mw_house_narrow_low', x: 37, y: 1, text: 'front_narrow' },
    { sprite: 'mw_ov_wall_lamp', x: 38, y: 1, text: 'front_lamp', glow: [{ dx: 2, dy: -23, bloom: 10, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -2, pool: 46, strength: 0.45, flicker: 0.3, color: '255, 156, 68' }] },
    // In the flood (2026-11-08): gutters and slates off the roofs' edges, a cart, a stall, a lamp still
    // burning; all on deep water, clear of the bellbuoy's row 16 and every roof, eave and plank.
    { sprite: 'mw_eave_weed', x: 6, y: 15, text: 'roofs_water' },
    { sprite: 'mw_eave_weed', x: 16, y: 8, text: 'roofs_water' },
    { sprite: 'mw_slates_afloat', x: 18, y: 9, text: 'roofs_water', flat: true, walkable: true },
    { sprite: 'mw_eave_weed', x: 27, y: 13, text: 'roofs_water' },
    { sprite: 'mw_cart_sunk', x: 10, y: 12, text: 'water_cart' },
    { sprite: 'mw_lamp_leaning', x: 20, y: 10, text: 'water_lamp', glow: [{ dx: 4, dy: -39, bloom: 12, strength: 0.7, flicker: 0.4, color: '255, 156, 68' }, { dx: 2, dy: -4, pool: 50, strength: 0.4, flicker: 0.3, color: '255, 156, 68' }] },
    { sprite: 'mw_barrel_bob', x: 12, y: 6, text: 'water_barrel', animation: 'mw_barrel_bob', speed: 0.28 },
    { sprite: 'mw_crate_drift', x: 24, y: 9, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_stall_drowned', x: 18, y: 12, text: 'water_stall' },
    { sprite: 'mw_weed_mat', x: 10, y: 9, text: 'roofs_water', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 22, y: 11, text: 'roofs_water', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 31, y: 15, text: 'roofs_water', flat: true, walkable: true },
    { sprite: 'mw_slates_afloat', x: 9, y: 4, text: 'roofs_water', flat: true, walkable: true },
    { sprite: 'mw_ripples', x: 21, y: 4, text: 'roofs_water', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_ripples', x: 13, y: 11, text: 'roofs_water', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_crate_drift', x: 32, y: 7, text: 'water_crate', animation: 'mw_crate_drift', speed: 0.32 },
    { sprite: 'mw_weed_mat', x: 25, y: 16, text: 'roofs_water', flat: true, walkable: true },
  ],
  tileTexts: { '#': 'merrow_stone', W: 'merrow_stone', '~': 'roofs_water', b: 'roofs_eave', B: 'roofs_roof', g: 'roofs_plank', I: 'merrow_chimney' },

  // A bellbuoy swimming the drowned street along the west street's foot (row 16, x 5 to 12:
  // water, clear of the west eave at 5,9-10 and the door), and a net wraith drifting about the
  // far street's south end (home 36,15, rows 14-16: clear of the east door, rows 9-10, and the
  // plank's landing at 34,10). No cutscenes in this room.
  npcs: [
    { enemy: 'bellbuoy', x: 8, y: 16, patrol: [5, 12], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 36, y: 15, patrol: [35, 37], behaviour: 'wander' },
  ],
};
