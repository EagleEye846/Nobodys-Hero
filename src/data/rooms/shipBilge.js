// THE BILGE: the lowest room, black timbers sweating, the ship's own ballast water slopping about in the middle. The
// water goes where the list sends it: leaning to PORT (as found) it stands over the north half (rows 3-6, x 9-22), the south half is dry bed; leaning to
// STARBOARD it stands over the south half (rows 8-11) and the north bed shows. The captain's KEY hangs on a nail on the sump board at (15,4): under
// the north water to port, reachable (from row 5) to starboard. A purse (16,10) on the south bed is reachable only leaning
// to port. Row 7 is dry both ways, so you can always walk across. A crank on each landing (5,7), (25,7) turns her.
// Lantern: a boy bailing with a bucket that is not there, his footprints, a handprint on the hull, chalk (HOME).
// Taking the key is the gift (the captains_key keepsake and the friends' answers): the cabin door on the deck is what turns to it.
// Scene ship_bilge_in (x 4, rows 4-6, once). The ladder (2-3, row 3) is the way back up to the hold.
// Tile key: # hull (solid)   W planking face (solid)   . bilge floor   ~ the ballast water (solid)

export const SHIP_BILGE = {
  id: 'ship_bilge',
  name: 'THE BILGE',
  area: 'ghostship',
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
      '#............................#',
      '#............................#',
      '#............................#',
      '#............................#',
      '###........................###',
      '##############################',
      '##############################',
    ],

  // The STARBOARD map (a space is "same as the port map above").
  list: { star: [
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

  cutscenes: [{ x: 4, y: 4, w: 1, h: 3, scene: 'ship_bilge_in' }],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'gs_ladder', x: 2, y: 3, flat: true, walkable: true, text: 'bilge_ladder' },
    { sprite: 'gs_ladder', x: 3, y: 3, flat: true, walkable: true, text: 'bilge_ladder' },
    { sprite: 'gs_crank', x: 5, y: 7, text: 'bilge_crank', listWheel: { to: 'toggle', port: 'crank_port', star: 'crank_star', busy: 'crank_busy', already: 'crank_already' } },
    { sprite: 'gs_crank', x: 25, y: 7, text: 'bilge_crank', listWheel: { to: 'toggle', port: 'crank_port', star: 'crank_star', busy: 'crank_busy', already: 'crank_already' } },
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
    { sprite: 'gs_barrel_staves', x: 12, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 9, y: 10, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'bilge_wall', W: 'bilge_wall', '~': 'bilge_water' },

  // The deckhand patrols the middle band (row 7, x 11-20: dry at both leans) and flees the light; the powder monkey the east landing (row 9, x 24-27) and stops dead in it. Neither is on a tile that changes, a ladder, a crank or the key's pool.
  npcs: [
    { enemy: 'ghost_deckhand', x: 12, y: 7, patrol: [11, 20], behaviour: 'patrol', lantern: 'flee' },
    { enemy: 'powder_monkey', x: 25, y: 9, patrol: [24, 27], behaviour: 'patrol', lantern: 'freeze' },
  ],
};
