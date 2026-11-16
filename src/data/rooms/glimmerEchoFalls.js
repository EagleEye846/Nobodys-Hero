// THE ECHO FALLS: a lake lit from below, and at the far end of it a waterfall
// of glowing water that never stops talking. The falls pour into the lake and
// the lake drains away the only way it can, in currents: fast, shallow water
// racing along channels cut through the deep. Step into one and it carries you
// along it and sets you down at the end; you can't swim against it. There are
// three little islets in the lake and the far bank is in plain sight from the
// second, but the water doesn't go that way: the current that leaves the second
// islet goes back across the lake to a third islet, which sits one deep tile
// away from the first and can't be walked to from it. From the third, one
// current leads to the far bank. A wrong pick only takes you round the lake
// and back to the near bank (the water that runs home along the bottom edge),
// so the worst it costs is the ride. A ledge runs along under the cliff, right
// behind the falls (the water hangs in front of you as you walk it), to a nook
// with a purse in it. And at the end of the nook one bit of the wall isn't
// quite wall. The ledge doesn't need the water at all.
//
// The currents (j = shallow water under them; the arrows are the way they run):
//   Ride in: row 9, x 10-13, runs right, and leaves you on the first islet
//   (14-15, 9-10).
//   From the first islet: UP at 14,8 then along row 7 to the right (x 14-17)
//   puts you on the second islet (18-19, 7-8): the way on. DOWN at 15,11 drops
//   straight to the bottom edge: wrong, it ends on the near bank.
//   From the second islet: LEFT at 18,9, then DOWN at 17,9, sets you on the third
//   islet (17,10), across a deep tile from the first one: the way on. (There is no
//   current from the second islet to the far bank. Its far side, x 20, is deep.)
//   From the third islet: RIGHT along row 10 (x 18-20) sets you on the far bank
//   (21,10): the way across. DOWN at 17,11 is the wrong one, the bottom edge again.
//   The bottom edge, row 12, x 10-20, runs left and ends on the near bank at
//   9,12. You get onto it from the far bank at 21,12, which is also the way
//   back across for anyone who's come over and wants to go home. Every islet
//   has a way home, so nobody is ever stuck on one.
// Behind the falls: the ledge on rows 4-5 from x 10 to 17, hidden by the falls
//   at 12-15. The G tile at 16,3 is a vein you can walk through (the way to
//   glimmer_vug, the secret).
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   G  a wall that isn't (you can walk through it)
//   .  lilac cave floor   ,  glowing moss   ~  the glowing lake (solid)
//   j  shallow glowing water (walkable; a current runs over those that have one)
//   O  crystal cluster (solid)   J  crystal spires   ^  crystal spike
//   p  small glowing mushrooms (solid)   N  ferns
// A current: a prop with a `flow` (src/overworld/prop.js), drawn with the
// Old Drains' running-water art.
const current = (flow, x, y) => ({ sprite: `current_${flow}`, x, y, text: 'falls_current', flow, animation: `current_${flow}`, speed: 0.1 });
const row = (flow, x0, x1, y) => Array.from({ length: x1 - x0 + 1 }, (_, k) => current(flow, x0 + k, y));
export const GLIMMER_ECHO_FALLS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_echo_falls',
  // The room's name, for the Room Editor.
  name: 'THE ECHO FALLS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal_falls',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',

  tiles: [
    '##############################',
    '##############################',
    '#WWWVWWWWWWHWWWWWWWWVWWWWWHWW#',
    '#WWWWWWWWWWWWWWWGWWWWWWWWWWWW#',
    '#..........,..,...###.......B#',
    '#N...^.O.....,....###.O,,^.OB#',
    '#.........~~~~~~~~~~~......,b#',
    '#O..p.....~~~~jjjj..~.O...p..#',
    '#..,......~~~~j~~~..~.....N..#',
    '....,.,,..jjjj..~jj~~...,,..O.',
    '..........~~~~..~.jjj.........',
    '#......J.j~~~~~j~j~~~j.......#',
    '#N..O...Njjjjjjjjjjjjj.p...JN#',
    '##############################',
    '##############################',
  ],


  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'glimmer_geode', spawn: { x: 28, y: 10 } },
    { x: 29, y: 9, w: 1, h: 2, to: 'glimmer_tuck', spawn: { x: 1, y: 9 } },
    // The secret: through the vein at the end of the ledge behind the falls.
    { x: 16, y: 3, w: 1, h: 1, to: 'glimmer_vug', spawn: { x: 6, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // A line down the far bank's west edge, which every way on from the lake
  // crosses (the_echo_answers: Ves and the echo). Not for saves past Tuck.
  cutscenes: [
    { x: 22, y: 4, w: 1, h: 9, scene: 'the_echo_answers', until: ['tuck_finds_you', 'the_kings_welcome'] },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    // The currents: see the header. Ride in along row 9; up and along row 7 to
    // the second islet; from there back down and left onto the third; then right
    // along row 10 onto the far bank. Row 12 runs home.
    ...row('right', 10, 13, 9),
    current('up', 14, 8),
    ...row('right', 14, 17, 7),
    current('left', 18, 9), current('down', 17, 9),
    ...row('right', 18, 20, 10),
    current('down', 15, 11),
    current('down', 17, 11),
    ...row('left', 10, 20, 12),
    // A second sign, at the water's edge, to say what the water does.
    { sprite: 'sign', x: 9, y: 8, text: 'falls_sign_water' },
    // The falls, in front of the ledge. The nook behind it.
    { sprite: 'glow_falls', x: 12, y: 6, text: 'falls_water', animation: 'glow_falls', speed: 0.14,
      glow: [{ dy: -34, bloom: 22, strength: 0.4, flicker: 0.15, color: '110, 220, 255' }, { dy: -4, pool: 80, strength: 0.5, flicker: 0.1, color: '110, 220, 255' }] },
    { sprite: 'gold_pouch', x: 17, y: 4, text: 'falls_purse', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'crystal_violet_s', x: 15, y: 5, text: 'falls_vein_crystal' },
    // The banks.
    { sprite: 'crystal_bloom', x: 6, y: 12, text: 'falls_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_teal_l', x: 24, y: 6, text: 'falls_crystal' },
    { sprite: 'crystal_pink_l', x: 26, y: 11, text: 'falls_crystal' },
    { sprite: 'crystal_gold_s', x: 5, y: 8, text: 'falls_crystal' },
    { sprite: 'crystal_pink_s', x: 8, y: 4, text: 'falls_crystal' },
    { sprite: 'glowcap_trio', x: 2, y: 4, text: 'falls_trio' },
    { sprite: 'glowcap_big', x: 22, y: 12, text: 'falls_glowcap' },
    { sprite: 'glowcap_tall', x: 27, y: 8, text: 'falls_glowcap' },
    { sprite: 'crystal_pool', x: 4, y: 10, text: 'falls_pool', animation: 'crystal_pool', speed: 0.5 },
    { sprite: 'glow_moss', x: 6, y: 9, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 25, y: 9, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 23, y: 5, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'sign', x: 8, y: 9, text: 'falls_sign' },
    // A purse on the high ledge by the far bank (b, then B).
    { sprite: 'gold_pouch', x: 28, y: 4, text: 'falls_purse_high', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'crystal_teal_s', x: 7, y: 4, text: 'gp_gem' },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    '~': 'falls_lake', O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
    G: 'falls_vein', B: 'geode_block', b: 'geode_block',
  },

  // A gleamsnail on the near bank, and a quartzling and a prismoth
  // across the lake (the snails and the quartzling are all on the banks,
  // never near the currents). The_echo_answers walks only x 21-22 on rows
  // 8-9 of the far bank, clear of the quartzling (25,7) and the prismoth
  // (24-26 on row 12).
  npcs: [
    { enemy: 'gleamsnail', x: 5, y: 7, patrol: [5, 7], behaviour: 'patrol' },
    { enemy: 'quartzling', x: 25, y: 7, patrol: [25, 25], behaviour: 'disguise', reach: 3 },
    { enemy: 'prismoth', x: 25, y: 12, patrol: [24, 26], behaviour: 'patrol' },
  ],
};
