// The life pass, round 2 (15 November 2026): chapter 1's Ruins and Mother Taper's house. Set dressing
// and things to press Z on, per room, spread into each room's props. Every one is `walkable`, so none of
// them can block a lever, a gate, a block, a monster or a cutscene walk. Their words are the `r1_*`
// sections at the end of text/interactions/the_ruins.txt and taper_home.txt. Their art is in
// src/data/art/ruinsLife.js; the living things are in src/data/ruinsTouches.js.
export const R1_PROPS = {
  ruins_entrance: [
    { sprite: 'r1_urn', x: 27, y: 5, text: 'r1_en_urn' },
    { sprite: 'r1_bench', x: 19, y: 3, text: 'r1_en_bench' },
    { sprite: 'r1_mouse', x: 8, y: 3, npc: 'r1_mouse', quest: [{'needs': ['has:r1_button'], 'take': 'r1_button', 'set': ['q_r1_button_asked', 'q_r1_button_done'], 'give': 'mouse_scarf', 'text': 'button_done'}, {'needs': ['q_r1_button_done'], 'text': 'button_after'}, {'needs': ['!q_r1_button_asked'], 'set': 'q_r1_button_asked', 'text': 'button_ask', 'append': true}] },
    { sprite: 'gold_pouch', x: 28, y: 18, text: 'r1_en_stash', gold: 12, taken: {'sprite': 'gold_pouch_empty', 'text': 'r1_en_stash_gone'}, walkable: true },
  ],
  lantern_hall: [
    { sprite: 'r1_stump', x: 19, y: 9, text: 'r1_lh_stump' },
    { sprite: 'r1_column', x: 3, y: 14, text: 'r1_lh_column' },
  ],
  pillar_room: [
    { sprite: 'r1_hamper', x: 1, y: 3, text: 'r1_pi_hamper', gives: 'lantern_tea', taken: {'text': 'r1_pi_hamper_gone'} },
    { sprite: 'r1_column', x: 2, y: 11, text: 'r1_pi_column' },
    { sprite: 'r1_stump', x: 16, y: 13, text: 'r1_pi_stump' },
    { sprite: 'r1_helm', x: 16, y: 7, text: 'r1_pi_helm', walkable: true },
    { sprite: 'r1_candle_saucer', x: 2, y: 5, text: 'r1_pi_candles', walkable: true },
  ],
  flower_room: [
    { sprite: 'watering_can', x: 14, y: 8, text: 'r1_fl_can', walkable: true },
    { sprite: 'th_trug', x: 2, y: 8, text: 'r1_fl_trug' },
    { sprite: 'r1_rain_barrel', x: 18, y: 12, text: 'r1_fl_barrel' },
    { sprite: 'r1_button', x: 18, y: 7, text: 'r1_fl_button', gives: 'r1_button', taken: {'gone': true}, flat: true, walkable: true },
  ],
  way_out: [
    { sprite: 'r1_cups', x: 10, y: 7, text: 'r1_wo_cups', walkable: true },
    { sprite: 'r1_bench', x: 16, y: 7, text: 'r1_wo_bench' },
    { sprite: 'r1_stump', x: 24, y: 7, text: 'r1_wo_stump' },
  ],
  taper_home: [
    { sprite: 'r1_books', x: 2, y: 5, text: 'r1_th_books', walkable: true },
    { sprite: 'r1_boots_row', x: 7, y: 13, text: 'r1_th_boots', walkable: true },
  ],
  taper_kitchen: [
    { sprite: 'r1_books', x: 2, y: 6, text: 'r1_tk_books', walkable: true },
    { sprite: 'r1_tea_tray', x: 9, y: 8, text: 'r1_tk_tea', walkable: true },
  ],
  taper_hall: [
    { sprite: 'r1_books', x: 13, y: 5, text: 'r1_tl_ledger', walkable: true },
    { sprite: 'r1_broom', x: 1, y: 3, text: 'r1_tl_broom' },
  ],
  your_room: [
    { sprite: 'r1_beanpoles', x: 3, y: 4, text: 'r1_tg_beans' },
    { sprite: 'r1_rain_barrel', x: 12, y: 5, text: 'r1_tg_barrel' },
    { sprite: 'r1_packet', x: 2, y: 9, text: 'r1_tg_later', gives: 'r1_later_seeds', taken: {'gone': true}, flat: true, walkable: true },
  ],
};
