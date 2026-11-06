// THE SOFT FIELD: the widest, prettiest field in Sunnyside, and the last room
// above ground. Nothing here is trying to eat you: there's a picnic laid out,
// a scarecrow, haystacks, a daisy to put your ear to (it hums), and a sign that
// says KEEP OFF THE GRASS, with no reason given. Walk far enough east and the
// ground gives way (the_ground_gives): that's the whole room, really, and
// everything to the west of the trigger is the last of the daylight.
//
// The gentle puzzle is in the west half, before the trigger: a round hay bale
// to push onto a plate (a flat stone in the lawn), which swings open the gate
// of a fenced corner and shows a purse. The one little twist: the plate is
// tucked between two flower beds at (4,12), so the bale can't be pushed
// along to it; it goes left along row 11 to column 4, and then DOWN onto it
// from the lane (stand at 4,10 and push). Push it down anywhere else and it
// ends up wedged in the flower beds' row; the stump at column 12 puts the
// bale back (so does Z twice on the bale). Ves says she
// can't push it ("I'm elegant, not a hay-mover"), so it's yours to shove.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   f  white picket fence (solid)
//   I  oak   T  apple tree   J  blossom tree (solid, standing)   F  flower bed (solid)
export const SUNNY_SOFT_FIELD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_soft_field',
  // The room's name, for the Room Editor.
  name: 'THE SOFT FIELD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'sunnyside',
  // "Sunnyside" (src/data/music/sunnysideTheme.js). The scene cuts it dead.
  music: 'sunnyside',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'meadow',
  vesWell: true,
  birds: 6,

  tiles: [
    '######################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,ffffffff,#',
    '#,,,,,,,,,,,,,,J,,,,,,,,,,,,f,,,,,,f,#',
    '#,,,,,,,I,,,,,,,,,,,,,,,,,,,f,,,,,,f,#',
    '#,,,,,,,,,,FF,,,,,,T,,,,,,,,fff,,fff,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,FF,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '::::::::::::::::::::::::::::::::::,,,#',
    '::::::::::::::::::::::::::::::::::,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,F,F,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#fffff,,ffffff,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,f,,,,,,,,FF,,,,,,,,,J,,,#',
    '#,,,,,,,,,,,,f,,,,,,J,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,f,,,,,,,,,,,,,,,,I,,,,,,#',
    '#,,,,,,,,,,,,f,,F,,,,,,,,,,,,,,,,,,,,#',
    '######################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates (the west door).
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_brook', spawn: { x: 32, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // A strip right across the field at column 21: there's no way round it.
  cutscenes: [
    { x: 21, y: 2, w: 1, h: 16, scene: 'the_ground_gives' },
    // The end of Chapter 4: climbing out of the hole, up the Long Rope.
    { x: 27, y: 12, w: 1, h: 1, scene: 'out_into_the_light' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The bale and its plate, the gate of the fenced corner and the purse in it,
  // the stump that resets the bale, the sign, the picnic, the humming daisy,
  // the scarecrow, haystacks, a bench, flowers.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'hay_bale', x: 9, y: 11, text: 'soft_bale', rock: true },
    // Where the ground gave way, once it has: the hole, and the Long Rope you
    // climbed back out on, tied off beside it.
    // The cracks Ves's umbrella tip sent across the grass, still there round
    // the hole, centred on it, flat under everyone.
    { sprite: 'field_cracks', x: 27, y: 12, text: 'soft_hole', flat: true, walkable: true, after: 'the_ground_gives' },
    { sprite: 'field_hole', x: 26, y: 11, text: 'soft_hole', after: 'the_ground_gives' },
    { sprite: 'stone_button', x: 4, y: 12, text: 'soft_plate', button: 'plate' },
    { sprite: 'meadow_gate', x: 6, y: 13, text: 'soft_gate', opensWith: ['plate'], openText: 'soft_gate_open' },
    { sprite: 'rock_stump', x: 12, y: 12, text: 'soft_stump', rockReset: true },
    { sprite: 'gold_pouch', x: 3, y: 16, text: 'soft_pouch', gold: 105, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'haystack', x: 8, y: 16, text: 'soft_haystack' },
    { sprite: 'sign', x: 19, y: 8, text: 'soft_keep_off' },
    { sprite: 'picnic_blanket', x: 16, y: 13, text: 'soft_picnic', walkable: true },
    { sprite: 'daisy_patch', x: 17, y: 5, text: 'soft_hum', walkable: true },
    { sprite: 'scarecrow', x: 23, y: 5, text: 'soft_scarecrow', animation: 'scarecrow', speed: 0.5 },
    { sprite: 'haystack', x: 25, y: 14, text: 'soft_haystack' },
    { sprite: 'haystack', x: 31, y: 12, text: 'soft_haystack' },
    { sprite: 'bench', x: 9, y: 6, text: 'soft_bench' },
    { sprite: 'picnic_blanket', x: 31, y: 3, text: 'soft_picnic', walkable: true },
    { sprite: 'daisy_patch', x: 5, y: 7, walkable: true },
    { sprite: 'daisy_patch', x: 14, y: 15, walkable: true },
    { sprite: 'daisy_patch', x: 28, y: 8, walkable: true },
    { sprite: 'daisy_patch', x: 34, y: 15, walkable: true },
    { sprite: 'buttercups', x: 11, y: 8, walkable: true },
    { sprite: 'buttercups', x: 19, y: 12, walkable: true },
    { sprite: 'buttercups', x: 26, y: 11, walkable: true },
    { sprite: 'buttercups', x: 33, y: 7, walkable: true },
    { sprite: 'buttercups', x: 29, y: 16, walkable: true },
    { sprite: 'butterflies', x: 7, y: 5, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 14, y: 11, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 24, y: 8, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 30, y: 14, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 35, y: 9, animation: 'butterflies', speed: 0.2, walkable: true },
  ],
  tileTexts: {
    '#': 'soft_hedge', W: 'soft_hedge', f: 'soft_fence',
    F: 'field_flowers', I: 'field_oak', T: 'field_apple', J: 'field_blossom',
  },

  // No monsters: the scene crosses the middle of the field, and nothing may be
  // in its way (and "nothing ever happens here" is the joke).
  npcs: [],

  // CHAPTER 5 (src/overworld/chapterRooms.js): the next morning. The dandelions
  // have gone to seed and the seed clocks drift over the field. Farmer Tolliver has roped
  // off the hole: posts and rope round three sides (rows 10 to 14, open to the
  // west so nobody waking beside the hole is shut in) on the lane's
  // south half, so row 9 of the lane stays open for the walk east. There is a way on east
  // now, along the lane, through a door at the field's east end.
  // Nobody has a fight here, as before. Nothing crosses the opening scene's walk.
  chapter5: {
    tiles: [
      '######################################',
      '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
      '#,,,,,,,,,,,,,,,,,,,,,,,,,,,ffffffff,#',
      '#,,,,,,,,,,,,,,J,,,,,,,,,,,,f,,,,,,f,#',
      '#,,,,,,,I,,,,,,,,,,,,,,,,,,,f,,,,,,f,#',
      '#,,,,,,,,,,FF,,,,,,T,,,,,,,,fff,,fff,#',
      '#,,,,,,,,,,,,,,,,,,,,,,,,FF,,,,,,,,,,#',
      '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,#',
      '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
      '::::::::::::::::::::::::::::::::::::::',
      '::::::::::::::::::::::::::::::::::::::',
      '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
      '#,,F,F,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
      '#fffff,,ffffff,,,,,,,,,,,,,,,,,,,,,,,#',
      '#,,,,,,,,,,,,f,,,,,,,,FF,,,,,,,,,J,,,#',
      '#,,,,,,,,,,,,f,,,,,,J,,,,,,,,,,,,,,,,#',
      '#,,,,,,,,,,,,f,,,,,,,,,,,,,,,,I,,,,,,#',
      '#,,,,,,,,,,,,f,,F,,,,,,,,,,,,,,,,,,,,#',
      '######################################',
      '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    ],
    doors: [
      { x: 0, y: 9, w: 1, h: 2, to: 'sunny_brook', spawn: { x: 32, y: 13 } },
      { x: 37, y: 9, w: 1, h: 2, to: 'sunny_hayfields', spawn: { x: 1, y: 9 } },
    ],
    cutscenes: [
      { x: 19, y: 10, w: 4, h: 5, scene: 'tide_held_opens' },
    ],
    dropProps: ['haystack@25,14', 'haystack@31,12', 'daisy_patch@28,8', 'buttercups@26,11'],
    textSwap: {
      soft_hole: 'soft_hole_5', soft_keep_off: 'soft_keep_off_5', soft_picnic: 'soft_picnic_5',
      soft_scarecrow: 'soft_scarecrow_5', soft_hum: 'soft_hum_5', soft_bench: 'soft_bench_5',
    },
    addProps: [
      { sprite: 'sign', x: 27, y: 6, text: 'soft_rope_sign' },
      { sprite: 'cf_basket', x: 20, y: 13, text: 'soft_basket', after: 'tide_held_opens' },
      { sprite: 'sy_rope_post', x: 23, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 24, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 25, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 26, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 27, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 28, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 29, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 30, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_post', x: 31, y: 10, text: 'soft_rope' },
      { sprite: 'sy_rope_post', x: 23, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 24, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 25, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 26, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 27, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 28, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 29, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_h', x: 30, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_post', x: 31, y: 14, text: 'soft_rope' },
      { sprite: 'sy_rope_v', x: 31, y: 11, text: 'soft_rope' },
      { sprite: 'sy_rope_v', x: 31, y: 12, text: 'soft_rope' },
      { sprite: 'sy_rope_v', x: 31, y: 13, text: 'soft_rope' },
      { sprite: 'sy_seed_heads', x: 3, y: 3, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 10, y: 2, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 14, y: 8, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 18, y: 13, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 5, y: 16, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 10, y: 15, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 20, y: 3, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 25, y: 6, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 29, y: 6, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 34, y: 4, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 35, y: 11, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 33, y: 16, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 21, y: 16, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 27, y: 16, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_heads', x: 36, y: 7, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 16, y: 16, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_drift', x: 6, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 11, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 17, y: 6, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 22, y: 11, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 26, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 33, y: 10, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 30, y: 3, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 8, y: 14, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 19, y: 15, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 35, y: 14, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 14, y: 13, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 28, y: 15, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    ],
    npcs: [],
  },
};
