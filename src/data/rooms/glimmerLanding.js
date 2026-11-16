// THE LANDING: where you come down. A broad ledge high on the wall of an
// enormous cavern, and in the middle of it a mushroom the size of a house,
// glowing violet, whose cap has just caught the two of you (soft_landing:
// SPLOMF, two bounces, spores, Ves's legs sticking out of the top). Beyond the
// ledge's edge there is no floor at all: the south side of the room is open
// air and, far below, the whole buried kingdom: a great hanging crystal like a
// dim sun, spires standing in the haze, a lake, and the lights of a town
// (`vista: { kind: 'kingdom' }`, src/overworld/kingdomVista.js). The scene
// pans the camera down to it.
//
// There is no way back up the shaft, and nothing to fight here. The way on is
// the door in the east wall, along the ledge. A crack in the west wall
// leads to the Chimney (glimmerChimney.js), a ring climb up to a chest.
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss (solid)
//   K  rock face (solid)             .  lilac cave floor   ,  glowing moss
//   O  crystal cluster (solid)   J  crystal spires (solid, standing)
//   ^  crystal spike (solid)   p  small glowing mushrooms (solid)
//   Z  crystal thicket (solid)   N  glowing ferns (walkable)
//   _  open air: the view over the edge shows through
import { R3C_PROPS } from '../r3cLife.js';

export const GLIMMER_LANDING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_landing',
  // The room's name, for the Room Editor.
  name: 'THE LANDING',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // Silent until the scene's view over the edge, where the Glimmering's song
  // swells in; after that it plays whenever you're here.
  music: null,
  musicAfter: { scene: 'soft_landing', song: 'glimmer' },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // The view down over the buried kingdom, behind the open air.
  vista: { kind: 'kingdom' },
  vesWell: true,

  tiles: [
    '##############################',
    '##############################',
    '#WWVWWWWWVWWWWWVWWWWWVWWWWVWW#',
    '#WWWWWHWWWWWHWWWWWHWWWWWHWWWW#',
    '#.J...................p....J.#',
    '#.,,,...O........,^,.........#',
    '#,,,,,,..........,,,,..O.....#',
    '#.,,,,,.........,,,..........#',
    '...,,..................^......',
    '....p.....N...................',
    '#......N...........,,,,,.....#',
    '#O.................,,,,,,,..O#',
    '#..^....,,,........,,,,,,,...#',
    '#....O.,,,,,.^......O.,,,.J..#',
    '#.......,,,..........,,,.....#',
    '#WWWWKWWWWWKWWWWWKWWWWWKWWWWW#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
    '#____________________________#',
  ],

  // Where the player starts, in tile coordinates: on top of the great mushroom
  // (the scene opens with the fall, so you never see this).
  playerStart: { x: 13, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you
  // arrive. East, along the ledge, to the Shelf (glimmer_shelf: you arrive at x 1, y 7).
  doors: [
    { x: 29, y: 8, w: 1, h: 2, to: 'glimmer_shelf', spawn: { x: 1, y: 7 } },
    // West, through a crack in the wall, to the Chimney (a ring climb up to a chest).
    { x: 0, y: 8, w: 1, h: 2, to: 'glimmer_chimney', spawn: { x: 16, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // Where you land, so it plays as the room opens.
  cutscenes: [
    { x: 13, y: 8, w: 1, h: 1, scene: 'soft_landing' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The giant mushroom (the scene's own animated cap takes its place while it
  // plays: `cast` lets it), a sign somebody put up, crystals and moss, a pool,
  // a purse tucked behind the spires.
  textFile: 'interactions/glimmer.txt',
  props: [
    ...(R3C_PROPS.glimmer_landing ?? []),
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 26, y: 10, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 27, y: 10, travel: 'glimmer_landing', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    { sprite: 'glowcap_giant', x: 12, y: 9, text: 'landing_cap', cast: 'glowcap' },
    { sprite: 'sign', x: 17, y: 9, text: 'landing_sign' },
    { sprite: 'crystal_bloom', x: 4, y: 10, text: 'landing_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_pool', x: 22, y: 8, text: 'landing_pool', animation: 'crystal_pool', speed: 0.5 },
    { sprite: 'crystal_pink_l', x: 25, y: 5, text: 'landing_crystal' },
    { sprite: 'crystal_teal_s', x: 16, y: 6, text: 'landing_crystal' },
    { sprite: 'crystal_gold_s', x: 19, y: 12, text: 'landing_crystal' },
    { sprite: 'crystal_violet_s', x: 7, y: 7, text: 'landing_crystal' },
    { sprite: 'glowcap_trio', x: 24, y: 12, text: 'landing_trio' },
    { sprite: 'glowcap_small', x: 10, y: 6, text: 'landing_small' },
    { sprite: 'glow_moss', x: 6, y: 12, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 15, y: 11, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'gold_pouch', x: 3, y: 4, text: 'landing_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gold_pouch', x: 1, y: 4, text: 'lp_land_nook', gives: 'glow_sugar', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'landing_rock', W: 'landing_wall', V: 'landing_vein', H: 'landing_moss_wall', K: 'landing_wall',
    O: 'landing_crystal', J: 'landing_spires', '^': 'landing_spike', p: 'landing_mushrooms', Z: 'landing_thicket',
  },

  // No monsters: it's a landing.
  npcs: [],
};
