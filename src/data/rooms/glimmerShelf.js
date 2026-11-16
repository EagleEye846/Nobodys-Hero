// THE SHELF: a ledge path along the wall of the great cavern, a long way up,
// with the whole buried kingdom hanging in the haze below the open edge. Half
// way along, the ledge has simply fallen away: five tiles of air. On this side
// a sun-crystal throws its beam along, and a prism you turn sends it down the
// ledge. The prism that has to catch it is not fixed to anything: it is a
// loose one, standing on the floor, and it slides when you lean on it. Slide it
// into the line of the beam, turn it to face the gap, and the light goes across
// to a crystal eye on the far ledge, which lays a bridge of light. The first
// beam room, so it teaches the two things the rest of the Glimmering keeps
// asking: prisms turn (Z), and prisms move (lean on them).
//
// beam: the sun-crystal at 3,6 throws right along row 6 to the prism at 10,6.
//   Set '\\' it turns the beam down column 10 (set '/' it goes up into the rock).
//   The loose prism starts at 9,9. Pushed up (stand at 9,10) it reaches 9,8;
//   pushed right from there (stand at 8,8) it reaches 10,8, under the beam.
//   Set '\\' it sends the light right along row 8: over the gap (12-16) to the
//   eye at 24,8. (Left at 10,9 it sends the beam along row 9 to the wall at
//   the far side: close, and nothing.) The eye is latched, so once it has been
//   lit the bridge stays. A stump by the wall puts the loose prism back.
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   .  lilac cave floor   ,  glowing moss   ~  glowing pool (solid)
//   b  amethyst block, 12 high   B  amethyst block, 24 high
//   O  crystal cluster (solid)   J  crystal spires (solid)   ^  crystal spike
//   p  small glowing mushrooms (solid)   N  glowing ferns (walkable)
//   _  open air: the view over the edge shows through
export const GLIMMER_SHELF = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_shelf',
  // The room's name, for the Room Editor.
  name: 'THE SHELF',
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
    '#WWVWWWWWWWHWWWWWWWWVWWWWWWWHWW#',
    '#WWWWKWWWWWWWWWWWKWWWWWWWWWWWWW#',
    '#..,,..N..O._____..........B,,N#',
    '#.,,........_____..........B..N#',
    '#...,,......_____..........b,,.#',
    '............_____.....p.........',
    '............_____...............',
    '#....~~....._____..........N...#',
    '#...~~~,...._____...,,....p....#',
    '#______________________________#',
    '#______________________________#',
    '#______________________________#',
    '#______________________________#',
    '#______________________________#',
  ],


  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'glimmer_landing', spawn: { x: 28, y: 8 } },
    { x: 31, y: 7, w: 1, h: 2, to: 'glimmer_prism_hall', spawn: { x: 1, y: 7 } },
  ],

  // A span of light over the gap, once the eye across it has been lit.
  lightBridges: [
    { x: 12, y: 8, w: 5, h: 1, when: 'shelf_eye' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    // beam: row 6, then down column 10, then row 8 across the gap.
    { sprite: 'sun_crystal', x: 3, y: 6, beam: 'right', text: 'sun_crystal' },
    { sprite: 'prism', x: 10, y: 6, mirror: '/', text: 'prism_first' },
    // The loose one: lean on it to slide it, Z to turn it. The stump puts it back.
    { sprite: 'prism', x: 9, y: 9, mirror: '/', rock: true, text: 'prism_loose' },
    { sprite: 'rock_stump', x: 2, y: 9, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 7, y: 7, text: 'shelf_sign_slide' },
    { sprite: 'crystal_eye', x: 24, y: 8, eye: 'shelf_eye', text: 'crystal_eye' },
    // The ledge, the edge and the things on it.
    { sprite: 'crystal_bloom', x: 6, y: 5, text: 'shelf_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_teal_l', x: 20, y: 5, text: 'shelf_crystal' },
    { sprite: 'crystal_pink_s', x: 22, y: 4, text: 'shelf_crystal' },
    { sprite: 'crystal_gold_s', x: 8, y: 10, text: 'shelf_crystal' },
    { sprite: 'crystal_violet_s', x: 18, y: 10, text: 'shelf_crystal' },
    { sprite: 'glowcap_big', x: 2, y: 5, text: 'shelf_glowcap' },
    { sprite: 'glowcap_trio', x: 25, y: 10, text: 'shelf_trio' },
    { sprite: 'glowcap_tall', x: 27, y: 7, text: 'shelf_glowcap' },
    { sprite: 'glow_moss', x: 7, y: 9, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 3, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 19, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'sign', x: 11, y: 6, text: 'shelf_sign' },
    // A purse up on the high block (b, then B), on the far ledge.
    { sprite: 'gold_pouch', x: 27, y: 4, text: 'shelf_purse', gold: 65, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- life pass: things to see and poke (all bodiless) ---
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    '~': 'cave_pool', O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
    _: 'shelf_edge',
  },

  // A gleamsnail on the near ledge's top edge (clear of the loose prism's
  // slides, rows 8-10), and a quartzling pretending to be one of the crystals
  // on the far one. No scenes here, so nothing to keep clear of.
  npcs: [
    { enemy: 'gleamsnail', x: 4, y: 4, patrol: [2, 6], behaviour: 'patrol' },
    { enemy: 'quartzling', x: 21, y: 6, patrol: [21, 21], behaviour: 'disguise', reach: 3 },
    // A prismoth flutters about the east ledge beyond the gap (x 18 to 23, row
    // 9), south of the crystal eye (24,8) and well off the beams and the loose
    // prism (all on the west side, x 3 to 11).
    { enemy: 'prismoth', x: 20, y: 9, patrol: [18, 23], behaviour: 'wander' },
  ],
};
