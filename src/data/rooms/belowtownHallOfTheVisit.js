// THE HALL OF THE VISIT: Belowtown's history hall, a long carved room with
// the great painting of the Hero's coming at its heart, six paces wide, the
// Hero on the stair with the dark below. It has no relics at all (the king
// keeps those); it has a mole curator, a school of one frog, a very old snail
// and a good deal of damp.
//
// THE KEEPER'S MOMENT, and the only one in the town: low down on the stair of
// the mural, almost lost in the plaster, a small figure with a lantern. The
// `bt_spot` prop on that tile carries its words (mural_lantern), and sits
// before the mural in the list so Z finds it first. Nothing else here hints
// at him. Ves notices; she says very little.
// Tile key: # rock  W carved stone  V lamp wall  H banner wall  . flagstone  X cobbles  D doorway
export const BELOWTOWN_HALL_OF_THE_VISIT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_hall_of_the_visit',
  // The room's name, for the Room Editor.
  name: 'HALL OF THE VISIT',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  music: 'belowtown',
  ambience: 'belowtown_indoors',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '########################',
    '#WHWWWVWWWWWWWWWWVWWWHW#',
    '#WWWWWWWWWWWWWWWWWWWW.W#',
    '#WWWWWWWWWWWWWWWWWWWW.W#',
    '#......................#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '#.........XXXX.........#',
    '###########DD###########',
  ],

  playerStart: { x: 11, y: 12 },

  doors: [
    { x: 11, y: 13, w: 2, h: 1, to: 'belowtown_square', spawn: { x: 32, y: 6 } },
  ],

  cutscenes: [],

  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'bt_spot', x: 11, y: 4, text: 'mural_lantern' },
    { sprite: 'mural_visit', x: 9, y: 4, text: 'mural_visit' },
    { sprite: 'mural_end', x: 8, y: 4, text: 'mural_end' },
    { sprite: 'mural_end', x: 15, y: 4, text: 'mural_end' },
    { sprite: 'hist_panel_a', x: 3, y: 4, text: 'hist_founding' },
    { sprite: 'hist_panel_b', x: 5, y: 4, text: 'hist_pie' },
    { sprite: 'hist_panel_c', x: 17, y: 4, text: 'hist_stair' },
    { sprite: 'hist_panel_a', x: 19, y: 4, text: 'hist_founding_two' },
    { sprite: 'bench', x: 9, y: 9, text: 'hall_bench' },
    { sprite: 'bench', x: 13, y: 9, text: 'hall_bench' },
    { sprite: 'town_noticeboard', x: 3, y: 8, text: 'hall_noticeboard' },
    { sprite: 'sign', x: 10, y: 11, text: 'hall_sign' },
    { sprite: 'glowworm_lamp', x: 7, y: 6, text: 'hall_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 16, y: 6, text: 'hall_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'bf_mole_miner_b', x: 12, y: 7, npc: 'bt_curator', animation: 'bf_mole_miner_b', speed: 0.5, stroll: { path: [[4, 7], [20, 7]], speed: 9, pause: [3, 6], greet: true } },
    { sprite: 'bf_frog_kid_b', x: 15, y: 8, npc: 'bt_hall_kid', animation: 'bf_frog_kid_b', speed: 0.45, stroll: { wander: [14, 8, 19, 11], speed: 24, pause: [1, 3], hop: true, scatter: true } },
    { sprite: 'bf_snail_elder', x: 19, y: 10, npc: 'bt_hall_snail', animation: 'bf_snail_elder', speed: 0.5 },
    { sprite: 'chest', x: 22, y: 12, text: 'hall_chest', gives: 'frog_toffee', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'town_barrels', x: 20, y: 12, text: 'hall_barrels' },
    // The life pass (14 Nov): the museum's odds and ends, a stash in the wall, a pinwheel that shouldn't spin.
    { sprite: 'bt_hand_cart', x: 2, y: 6, text: 'bl_hall_cart' },
    { sprite: 'bt_pick_rack', x: 22, y: 7, text: 'bl_hall_rack' },
    { sprite: 'bt_bucket_mop', x: 3, y: 11, text: 'bl_hall_bucket', gives: 'dented_dustpan', taken: { sprite: 'bt_bucket_mop', text: 'bl_hall_bucket_empty' } },
    { sprite: 'gold_pouch', x: 21, y: 2, text: 'bl_hall_stash', gives: 'bl_curator_iou', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },

  ],
  tileTexts: { W: 'hall_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall' },

  // Nobody to fight in a museum.
  npcs: [],
};
