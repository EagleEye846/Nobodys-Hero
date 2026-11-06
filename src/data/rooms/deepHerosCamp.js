// THE HERO'S CAMP: a wide dark hall with a ring of cold stones for a fire,
// and nobody has lit it in a very long time. Your light finds the rest one
// thing at a time. Along the north wall, marks scratched in the rock, in
// fives: the first ones high up and neat, the later ones lower down and
// smaller and wobblier, as if whoever made them stopped reaching. One has a
// sun drawn in it, and a stick figure. By the cold fire, on a smooth stone,
// one word scratched over and over. At the far end, a bedroll the size of a
// child's. Reach it and Ves says what she has seen (the_heros_camp).
//
// A save crystal is here: the last place to rest before the root.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid; the
//      north wall is two tiles of it, so marks can go high and low)
//   .  black stone floor   q  ash (floor)   ^  black stalagmite (solid)
//   O  glossy black boulder (solid)
export const DEEP_HEROS_CAMP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_heros_camp',
  // The room's name, for the Room Editor.
  name: 'THE HERO\'S CAMP',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "Five and a Line" (src/data/music/herosCampTheme.js): a small bell counting in
  // fives, this room's own quiet piece (the Deep's song plays outside it).
  music: 'herosCamp',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // Dark: only your light shows anything (0 to 1).
  // Dark, but the camp has a little light of its own: a faint blue crystal
  // between the marks, another over the bedroll and the fire's last embers,
  // so the heart of the chapter can be seen without hunting for it.
  dark: 0.86,
  // Glow-worms on Ves's umbrella: your light never drops below this here.
  glowworms: 38,

  tiles: [
    '################################',
    '################################',
    '################################',
    '###WWWWWWWWWWWWWWWWWWWWWWWWWW###',
    '###WWWWWxWWWWWWWWWWWWWWWWWWWW###',
    '###..........................###',
    '###O.......................x.###',
    '###..........................WWW',
    'WWW.......qq....................',
    '...............qq......q........',
    '..............qqqq...........###',
    '###.^.......................O###',
    '######.^..###.O.....^.....######',
    '################################',
    '################################',
  ],

  // Where the player starts, in tile coordinates (just in from the Crawl).
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'deep_crawl', spawn: { x: 38, y: 10 } },
    { x: 31, y: 8, w: 1, h: 2, to: 'deep_keepers_fire', spawn: { x: 1, y: 6 } },
  ],

  // The scene plays when you come to the bedroll at the far end (it reads the
  // bedroll for you, then Ves speaks).
  cutscenes: [
    { x: 23, y: 5, w: 4, h: 8, scene: 'the_heros_camp' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The marks on the wall (high and neat, then low and wobbly, then a drawing),
  // the cold fire, the scratched stone, the bedroll, a purse and a save crystal.
  // The marks, the fire, the stone and the bedroll are always there to be seen (the
  // camp's own faint lights show them); only the purse waits for your light.
  textFile: 'interactions/deep.txt',
  props: [
    { sprite: 'tally_marks_a', x: 5, y: 3, text: 'cp_marks_high' },
    { sprite: 'tally_marks_a', x: 6, y: 3, text: 'cp_marks_high' },
    { sprite: 'tally_marks_b', x: 7, y: 3, text: 'cp_marks_high' },
    { sprite: 'tally_marks_b', x: 10, y: 4, text: 'cp_marks_low' },
    { sprite: 'tally_marks_b', x: 11, y: 4, text: 'cp_marks_low' },
    { sprite: 'tally_marks_c', x: 12, y: 4, text: 'cp_marks_child' },
    { sprite: 'cold_campfire', x: 16, y: 9, text: 'cp_fire', light: 56 },
    { sprite: 'smooth_stone_c', x: 14, y: 9, text: 'cp_stay' },
    { sprite: 'little_cairn', x: 18, y: 11, text: 'cp_cairn', seenInLight: true },
    { sprite: 'old_bedroll', x: 25, y: 7, text: 'cp_bedroll' },
    { sprite: 'gold_pouch', x: 3, y: 11, text: 'cp_purse', gold: 50, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'savepoint', x: 21, y: 6, save: true },
    // Grig's pack (shops.js: deep_grig), set down at the west end where the camp is
    // flat and clear of the scene's walk (x 23 to 26): a cave cricket who sells the long walk.
    { sprite: 'bf_grig', x: 8, y: 7, shop: 'deep_grig', animation: 'bf_grig', speed: 0.5, light: 52 },
  ],
  tileTexts: { '#': 'deep_rock', W: 'deep_face', '^': 'deep_stalagmite', O: 'deep_boulder', q: 'deep_ash' },

  // Nobody lives in the Hero's camp but Grig, who sells; not a single monster, so
  // the scene's walk has the whole east end to itself.
  npcs: [],
};
