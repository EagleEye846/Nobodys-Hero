// THE FIELD BEYOND THE GATE: the start of Chapter 4. Dawn, and the Hero's Gate
// stands broken in a hedge behind you, seen from its far side: all that grim
// violet stone, and a meadow on the other side of it going on to the horizon,
// buttercups, birdsong, a lane running off east. Ves comes out into the sun
// beside you and, after a long look at the sky, throws her crutch into the
// hedge and is well from here on (chapter_four_opens). Nothing in the field
// wants to eat you. That's the point.
//
// A little stair of banks in the north-west corner (b, then B) leads up to a
// purse; the first jump of the chapter, with nothing at stake.
//
// Tile key (see src/overworld/brightTiles.js for how Sunnyside draws them):
//   #  hedgerow, leafy top (solid)       W  hedgerow, leafy face (solid)
//   .  sun-warmed flagstones             ,  lush meadow grass
//   :  golden dirt lane                  b  grassy bank (12 high)   B  grassy bank (24 high)
//   I  big oak (solid)   T  apple tree (solid)   J  pink blossom tree (solid)
//   F  wildflower bed (solid)
export const SUNNY_GATE_FIELD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_gate_field',
  // The room's name, for the Room Editor.
  name: 'THE FIELD BEYOND THE GATE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'sunnyside',
  // Quiet to begin with (the scene brings it in after Ves's first line);
  // after that the Sunnyside song plays whenever you're here.
  music: null,
  musicAfter: { scene: 'chapter_four_opens', song: 'sunnyside' },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'meadow',
  // (No `vesWell` here: she arrives on her crutch, and the scene is where
  // she throws it away and is healed.)
  // A few birds in the sky of the room, for the dawn.
  birds: 5,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,BBb,,,,,,,......,,,,,,,,,,,#',
    '#,,,b,,,,,,,......,,,,,,T,,,,#',
    '#,,,,,,,,,,,......,,,,,,,,,,,#',
    '#,,I,,,,,,,,......,,,,,,,,,,,#',
    '#,,,,,,,,,,,,...,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,::,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,:::,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,::::::::::::::::',
    '#,,,,,,,,,,,,,::::::::::::::::',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,FF,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,FF,,,,,J,#',
    '#,,,,T,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,J,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates: just in front of the Gate.
  playerStart: { x: 14, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 29, y: 10, w: 1, h: 2, to: 'sunny_lane', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // The whole plaza under the Gate: it plays the moment the chapter starts.
  cutscenes: [
    { x: 12, y: 4, w: 6, h: 4, scene: 'chapter_four_opens' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The Hero's Gate from behind, a shrub in the hedge (the crutch goes in it:
  // `cast` lets the scene's own shrub take its place, and `until`/`after` swap
  // the words), a sign, a bench, flowers and butterflies, and a purse on top
  // of the banks.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'gate_foot_back', x: 13, y: 3, text: 'gate_behind' },
    { sprite: 'sun_shrub', x: 7, y: 2, text: 'shrub', cast: 'shrub', until: 'chapter_four_opens' },
    { sprite: 'sun_shrub', x: 7, y: 2, text: 'shrub_after', after: 'chapter_four_opens' },
    { sprite: 'sign', x: 16, y: 8, text: 'field_sign' },
    { sprite: 'bench', x: 21, y: 6, text: 'field_bench' },
    { sprite: 'gold_pouch', x: 2, y: 3, text: 'field_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'daisy_patch', x: 9, y: 4, walkable: true },
    { sprite: 'daisy_patch', x: 10, y: 9, walkable: true },
    { sprite: 'daisy_patch', x: 23, y: 9, walkable: true },
    { sprite: 'daisy_patch', x: 19, y: 13, walkable: true },
    { sprite: 'daisy_patch', x: 4, y: 11, walkable: true },
    { sprite: 'buttercups', x: 8, y: 7, walkable: true },
    { sprite: 'buttercups', x: 22, y: 3, walkable: true },
    { sprite: 'buttercups', x: 25, y: 13, walkable: true },
    { sprite: 'buttercups', x: 12, y: 15, walkable: true },
    { sprite: 'butterflies', x: 9, y: 6, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 23, y: 12, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 6, y: 14, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'haystack', x: 24, y: 16, text: 'field_haystack' },
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', F: 'field_flowers', I: 'field_oak', T: 'field_apple', J: 'field_blossom', b: 'field_bank', B: 'field_bank' },

  // Nothing. The first room of the chapter: not a single thing in it wants a fight.
  npcs: [],

  // CHAPTER 5 (src/overworld/chapterRooms.js): coming back through it. The
  // dandelions have gone to seed and drift over the grass, the Gate is just a
  // landmark now, and a couple of the coast's gulls have wandered in. Clear of
  // the old opening scene's plaza (x 12 to 17, rows 4 to 7).
  chapter5: {
    cutscenes: [],
    textSwap: { gate_behind: 'gate_behind_5', field_sign: 'field_sign_5', field_bench: 'field_bench_5' },
    addProps: [
      { sprite: 'sy_seed_heads', x: 22, y: 4, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 9, y: 12, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_heads', x: 18, y: 7, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 13, y: 16, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 14, y: 13, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 22, y: 12, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 2, y: 2, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 7, y: 7, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 2, y: 12, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 19, y: 16, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 10, y: 3, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 12, y: 7, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_drift', x: 19, y: 2, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 20, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 23, y: 13, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 26, y: 2, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 24, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 11, y: 14, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 3, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 6, y: 15, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 17, y: 14, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    ],
    npcs: [
      { enemy: 'haybob', x: 6, y: 14, patrol: [3, 9], behaviour: 'patrol' },
      { enemy: 'bunting', x: 24, y: 15, patrol: [21, 27], behaviour: 'wander' },
      // A clover snail dozing in the north-east field (x 19 to 27, rows 4 to 6), clear of the
      // lane (rows 10 and 11) and the gate scene's walk (cleared in chapter 5).
      { enemy: 'clover_snail', x: 22, y: 5, patrol: [19, 27], behaviour: 'patrol' },
    ],
  },
};
