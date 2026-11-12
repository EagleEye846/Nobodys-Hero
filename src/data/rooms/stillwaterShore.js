// THE SHORE: where the lift lets you out and the Stillwater begins: a pale
// stone beach, a jetty, and a lake so wide and so still that the far side is
// only a guess. Gubb the ferryman keeps his punt at the end of the jetty,
// humming. Walk out onto the last board and he takes you across (the scene
// gubb_crossing the first time, a short ride after that); on the east shore
// his punt is waiting for the way back. The punt is moored at each end: you
// only ever see the one on your side, because the lake between is wider than
// the screen.
// Tile key (see src/overworld/deepTiles.js for how the Stillwater draws them):
//   #  cold black rock overhead (solid)   W  pale flowstone rock face (solid)
//   .  pale wet stone   q  wet shingle   g  jetty boards over the water
//   ~  black water (solid)   ;  shallows (walkable)
//   I  fluted pillar standing in the lake (solid)   J  broken pillar (solid)
//   O  water-worn boulder (solid)   ^  stalagmite (solid)
export const STILLWATER_SHORE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'stillwater_shore',
  // The room's name, for the Room Editor.
  name: 'THE SHORE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stillwater',
  // "The Stillwater" (src/data/music/stillwaterTheme.js).
  music: 'stillwater',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'lake_jetty',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // A little mist on the water.
  fog: 0.18,
  vesWell: true,

  tiles: [
    '############################################',
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#..^......~~~~~~~~J~~~~~~~~~~~~~~~~~~~~~qq.#',
    '#.^......OO.q~~~~~~~~~~~I~~~~~~~~~~~~~~qq^^#',
    '#..........qq~~~~~~~~J~~~~~~~~~~~~~~~~~q.q.#',
    '#..........qq~~~~~~~~~~~~~~~~~~~~~~~~~~q...#',
    '#...........q~~~~~~~~~~~~~~~~~~~~~~~~~~q....',
    '...........qggg~~~~~~~~~~~~~~~~~~~~~~ggg....',
    '...........qq~~~~~~~~~~~~~~~~~~~~~~~~~~q...#',
    '#..........qq~~~~~~~~~~~~~~~~~~~~~~~~~~q...#',
    '#..........qq~~~~~~~~~~~~~~~~~J~~~~~~~~q...#',
    '#.OO..qq...qq~~~~~~~~~~~~J~~~~~~~~~~~~~q.O.#',
    '#.....^q..~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#',
    '####...q~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates (just in from the lift).
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_lift', spawn: { x: 34, y: 8 } },
    { x: 43, y: 7, w: 1, h: 2, to: 'stillwater_isles', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto the last board of a jetty plays Gubb's crossing: the whole
  // story the first time (gubb_crossing), then the short rides each way.
  cutscenes: [
    { x: 14, y: 8, w: 1, h: 1, scene: 'gubb_crossing', until: 'gubb_crossing' },
    { x: 14, y: 8, w: 1, h: 1, scene: 'gubb_ferry_over', after: 'gubb_crossing' },
    { x: 37, y: 8, w: 1, h: 1, scene: 'gubb_ferry_back' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Gubb's punt at each end of the crossing (`cast` is how the scenes find
  // them; the rides mark `punt_east` seen or not seen, so only the punt on
  // the side he is on shows), the ferry sign, a chest behind the boulders, a purse on the east
  // shore, reeds, pads, and pillar tops standing in the black water.
  textFile: 'interactions/stillwater.txt',
  props: [
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 3, y: 6, save: true },
    { sprite: 'bf_punt', x: 15, y: 8, cast: 'gubb', until: 'punt_east', text: 'shore_punt_west', animation: 'bf_punt', speed: 0.5 },
    { sprite: 'bf_punt', x: 34, y: 8, cast: 'gubb_far', after: 'punt_east', text: 'shore_punt_east', animation: 'lake_punt_east', speed: 0.5 },
    { sprite: 'sign', x: 10, y: 7, text: 'shore_sign' },
    { sprite: 'jetty_post', x: 12, y: 7, text: 'jetty_post' },
    // Knocking after the first crossing also offers Gubb's rod (src/ui/fishingScene.js).
    { sprite: 'jetty_post', x: 12, y: 9, npc: 'gubb', text: 'jetty_post', fishing: 'gubb_crossing' },
    { sprite: 'jetty_post', x: 39, y: 7, text: 'jetty_post' },
    { sprite: 'jetty_post', x: 39, y: 9, text: 'jetty_post' },
    { sprite: 'mooring_ring', x: 11, y: 8, text: 'mooring_ring', walkable: true },
    { sprite: 'chest', x: 1, y: 13, text: 'shore_chest', gives: 'ferry_pole', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 41, y: 10, text: 'shore_purse', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'glow_reeds', x: 12, y: 5, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds_tall', x: 12, y: 11, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'glow_reeds', x: 11, y: 13, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.4 },
    { sprite: 'glow_reeds_tall', x: 39, y: 5, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'glow_reeds', x: 39, y: 11, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds_tall', x: 5, y: 5, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'fungus_pads', x: 17, y: 5, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 19, y: 6, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 27, y: 10, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 28, y: 4, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 21, y: 12, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 33, y: 5, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'sunken_pillar_top', x: 24, y: 6, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 28, y: 10, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 20, y: 10, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 32, y: 12, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    // Set dressing: roots down the walls, and smooth stones and a drip or two
    // on the floor (walkable: in nobody's way).
    { sprite: 'wall_roots', x: 4, y: 2, text: 'sw_roots' },
    { sprite: 'wall_roots', x: 41, y: 2, text: 'sw_roots' },
    { sprite: 'drip_puddle', x: 5, y: 4, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles_cool', x: 3, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 8, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 39, y: 12, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 7, y: 14, walkable: true, flat: true },
  ],
  tileTexts: {
    '#': 'lake_rock', W: 'lake_wall', '~': 'lake_water', ';': 'lake_shallows', q: 'lake_shingle', g: 'lake_jetty',
    I: 'lake_pillar', J: 'lake_broken_pillar', O: 'lake_boulder', '^': 'lake_stalagmite',
  },

  // No monsters on the shore: the fish keep their distance from the jetty,
  // and Gubb's crossing walks over the whole length of the water.
  npcs: [],
};
