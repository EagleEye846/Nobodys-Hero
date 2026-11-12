// THE LONG ROPE: the way home. Out of the fallen hall's doorway and along the
// passage, Belowtown ends at the foot of a sheer face, and down it, from a
// square of daylight a very long way up, hangs a rope. The folk kept it for
// when the Hero went home. He never used it. (Up top is the Soft Field, where
// the ground gave way under Ves at the start of the chapter.)
//
// Arriving plays the_long_rope (src/data/scenes/theLongRope.js): Tuck and a
// few of the folk come to see you off. Then it's yours: talk to them, save,
// and walk up into the face at the rope's foot to take hold. All three of you
// climb it together (src/overworld/ropeClimb.js), and at the top the Soft
// Field's out_into_the_light ends the chapter.
//
// Tile key (see src/overworld/brightTiles.js for how Belowtown draws them):
//   #  cavern rock overhead (solid)   W  old carved stone (solid)
//   V  stone wall hung with glow-worm lamps   .  worn flagstone   ,  mossy turf
//   I  carved pillar with a hanging lantern (solid)   F  mushroom bed (solid)
export const BELOWTOWN_LONG_ROPE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_long_rope',
  // The room's name, for the Room Editor.
  name: 'THE LONG ROPE',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  // "Pull It Twice" (src/data/music/longRopeTheme.js): the goodbye, from
  // walking in through the whole climb. The Soft Field takes over at the top.
  music: 'longRope',
  ambience: 'long_rope',
  indoors: true,

  tiles: [
    '###################',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '#######WWWWW#######',
    '######WWWWWWW######',
    '#####WWWWWWWWW#####',
    '####WWWWWWWWWWW####',
    '###WWWWWWWWWWWWW###',
    '##WWWWWWWWWWWWWWW##',
    '#WWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWW#',
    '#WWVWWWWWWWWWWWVWW#',
    '#.,,......,......,#',
    '#.,I...........I.,#',
    '#..............F..#',
    '#.F...............#',
    '#........,,.......#',
    '#.......,,,,......#',
    '#........,,.......#',
    '#.................#',
    '#.................#',
    '#.................#',
    '###################',
  ],

  // Where you come in: up the passage from the fallen hall.
  playerStart: { x: 9, y: 47 },

  // No doors: back is the fallen hall, and the only way on is up.
  doors: [],

  // The rope: from the foot of the face (row 39) all the way up to the
  // daylight, and out into the Soft Field beside the hole you fell through.
  rope: {
    x: 9,
    top: 1,
    bottom: 39,
    to: 'sunny_soft_field',
    spawn: { x: 27, y: 12 },
    daylight: 24,
    // "Pull It Twice" climbs with you: its climb as you take hold, and its
    // daylight (the Buttercups on the flute) as the light reaches you.
    music: [
      { at: 38, from: 'climb' },
      { at: 25, from: 'daylight' },
    ],
    barks: [
      { at: 31, who: 'vesper', text: '{bored}Nobody look down.\n\n{worried}...I looked down.' },
      { at: 20, who: 'bramble', text: '{grin}I can see daylight! Real daylight!\n\n{thinking}...Or a really big glow-worm.' },
      { at: 9, who: 'vesper', text: '{exhausted}When we get to the top, nobody says a word about my hair.' },
    ],
  },

  // Arriving plays the goodbyes.
  cutscenes: [
    { x: 9, y: 47, w: 1, h: 1, scene: 'the_long_rope' },
  ],

  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'bf_tuck', x: 7, y: 41, cast: 'tuck', text: 'rope_tuck', speaker: 'tuck', animation: 'bf_tuck', speed: 0.5 },
    { sprite: 'bf_rumbold_head', x: 6, y: 41, text: 'rope_king_head' },
    { sprite: 'bf_mole_miner_a', x: 12, y: 42, cast: 'm1', text: 'rope_mole' },
    { sprite: 'bf_frog_kid_a', x: 13, y: 43, cast: 'f1', text: 'rope_frog' },
    { sprite: 'bf_glowworm', x: 5, y: 44, cast: 'g1', text: 'rope_glowworm', glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    { sprite: 'savepoint', x: 14, y: 46, save: true },
  ],
  tileTexts: { W: 'rope_face', '#': 'town_rock', V: 'town_lamps_wall', I: 'town_pillar' },

  // Nothing to fight: just the way home.
  npcs: [],
};
