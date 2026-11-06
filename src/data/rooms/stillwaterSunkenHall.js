// THE SUNKEN HALL: a great pillared hall that the lake has stood in for
// longer than anyone has counted, roofed over with rock, the water still and
// black to the tops of its walls, and every pillar standing twice: once in
// the air and once in the water. A causeway of boards runs out from the west
// door and stops short, at a gap seven strides wide, with the east door on
// the far side of it.
// The puzzle is in the light, and it takes both of you, twice over. A sun-crystal
// on the west platform throws a beam along row 5; three prisms have to be turned
// so it runs down the west platform, along the south water and up to the causeway,
// and there Ves has to stand in it (Q, walk her to the end of the boards, face
// east) to send it over the first gap to a lamp on a little islet. The lamp (an
// eye that only burns while the light holds) lays a bridge of light, but only
// for as long as she keeps holding it, so she can't leave her post.
// On the islet a second sun-crystal wakes with the lamp, and its beam goes up
// into a prism. Set one way it goes east to the eye on the far platform (that
// lays the second bridge); set the other way it goes west, all the way back over
// the water, to an eye on the west platform that makes the first bridge last.
// You need both: the first so Ves can let go and follow, the second to get out.
//
// beam 1 (solved): the sun-crystal at 2,5 throws right along row 5 to the prism
//   at 6,5 (turned to backslash), down column 6 to the prism at 6,11 (backslash),
//   right along row 11 to the prism at 14,11 (turned to slash), up column 14 to
//   Ves at 14,8 (facing right), and right along row 8 over the gap to the lamp
//   at 19,8 (hall_a: 'latch: false', only while lit).
// beam 2: the sun-crystal at 21,9 (beamWhen hall_a) throws up column 21 to the
//   prism at 21,7. Slash: right along row 7 to the eye at 26,7 (hall_b, the bridge
//   at 22-23). Backslash: left along row 7 to the eye at 7,7 (hall_a2, the first
//   bridge for good). Turn it from 20,7 (not in the line of the beam).
// Tile key (see src/overworld/deepTiles.js for how the Stillwater draws them):
//   #  cold black rock overhead (solid)   W  flowstone rock face (solid)
//   h  the hall's dressed stone wall (solid)   .  pale wet stone
//   q  wet shingle   g  jetty boards over the water   ;  shallows (walkable)
//   ~  black water (solid; beams pass over it)
//   I  fluted pillar standing in the water (solid)   J  broken pillar (solid)
export const STILLWATER_SUNKEN_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'stillwater_sunken_hall',
  // The room's name, for the Room Editor.
  name: 'THE SUNKEN HALL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stillwater',
  // "The Stillwater" (src/data/music/stillwaterTheme.js).
  music: 'stillwater',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'lake',
  // Under the hall's roof of rock: the edges of the screen sink into shadow.
  indoors: true,
  fog: 0.12,
  vesWell: true,

  tiles: [
    '########################################',
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#......q~~~~~~~J~~~~~~~~q..............#',
    '#......q~I~I~~~~~~I~I~I~q..I..I..I..I..#',
    '#.......~~~~~~~~~~~...~~...............#',
    '.......Jggggggggg~~...~~................',
    '........g~~~ggggg~~...~~................',
    '#......q~~J~gg~~J~~~~J~~q..............#',
    '#......q~~~~...~~~~~~~~~q..I..I..I.....#',
    '#......q~I~I...~~~I~I~I~q...;;;;;;;;...#',
    '#......q~~~~~~~~~~~~~~~~q.;;;;;;;;;;;;.#',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates (just in from the west door).
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'stillwater_reeds', spawn: { x: 43, y: 6 } },
    { x: 39, y: 8, w: 1, h: 2, to: 'stillwater_far_shore', spawn: { x: 1, y: 8 } },
  ],

  // The spans of light over the two gaps (each two tiles wide and two deep, so you never have to
  // walk along the beam). The first gap has two: one that lasts only while the lamp on the islet
  // is held lit (hall_a), and one that is there for good (hall_a2).
  lightBridges: [
    { x: 17, y: 8, w: 2, h: 2, when: 'hall_a' },
    { x: 17, y: 8, w: 2, h: 2, when: 'hall_a2' },
    { x: 22, y: 8, w: 2, h: 2, when: 'hall_b' },
  ],

  // No cutscenes here.
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/stillwater.txt',
  props: [
    // beam 1: row 5, down column 6, along row 11, up column 14 to Ves at 14,8 (facing right),
    // along row 8 over the first gap to the lamp on the islet (hall_a).
    { sprite: 'sun_crystal', x: 2, y: 5, beam: 'right', text: 'hall_sun_crystal' },
    { sprite: 'prism', x: 6, y: 5, mirror: '/', text: 'hall_prism' },
    { sprite: 'prism', x: 6, y: 11, mirror: '/', text: 'hall_prism' },
    { sprite: 'prism', x: 14, y: 11, mirror: '\\', text: 'hall_prism' },
    // The islet (19-21, 7-9): the lamp (an eye that only burns while the light holds), a second
    // sun-crystal that wakes with it, and the prism that aims its beam. Set '/', the beam goes
    // east along row 7 to the eye on the far platform (hall_b: the second bridge). Set '\' it
    // goes west along row 7, all the way back to the eye on the west platform (hall_a2:
    // the first bridge, for good).
    { sprite: 'crystal_eye', x: 19, y: 8, eye: 'hall_a', latch: false, text: 'hall_lamp' },
    { sprite: 'sun_crystal', x: 21, y: 9, beam: 'up', beamWhen: 'hall_a', text: 'hall_sun_crystal_asleep' },
    { sprite: 'prism', x: 21, y: 7, mirror: '/', text: 'hall_prism_islet' },
    { sprite: 'crystal_eye', x: 7, y: 7, eye: 'hall_a2', text: 'hall_eye_west' },
    { sprite: 'crystal_eye', x: 26, y: 7, eye: 'hall_b', text: 'hall_eye' },
    // The hall.
    { sprite: 'sign', x: 4, y: 9, text: 'hall_plaque' },
    { sprite: 'gold_pouch', x: 12, y: 12, text: 'hall_purse', gold: 105, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 37, y: 5, text: 'hall_chest', gives: 'olmskin_vest', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'glow_reeds_tall', x: 1, y: 13, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'glow_reeds', x: 3, y: 13, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds', x: 25, y: 13, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.4 },
    { sprite: 'glow_reeds_tall', x: 38, y: 11, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'glow_reeds', x: 35, y: 9, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.5 },
    { sprite: 'fungus_pads', x: 15, y: 13, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 21, y: 11, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 11, y: 7, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 19, y: 5, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'sunken_pillar_top', x: 15, y: 6, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 19, y: 10, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 21, y: 13, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    // Set dressing: roots down the walls, and smooth stones and a drip or two
    // on the floor (walkable: in nobody's way).
    { sprite: 'floor_pebbles_cool', x: 4, y: 6, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 31, y: 7, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles_cool', x: 25, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 28, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 4, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 30, y: 13, walkable: true, flat: true },
  ],
  tileTexts: {
    '#': 'lake_rock', W: 'lake_wall', h: 'hall_wall', '~': 'lake_water', ';': 'lake_shallows', q: 'lake_shingle', g: 'lake_jetty',
    I: 'hall_pillar', J: 'lake_broken_pillar',
  },

  // A blindfish glides under the gap (row 9, east of the causeway's end), and
  // an olm lies in the shallows below the east platform. The beam puzzle is on
  // the west side, well clear of both; no scenes here.
  npcs: [
    { enemy: 'blindfish', x: 16, y: 13, patrol: [9, 22], behaviour: 'patrol' },
    { enemy: 'olm', x: 31, y: 12, patrol: [28, 35], behaviour: 'patrol' },
    // A fiddler on the east platform (row 9, x 28 to 34), between the pillars' row and the
    // olm's; the beams, prisms and crystal eyes are all west of x 27. No cutscenes here.
    { enemy: 'fiddler', x: 31, y: 9, patrol: [28, 34], behaviour: 'patrol' },
  ],
};
