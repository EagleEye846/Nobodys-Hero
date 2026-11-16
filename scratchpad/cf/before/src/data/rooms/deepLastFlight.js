// THE LAST FLIGHT (draft): the top of the Way Up. The old stair's last
// flights fell into the shaft long ago, and all that's left of them is a
// sheer face with a ledge halfway, and old iron rings hammered into the rock
// where the steps used to be. The way on is up it: two pitches of rings
// (see src/overworld/climbing.js), the hardest climbing under the ground.
// Warm air off the lit root comes up the shaft in gusts, blowing to the right,
// with ash on it (`climbWind`, and the drifting ash is `weather`): swing the
// way it blows and it carries you higher; swing into it and it pushes you
// back. The lower pitch has a long catch five tiles across, the way the wind
// blows; the upper one a catch six tiles across the other way, into it, that
// wants the biggest swing you can get, and ends straight up past the bottom of
// the swing to the clifftop ring. Ves comes up after you (as on every climb
// once she's off her crutch), and has a word about it the first time
// (ves_at_the_last_flight).
// The top comes out in Belowtown square. Nothing lives here.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid)
//   .  black stone floor   q  ash (floor)   ^  black stalagmite (solid)
//   O  glossy black boulder (solid)   J  smooth knob (solid)
import { R3C_PROPS } from '../r3cLife.js';

export const DEEP_LAST_FLIGHT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_last_flight',
  // The room's name, for the Room Editor.
  name: 'THE LAST FLIGHT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "Eight Flights" (src/data/music/wayUpTheme.js), on from the Way Up.
  music: 'wayUp',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // How it rings (a narrow drift: ECHOES in src/audio/music.js).
  echo: 'tunnel',
  // Dim, not dark: the root's veins light the rock, as on the Way Up.
  dark: 0.55,
  // The glow-worms on Ves's umbrella light the way too (as all through the Deep;
  // she has them from the First Dark on), so nobody needs a candle here.
  glowworms: 38,
  // Gusts of warm air up the shaft, shoving your swing (see climbing.js): to
  // the right, every 4 seconds for 1.5 seconds. Pumping the swing yourself is 1.8.
  climbWind: { dir: 1, every: 4, lasts: 1.5, strength: 1.0 },
  // The face is drawn as broken rock, not coursed wall (src/overworld/cragRock.js).
  crag: [{ x: 0, y: 8, w: 24, h: 25 }],
  // The ash on the draught (drawn like a thin, windblown fall: it blows harder in a gust).
  weather: 'flurry',
  wind: 0.8,

  tiles: [
    '#################..#####',
    '################W..W####',
    '###########WWWWW....W###',
    '##########W.....q....###',
    '#########O..q.........##',
    '########....^.....q.O###',
    '#######J..q........#####',
    '########.....q...#######',
    '#########WWWWWW#########',
    '######WWWWWWWWWWWW######',
    '#####WWWWWWWWWWWWWW#####',
    '#####WWWWWWWWWWWWWW#####',
    '####WWWWWWWWWWWWWWW#####',
    '#####WWWWWWWWWWWWWWW####',
    '#####WWWWWWWWWWWWWWW####',
    '####WWWWWWWWWWWWWWWWW###',
    '####WWWWWWWWWWWWWWWWW###',
    '###WWWWWWWWWWWWWWWWWW###',
    '###WWW.WWWWWW..WWWWWWW##',
    '##OWW.q.....J.....q...##',
    '#....q.......q......^.##',
    '##^......q....WO..q..###',
    '#####..WWWWWWWWWW#######',
    '###WWWWWWWWWWWWWWW######',
    '###WWWWWWWWWWWWWWW######',
    '##WWWWWWWWWWWWWWWWW#####',
    '##WWWWWWWWWWWWWWWWW#####',
    '##WWWWWWWWWWWWWWWWW#####',
    '##WWWWWWWWWWWWWWWW######',
    '#WWWWWWWWWWWWWWWWW######',
    '###WWWWWWWWWWWWWWW######',
    '###WWWWW..WWWWWW########',
    '#...q.....q...WWO#######',
    '#.^....q.....J..########',
    '#..q.....O....##########',
    '#...q....###############',
    '##..####################',
    '##..####################',
  ],

  // Where the player starts, in tile coordinates: at the foot, up from the Way Up.
  playerStart: { x: 3, y: 34 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // Down: back onto the Way Up's top landing. Up: out into Belowtown square.
  doors: [
    { x: 2, y: 37, w: 2, h: 1, to: 'deep_way_up', spawn: { x: 2, y: 3 } },
    { x: 17, y: 0, w: 2, h: 1, to: 'belowtown_square', spawn: { x: 30, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // Across the foot, just in from the Way Up: Ves looks up at the face, once.
  cutscenes: [
    { x: 1, y: 34, w: 9, h: 1, scene: 'ves_at_the_last_flight', after: 'the_light_goes_up' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The lower pitch: hook the first ring from 4,32. A step up and across, a long
  // catch five tiles across to the right (with the wind), a step up, a step back
  // left, and the clifftop ring at the ledge's edge (11,21). The upper pitch:
  // hook the first ring from 17,19. A step up and across to the left, a long
  // catch six tiles across to the left (into the wind: pump it as high as it
  // goes), two steps up, then straight up to the clifftop ring at the top
  // landing's edge (9,7). Roping down: 9,7 lands you on the ledge at 9,19, and
  // 11,21 at the foot at 11,32.
  textFile: 'interactions/deep.txt',
  // Each ring has a faint glow of its own (`light`), so the route shows in the dim before you hook on.
  props: [
    ...(R3C_PROPS.deep_last_flight ?? []),
    // The lower pitch.
    { sprite: 'swing_ring', x: 4, y: 30, light: 20 },
    { sprite: 'swing_ring', x: 6, y: 28, light: 20 },
    { sprite: 'swing_ring', x: 11, y: 28, light: 20 },
    { sprite: 'swing_ring', x: 13, y: 26, light: 20 },
    { sprite: 'swing_ring', x: 11, y: 24, light: 20 },
    { sprite: 'grapple_ring', x: 11, y: 21, grapple: true, light: 20 },
    // The upper pitch.
    { sprite: 'swing_ring', x: 17, y: 17, light: 20 },
    { sprite: 'swing_ring', x: 15, y: 15, light: 20 },
    { sprite: 'swing_ring', x: 9, y: 15, light: 20 },
    { sprite: 'swing_ring', x: 7, y: 13, light: 20 },
    { sprite: 'swing_ring', x: 9, y: 11, light: 20 },
    { sprite: 'grapple_ring', x: 9, y: 7, grapple: true, light: 20 },
    // Lit root veins in the rock, as all the way up the Way Up.
    { sprite: 'root_vein_lit', x: 15, y: 30, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.32 },
    { sprite: 'root_vein_lit', x: 3, y: 24, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    { sprite: 'root_vein_lit', x: 19, y: 12, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.34 },
    { sprite: 'root_vein_lit', x: 5, y: 9, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    // (and close by the rings, so the route shows in their light)
    { sprite: 'root_vein_lit', x: 9, y: 29, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.33 },
    { sprite: 'root_vein_lit', x: 8, y: 25, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.31 },
    { sprite: 'root_vein_lit', x: 12, y: 17, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.35 },
    { sprite: 'root_vein_lit', x: 12, y: 12, text: 'wu_vein', animation: 'root_vein_lit', speed: 0.3 },
    // A broken step, the last of the old flight, at the foot.
    { sprite: 'smooth_stone_b', x: 12, y: 33, text: 'lf_step' },
    // At the top, the stair again: the last few steps up into the town.
    { sprite: 'smooth_stone_a', x: 14, y: 3, text: 'lf_top' },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'dp_floor_stars', x: 8, y: 20, animation: 'dp_floor_stars', speed: 0.6, flat: true, walkable: true, decor: true },
    { sprite: 'dp_floor_stars', x: 14, y: 19, animation: 'dp_floor_stars', speed: 0.6, flat: true, walkable: true, decor: true },
    { sprite: 'dp_floor_stars', x: 10, y: 5, animation: 'dp_floor_stars', speed: 0.6, flat: true, walkable: true, decor: true },
    { sprite: 'dp_pale_caps', x: 13, y: 4, text: 'dd_caps', animation: 'dp_pale_caps', speed: 1.0, walkable: true, seenInLight: true },
    { sprite: 'dp_worm_pile', x: 13, y: 20, text: 'dd_worms', animation: 'dp_worm_pile', speed: 0.7, walkable: true, seenInLight: true },
    { sprite: 'dp_crystal_bud', x: 12, y: 3, text: 'dd_bud', animation: 'dp_crystal_bud', speed: 0.9, walkable: true, seenInLight: true },
    // --- end life pass ---
  ],
  tileTexts: { '#': 'deep_rock', W: 'lf_face', '^': 'deep_stalagmite', O: 'deep_boulder', J: 'deep_boulder' },

  // Nobody, nothing.
  npcs: [],
};
