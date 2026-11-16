// Round 3, the fun check (15 November 2026), chapters 1 and 2: the extra things to look at and press Z on in the
// rooms that scored lowest (the foot of the Stair, the Ice Caves, the Singing Gallery, the Sheer Face, the
// Lamplighter's hut, the ice cave rooms, the summit and the village's houses, shops and tower). Spread into each
// room's props. Everything is bodiless (`walkable`), so no climb, push, ring, door or cutscene can be blocked;
// wordless pieces carry `decor: true`. Words: the `r3a_*` sections at the end of each room's text file. Art:
// src/data/art/r3aLife.js (and a few older sprites from restLife.js, vigilLife.js, ruinsLife.js).
const t = (sprite, x, y, text, more = {}) => ({ sprite, x, y, text, walkable: true, ...more });
const d = (sprite, x, y, more = {}) => ({ sprite, x, y, walkable: true, decor: true, ...more });
const f = (sprite, x, y, more = {}) => ({ sprite, x, y, walkable: true, decor: true, flat: true, ...more });
const w = (sprite, x, y, more = {}) => ({ sprite, x, y, walkable: true, decor: true, wall: true, ...more });

export const R3A_PROPS = {
  // The first look at the world: a meadow with a buried stair at the end of it.
  beyond_ruins: [
    t('r3a_picnic', 4, 8, 'r3a_bf_picnic', { flat: true }),
    t('r3a_signpost', 11, 9, 'r3a_bf_signpost', { walkable: false }),
  ],

  // The first cave: someone has strung a guide-line, and lived here a while.
  cave_entry: [
    t('r2r_rope_coil', 8, 19, 'r3a_ce_cord'),
    t('r3a_thermos', 13, 20, 'r3a_ce_flask'),
  ],

  // The Singing Gallery: someone has been tuning it with chalk.
  cave_gallery: [
    t('r3a_hum_slab', 8, 17, 'r3a_cg_slab', { flat: true }),
    t('r3a_slate', 7, 22, 'r3a_cg_slate', { walkable: false }),
  ],

  // The Sheer Face: the top, the halfway and the bottom ledges (nothing with words near a ring) and the rock itself.
  sheer_face: [
    t('telescope', 3, 2, 'r3a_sf_scope', { walkable: false }),
    t('r3a_thermos', 18, 11, 'r3a_sf_flask'),
  ],

  // The Lamplighter's hut: tea kept ready.
  vigil_lamplighters_hut: [
    t('r3a_oil_shelf', 4, 2, 'r3a_hut_shelf', { walkable: false }),
  ],

  // The ice cave rooms.
  ice_cave_throat: [
    t('r3a_bedroll', 2, 18, 'r3a_it_bedroll', { flat: true }),
    t('r3a_slate', 25, 12, 'r3a_it_slate', { walkable: false }),
  ],
  ice_cave_grotto: [
    t('r3a_slate', 19, 12, 'r3a_ig_slate', { walkable: false }),
    t('r3a_boot_heap', 29, 13, 'r3a_ig_boots', { walkable: false }),
  ],
  ice_cave_hall: [
    t('r3a_slate', 11, 13, 'r3a_ih_slate', { walkable: false }),
    t('r3a_tea_kit', 30, 15, 'r3a_ih_tea', { walkable: false }),
  ],
  ice_cave_roost: [
    t('r3a_slate', 11, 13, 'r3a_ir_census', { walkable: false }),
    t('r2r_scratches', 6, 2, 'r3a_ir_claws', { wall: true }),
  ],

  // The top of the world: more than a white floor.
  vigil_summit: [
    t('r3a_summit_tin', 22, 13, 'r3a_su_tin'),
    t('r3a_snow_stack', 10, 11, 'r3a_su_snowman', { walkable: false }),
  ],

  // Heralds' Rest: the Hall of Heralds, the stores, the forge, the tower and the houses.
  rest_hall: [
    t('r3a_welcome_banner', 8, 2, 'r3a_hl_banner', { walkable: false }),
  ],
  rest_stores: [
    t('r3a_cheese', 2, 6, 'r3a_st_cheese'),
  ],
  rest_forge: [
    t('r3a_bellows', 4, 5, 'r3a_fg_bellows', { walkable: false }),
  ],
  rest_belltower: [
    t('r3a_dove_box', 7, 7, 'r3a_bt_doves', { walkable: false }),
    t('r3a_tea_kit', 4, 10, 'r3a_bt_tea', { walkable: false }),
  ],
  rest_house_marta: [
    t('r3a_loom', 2, 2, 'r3a_ma_loom', { walkable: false }),
  ],
  rest_house_pottle: [
    t('r3a_buns', 12, 3, 'r3a_po_buns', { walkable: false }),
  ],
  rest_chapel: [
    t('r3a_donations', 1, 11, 'r3a_ch_box', { walkable: false }),
  ],
};
