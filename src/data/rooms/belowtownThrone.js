// KING PEPTUP'S HALL: the throne room of Belowtown, built to be performed in.
// A dais under a roof-window, a red carpet down the aisle, banners, glow-worm
// strings, and the great painted wooden marionette king himself in front of his throne
// (a curtain behind it that bulges, and a tail tip and toes that show under
// the hem now and then; that's Tuck, who is always just behind the throne).
// The audience stands in two blocks on either side of the aisle.
//
// The first time you walk in, the_kings_welcome plays as a real SHOW:
// curtains, a drum roll, spotlights sweeping, the folk cheering in waves, the
// CHEER sign, confetti, and the Sunstone flickering. Afterwards the Hero's
// relics stand in glass cases (cloak, cup, boot), and the guard steps away
// from the back door (east wall), which goes down to the Diggings pithead.
// The duel (rumbolds_duel) and the collapse come later, in this room, once
// the light has gone up.
//
// Tile key: # rock  W carved stone  V lamp wall  H banner wall  . flagstone
//   r  royal carpet    I  carved pillar with a lantern (solid)   D  doorway
import { sunstoneGlow } from '../art/belowtownScenes.js';

export const BELOWTOWN_THRONE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_throne',
  // The room's name, for the Room Editor.
  name: 'KING PEPTUP\'S HALL',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  // "Built to Be Performed In" (src/data/music/throneHallTheme.js).
  music: 'throneHall',
  ambience: 'belowtown',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##########################',
    '#VWHWVWHWWWWVVWWWWHWVWHWV#',
    '#.........rrrrrr.........#',
    '#.........rrrrrr.........#',
    '#.........rrrrrr.........#',
    '#.........rrrrrr.........#',
    '#.........rrrrrr.........#',
    '#..I......rrrrrr......I..#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '#..I........rr........I..D',
    '#...........rr...........#',
    '#...........rr...........#',
    '#...........rr...........#',
    '############DD############',
  ],

  // Where the player starts, in tile coordinates (just inside the great doors).
  playerStart: { x: 12, y: 19 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 12, y: 20, w: 2, h: 1, to: 'belowtown_square', spawn: { x: 22, y: 6 } },
    // The back way down to the Diggings.
    { x: 25, y: 16, w: 1, h: 1, to: 'diggings_pithead', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // Both strips run wall to wall, so there's no walking round them.
  cutscenes: [
    { x: 1, y: 17, w: 24, h: 1, scene: 'the_kings_welcome' },
    // Once the light has gone up and the square has cheered: the duel (and, after it, the hall comes down).
    { x: 1, y: 15, w: 24, h: 1, scene: 'rumbolds_duel', after: 'homecoming' },
  ],

  // The stage curtains the welcome drew, left tied back at the sides of the dais.
  openCurtains: { x: 8, y: 0, w: 10, h: 8, after: 'the_kings_welcome' },

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'sunstone', x: 12, y: 4, cast: 'sunstone', animation: 'sunstone_dim_pulse', speed: 1.1, walkable: true, until: 'the_light_goes_up', glow: sunstoneGlow(false, 150) },
    { sprite: 'sunstone_bright', x: 12, y: 4, cast: 'sunstone', animation: 'sunstone_bright_pulse', speed: 0.5, walkable: true, after: 'the_light_goes_up', glow: sunstoneGlow(true, 150) },
    { sprite: 'bf_throne', x: 11, y: 6, cast: 'throne', text: 'throne_chair', animation: 'bf_throne', speed: 0.7 },
    // (Gone after the duel: the hall fell on what was left of him.)
    { sprite: 'bf_rumbold', x: 11, y: 7, npc: 'rumbold', animation: 'bf_rumbold', speed: 0.6, until: 'rumbolds_duel' },
    { sprite: 'bf_mole_crowd', x: 6, y: 10, cast: 'a1', text: 'throne_crowd' },
    { sprite: 'bf_mole_crowd_b', x: 8, y: 10, cast: 'a2', text: 'throne_crowd' },
    { sprite: 'bf_frog_kid_a', x: 10, y: 10, npc: 'bt_throne_kid', animation: 'bf_frog_kid_a', speed: 0.4 },
    { sprite: 'bf_mole_crowd_c', x: 5, y: 12, cast: 'a4', text: 'throne_crowd' },
    { sprite: 'bf_mole_miner_a', x: 7, y: 12, cast: 'a5', text: 'throne_crowd' },
    { sprite: 'bf_snail_elder', x: 9, y: 12, npc: 'bt_throne_snail', animation: 'bf_snail_elder', speed: 0.5 },
    { sprite: 'bf_mole_crowd_d', x: 6, y: 14, cast: 'a7', text: 'throne_crowd' },
    { sprite: 'bf_glowworm', x: 8, y: 14, cast: 'a8', text: 'throne_crowd', glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    { sprite: 'bf_mole_crowd', x: 10, y: 14, cast: 'a9', text: 'throne_crowd' },
    { sprite: 'bf_mole_crowd_d', x: 15, y: 10, cast: 'b1', text: 'throne_crowd' },
    { sprite: 'bf_frog_kid_b', x: 17, y: 10, npc: 'bt_throne_kid2', animation: 'bf_frog_kid_b', speed: 0.45 },
    { sprite: 'bf_mole_crowd_b', x: 19, y: 10, cast: 'b3', text: 'throne_crowd' },
    { sprite: 'bf_mole_miner_b', x: 16, y: 12, npc: 'bt_throne_miner', animation: 'bf_mole_miner_b', speed: 0.5 },
    { sprite: 'bf_mole_crowd', x: 18, y: 12, cast: 'b5', text: 'throne_crowd' },
    { sprite: 'bf_mole_crowd_c', x: 20, y: 12, cast: 'b6', text: 'throne_crowd' },
    { sprite: 'bf_toad_innkeeper', x: 15, y: 14, cast: 'b7', text: 'throne_crowd' },
    { sprite: 'bf_mole_crowd_b', x: 17, y: 14, cast: 'b8', text: 'throne_crowd' },
    { sprite: 'bf_beetle_postman', x: 19, y: 14, cast: 'b9', text: 'throne_crowd' },
    { sprite: 'bf_newt_guard', x: 9, y: 17, npc: 'bt_throne_guard', animation: 'bf_newt_guard', speed: 0.5 },
    { sprite: 'bf_newt_guard', x: 16, y: 17, npc: 'bt_throne_guard2', animation: 'bf_newt_guard', speed: 0.5 },
    { sprite: 'bf_newt_guard', x: 24, y: 16, npc: 'bt_back_guard', animation: 'bf_newt_guard', speed: 0.5, until: 'the_kings_welcome' },
    { sprite: 'relic_case_cloak', x: 2, y: 9, text: 'relic_cloak', after: 'the_kings_welcome' },
    { sprite: 'relic_case_cup', x: 2, y: 13, text: 'relic_cup', after: 'the_kings_welcome' },
    { sprite: 'relic_case_boot', x: 23, y: 12, text: 'relic_boot', after: 'the_kings_welcome' },
    { sprite: 'glowworm_string', x: 6, y: 7, animation: 'glowworm_string', speed: 0.4, walkable: true },
    { sprite: 'glowworm_string', x: 17, y: 7, animation: 'glowworm_string', speed: 0.4, walkable: true },
    { sprite: 'glowworm_lamp', x: 9, y: 7, text: 'throne_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 16, y: 7, text: 'throne_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    // A post at the far end of each string too, so it hangs between two.
    { sprite: 'glowworm_lamp', x: 5, y: 7, text: 'throne_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 20, y: 7, text: 'throne_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'sign', x: 11, y: 18, text: 'throne_sign' },
    { sprite: 'gold_pouch', x: 24, y: 18, text: 'throne_pouch', gold: 55, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'hall_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall', I: 'town_pillar', r: 'throne_carpet' },

  // Nobody to fight in the throne hall (the duel is a story battle from a
  // scene). The welcome walks the aisle (x 12 and 13, y 11 to 19) and the
  // dais to its left; the audience, guards and the king are cast as actors
  // in it and put back where they were.
  npcs: [],
};
