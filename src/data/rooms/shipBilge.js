// THE BILGE: the lowest room, black timbers sweating, the ship's own ballast water slopping about in the middle. Nothing
// to turn down here: SHE LURCHES BY HERSELF (shipList.js `list.lurch`). Every few seconds (3.5 of play, after the water
// has settled) a creak and a shudder, a second's warning, and she rolls over the other way, and the black water runs
// across the floor to the low side. The middle of the floor (x 9-22) is never all dry: leaning to PORT (as found, every
// time you come in: `list.own`) the water stands over the north half (rows 3-7) and the south bed (rows 8-11) is dry;
// to STARBOARD it runs south (rows 7-11) and the north bed shows. Row 7 is always under. The two landings, west (x 1-8,
// the ladder) and east (x 23-28), are always dry.
// THE PUZZLE (a timed dash): the captain's KEY hangs on a nail on the sump board at (15,4), out in the north bed. Wait on
// the west landing for her to roll to starboard, run the seven tiles out to it while the water is away, take it, and
// get back before she rolls again. Caught by the water you are washed to the nearest dry boards and lose a little HP;
// never worse, and the landings are always there. A purse (16,10) lies out on the south bed (dry to port), another
// (26,4) and a sea chest on the east landing.
// Lantern: a boy bailing with a bucket that is not there, his footprints, a handprint on the hull, chalk.
// Taking the key is the gift (the captains_key keepsake and the friends' answers): the cabin door on the deck is what turns to it.
// Scene ship_bilge_in (x 4, rows 3-11, once). The ladder (2-3, row 3) is the way back up to the hold.
// Tile key: # hull (solid)   W planking face (solid)   . bilge floor   ~ the ballast water (solid)

import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_BILGE = {
  id: 'ship_bilge',
  name: 'THE BILGE',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.2,
  music: 'ghostShip',
  musicFrom: 'list',
  ambience: 'ghost_ship_deep',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...bail...', '...keep bailing...', '...it\'s only a little water...', '...Mother...'] },
  playerStart: { x: 3, y: 5 },

  tiles: [
      '##############################',
      '##############################',
      '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
      '##........~~~~~~~~~~~~~.....##',
      '#........~~~~~~~~~~~~~.......#',
      '#........~~~~~~~~~~~~~~......#',
      '#.........~~~~~~~~~~~~~......#',
      '#........~~~~~~~~~~~~~~......#',
      '#............................#',
      '#............................#',
      '#............................#',
      '###........................###',
      '##############################',
      '##############################',
    ],

  // The STARBOARD map (a space is "same as the port map above"). Her lean is the room's own (port each time you come in),
  // and she lurches by herself; the water washes you off a tile after 0.3 s.
  list: { own: true, lurch: { every: 3.5, warn: 1, first: 4 }, creep: 0.9, wait: 0.3, star: [
      '                              ',
      '                              ',
      '                              ',
      '          .............       ',
      '         .............        ',
      '         ..............       ',
      '          .............       ',
      '                              ',
      '          ~~~~~~~~~~~~~       ',
      '         ~~~~~~~~~~~~~~       ',
      '         ~~~~~~~~~~~~~~       ',
      '          ~~~~~~~~~~~~        ',
      '                              ',
      '                              ',
    ] },

  doors: [
    { x: 2, y: 3, w: 2, h: 1, to: 'ship_hold', spawn: { x: 34, y: 13 } },
  ],

  // The whole column x 4 (rows 3-11), so you can't step round it on the way in.
  cutscenes: [{ x: 4, y: 3, w: 1, h: 9, scene: 'ship_bilge_in' }],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'gs_ladder', x: 2, y: 3, flat: true, walkable: true, text: 'bilge_ladder' },
    { sprite: 'gs_ladder', x: 3, y: 3, flat: true, walkable: true, text: 'bilge_ladder' },
    { sprite: 'gs_key_hook', x: 15, y: 4, text: 'bilge_key', gives: 'captains_key', react: true, taken: { sprite: 'gs_key_hook_bare', text: 'bilge_key_taken' } },
    { sprite: 'gold_pouch', x: 16, y: 10, text: 'bilge_purse', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 26, y: 4, text: 'bilge_purse_b', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'in_sea_chest_small', x: 26, y: 10, text: 'bilge_chest' },
    { sprite: 'gs_ghost_boy', x: 7, y: 10, text: 'ghost_bilge_boy', animation: 'gs_ghost_boy', speed: 0.55, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_prints_a', x: 4, y: 5, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 6, y: 6, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 8, y: 7, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 9, y: 8, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 9, y: 9, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_chalk', x: 22, y: 2, text: 'bilge_chalk', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_handprint', x: 24, y: 5, text: 'bilge_handprint', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'c5_ship_ribs', x: 5, y: 2, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 20, y: 2, text: 'bilge_ribs' },
    { sprite: 'wy_bilge_slick', x: 11, y: 7, flat: true, walkable: true, text: 'bilge_slick' },
    { sprite: 'wy_bilge_slick_b', x: 19, y: 8, flat: true, walkable: true, text: 'bilge_slick' },
    { sprite: 'gs_puddle', x: 3, y: 9, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 24, y: 9, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 12, y: 11, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 6, y: 4, flat: true, walkable: true },
    { sprite: 'gs_coil', x: 27, y: 6, flat: true, walkable: true, text: 'deck_coil' },
    { sprite: 'wy_ribs_jag', x: 13, y: 12 },
    { sprite: 'gs_shadow_b', x: 4, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 25, y: 4, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 17, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 11, y: 8, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 5, y: 7, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 10, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 5, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 23, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 15, y: 7, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 2, y: 6, flat: true, walkable: true },
    { sprite: 'gs_net_drape', x: 26, y: 2, text: 'dress_net' },
    { sprite: 'gs_post_lantern', x: 6, y: 9, text: 'dress_lantern' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_knee', x: 3, y: 2 },
    { sprite: 'gs_knee_r', x: 7, y: 2 },
    { sprite: 'gs_knee', x: 12, y: 2 },
    { sprite: 'gs_knee_r', x: 18, y: 2 },
    { sprite: 'gs_knee', x: 22, y: 2 },
    { sprite: 'gs_knee_r', x: 26, y: 2 },
    { sprite: 'gs_wall_lantern', x: 5, y: 2 },
    { sprite: 'gs_wall_lantern', x: 24, y: 2 },
    { sprite: 'gs_wall_lantern', x: 15, y: 2 },
    { sprite: 'gs_web_l', x: 2, y: 10, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 8, y: 8, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 22, y: 8, flat: true, walkable: true },
    { sprite: 'gs_bucket', x: 5, y: 8, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 20, y: 9, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 14, y: 9, flat: true, walkable: true },
    { sprite: 'gs_lantern_smashed', x: 18, y: 8, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 26, y: 8, flat: true, walkable: true },
    { sprite: 'gs_crate_smashed', x: 3, y: 9, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 9, y: 10, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_bilge ?? []),
  ],
  tileTexts: { '#': 'bilge_wall', W: 'bilge_wall', '~': 'bilge_water' },

  // Both on the east landing, which is always dry: the deckhand patrols its north end (row 5, x 24-27) and flees the light; the powder monkey its
  // south end (row 9, x 24-27) and stops dead in it. Neither is on a tile that changes, the ladder, the scene's column (x 4) or the key's run.
  npcs: [
    { enemy: 'ghost_deckhand', x: 25, y: 5, patrol: [24, 27], behaviour: 'patrol', lantern: 'flee' },
    { enemy: 'powder_monkey', x: 25, y: 9, patrol: [24, 27], behaviour: 'patrol', lantern: 'freeze' },
  ],
};
