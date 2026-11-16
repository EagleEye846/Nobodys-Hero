// THE BELL TOWER: inside Merrow's drowned bell tower. The floor is a foot of green water with
// deep holes in it where the floorboards went; the bell ropes still hang from the beams along the
// north wall, sallies and all; and in the middle, fallen through from the belfry and lying on its
// side in the water, is the great bell. Old Gulper lives in it (src/data/enemies/old_gulper.js):
// a very old moray eel with toothache, who rubs his jaw on the bell, which is what rings it.
// You come up from the porch (south, dry, a SAVE crystal). The trigger is the whole of row 17,
// so it can't be walked round: scene `old_gulper` (the bell rings by itself, then he comes out),
// and the fight. Spared, `gulper_spared`; beaten, `gulper_beaten`. Both give the Gulper Tooth.
// He stays in the bell afterwards (a prop playing `mw_gulper_doze` or `mw_gulper_snore`: the same bell, same size and place, with him in it).
// The way on is the breach in the seaward (east) wall, x 29, rows 8-9, to merrow_sea_gate.
// No monsters (the boss room). The fight has its own song (oldGulperBattle, "Long in the Tooth") and backdrop.
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  masonry (solid)   W  dressed stone face (solid)   :  flagstones (dry)   .  the porch step
//   ;  the flooded floor (walk)   ~  the holes in the floor, deep (solid)

export const MERROW_BELFRY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_belfry',
  // The room's name, for the Room Editor.
  name: 'THE BELL TOWER',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  indoors: true,
  // No blend pass: soft edges made the deep holes too faint to read as holes. Their shapes are
  // ragged in the map instead, and each keeps its hard lip.
  softEdges: false,
  // "Bells Under Water"; inside the tower, the sea in the stones and the drips (no rain).
  music: 'merrow',
  ambience: 'drowned_inside',
  // After chapter 5 the storm is over (`calmAfter`): only the water and the drips, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_drowned_inside' },
  vesWell: true,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#:::::::::::::::::::::::::::O#',
    '#Oooo;;;;;;;;;;;;;;;;;~~~;;;x#',
    '#ooo;;;;;;;;;;;;;;;;;~~~~~;;;#',
    '#o;~~~;;;;;;;;;;;;;;;~~~~~o;;#',
    '#;~~~~~;;;;;;;;;;;;;;;~~~~oo;#',
    '#;;~~~~;ooo;;;;;;;;;;;;N;;;;;#',
    '#;;~~~;;oo;;;;;;;;;;;;;;;;;;;;',
    '#;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',
    '#N;;;;;;;;;;;;;;;;;;;;;;;;;;;#',
    '#O;;;;;;;;;;;;;;;;;;;;;~~~~;;#',
    '#;;;~~~;;;;;;;;;;;;;;;~~~~~~;#',
    '#;;~~~~~;;N;;;;;;;;;;;;~~~~~;#',
    '#;;;~~~~;;;;;;;;;;ooo;~~~~~o;#',
    '#oo;;~~;;;;;;;;;;;oo;;;~~~ooO#',
    '#xOo;;;;;;;;;;;;;;;;;;;;;;;oO#',
    '#............................#',
    '#########::::::::::::#########',
    '#WWWWWWWW::::::::::::WWWWWWWW#',
    '#########::::::::::::#########',
    '#########::::::::::::#########',
    '#########::::::::::::#########',
    '##############::##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 21 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 14, y: 23, w: 2, h: 1, to: 'merrow_tower_lane', spawn: { x: 17, y: 3 } },
    // The breach in the seaward wall.
    { x: 29, y: 8, w: 1, h: 2, to: 'merrow_sea_gate', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene: the whole of row 17 (the porch step), so the
  // bell can't be reached any other way.
  cutscenes: [
    { x: 1, y: 17, w: 28, h: 1, scene: 'old_gulper' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'savepoint', x: 11, y: 20, save: true },
    // The great bell, empty-looking before the fight (he's inside it); after it, him in it.
    { sprite: 'mw_great_bell', x: 13, y: 9, text: 'belfry_bell', until: 'old_gulper' },
    { sprite: 'mw_great_bell', x: 13, y: 9, text: 'belfry_bell_spared', animation: 'mw_gulper_doze', speed: 1.1, after: 'gulper_spared' },
    { sprite: 'mw_great_bell', x: 13, y: 9, text: 'belfry_bell_beaten', animation: 'mw_gulper_snore', speed: 0.9, after: 'gulper_beaten' },
    { sprite: 'mw_gulper_nest', x: 12, y: 11, text: 'belfry_nest', flat: true, walkable: true },
    // The ropes on the north wall, each from its beam.
    { sprite: 'mw_bell_rope', x: 4, y: 2, text: 'belfry_rope' },
    { sprite: 'mw_bell_rope', x: 9, y: 2, text: 'belfry_rope' },
    { sprite: 'mw_bell_rope', x: 15, y: 2, text: 'belfry_rope' },
    { sprite: 'mw_bell_rope', x: 26, y: 2, text: 'belfry_rope' },
    { sprite: 'mw_ropes_coiled', x: 18, y: 21, text: 'belfry_ropes_coiled', walkable: true },
    // Grey daylight: a thread down through the hole the bell fell through, onto the water beside it,
    // and another in at the breach in the seaward wall (the way on), so the eye goes there.
    { sprite: 'sy_dim_shaft', x: 17, y: 10, walkable: true, flat: true, animation: 'sy_dim_shaft', speed: 0.5, glow: [{ dx: 3, dy: -4, pool: 46, strength: 0.48, flicker: 0, color: '160, 184, 196' }] },
    { sprite: 'sy_dim_shaft', x: 26, y: 9, walkable: true, flat: true, animation: 'sy_dim_shaft', speed: 0.45, glow: [{ dx: 3, dy: -4, pool: 36, strength: 0.3, flicker: 0, color: '160, 184, 196' }] },
    { sprite: 'mw_bubbles', x: 24, y: 13, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.25 },
    { sprite: 'mw_bubbles', x: 4, y: 6, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.28 },
    // What came down with the bell: broken floorboards from the belfry and stones off the rim
    // of the hole it fell through, scattered round it in the water; the ringers' lantern
    // knocked off the dry ledge, still burning low; one still lit on its hook in the porch.
    { sprite: 'c5_planks_scatter', x: 9, y: 8, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 17, y: 7, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 11, y: 7, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 18, y: 10, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 7, y: 9, flat: true, walkable: true },
    { sprite: 'c5_lantern_fallen', x: 7, y: 2, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 20, y: 2, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 19, y: 19 },
    { sprite: 'c5_floor_crack', x: 10, y: 21, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 20, y: 22, flat: true, walkable: true },
    // Breaking up the holes and the flooded floor (2026-11-08): boards fallen across the holes' lips,
    // weed afloat in them, silt settled on the floor in drifts (all flat, walked over), and the
    // ringers' candle lanterns on their spikes along the dry ledge, burning low.
    { sprite: 'mw_floorboards', x: 2, y: 5, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 4, y: 7, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_floorboards', x: 22, y: 4, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 24, y: 5, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_floorboards', x: 23, y: 12, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 25, y: 14, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_floorboards', x: 4, y: 13, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_weed_mat', x: 5, y: 12, text: 'belfry_hole', flat: true, walkable: true },
    { sprite: 'mw_silt', x: 7, y: 11, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_silt_b', x: 15, y: 15, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_silt', x: 19, y: 5, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_silt_b', x: 10, y: 4, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_silt', x: 25, y: 9, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_silt_b', x: 2, y: 9, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_ripples', x: 12, y: 9, text: 'belfry_floor', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_ripples', x: 16, y: 10, text: 'belfry_floor', flat: true, walkable: true, animation: 'mw_ripples', speed: 0.22 },
    { sprite: 'mw_slates_afloat', x: 20, y: 12, text: 'belfry_floor', flat: true, walkable: true },
    { sprite: 'mw_candle_ledge', x: 12, y: 2, text: 'belfry_candle', glow: [{ dy: -14, bloom: 10, strength: 0.65, flicker: 0.5, color: '255, 170, 80' }, { dy: -4, pool: 52, strength: 0.4, flicker: 0.4, color: '255, 170, 80' }] },
    { sprite: 'mw_candle_ledge', x: 23, y: 2, text: 'belfry_candle', glow: [{ dy: -14, bloom: 10, strength: 0.65, flicker: 0.5, color: '255, 170, 80' }, { dy: -4, pool: 52, strength: 0.4, flicker: 0.4, color: '255, 170, 80' }] },
  ],
  tileTexts: { '#': 'lane_masonry', W: 'merrow_stone', ';': 'belfry_floor', '~': 'belfry_hole' },

  // None: Old Gulper is cast by the scenes (old_gulper, gulper_spared, gulper_beaten).
  npcs: [],
};
