// Round 3 (the fun check), helper C, 15 November 2026: the dullest rooms of chapter 4 get a layer of things
// to look at and press Z on, with a Ves answer on most. Placed by script: every tile is floor, clear of every
// door, save point (two tiles), monster patrol and scene walk, and never directly south of a word-bearing
// prop. All of them are `walkable` (no bodies), so no climb, push, ring, rope or cutscene can be blocked.
// The art is in src/data/art/r3cLife.js (ids start `r3c_`); the words are the `r3c_` sections at the end of
// the room's text file. Each room file spreads its list in at the start of its props.
import { ROOM_TOUCHES } from './touches.js';

export const R3C_PROPS = {
  belowtown_long_rope: [
    { sprite: 'r3c_flask', x: 4, y: 42, walkable: true, text: 'r3c_lr_flask' },
    { sprite: 'bt_stool', x: 17, y: 42, text: 'r3c_lr_stool' },
  ],
  belowtown_collapse: [
    { sprite: 'r3c_handbell', x: 23, y: 4, text: 'r3c_hf_handbell' },
    { sprite: 'r3c_top_hat', x: 1, y: 13, walkable: true, text: 'r3c_hf_hat' },
  ],
  deep_last_flight: [
    { sprite: 'dp_candle_stub', x: 1, y: 32, walkable: true, text: 'r3c_lf_rest_stub' },
    { sprite: 'r3c_flask', x: 8, y: 33, walkable: true, text: 'r3c_lf_dry_flask' },
  ],
  deep_crawl: [
    { sprite: 'r3c_spoon_pot', x: 4, y: 5, walkable: true, text: 'r3c_cr_pot' },
    { sprite: 'r3c_jar_lights', x: 26, y: 13, animation: 'r3c_jar_lights', speed: 0.5, text: 'r3c_cr_jar' },
  ],
  deep_way_up: [
    { sprite: 'r3c_flask', x: 19, y: 37, walkable: true, text: 'r3c_wu_flask' },
    { sprite: 'dp_candle_stub', x: 9, y: 31, walkable: true, text: 'r3c_wu_stub' },
  ],
  deep_keepers_fire: [
    { sprite: 'r3c_log_pile', x: 9, y: 6, text: 'r3c_kf_logs' },
    { sprite: 'r3c_spoon_pot', x: 32, y: 6, walkable: true, text: 'r3c_kf_kettle' },
  ],
  stillwater_stair_down: [
    { sprite: 'r3c_step_lamp', x: 8, y: 11, text: 'r3c_sd_step_lamp' },
  ],
  diggings_star_pool: [
    { sprite: 'r3c_cup_row', x: 3, y: 5, walkable: true, text: 'r3c_sp_cups' },
    { sprite: 'r3c_journal', x: 10, y: 5, walkable: true, text: 'r3c_sp_journal' },
  ],
  glimmer_landing: [
    { sprite: 'r3c_jar_lights', x: 6, y: 13, animation: 'r3c_jar_lights', speed: 0.5, text: 'r3c_gl_jar' },
    { sprite: 'r3c_hammock', x: 15, y: 4, text: 'r3c_gl_hammock' },
    { sprite: 'r3c_crystal_cups', x: 9, y: 10, walkable: true, text: 'r3c_gl_cups' },
  ],
  glimmer_chimney: [
    { sprite: 'r3c_rope_loop', x: 11, y: 16, text: 'r3c_ch_rope' },
    { sprite: 'r3c_flask', x: 2, y: 17, walkable: true, text: 'r3c_ch_flask' },
  ],
  deep_root: [
    { sprite: 'r3c_journal', x: 8, y: 17, walkable: true, text: 'r3c_rt_journal' },
    { sprite: 'r3c_flask', x: 10, y: 22, walkable: true, text: 'r3c_rt_flask' },
  ],
  deep_first_dark: [
    { sprite: 'r3c_flask', x: 29, y: 3, walkable: true, text: 'r3c_fd_flask' },
  ],
  diggings_star_spill: [
    { sprite: 'r3c_spoon_pot', x: 6, y: 7, walkable: true, text: 'r3c_ss_pot' },
    { sprite: 'dg_boot', x: 19, y: 7, walkable: true, text: 'r3c_ss_boot' },
  ],
  deep_heros_camp: [
  ],
  deep_hidden_vug: [
  ],
};

export const R3C_TOUCHES = {
  belowtown_long_rope: [
    { kind: 'cricket', x: 1, y: 41 },
    { kind: 'cricket', x: 17, y: 42 },
    { kind: 'motes', x: 2, y: 39, w: 14, h: 8, n: 8, color: '255,225,160' },
  ],
  belowtown_collapse: [
    { kind: 'motes', x: 1, y: 2, w: 24, h: 19, n: 10, color: '230,215,190' },
  ],
  deep_last_flight: [
    { kind: 'cricket', x: 8, y: 5 },
    { kind: 'cricket', x: 11, y: 20 },
    { kind: 'motes', x: 3, y: 19, w: 18, h: 3, n: 6, color: '190,205,230' },
  ],
  deep_crawl: [
    { kind: 'cricket', x: 9, y: 4 },
    { kind: 'cricket', x: 20, y: 13 },
    { kind: 'beetle', x: 21, y: 17, w: 5 },
  ],
  deep_way_up: [
    { kind: 'cricket', x: 2, y: 42 },
    { kind: 'cricket', x: 21, y: 31 },
    { kind: 'motes', x: 2, y: 11, w: 18, h: 2, n: 5, color: '190,205,230' },
  ],
  deep_keepers_fire: [
    { kind: 'cricket', x: 14, y: 11 },
    { kind: 'cricket', x: 2, y: 6 },
    { kind: 'motes', x: 18, y: 5, w: 10, h: 4, n: 7, color: '255,190,120' },
  ],
  stillwater_stair_down: [
    { kind: 'cricket', x: 7, y: 17 },
    { kind: 'cricket', x: 10, y: 11 },
    { kind: 'beetle', x: 7, y: 13, w: 3 },
  ],
  diggings_star_pool: [
    { kind: 'cricket', x: 22, y: 3 },
    { kind: 'starmotes', x: 14, y: 5, w: 12, h: 6, n: 8, color: '255,226,170' },
  ],
  glimmer_landing: [
    { kind: 'cricket', x: 21, y: 4 },
    { kind: 'cricket', x: 2, y: 12 },
    { kind: 'sparkle', x: 15, y: 5, w: 10, h: 6, n: 10, color: '255,190,230' },
  ],
  glimmer_chimney: [
    { kind: 'cricket', x: 7, y: 16 },
    { kind: 'cricket', x: 8, y: 4 },
    { kind: 'sparkle', x: 2, y: 16, w: 14, h: 3, n: 8, color: '190,235,255' },
  ],
  deep_root: [
    { kind: 'cricket', x: 22, y: 23 },
    { kind: 'cricket', x: 7, y: 24 },
    { kind: 'motes', x: 2, y: 17, w: 28, h: 8, n: 8, color: '190,205,230' },
  ],
  deep_first_dark: [
    { kind: 'cricket', x: 33, y: 10 },
    { kind: 'cricket', x: 25, y: 5 },
    { kind: 'beetle', x: 15, y: 14, w: 6 },
  ],
  diggings_star_spill: [
    { kind: 'cricket', x: 23, y: 5 },
    { kind: 'starmotes', x: 14, y: 5, w: 8, h: 6, n: 6, color: '255,226,170' },
  ],
  deep_heros_camp: [
    { kind: 'cricket', x: 10, y: 7 },
    { kind: 'cricket', x: 13, y: 10 },
    { kind: 'motes', x: 4, y: 5, w: 24, h: 6, n: 6, color: '200,200,215' },
  ],
  deep_hidden_vug: [
    { kind: 'cricket', x: 9, y: 4 },
    { kind: 'cricket', x: 5, y: 4 },
  ],
};

for (const [room, specs] of Object.entries(R3C_TOUCHES)) {
  ROOM_TOUCHES[room] = [...(ROOM_TOUCHES[room] ?? []), ...specs];
}
