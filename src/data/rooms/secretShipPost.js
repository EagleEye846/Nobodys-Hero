// THE PURSER'S LOCKER (the secret): a cupboard of a room off the hold, behind a boarded door that only the lantern's ring
// opens. Pigeonholes of letters nobody collected (three racks, every hole full), the post bag with the last of them
// still tied up, a purser's stool, his chest and his purse. The purser is still here, writing, in the lantern's
// light. The bag's a keepsake (the unsent letters). The way out is the south door (6-7, row 9) to the hold's west passage.
// Tile key: # bulkhead (solid)   W planking face (solid)   . floor

export const SECRET_SHIP_POST = {
  id: 'secret_ship_post',
  name: 'THE PURSER\'S LOCKER',
  area: 'ghostship',
  music: 'ghostShip',
  ambience: 'ghost_ship',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...please let it reach her...', '...the next post...'] },
  playerStart: { x: 6, y: 7 },

  tiles: [
      '##############',
      '##############',
      '#WWWWWWWWWWWW#',
      '#............#',
      '#............#',
      '#............#',
      '#............#',
      '#............#',
      '##..........##',
      '######..######',
    ],

  // No tiles change here, but she leans, and the whole room with her.
  list: {},

  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'ship_hold', spawn: { x: 3, y: 9 } },
  ],

  cutscenes: [],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'gs_letter_rack', x: 2, y: 2, text: 'post_rack' },
    { sprite: 'gs_letter_rack', x: 5, y: 2, text: 'post_rack' },
    { sprite: 'gs_letter_rack', x: 8, y: 2, text: 'post_rack' },
    { sprite: 'gs_post_bag', x: 6, y: 5, text: 'post_bag', gives: 'unsent_letters', react: true, taken: { sprite: 'gs_post_bag', text: 'post_bag_taken' } },
    { sprite: 'in_stool_mug', x: 10, y: 5, text: 'post_stool' },
    { sprite: 'in_sea_chest_small', x: 10, y: 3, text: 'post_chest' },
    { sprite: 'gold_pouch', x: 3, y: 6, text: 'post_purse', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gs_ghost_old', x: 8, y: 6, text: 'ghost_purser', animation: 'gs_ghost_old', speed: 1.6, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_letters_pile', x: 4, y: 4, flat: true, walkable: true, text: 'post_pile' },
    { sprite: 'gs_letters_pile', x: 9, y: 7, flat: true, walkable: true, text: 'post_pile' },
    { sprite: 'gs_letters_pile', x: 2, y: 7, flat: true, walkable: true, text: 'post_pile' },
    { sprite: 'in_wall_lamp', x: 11, y: 2, text: 'post_lamp' },
    { sprite: 'in_rug_red', x: 5, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 7, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 7, y: 4, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 11, y: 3, flat: true, walkable: true },
    { sprite: 'gs_post_lantern', x: 7, y: 3, text: 'dress_lantern' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_knee', x: 1, y: 2 },
    { sprite: 'gs_knee_r', x: 4, y: 2 },
    { sprite: 'gs_knee', x: 7, y: 2 },
    { sprite: 'gs_knee_r', x: 10, y: 2 },
    { sprite: 'gs_wall_lantern', x: 12, y: 2 },
    { sprite: 'gs_web_l', x: 1, y: 3, flat: true, walkable: true },
    { sprite: 'gs_web_r', x: 12, y: 3, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 3, y: 5, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 8, y: 4, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 10, y: 6, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 5, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 4, y: 6, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 9, y: 5, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 11, y: 7, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'post_wall', W: 'post_wall' },

  // None: the secret is a small, still room.
  npcs: [

  ],
};
