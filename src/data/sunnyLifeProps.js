// The life pass, round 2: the things to look at and press Z on in Sunnyside. Each room's list is spread
// into its props. Every one is bodiless (`walkable`) so none can block a route, a push, a gust, a swing or
// a cutscene walk (the one exception is Burdock the mole, who sits clear of every route). Their words
// are the `r5s_*` sections at the end of the room's text file, `_ves` (and in chapter 5 `_bramble`)
// after them. Art: src/data/art/sunnyLife.js. Living things that move about are touches
// (src/data/sunnyTouches.js, src/overworld/sunnyLife.js).
//
//   w(sprite, x, y)               a bit of dressing, nothing to read
//   t(sprite, x, y, text)         something to press Z on
//   an(sprite, x, y, speed)       dressing that moves (the sprite's own animation)
//   at(sprite, x, y, speed, text) something that moves and talks
const w = (sprite, x, y, o = {}) => ({ sprite, x, y, walkable: true, decor: true, ...o });
const t = (sprite, x, y, text, o = {}) => ({ sprite, x, y, text, walkable: true, ...o });
const an = (sprite, x, y, speed, o = {}) => ({ sprite, x, y, animation: sprite, speed, walkable: true, decor: true, ...o });
const at = (sprite, x, y, speed, text, o = {}) => ({ sprite, x, y, text, animation: sprite, speed, walkable: true, ...o });
const flat = { flat: true };

export const R5S_PROPS = {
  // ---- The Lane (chapters 4 and 5) ----
  sunny_lane: [
    t('r5s_lemon_crate', 6, 8, 'r5s_lane_lemons', { walkable: false }),
    at('r5s_birdhouse', 31, 6, 1.7, 'r5s_lane_birdhouse', { walkable: false }),
  ],
  // ---- The Field Beyond the Gate ----
  sunny_gate_field: [
    t('r5s_straw_hat', 21, 12, 'r5s_gate_hat', { walkable: false }),
    t('r5s_well', 27, 6, 'r5s_gate_well', { walkable: false }),
  ],
  // ---- The Brook ----
  sunny_brook: [
    at('r5s_molehill', 11, 16, 2.4, 'r5s_brook_mole', { walkable: false }),
  ],
  // ---- The Soft Field ----
  sunny_soft_field: [
    // The cow pen (north east), the hen yard (north west), the hay cart and the well.
    at('r5s_cow', 29, 3, 1.3, 'r5s_soft_cow', { walkable: false }),
    t('r5s_hen_house', 1, 2, 'r5s_soft_coop', { walkable: false }),
  ],
  // ---- The Hayfields (chapter 5) ----
  sunny_hayfields: [
    t('r5s_hay_cart', 12, 13, 'r5s_hay_cart', { walkable: false }),
    t('r5s_bale_stack', 25, 8, 'r5s_hay_stack', { walkable: false }),
    t('r5s_pitchfork', 27, 16, 'r5s_hay_fork', { walkable: false }),
  ],
  // ---- Dandelion Hill (chapter 5) ----
  sunny_dandelion_hill: [
    // Burdock the mole: an errand (his neighbour, right beside him, is wearing his spectacles).
    { sprite: 'r5s_molehill', x: 5, y: 12, npc: 'r5s_burdock', animation: 'r5s_molehill', speed: 2.0, notice: true, quest: [
      { needs: ['has:mole_specs'], take: 'mole_specs', set: ['q_burdock_asked', 'q_burdock_done'], give: 'burdocks_button', text: 'found' },
      { needs: ['q_burdock_done'], text: 'after', append: true },
      { needs: ['!q_burdock_asked'], set: 'q_burdock_asked', text: 'ask', append: true },
    ] },
    // His neighbour, two tiles along, up out of his own hill and wearing Burdock's spectacles. A gag:
    // he shows them off, then hands them over. Both moles wear a "!" till you've talked to them. (draft)
    { sprite: 'r5s_mole_specs', x: 8, y: 12, npc: 'r5s_mole_neighbour', notice: true, quest: [
      { needs: ['q_specs_given'], text: 'after', append: true },
      { needs: ['!q_specs_given'], set: 'q_specs_given', give: 'mole_specs', text: 'give' },
    ] },
    at('sy_windsock', 24, 8, 0.32, 'cliff_windsock', { walkable: false }),
    t('r5s_cairn', 44, 3, 'r5s_hill_cairn', { walkable: false }),
    t('r5s_picnic_basket', 40, 11, 'r5s_hill_basket', { walkable: false }),
  ],
  // ---- The Windmill (chapter 5) ----
  sunny_windmill: [
    t('r5s_sack_pile', 16, 7, 'r5s_mill_sacks', { walkable: false }),
    t('r5s_millstone', 24, 7, 'r5s_mill_stone', { walkable: false }),
  ],
  // ---- The Orchard (chapter 5) ----
  sunny_orchard: [
    t('r5s_ladder', 11, 4, 'r5s_orch_ladder', { walkable: false }),
    at('r5s_cow_lie', 24, 2, 1.1, 'r5s_orch_cow', { walkable: false }),
  ],
  // ---- The Mill Pond (chapter 5) ----
  sunny_mill_pond: [
    t('r5s_fishing_rod', 32, 16, 'r5s_pond_rod', { walkable: false }),
    // The hidden corner: the alcove in the hedge at the south west. A picnic left in it.
    t('r5s_picnic_basket', 6, 17, 'r5s_pond_basket', { walkable: false, gives: 'jam_tart', taken: { gone: true }, react: true }),
    t('r5s_birdbath', 33, 5, 'r5s_pond_birdbath', { walkable: false }),
  ],
  // ---- The Last Farm (chapter 5) ----
  sunny_last_farm: [
    t('r5s_hen_house', 3, 8, 'r5s_farm_coop', { walkable: false }),
    t('r5s_nest', 10, 6, 'r5s_farm_nest'),
    at('r5s_birdhouse', 13, 3, 1.6, 'r5s_farm_birdhouse', { walkable: false }),
    // Tolliver's things: the start of his race, the finish ribbon, a deckchair, his best turnip.
  ],
  // ---- The Cliff Meadow (chapter 5) ----
  sunny_cliff_meadow: [
    at('r5s_cow', 8, 13, 1.4, 'r5s_cliff_cow', { walkable: false }),
    at('r5s_cow_lie', 12, 15, 1.1, 'r5s_cliff_cow_lie', { walkable: false }),
    t('r5s_deckchair', 23, 12, 'r5s_cliff_chair', { walkable: false }),
  ],
  // ---- The Sea View (chapter 5): keep x 7 to 11 clear (the first look at the sea is a walk) ----
  sunny_sea_view: [
    t('r5s_picnic_basket', 13, 12, 'r5s_sea_basket', { walkable: false }),
    t('r5s_cairn', 24, 12, 'r5s_sea_cairn', { walkable: false }),
  ],
  // ---- The Fishers' Hollow and the Cliff Cave (chapter 5) ----
  sunny_cliff_hollow: [
    at('r5s_fish_tub', 16, 11, 1.8, 'r5s_hol_tub', { walkable: false }),
  ],
  sunny_cliff_cave: [
    at('r5s_fish_tub', 5, 16, 1.8, 'r5s_cave_tub', { walkable: false }),
  ],
  // ---- The burrow under the orchard (chapter 5): a rabbit's house ----
  secret_sunny_burrow: [
    t('in_rug_blue', 8, 6, 'r5s_burrow_rug', flat),
  ],
  // ---- Haddock's Light: the headland. Only outdoor things; his rooms inside are left as they are ----
  haddock_light_door: [
    t('r5s_cairn', 24, 6, 'r5s_hd_cairn', { until: 'haddock_gone' }),
    t('r5s_cairn', 24, 6, 'r5s_hd_cairn_after', { after: 'haddock_gone' }),
    t('r5s_fishing_rod', 21, 12, 'r5s_hd_rod', { until: 'haddock_gone' }),
    t('r5s_fishing_rod', 21, 12, 'r5s_hd_rod_after', { after: 'haddock_gone' }),
    t('r5s_crab_trap', 16, 13, 'r5s_hd_trap'),
  ],
  // ---- The secret rooms (chapter 5): a little more in each ----
  secret_gull_hoard: [
    t('st_glass_float', 7, 5, 'r5s_hoard_float', { walkable: false }),
  ],
  secret_isles_cave: [
    t('r5s_boots', 8, 6, 'r5s_tidy_boots'),
  ],
  secret_lastlight_den: [
    t('st_tin_box', 5, 5, 'r5s_den_tin'),
  ],
  secret_wrack_hulk: [
    t('r5s_crab_trap', 4, 6, 'r5s_hulk_trap'),
  ],
  secret_wreck_pocket: [
    t('r5s_fish_tub', 11, 5, 'r5s_pocket_tub', { walkable: false }),
  ],
};
