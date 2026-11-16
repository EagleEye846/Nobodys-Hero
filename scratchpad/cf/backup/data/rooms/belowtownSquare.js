// BELOWTOWN SQUARE: the heart of the buried town, a cobbled plaza under the
// cavern roof with every door in it: the Mossy Pillow inn (north west), Hobnail's
// forge (a planked creature building with a firelit door), King Peptup's hall
// (the grand front in the middle, banners and pillars), and the Hall of the Visit
// (north east). The market's the way west. Over the throne hall hangs the
// Sunstone, dim and cracked and breathing: it's why everyone's lamps are lit so
// early. Once the light goes up it blazes instead, and the town throws a party
// (homecoming, with the frog band, glow-worm dancers and a crowd that's
// decided you're the Hero's friends). After the welcome, Tuck runs out to catch
// you in here (tucks_whisper). A save point by the plaza, a well, a
// half-crumbled statue of the Hero (nine feet tall, they say), and a purse
// behind the toadstool beds in the south-east corner.
// Tile key (see src/overworld/brightTiles.js):
//   #  cavern rock    W  carved stone    V  wall of glow-worm lamps    H  banner wall
//   .  flagstone  X  cobbles  ,  mossy turf   D  a doorway   F  toadstool bed (solid)
//   5 6 7  house wall, round window, mossy roof      a w e  planked wall, window, cap roof
//   I  carved pillar with a lantern (solid)    J  broken pillar (solid)
import { sunstoneGlow, DRUMMER_GLOW } from '../art/belowtownScenes.js';

export const BELOWTOWN_SQUARE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_square',
  // The room's name, for the Room Editor.
  name: 'BELOWTOWN SQUARE',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  // "Lamps Lit Early" (belowtownTheme.js).
  music: 'belowtown',
  ambience: 'belowtown',
  // Once the light has gone up, the whole town out partying in the square.
  ambienceAfter: { scene: 'the_light_goes_up', ambience: 'belowtown_party' },

  tiles: [
    '######################################',
    '#WWWVWWHWWWWWWVWWWWWVWWWWWVWWWHWWVWWW#',
    '#W7777777WeeeeeeeWWWWWWWWWWWWWWWWWWWW#',
    '#W5656565WawaaawaWWHWWWWWWHWW.HWWWHWW#',
    '#W5656565WaaaaaaaWWWWWWWWWWWW.WWWWWWW#',
    '#W555D555WaaaDaaaWWWWIDDIWWWW.WWDWWWW#',
    '#...,X.....,.X....,...XX.,......X....#',
    '#,,,,X,,,,,,,X,,,,,,,,XX,,,,,,,,X,,,,#',
    '#...,X....XIXXXXXXXXXXXXXXIX....X....#',
    '#.J.,.....XXXXXXXXXXXXXXXXXX....,....#',
    '#...,.....XXXXXXXXXXXXXXXXXX....,....#',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXX....,....#',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXX....,....#',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXX....,....#',
    '#,,,,,,,,,XXXXXXXXXXXXXXXXXX,,,,,,,J,#',
    '#...,.....XXXXXXXXXXXXXXXXXX....,....#',
    '#...,.....XXXXXXXXXXXXXXXXXX....,....#',
    '#...,.....XIXXXXXXXXXXXXXXIX....,....#',
    '#..FF......,......,......,......,.FF.#',
    '#..F,......,......,......,......,.F.F#',
    '#...,......,......,......,......,....#',
    '#############################..#######',
  ],

  // Where the player starts, in tile coordinates (the market end).
  playerStart: { x: 1, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 11, w: 1, h: 3, to: 'belowtown_market', spawn: { x: 30, y: 9 } },
    { x: 5, y: 5, w: 1, h: 1, to: 'belowtown_inn', spawn: { x: 7, y: 11 } },
    { x: 13, y: 5, w: 1, h: 1, to: 'belowtown_forge', spawn: { x: 8, y: 10 } },
    { x: 22, y: 5, w: 2, h: 1, to: 'belowtown_throne', spawn: { x: 12, y: 19 } },
    { x: 32, y: 5, w: 1, h: 1, to: 'belowtown_hall_of_the_visit', spawn: { x: 11, y: 12 } },
    // The stair up from the Deep comes out of the gap in the south wall.
    // (`back`: a way back out, not the way in, for the Studio's ordering.)
    { x: 29, y: 21, w: 2, h: 1, to: 'deep_last_flight', spawn: { x: 17, y: 2 }, back: true },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // Tuck catches you up outside the throne hall once you've had the king's
  // welcome; the homecoming plays across the whole middle of the square (wall to
  // wall: the duel waits on it, so there's no way round it) the first time
  // you're back after the light goes up.
  cutscenes: [
    // (Rows 6 to 8 in front of the hall's doors, so it plays on the tile you come out on.
    // The hall's back door to the Diggings waits for it: belowtownThrone.js. Not once the
    // light's gone up: "before you go down" would be a bit late by then.)
    { x: 19, y: 6, w: 10, h: 3, scene: 'tucks_whisper', after: 'the_kings_welcome', until: ['the_light_goes_up', 'homecoming'] },
    { x: 1, y: 9, w: 36, h: 3, scene: 'homecoming', after: 'the_light_goes_up' },
    // The end of the chapter: out of the fallen hall, Tuck leads you to the secret way.
    { x: 20, y: 19, w: 1, h: 1, scene: 'tuck_shows_the_way', after: 'the_hall_falls' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'sunstone', x: 22, y: 4, cast: 'sunstone', animation: 'sunstone_dim_pulse', speed: 1.1, walkable: true, until: 'the_light_goes_up', glow: sunstoneGlow(false, 130) },
    { sprite: 'sunstone_bright', x: 22, y: 4, cast: 'sunstone', animation: 'sunstone_bright_pulse', speed: 0.5, walkable: true, after: 'the_light_goes_up', glow: sunstoneGlow(true, 130) },
    { sprite: 'savepoint', x: 16, y: 10, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 16, y: 8, travel: 'belowtown', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    { sprite: 'town_well', x: 17, y: 12, text: 'square_well' },
    { sprite: 'hero_statue_old', x: 21, y: 16, text: 'square_statue' },
    { sprite: 'town_noticeboard', x: 6, y: 8, text: 'square_noticeboard' },
    { sprite: 'town_signpost', x: 9, y: 9, text: 'square_signpost' },
    { sprite: 'bench', x: 30, y: 10, text: 'square_bench' },
    { sprite: 'bench', x: 13, y: 16, text: 'square_bench' },
    { sprite: 'glowworm_string', x: 14, y: 8, animation: 'glowworm_string', speed: 0.4, walkable: true, decor: true },
    { sprite: 'glowworm_string', x: 24, y: 8, animation: 'glowworm_string', speed: 0.4, walkable: true, decor: true },
    { sprite: 'glowworm_string', x: 19, y: 17, animation: 'glowworm_string', speed: 0.4, walkable: true, decor: true },
    { sprite: 'glowworm_lamp', x: 10, y: 7, text: 'square_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 27, y: 7, text: 'square_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 7, y: 15, text: 'square_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 31, y: 15, text: 'square_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'town_barrels', x: 33, y: 9, text: 'square_barrels' },
    { sprite: 'bf_beetle_postman', x: 9, y: 12, npc: 'bt_postman', animation: 'bf_beetle_postman', speed: 0.5, stroll: { wander: [3, 12, 12, 13], speed: 14, pause: [2, 5], greet: true } },
    { sprite: 'bf_frog_kid_a', x: 24, y: 12, npc: 'bt_sq_frogkid_ball', animation: 'bf_frog_kid_a', speed: 0.4, stroll: { wander: [23, 12, 28, 16], speed: 26, pause: [0.8, 2.5], hop: true, scatter: true, greet: true } },
    { sprite: 'bf_ball', x: 25, y: 15, walkable: true, stroll: { ball: true, keepAnim: true } },
    { sprite: 'bf_frog_kid_b', x: 26, y: 13, npc: 'bt_sq_frogkid_sword', animation: 'bf_frog_kid_b', speed: 0.45, stroll: { wander: [23, 12, 28, 16], speed: 30, pause: [0.5, 2], hop: true, scatter: true } },
    { sprite: 'bf_mole_miner_a', x: 6, y: 14, npc: 'bt_sq_mole', animation: 'bf_mole_miner_a', speed: 0.5 },
    { sprite: 'bf_glowworm', x: 15, y: 14, npc: 'bt_sq_lamplighter', animation: 'bf_glowworm', speed: 0.4, stroll: { path: [[9, 14], [16, 14]], speed: 12, pause: [3, 5], greet: true }, glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    { sprite: 'bf_snail_elder', x: 30, y: 14, npc: 'bt_sq_snail', animation: 'bf_snail_elder', speed: 0.5, stroll: { path: [[29, 14], [33, 14]], speed: 4, pause: [3, 7], greet: true } },
    // After the king's welcome: party scraps in front of the throne hall and across the plaza.
    { sprite: 'bf_confetti_a', x: 20, y: 7, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_confetti_b', x: 25, y: 7, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_streamer', x: 23, y: 8, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_confetti_b', x: 18, y: 12, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_streamer', x: 27, y: 10, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_confetti_a', x: 21, y: 13, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_mole_miner_b', x: 13, y: 18, npc: 'bt_sq_mole2', animation: 'bf_mole_miner_b', speed: 0.5 },
    { sprite: 'gold_pouch', x: 35, y: 19, text: 'square_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'bf_drummer', x: 19, y: 11, npc: 'bt_band_a', animation: 'bf_drummer', speed: 0.16, after: 'the_light_goes_up', glow: DRUMMER_GLOW },
    { sprite: 'bf_drummer', x: 21, y: 11, npc: 'bt_band_b', animation: 'bf_drummer', speed: 0.2, after: 'the_light_goes_up', glow: DRUMMER_GLOW },
    { sprite: 'bf_glowworm', x: 20, y: 14, npc: 'bt_dancer_a', animation: 'bf_glowworm', speed: 0.3, after: 'the_light_goes_up', glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    { sprite: 'bf_glowworm', x: 23, y: 15, npc: 'bt_dancer_b', animation: 'bf_glowworm', speed: 0.35, after: 'the_light_goes_up', glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    // (East of the well, off every walk the homecoming starts with, wherever you come in from.)
    { sprite: 'bf_frog_kid_a', x: 25, y: 11, npc: 'bt_sq_party_kid', animation: 'bf_frog_kid_a', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'bf_mole_crowd', x: 28, y: 11, npc: 'bt_sq_cheer_a', animation: 'bf_mole_crowd', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'bf_mole_crowd_b', x: 30, y: 8, npc: 'bt_sq_cheer_b', animation: 'bf_mole_crowd_b', speed: 0.38, after: 'the_light_goes_up' },
    { sprite: 'bf_mole_crowd_c', x: 12, y: 13, npc: 'bt_sq_cheer_c', animation: 'bf_mole_crowd_c', speed: 0.33, after: 'the_light_goes_up' },
    // The life pass (14 Nov): washing, tea, a stew pot, chalk, pigeons, and a stash in the alley.
    { sprite: 'bf_frog_kid_b', x: 34, y: 12, npc: 'bt_sq_hopscotch', animation: 'bf_frog_kid_b', speed: 0.45, stroll: { wander: [34, 12, 36, 15], speed: 24, pause: [0.8, 2.5], hop: true, scatter: true, greet: true } },
    { sprite: 'bf_mole_miner_a', x: 15, y: 17, npc: 'bt_sq_offshift', animation: 'bf_mole_miner_a', speed: 0.5, stroll: { path: [[14, 17], [24, 17]], speed: 11, pause: [3, 6], greet: true } },
    { sprite: 'bt_menu_board', x: 8, y: 7, text: 'bl_inn_board' },
    { sprite: 'bt_doorstep_shoes', x: 5, y: 6, text: 'bl_sq_shoes', gives: 'odd_sock', taken: { sprite: 'bt_doorstep_shoes', text: 'bl_shoes_b' }, walkable: true },
    { sprite: 'bt_drying_rack', x: 2, y: 7, text: 'bl_drying_rack' },
    { sprite: 'bt_tall_shroom', x: 1, y: 6, text: 'bl_tall_shroom' },
    { sprite: 'bt_tall_shroom', x: 36, y: 7, text: 'bl_tall_shroom' },
    { sprite: 'bt_tea_table', x: 31, y: 7, text: 'bl_sq_tea' },
    { sprite: 'bt_tea_table', x: 35, y: 8, text: 'bl_sq_tea' },
    { sprite: 'bt_stool', x: 33, y: 7, text: 'bl_stool' },
    { sprite: 'bt_pick_rack', x: 1, y: 16, text: 'bl_pick_rack' },
    { sprite: 'bt_cook_pot', x: 11, y: 16, text: 'bl_stew_pot', animation: 'bt_cook_pot', speed: 0.35 },
    { sprite: 'bt_stool', x: 10, y: 17, text: 'bl_stool' },
    { sprite: 'bt_hand_cart', x: 35, y: 16, text: 'bl_cart' },
    { sprite: 'bt_toys', x: 26, y: 15, text: 'bl_toys', walkable: true },
    { sprite: 'bf_chalk_a', x: 35, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'bf_chalk_b', x: 35, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'bf_chalk_a', x: 35, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'bf_chalk_x', x: 35, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'bt_pigeons', x: 14, y: 10, text: 'bl_pigeons', animation: 'bt_pigeons', speed: 0.6, walkable: true },
    { sprite: 'bt_pigeons', x: 30, y: 12, text: 'bl_pigeons', animation: 'bt_pigeons', speed: 0.75, walkable: true },
    { sprite: 'bt_dice_board', x: 31, y: 17, text: 'bl_dice', walkable: true },
    { sprite: 'bt_stalagmite', x: 1, y: 20, text: 'bl_stalagmite' },
    { sprite: 'bt_stalagmite', x: 36, y: 20, text: 'bl_stalagmite' },
    { sprite: 'bt_mushroom_tub', x: 7, y: 17, text: 'bl_tub' },
    { sprite: 'bt_mushroom_tub', x: 9, y: 19, text: 'bl_tub' },
    { sprite: 'bt_sacks', x: 3, y: 17, text: 'bl_sacks' },
    { sprite: 'bt_glow_patch_a', x: 7, y: 20, walkable: true, decor: true },
    { sprite: 'bt_glow_patch_b', x: 33, y: 19, walkable: true, decor: true },
    { sprite: 'bt_poster_a', x: 18, y: 5, text: 'bl_sq_poster', walkable: true },
    { sprite: 'bt_poster_b', x: 27, y: 5, text: 'bl_poster_gig', walkable: true },
    { sprite: 'bt_wall_pegs', x: 31, y: 5, text: 'bl_pegs', walkable: true },
    // The skinny alley between the Hall of the Visit and the throne hall: a stash.
    { sprite: 'bt_glow_patch_a', x: 29, y: 4, walkable: true, decor: true },
    { sprite: 'gold_pouch', x: 29, y: 3, text: 'bl_sq_alley', gives: 'bl_den_shoe', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'town_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall', 5: 'town_house', 6: 'town_house', 7: 'town_house', a: 'town_plank', w: 'town_plank', e: 'town_plank', F: 'town_toadstools', I: 'town_pillar', J: 'town_broken_pillar' },

  // Nobody to fight in town. The scenes (tucks_whisper, homecoming) use the
  // plaza between x 14 and 28, y 8 to 13; the folk who stand there are cast
  // in them and put back. The folk who walk about stay out of it: the kids
  // and their ball in the south east (x 23 to 28, y 12 to 16), the
  // lamplighter on row 14, the postman on rows 12 and 13 in the west, the
  // snail on row 14 in the east. (Folk never step onto a cutscene's trigger tiles.)
  npcs: [],
};
