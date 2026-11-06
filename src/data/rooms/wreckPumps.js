// THE PUMPS: three decks of a sunk-and-risen merchantman, one above the other (on the
// screen, north to south): the main deck you come in on, the 'tween deck below it, and
// the bilge at the bottom. The way on (east, through the forecastle) is a hatch
// standing full of black bilge water. There are three bilge pumps, one on each deck,
// and it takes all three of you.
//
// THE PUZZLE (a trio split, E for Bramble, Q for Ves):
//   1. The hero stands on the main deck pump's treadle (12,4) and works it.
//   2. E: Bramble squeezes through the torn plate (2,7) and down the crawl in the hull's
//      side to the bilge, and onto the bilge pump's treadle (25,17).
//   3. With both pumps going, the companionway (16,8) and (17,8) drains: Q, and Ves goes
//      down to the 'tween deck, where the third pump's handle is up on a beam (27,10):
//      she hooks it down with her umbrella (a `high` lever).
//   4. That pumps the forecastle hatch dry for good ((29,4) and (29,5)). R brings everyone
//      together (or Z beside them); the hero walks out east.
// The stump (5,3) puts all three back at the door if a split goes wrong. Nothing here
// can strand anyone: R always fetches a friend through the water.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   W  hull plate (solid)   .  iron deck   ;  bilge shallows (walk)
//   ~  deep bilge (solid)   O  cargo crate (solid)   F  net heap (solid)

export const WRECK_PUMPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_pumps',
  // The room's name, for the Room Editor.
  name: 'THE PUMPS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  vesWell: true,
  // Below decks: dim and dripping, no rain.
  indoors: true,

  tiles: [
    '##################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.......OO............F......W.O.#',
    '#............................W...#',
    '..................................',
    '..................................',
    '#............................W.F.#',
    '##.#############..################',
    '##.WWWWWWWWWWWWW..WWWWWWWWWWWWWWW#',
    '##.W...........................O.#',
    '##.W..O..........................#',
    '##.W................F............#',
    '##.W.............................#',
    '##.###############################',
    '#W.WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.............;..................#',
    '#.......;;............~~......;;.#',
    '#........;;........;.............#',
    '#....~~...........;;.............#',
    '#...........F~..............OO...#',
    '##################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 4, w: 1, h: 2, to: 'wreck_hull', spawn: { x: 33, y: 10 } },
    { x: 33, y: 4, w: 1, h: 2, to: 'wreck_fog', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The main deck pump: its treadle is the hero's.
    { sprite: 'wy_pump', x: 12, y: 3, text: 'pumps_main_pump' },
    { sprite: 'treadle', x: 12, y: 4, text: 'pumps_plate_hero', treadle: 'ph', who: 'hero' },
    // The crawl down the hull's side: a torn plate only Bramble fits through.
    { sprite: 'wy_hull_hole', x: 2, y: 7, text: 'pumps_hole', gap: true },
    // The bilge pump: Bramble's treadle.
    { sprite: 'wy_pump', x: 25, y: 16, text: 'pumps_bilge_pump' },
    { sprite: 'treadle', x: 25, y: 17, text: 'pumps_plate_bramble', treadle: 'pb', who: 'bramble' },
    // The companionway to the 'tween deck: drains while both treadles are down.
    { sprite: 'wy_flood', x: 16, y: 8, text: 'pumps_companionway', animation: 'wy_flood', speed: 0.35, opensWith: ['ph', 'pb'], openText: 'pumps_companionway_open' },
    { sprite: 'wy_flood', x: 17, y: 8, text: 'pumps_companionway', animation: 'wy_flood', speed: 0.4, opensWith: ['ph', 'pb'] },
    // The 'tween deck pump: its handle is up on a beam, Ves's to hook.
    { sprite: 'wy_pump', x: 27, y: 10, text: 'pumps_tween_pump', lever: 'pv', high: true },
    // The forecastle hatch: pumped dry for good by the third pump.
    { sprite: 'wy_flood', x: 29, y: 4, text: 'pumps_hatch', animation: 'wy_flood', speed: 0.38, opensWith: ['pv'], openText: 'pumps_hatch_open' },
    { sprite: 'wy_flood', x: 29, y: 5, text: 'pumps_hatch', animation: 'wy_flood', speed: 0.42, opensWith: ['pv'] },
    // The reset stump, a sign, and the decks' clutter.
    { sprite: 'rock_stump', x: 5, y: 3, text: 'pumps_stump', rockReset: true },
    { sprite: 'sign', x: 14, y: 2, text: 'pumps_sign' },
    { sprite: 'c5_barrels', x: 24, y: 5, text: 'pumps_barrels' },
    { sprite: 'c5_rope_coil', x: 19, y: 3, text: 'hull_rope', walkable: true },
    { sprite: 'c5_crates_stack', x: 9, y: 11, text: 'hull_cargo' },
    { sprite: 'c5_anchor', x: 23, y: 9, text: 'hull_anchor' },
    { sprite: 'c5_lobster_pots', x: 14, y: 11, text: 'hull_pots' },
    { sprite: 'gold_pouch', x: 4, y: 16, text: 'pumps_pouch', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_buoys_pile', x: 16, y: 18, text: 'pumps_buoys' },
  ],
  tileTexts: { '#': 'hull_plate', W: 'hull_plate', '~': 'hull_bilge', ';': 'pumps_shallows', O: 'hull_cargo', F: 'hull_net' },

  // A net wraith in the forecastle, past the flooded hatch (row 4, x 30 to 32): it is shut
  // away until the hatch is pumped dry, so it never meets anyone mid-split, and it is off
  // the door's own tiles (x 33). No cutscenes in this room.
  npcs: [
    { enemy: 'net_wraith', x: 31, y: 3, patrol: [30, 32], behaviour: 'patrol' },
  ],
};
