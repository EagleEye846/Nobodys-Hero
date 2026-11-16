// THE WAY UP: the sounders' stair out of the caves, climbing to daylight and the Beacon Isles. A
// SAVE crystal at its foot. Half way up, an iron grille across the throat of the stair hangs from a
// chain over a wheel on a counterweight frame, and the hook at the chain's end is empty: WEIGHT
// KEPT BELOW. With the brass sounding-weight from the Weight Room, the scene
// `soundings_weight_gate` hangs it on the hook and the grille goes up for good. No monsters (a save
// room); no puzzle but the key.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   s  stair
//   x  glowing sea-glass (solid)   I  a rock pillar

// The light off a lump of sea-glass: a small bloom and a pool round it.
const GLASS_GLOW = [{ dy: -8, bloom: 10, strength: 0.45, flicker: 0.1, color: '120, 240, 220' }, { dy: 2, pool: 40, strength: 0.38, flicker: 0.05, color: '120, 240, 220' }];
export const SOUNDINGS_UP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_up',
  // The room's name, for the Room Editor.
  name: 'THE WAY UP',
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
    '###########..###########',
    '#WWWWWWWWWW..WWWWWWWWWW#',
    '######...#........######',
    '#####W...W........W#####',
    '####.................###',
    '###....I........I....###',
    '##...................###',
    '####................####',
    '#####.............x.####',
    '######............######',
    '#########..ss.##########',
    '##########.ss###########',
    '###########ss.##########',
    '###########ss###########',
    '##########.ss###########',
    '###########..###########',
    '###########..###########',
    '#########WW...W#########',
    '#########.....x#########',
    '########.......#########',
    '#########x......########',
    '########........########',
    '########.#.....#########',
    '###WxWWWW......WWWWWW###',
    '###....................#',
    '##...................###',
    '###.................x###',
    '#####.....#........#####',
    'WWWWWWWWWW#..#WWWWWWWWWW',
    '###########..###########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 26 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 11, y: 29, w: 2, h: 1, to: 'soundings_echo_hall', spawn: { x: 21, y: 2 } },
    { x: 11, y: 0, w: 2, h: 1, to: 'isles_landing', spawn: { x: 5, y: 4 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // At the grille, with the weight (it's given by soundings_the_weight).
    { x: 11, y: 17, w: 2, h: 2, scene: 'soundings_weight_gate', after: 'soundings_the_weight' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    { sprite: 'savepoint', x: 6, y: 24, save: true },
    // The grille (two props, the throat is two wide) and its counterweight frame.
    { sprite: 'gate_narrow', x: 11, y: 16, text: 'up_grille', until: 'soundings_weight_gate' },
    { sprite: 'gate_narrow', x: 12, y: 16, text: 'up_grille', until: 'soundings_weight_gate' },
    { sprite: 'sd_counterweight', x: 13, y: 17, text: 'up_counterweight', until: 'soundings_weight_gate' },
    { sprite: 'sd_counterweight_full', x: 13, y: 17, text: 'up_counterweight_full', after: 'soundings_weight_gate' },
    { sprite: 'sign', x: 16, y: 24, text: 'up_sign' },
    { sprite: 'c5_stalactite_drip', x: 8, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_rope_coil', x: 18, y: 25, text: 'up_line', walkable: true },
    // The cave round the stair: dripstone and fallen slabs in the top chamber, sea-glass in the
    // corner, weed off a shelf; in the throat, rock and glass either side of the way (x 10 to 13
    // kept clear for the walk and the scene); at the foot, the divers' leavings by the save
    // crystal. Nothing on the stair or round the doors.
    { sprite: 'sd_rope_ladder', x: 6, y: 2, text: 'sound_rope_ladder' },
    { sprite: 'sd_weed_ledge', x: 15, y: 2, text: 'sound_weed_ledge' },
    { sprite: 'sd_stalagmites', x: 4, y: 4, text: 'sound_stalagmites' },
    { sprite: 'sd_slab', x: 2, y: 6, text: 'sound_slab' },
    { sprite: 'c5_puddle', x: 8, y: 5, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 5, y: 8, flat: true, walkable: true },
    { sprite: 'sd_stalagmite', x: 8, y: 7, text: 'sound_stalagmites' },
    { sprite: 'sd_timbers', x: 15, y: 7, text: 'sound_timbers' },
    { sprite: 'sd_glass_rock', x: 17, y: 8, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_glass_bed', x: 19, y: 6, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 17, y: 4, flat: true, walkable: true },
    { sprite: 'sd_stalagmite', x: 9, y: 18, text: 'sound_stalagmites' },
    { sprite: 'sd_rock_pile', x: 8, y: 21, text: 'sound_rocks' },
    { sprite: 'sd_glass_rock', x: 15, y: 20, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_scree', x: 14, y: 22, flat: true, walkable: true },
    { sprite: 'sd_weed_ledge', x: 3, y: 24, text: 'sound_weed_ledge' },
    { sprite: 'sd_stalagmites', x: 19, y: 24, text: 'sound_stalagmites' },
    { sprite: 'sd_glass_rock', x: 19, y: 26, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_diver_gear', x: 3, y: 26, text: 'sound_diver_gear' },
    { sprite: 'sd_slab', x: 15, y: 27, text: 'sound_slab' },
    { sprite: 'sd_stalagmite', x: 6, y: 27, text: 'sound_stalagmites' },
    { sprite: 'sd_scree', x: 8, y: 26, flat: true, walkable: true },
    { sprite: 'sd_glass_bed', x: 14, y: 25, flat: true, walkable: true },
    // Little bays off the stair where the rock has fallen back, with scree and a glint of glass.
    { sprite: 'sd_scree', x: 9, y: 10, flat: true, walkable: true },
    { sprite: 'sd_glass_bed', x: 13, y: 12, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 10, y: 14, flat: true, walkable: true },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_glow_threads', x: 4, y: 5, walkable: true, animation: 'lv_glow_threads', speed: 0.35, decor: true },
    { sprite: 'gold_pouch', x: 3, y: 6, text: 'lp_up_nook', walkable: true, gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'lv_cave_fern', x: 5, y: 6, walkable: true, decor: true },
    { sprite: 'lv_ledge_cups', x: 4, y: 6, text: 'lp_up_cups', walkable: true },
    { sprite: 'lv_pearl_pool', x: 18, y: 5, text: 'lp_pearl_up', walkable: true },
    { sprite: 'lv_midden', x: 17, y: 7, walkable: true, decor: true },
    { sprite: 'lv_hook_lamp', x: 20, y: 4, text: 'lp_hook_lamp_up', walkable: true },
    { sprite: 'lv_boot', x: 11, y: 22, text: 'lp_boot_up', walkable: true },
    { sprite: 'lv_lunch_pail', x: 14, y: 21, text: 'lp_pail_up', walkable: true },
    { sprite: 'lv_cave_fern', x: 20, y: 25, walkable: true, decor: true },
    { sprite: 'lv_drip_column', x: 5, y: 24, walkable: true, decor: true },
    { sprite: 'lv_glow_shelf', x: 4, y: 25, walkable: true, decor: true },
    { sprite: 'lv_chalk_arrow', x: 12, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'lv_candle_stubs', x: 10, y: 19, text: 'lp_candle_up', flat: true, walkable: true },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', x: 'sound_glass', I: 'sound_pillar', s: 'up_stair' },

  // None: a save room.
  npcs: [],
};
