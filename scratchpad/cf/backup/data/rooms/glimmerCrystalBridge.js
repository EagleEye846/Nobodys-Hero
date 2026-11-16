// THE CRYSTAL BRIDGE: ten tiles of nothing between the ledge you're on and the
// one you want, with a little island of rock in the middle and the kingdom
// glittering a long way below. The bridge is made of light, in two pieces. The
// Glimmering's hardest room, and it has three parts:
//
//   1. Wake the gate. A sun-crystal throws a beam along the bottom, but a crystal
//      column is in the way; Ves, steered, stands in front of it and turns the beam
//      up (Q, and she explains the umbrella herself). The prism above her must be
//      set to carry it on to the little eye by the wall. That eye stays lit for good
//      and wakes the crystal gate at the top of the ledge.
//   2. The near span. A second sun-crystal throws a beam along the top of the near
//      ledge to the ONE prism on this side you can turn (the "road" prism). Set one
//      way, it carries the light down and across the first gap, over the water, to a
//      crystal eye on the island, which only stays lit while the beam holds: the
//      near span stands, and you can walk out to the island.
//   3. The far span. The same prism, set the other way, sends the light UP and across
//      the whole room along the top row, through the crystal gate, to an eye on the
//      far ledge. That one stays lit for good and lays the far span. But the gate
//      only opens while something is standing on the plate in the island's floor, and
//      the plate is out there, on the island, while the prism is back here, and
//      turning it drops the near span (nobody on it, so away it goes). So one of you
//      has to stand on the plate while the other turns the prism: the hero goes out
//      to the island and stands on the plate, Ves stays on the near ledge (Q to her),
//      turns the prism, and the far span lights for good. The hero walks over it. Ves
//      turns the prism back, the near span returns, and she follows over both.
// Keep yourself and Ves out of the lines of light: you block a beam by standing
// in it.
//
// beam: S0 (sun-crystal) at 1,12 throws right along row 12; the column at 5,12
//   stops it. Ves at 4,12 facing up sends it up column 4 to the prism P0 at 4,10;
//   P0 set '/' carries it right along row 10 to the eye bridge_wake at 9,10
//   (latched). Set \\ it goes left along row 10 into the rock.
//   S1 at 2,5 throws right along row 5 to the road prism R at 7,5.
//   Set \\ (the low road) it goes down column 7 to the clamped prism LD at 7,7
//   (\\), which carries it right along row 7, over the first gap (11-14), to the
//   eye bridge_e1 at 15,7 (not latched: the near span, x 11-14 on row 8).
//   Set '/' (the high road) it goes up column 7 to the clamped prism HU at 7,4 ('/'),
//   which carries it right along row 4: through the gate at 9,4 (open only with
//   bridge_wake lit and the plate 'hold' down), over both gaps and the island, to the
//   eye bridge_e2 at 22,4 (latched: the far span, x 17-20 on row 8).
// The plate (treadle) 'hold' is at 16,9 on the island.
// Nothing can be lost: the road prism can always be turned again from the near ledge,
//   the far span is latched (so once lit the far side is always open, from either
//   direction), and the wake is latched. Whoever stays behind can always get across
//   by turning the road prism back to the low road.
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   .  lilac cave floor   ,  glowing moss   O  crystal cluster (solid)
//   I  crystal column (solid)   J  crystal spires   ^  crystal spike
//   p  small glowing mushrooms (solid)   N  glowing ferns   b/B  amethyst blocks
//   _  open air: the view over the edge shows through
export const GLIMMER_CRYSTAL_BRIDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_crystal_bridge',
  // The room's name, for the Room Editor.
  name: 'THE CRYSTAL BRIDGE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // The view down over the buried kingdom, behind the open air.
  vista: { kind: 'kingdom' },

  tiles: [
    '################################',
    '################################',
    '#WWWVWWWWWWWWHWWWWWVWWWWWWWHWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#N.........__________.N.J....B.#',
    '#.........O__________.....^..BB#',
    '#O.........__________.........b#',
    '#...O......____..____.,......pb#',
    '.....,,....____..____....,,.....',
    '...,.....O.____..____......,....',
    '#N.........____..____.........O#',
    '#.....,,..O__________O.,.......#',
    '#....I.....__________.p....O..N#',
    '#^.O.....ON__________N........J#',
    '################################',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'glimmer_tuck', spawn: { x: 24, y: 9 } },
    { x: 31, y: 8, w: 1, h: 2, to: 'glimmer_kings_road', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // Tuck, waiting on the far ledge. (The trigger is seven tiles wide because the scene
  // only plays when you're together, and one of you may cross before the other.)
  cutscenes: [
    { x: 23, y: 6, w: 7, h: 5, scene: 'tuck_at_the_bridge' },
  ],

  // The two spans of light. The first stands while the eye on the island is
  // lit, the second while the eye by the far ledge is.
  lightBridges: [
    { x: 11, y: 8, w: 4, h: 1, when: 'bridge_e1' },
    { x: 17, y: 8, w: 4, h: 1, when: 'bridge_e2' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    // The waking beam: row 12, Ves at 4,12 up column 4, the prism at 4,10, row 10 to the eye.
    { sprite: 'sun_crystal', x: 1, y: 12, beam: 'right', text: 'sun_crystal' },
    { sprite: 'prism', x: 4, y: 10, mirror: '\\', text: 'prism' },
    { sprite: 'crystal_eye', x: 9, y: 10, eye: 'bridge_wake', text: 'crystal_eye_wake' },
    // The road: row 5 to the road prism R at 7,5. Low road: down column 7, the clamped
    // prism at 7,7, right along row 7 to the island's eye. High road: up column 7, the
    // clamped prism at 7,4, right along row 4 through the gate to the far ledge's eye.
    { sprite: 'sun_crystal', x: 2, y: 5, beam: 'right', text: 'sun_crystal' },
    { sprite: 'prism', x: 7, y: 5, mirror: '/', text: 'prism_road' },
    { sprite: 'prism', x: 7, y: 7, mirror: '\\', fixed: true, text: 'prism_clamped' },
    { sprite: 'prism', x: 7, y: 4, mirror: '/', fixed: true, text: 'prism_clamped' },
    { sprite: 'gate_narrow', x: 9, y: 4, text: 'bridge_gate', opensWith: ['bridge_wake', 'hold'], openText: 'bridge_gate_open' },
    { sprite: 'crystal_eye', x: 15, y: 7, eye: 'bridge_e1', latch: false, text: 'crystal_eye_hold' },
    // The island: a purse, and the plate in the floor that holds the gate open.
    { sprite: 'gold_pouch', x: 16, y: 7, text: 'bridge_island_purse', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'treadle', x: 16, y: 9, text: 'bridge_plate', treadle: 'hold' },
    { sprite: 'crystal_eye', x: 22, y: 4, eye: 'bridge_e2', text: 'crystal_eye_wake' },
    // The ledges.
    { sprite: 'crystal_bloom', x: 28, y: 12, text: 'bridge_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_teal_l', x: 24, y: 12, text: 'bridge_crystal' },
    { sprite: 'crystal_pink_l', x: 8, y: 12, text: 'bridge_crystal' },
    { sprite: 'crystal_gold_s', x: 3, y: 7, text: 'bridge_crystal' },
    { sprite: 'crystal_violet_s', x: 23, y: 5, text: 'bridge_crystal' },
    { sprite: 'crystal_pink_s', x: 27, y: 11, text: 'bridge_crystal' },
    { sprite: 'glowcap_trio', x: 9, y: 6, text: 'bridge_trio' },
    { sprite: 'glowcap_big', x: 29, y: 11, text: 'bridge_glowcap' },
    { sprite: 'glowcap_tall', x: 2, y: 10, text: 'bridge_glowcap' },
    { sprite: 'glow_moss', x: 5, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 25, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 6, y: 11, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'sign', x: 8, y: 9, text: 'bridge_sign' },
    // A purse on a high block on the far ledge (b, then B, then B).
    { sprite: 'gold_pouch', x: 29, y: 4, text: 'bridge_purse_high', gold: 105, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gl_chime_stalk', x: 4, y: 6, text: 'gp_chime', animation: 'gl_chime_stalk', speed: 0.6, walkable: true },
    { sprite: 'gl_mirror_puddle', x: 7, y: 12, text: 'gp_puddle', animation: 'gl_mirror_puddle', speed: 0.7, flat: true, walkable: true },
    { sprite: 'gl_old_shell', x: 3, y: 12, text: 'gp_shell', walkable: true },
    { sprite: 'gl_crumb_heap', x: 26, y: 12, text: 'gp_crumbs', walkable: true },
    { sprite: 'crystal_pink_s', x: 10, y: 6, text: 'gp_gem', walkable: true },
    { sprite: 'gl_glowbug', x: 6, y: 9, text: 'gp_bug', animation: 'gl_glowbug', speed: 0.5, walkable: true },
    { sprite: 'gl_geode_half', x: 28, y: 4, text: 'gp_geode', walkable: true },
    { sprite: 'gl_glitter', x: 4, y: 8, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'gl_glitter', x: 25, y: 4, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'gl_glitter', x: 9, y: 12, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 5, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 23, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'gl_snagged_ribbon', x: 21, y: 12, text: 'gp_ribbon', walkable: true },
    { sprite: 'glowcap_small', x: 29, y: 13, text: 'gp_cap', walkable: true },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    O: 'cave_cluster', I: 'cave_column', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
    _: 'bridge_gap', B: 'geode_block', b: 'geode_block',
  },

  // A prismoth on the near ledge's south side, and two quartzlings among the
  // crystals up in the far ledge's corners. Tuck's scene (tuck_at_the_bridge)
  // walks along row 8 from x 29 to 24 and stands around 26,8, so everything
  // keeps well to the north and south of that.
  npcs: [
    { enemy: 'prismoth', x: 7, y: 13, patrol: [5, 8], behaviour: 'patrol' },
    { enemy: 'quartzling', x: 25, y: 4, patrol: [25, 25], behaviour: 'disguise', reach: 3 },
    { enemy: 'quartzling', x: 26, y: 12, patrol: [26, 26], behaviour: 'disguise', reach: 3 },
  ],
};
