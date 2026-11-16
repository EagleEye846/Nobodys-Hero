// THE DECK of the Fair Return: a brig's long open deck in a fog like a wall. The stern is on the left, a raised poop
// deck with the HELM (the ship's wheel: turn it and she leans to port or starboard, and the loose cargo slides: see
// src/overworld/shipList.js) and under it the captain's door, bolted; the mast stands in the middle with the shrouds
// going up into the fog; the two hatches are the way down (the quarters, aft; the hold, forward, with barrels loose
// on its cover). One ship's lantern is burning on its hook beside the cabin, with no oil in it. Take it: L puts it
// out and lights it, and what is only there in the light (the crew, still at their stations, wet footprints, chalk)
// shows (src/overworld/haunt.js).
// NO PUZZLE on the deck. The helm still turns (she leans, the loose crate slides), for the feel of her and for one small
// secret: the crate at the north rail sits on a purse (27,5) while she leans to port; at the south rail (27,15) it sits
// on the other purse while she leans starboard, so turn the wheel and both come free. (Her lean on deck is the ship's own
// one list, shared with the quarters, hold, cabin and rigging; the gun deck, bilge and flooded bow keep their own.)
// The hold hatch: barred from below until you have been down (ship_hold_in); the two barrels that sat on it are found
// roped clear either side of it after that, so the way down is open whichever way she leans. Nothing here is needed to
// go on except the lantern and the way down to the quarters.
// Scenes: ship_deck_in (the row above the gangway, once), ship_cabin_open (once the captain's key is in the bag).
// Tile key (src/overworld/coastTiles.js, ghostship):
//   #  rail / bulkhead top (solid)   W  rail face (solid)   w  porthole (solid)   .  deck planks   o  the poop's boards / the gangway end
//   ~  black water outside the hull (solid)

import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_DECK = {
  id: 'ship_deck',
  name: 'THE DECK',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.3,
  // "Port Tomorrow" (src/data/music/ghostShipTheme.js).
  music: 'ghostShip',
  ambience: 'ghost_ship',
  vesWell: true,
  // Out in the fog, but the fog is as thick as a roof: dark by the lamplight rules, no lightning.
  lastLight: { x: 20, y: 16 },
  // The haunting (src/overworld/haunt.js): the lights go low now and then, and the dark whispers.
  haunt: { whispers: ['...nearly home...', '...is it morning...', '...hold her steady...', '...Mother...', '...Day forty-one...'] },

  tiles: [
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~#############################~~~~~~~~~',
      '~~~#WWWWWWWWWWWWWWWWWWWWWWWWWWWWW##~~~~~~~',
      '~~~#ooooooo......................WW##~~~~~',
      '~~~#ooooooo........................WW#~~~~',
      '~~~#ooooooo#.........................W#~~~',
      '~~~#ooooooo#..........................W#~~',
      '~~~#ooooooo#...........................W#~',
      '~~~#ooooooo#............................#~',
      '~~~#oooooooo............................#~',
      '~~~#ooooooo#............................#~',
      '~~~#ooooooo#............................#~',
      '~~~#ooooooo#...........................##~',
      '~~~#oooooooW..........................##~~',
      '~~~#ooooooo..........................##~~~',
      '~~~#ooooooo........................###~~~~',
      '~~~#ooooooo......................###~~~~~~',
      '~~~#################oo############~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ],

  // No tiles change here, but she leans, and the whole room with her; the loose cargo slides (src/overworld/shipList.js).
  list: {},

  playerStart: { x: 20, y: 16 },

  doors: [
    // Down the gangway plank to the quay.
    { x: 20, y: 18, w: 2, h: 1, to: 'ship_plank', spawn: { x: 29, y: 8 } },
    // The crew's quarters (always open).
    { x: 16, y: 5, w: 2, h: 1, to: 'ship_quarters', spawn: { x: 14, y: 3 } },
    // The hold hatch: barred from below until you've been down there (and shut under the barrels while she lists to port).
    { x: 29, y: 10, w: 2, h: 1, to: 'ship_hold', spawn: { x: 34, y: 4 }, after: 'ship_hold_in', notYet: 'hatch_barred' },
    // Up the shrouds to the crow's nest.
    { x: 22, y: 7, w: 2, h: 1, to: 'ship_rigging', spawn: { x: 9, y: 19 } },
    // The captain's cabin, once the door's been unlocked.
    { x: 11, y: 10, w: 1, h: 1, to: 'ship_cabin', spawn: { x: 23, y: 7 }, after: 'ship_cabin_open', notYet: 'cabin_locked' },
  ],

  cutscenes: [
    // Rows 15-16 at the gangway's head, taking in the tile you arrive on (20,16), so it plays as you step aboard.
    { x: 19, y: 15, w: 4, h: 2, scene: 'ship_deck_in' },
    // The key turns in the captain's door (only once it's been found).
    { x: 12, y: 9, w: 1, h: 3, scene: 'ship_cabin_open', gear: 'captains_key' },
    // (2026-11-14) Bramble and the ship's boy (bramble_and_the_boy, once): the deck just north of the boy (17,14), once you
    // carry the lantern (he can only be spoken to in its light; the scene lights it). Off the boy's own tile, the lantern's
    // hook (13,12) and the gangway head's trigger (19-22, rows 15-16).
    { x: 12, y: 8, w: 10, h: 6, scene: 'bramble_and_the_boy', gear: 'ship_lantern', after: 'ship_deck_in' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. `loose` is cargo that slides when she leans (shipList.js).
  textFile: 'interactions/ghostship.txt',
  props: [
    // A save point at the gangway's head (beside where you come aboard), before the captain.
    { sprite: 'savepoint', x: 15, y: 16, save: true },
    { sprite: 'gs_helm', x: 7, y: 10, text: 'deck_helm', listWheel: { to: 'toggle', port: 'helm_port', star: 'helm_star', busy: 'helm_busy', already: 'helm_already' } },
    { sprite: 'gs_lantern', x: 13, y: 12, text: 'deck_lantern', animation: 'gs_lantern', speed: 0.35, gives: 'ship_lantern', react: true, taken: { sprite: 'gs_lantern_hook', text: 'deck_lantern_taken' } },
    // The captain's door: a framed gap in the poop's front wall with a warm lit threshold, so it reads as a door even swung open.
    { sprite: 'gs_door_frame', x: 11, y: 10, flat: true, walkable: true },
    { sprite: 'gs_side_door_low', x: 11, y: 10, text: 'deck_cabin_door', until: 'ship_cabin_open' },
    { sprite: 'gs_side_door_low_open', x: 11, y: 10, text: 'deck_cabin_door_open', walkable: true, after: 'ship_cabin_open' },
    { sprite: 'gs_mast', x: 23, y: 10, text: 'deck_mast' },
    { sprite: 'gs_ratlines', x: 22, y: 7, text: 'deck_shrouds', walkable: true },
    { sprite: 'gs_hatch', x: 16, y: 5, text: 'deck_hatch_quarters', walkable: true, flat: true },
    { sprite: 'gs_hatch', x: 29, y: 10, text: 'deck_hatch_hold', walkable: true, flat: true },
    { sprite: 'c5_barrel', x: 29, y: 10, text: 'deck_loose_barrel', loose: { port: [29, 10], star: [29, 16] }, until: 'ship_hold_in' },
    { sprite: 'c5_barrel', x: 30, y: 10, text: 'deck_loose_barrel', loose: { port: [30, 10], star: [30, 16], seconds: 1.5 }, until: 'ship_hold_in' },
    // Once you've been down in the hold, the two barrels stand roped either side of the hatch, so the way back down
    // is always open from the deck, whichever way she's leaning.
    { sprite: 'c5_barrel', x: 28, y: 10, text: 'deck_lashed_barrel', after: 'ship_hold_in' },
    { sprite: 'c5_barrel', x: 31, y: 10, text: 'deck_lashed_barrel', after: 'ship_hold_in' },
    { sprite: 'c5_crate', x: 27, y: 5, text: 'deck_loose_crate', loose: { port: [27, 5], star: [27, 15], seconds: 1.7 } },
    { sprite: 'gold_pouch', x: 27, y: 5, text: 'deck_purse', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 27, y: 15, text: 'deck_purse_b', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gs_ship_bell', x: 35, y: 10, text: 'deck_bell', sound: 'bell' },
    // The bow's point (2026-11-14): the stem head on the rail, the bowsprit's heel lashed to it, and out at the end of it
    // in the fog, a small cold blue light (the shard in the figurehead, far forward: shipSignposts.js). Dark once she's dealt with.
    { sprite: 'gs_bow_star', x: 40, y: 11, text: 'deck_bow_star', until: ['figurehead_spared', 'figurehead_beaten'] },
    { sprite: 'gs_bow_dark', x: 40, y: 11, text: 'deck_bow_dark', after: ['figurehead_spared', 'figurehead_beaten'] },
    { sprite: 'gs_ghost_mate', x: 5, y: 11, text: 'ghost_mate', animation: 'gs_ghost_mate', speed: 0.9, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_rail', x: 20, y: 4, text: 'ghost_rail_a', animation: 'gs_ghost_rail', speed: 1.1, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_rail', x: 26, y: 4, text: 'ghost_rail_b', animation: 'gs_ghost_rail', speed: 1.3, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_rail', x: 33, y: 15, text: 'ghost_rail_c', animation: 'gs_ghost_rail', speed: 1.0, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_boy', x: 17, y: 14, cast: 'deck_boy', text: 'ghost_boy', animation: 'gs_ghost_boy', speed: 0.7, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_old', x: 31, y: 6, text: 'ghost_old', animation: 'gs_ghost_old', speed: 1.4, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_prints_a', x: 20, y: 15, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 19, y: 13, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 19, y: 11, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 18, y: 9, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 17, y: 7, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_chalk', x: 13, y: 7, text: 'deck_chalk', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_coil', x: 9, y: 16, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 25, y: 11, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 15, y: 9, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 26, y: 13, flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 6, y: 6, flat: true, walkable: true },
    { sprite: 'c5_barrels', x: 35, y: 6, text: 'deck_barrels' },
    { sprite: 'c5_crates_stack', x: 34, y: 13, text: 'deck_crates' },
    { sprite: 'c5_rope_coil', x: 12, y: 16, text: 'deck_coil', walkable: true },
    { sprite: 'c5_oar_stuck', x: 38, y: 12, text: 'deck_oar' },
    { sprite: 'c5_planks_scatter', x: 24, y: 16, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 31, y: 12, flat: true, walkable: true },
    { sprite: 'in_boots', x: 18, y: 12, text: 'deck_boots', flat: true, walkable: true },
    { sprite: 'c5_chain_bollard', x: 36, y: 9, text: 'deck_bollard' },
    { sprite: 'gs_shadow_b', x: 26, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 7, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 30, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 23, y: 12, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 32, y: 12, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 21, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 10, y: 8, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 37, y: 11, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 7, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 10, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 20, y: 13, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 24, y: 4, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 11, y: 16, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 24, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 7, y: 14, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 16, y: 4, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 27, y: 5, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 4, y: 4, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 15, y: 8, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 9, y: 16, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 21, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 7, y: 15, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 19, y: 12, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 4, y: 0, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 41, y: 14, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 11, y: 21, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 23, y: 19, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 2, y: 5, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 41, y: 5, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 30, y: 20, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 26, y: 20, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 41, y: 17, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 31, y: 19, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 1, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 17, y: 0, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 8, y: 21, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 38, y: 18, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 38, y: 17, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 28, y: 21, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 0, y: 17, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 6, y: 21, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 15, y: 21, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 35, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 0, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 18, y: 0, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 22, y: 1, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 2, y: 16, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 8, y: 1, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 1, y: 18, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 17, y: 21, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 1, y: 19, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 23, y: 20, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 39, y: 20, flat: true, walkable: true },
    { sprite: 'gs_rail_broken', x: 30, y: 3, text: 'dress_rail' },
    { sprite: 'gs_rail_broken', x: 4, y: 3, text: 'dress_rail' },
    { sprite: 'gs_rail_broken', x: 14, y: 3, text: 'dress_rail' },
    { sprite: 'gs_net_drape', x: 9, y: 3, text: 'dress_net' },
    { sprite: 'gs_net_drape', x: 26, y: 3, text: 'dress_net' },
    { sprite: 'gs_net_drape', x: 22, y: 3, text: 'dress_net' },
    { sprite: 'gs_post_lantern', x: 33, y: 12, text: 'dress_lantern' },
    { sprite: 'gs_post_lantern', x: 13, y: 5, text: 'dress_lantern' },
    { sprite: 'gs_post_lantern', x: 26, y: 16, text: 'dress_lantern' },
    { sprite: 'gs_post_lantern', x: 8, y: 16, text: 'dress_lantern' },
    { sprite: 'gs_spar_fallen', x: 24, y: 6, flat: true, walkable: true, text: 'dress_spar' },
    { sprite: 'gs_sail_heap', x: 14, y: 15, flat: true, walkable: true, text: 'dress_sail' },
    { sprite: 'gs_sail_heap', x: 34, y: 7, flat: true, walkable: true, text: 'dress_sail' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_rail_post', x: 6, y: 3 },
    { sprite: 'gs_rail_post', x: 11, y: 3 },
    { sprite: 'gs_rail_post', x: 18, y: 3 },
    { sprite: 'gs_rail_post', x: 24, y: 3 },
    { sprite: 'gs_rail_post', x: 29, y: 3 },
    { sprite: 'gs_bitts', x: 8, y: 3 },
    { sprite: 'gs_capstan', x: 16, y: 3 },
    { sprite: 'gs_deadeyes', x: 12, y: 3 },
    { sprite: 'gs_deadeyes', x: 20, y: 3 },
    { sprite: 'gs_wall_lantern', x: 10, y: 3 },
    { sprite: 'gs_wall_lantern', x: 27, y: 3 },
    { sprite: 'gs_stay_mast', x: 13, y: 3 },
    { sprite: 'gs_stay_mast', x: 28, y: 3 },
    { sprite: 'gs_rail_post', x: 33, y: 3 },
    { sprite: 'gs_bitts', x: 11, y: 7 },
    { sprite: 'gs_capstan', x: 11, y: 12 },
    { sprite: 'gs_deadeyes', x: 11, y: 13 },
    { sprite: 'gs_wall_lantern', x: 11, y: 8 },
    { sprite: 'gs_rail_post', x: 5, y: 18 },
    { sprite: 'gs_rail_post', x: 8, y: 18 },
    { sprite: 'gs_rail_post', x: 12, y: 18 },
    { sprite: 'gs_rail_post', x: 16, y: 18 },
    { sprite: 'gs_rail_post', x: 24, y: 18 },
    { sprite: 'gs_rail_post', x: 27, y: 18 },
    { sprite: 'gs_rail_post', x: 31, y: 18 },
    { sprite: 'gs_deadeyes', x: 10, y: 18 },
    { sprite: 'gs_deadeyes', x: 29, y: 18 },
    { sprite: 'gs_bitts', x: 14, y: 18 },
    { sprite: 'gs_stay_mast', x: 4, y: 18 },
    { sprite: 'gs_stay_mast', x: 33, y: 18 },
    { sprite: 'gs_mast_step', x: 23, y: 10, flat: true, walkable: true },
    { sprite: 'gs_grating', x: 27, y: 7, flat: true, walkable: true },
    { sprite: 'gs_grating', x: 33, y: 15, flat: true, walkable: true },
    { sprite: 'gs_net_heap', x: 28, y: 14, flat: true, walkable: true },
    { sprite: 'gs_bucket', x: 21, y: 13, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 27, y: 16, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 31, y: 8, flat: true, walkable: true },
    { sprite: 'gs_crate_smashed', x: 37, y: 14, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 33, y: 11, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 14, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 24, y: 8, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 17, y: 16, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 14, y: 12, flat: true, walkable: true },
    { sprite: 'gs_lantern_smashed', x: 36, y: 8, flat: true, walkable: true },
    { sprite: 'gs_tricorn', x: 8, y: 12, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 6, y: 9, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 9, y: 14, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 7, y: 16, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 20, y: 16, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 35, y: 11, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 29, y: 5, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_deck ?? []),
  ],
  tileTexts: { '#': 'deck_rail', W: 'deck_rail_face', '~': 'deck_water', o: 'deck_planks' },

  // Both of them are clear of every door, hatch, trigger and the lantern's hook (comments on each line).
  npcs: [
    { enemy: 'ghost_deckhand', x: 24, y: 13, patrol: [24, 27], behaviour: 'patrol', lantern: 'flee' },
    { enemy: 'powder_monkey', x: 33, y: 9, patrol: [32, 35], behaviour: 'wander', lantern: 'freeze' },
  ],
};
