// THE FOOT OF THE LIGHT: the end of the causeway. Haddock's lighthouse stands on a flat rock of
// its own, white brick with a warm window, and round the foot of it is his garden: turf and
// flowers, and rows of bottles on posts and buoys on poles that chink in the wind. A path runs
// from the causeway to the tower's door. His boat the Bother is moored at a little jetty on the
// east side. A SAVE point. PUZZLE-FREE, no monsters (a home).
//
// The Bother's jetty (planks, x 23-26, rows 9-10): its tip (25-26, rows 9-10) is the boarding
// trigger for `to_the_reach`, once Haddock has told it and given the bell (`haddock_tells_it`);
// before that it does nothing. The boat floats in the water just south of the jetty (23-25, 11).
// The Reach's back step (reach_back_to_haddock) brings you home to the jetty's tip.
// Tile key (see src/overworld/coastTiles.js, haddock_light):
//   #  rock top (solid)   h  white brick of the tower (solid)   6  lit window   H  lamp niche
//   D  the open door   ,  garden turf   :  gravel path   o  jetty planks   ~  the sea (solid)

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const HADDOCK_LIGHT_DOOR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'haddock_light_door',
  // The room's name, for the Room Editor.
  name: "HADDOCK'S LIGHT",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'haddock_light',
  // "Minding the Light", and the open sea under it.
  music: 'haddock',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over here too, as on the causeway next door.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,

  // The wrecks' silhouettes on the sea keep this many tiles clear of any shore
  // (src/overworld/atmosphere.js, buildSkyline).
  skylineClear: 2,

  tiles: [
    '##############################',
    '#~~~~~~~~~~hhhhhhhh~~~~~~~~~~#',
    '#~~~~~x~~~~h66hh66h~~~~~^~~~~#',
    '#~~~~~~~~~~hhhHHhhh~~~~~~~~~~#',
    '#~~~~~~~,,~h6hhhh6h~,~~~~~~~~#',
    '#~~~~~,,,,,hhhDDhhh,,,,~~~~~~#',
    '#~~x,,,,,,,,,,::,,,,,,,,,~~~~#',
    '#~,,,,,,,,,,,,::,,,,,,,,,,~~~#',
    ':,,,,,,,::,,,,::,,,,,,,,,,~~~#',
    '::::::::::::::::,,,,,,,oooo~~#',
    ':::::::::::::::,,,,,,,,oooo~~#',
    '#,,,::,,,,:,,,,,,,,,,,~~~~~~~#',
    '#~,,,,,,,,,,,,,,,,,,,,,~~~~~~#',
    '#~~,,,,,,,,,,,,,,,,,,,,,~~~x~#',
    '#~~~~,,,x,,,,,,,,,,,x~~~~~~~~#',
    '#~~~~~~~~~,,~~~~x~~~~~~~~~~~~#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates: just off the causeway.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back along the causeway.
    { x: 0, y: 8, w: 1, h: 3, to: 'isles_causeway', spawn: { x: 45, y: 8 } },
    // The tower's door, into the parlour.
    { x: 14, y: 5, w: 2, h: 1, to: 'haddock_light_parlour', spawn: { x: 8, y: 11 } },
  ],

  cutscenes: [
    // The Bother's jetty: once he has told it and given you the bell, step onto the tip to go.
    { x: 25, y: 9, w: 2, h: 2, scene: 'to_the_reach', after: 'haddock_tells_it' },
  ],

  // The sign, the lamps by the door, the bottle gardens, the SAVE crystal, the Bother, ropes
  // and pots, and a purse.
  textFile: 'interactions/haddock_light.txt',
  props: [
    { sprite: 'sign', x: 3, y: 8, text: 'door_sign' },
    // A lantern on a post either side of the door.
    { sprite: 'c5_lantern_post_lit', x: 12, y: 7, text: 'door_lantern', animation: 'c5_lantern_post_lit', speed: 0.25, until: 'haddock_gone' },
    { sprite: 'c5_lantern_post_lit', x: 17, y: 7, text: 'door_lantern', animation: 'c5_lantern_post_lit', speed: 0.25, until: 'haddock_gone' },
    // After the chapter: the town keeps them lit.
    { sprite: 'c5_lantern_post_lit', x: 12, y: 7, text: 'door_lantern_after', animation: 'c5_lantern_post_lit', speed: 0.25, after: 'haddock_gone' },
    { sprite: 'c5_lantern_post_lit', x: 17, y: 7, text: 'door_lantern_after', animation: 'c5_lantern_post_lit', speed: 0.25, after: 'haddock_gone' },
    // His garden: bottles on posts, buoys on poles.
    { sprite: 'c5_bottle_garden', x: 5, y: 6, text: 'door_bottles' },
    { sprite: 'c5_bottle_garden', x: 19, y: 7, text: 'door_bottles' },
    { sprite: 'c5_bottle_garden', x: 6, y: 12, text: 'door_bottles' },
    { sprite: 'savepoint', x: 9, y: 7, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 10, y: 7, travel: 'haddocks_light', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    { sprite: 'c5_buoys_pile', x: 18, y: 12, text: 'door_buoys' },
    { sprite: 'c5_lobster_pots', x: 11, y: 13, text: 'door_pots' },
    { sprite: 'c5_barrel', x: 20, y: 6, text: 'door_barrel' },
    { sprite: 'c5_rope_coil', x: 21, y: 10, text: 'door_rope', walkable: true, flat: true },
    { sprite: 'c5_lifebuoy_post', x: 22, y: 9, text: 'door_lifebuoy' },
    // The Bother, tied up alongside the jetty.
    { sprite: 'c5_the_bother', x: 23, y: 11, text: 'door_bother' },
    { sprite: 'gold_pouch', x: 4, y: 13, text: 'door_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // (2026-11-08b) A garden somebody works in: a bench against the tower, a washing line on its two
    // posts, the barrow he brings the pots up in, and tufts of sea grass. Off the path and the jetty.
    { sprite: 'il_workbench', x: 7, y: 5, text: 'door_bench' },
    { sprite: 'washing_line', x: 15, y: 12, text: 'door_washing' },
    { sprite: 'sy_wheelbarrow', x: 9, y: 13, text: 'door_barrow' },
    { sprite: 'il_grass_tuft', x: 3, y: 12, flat: true, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 13, y: 8, flat: true, walkable: true },
    { sprite: 'il_grass_tuft', x: 21, y: 7, flat: true, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 20, y: 13, flat: true, walkable: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.haddock_light_door ?? []),
  ],
  tileTexts: { '#': 'door_rock', '~': 'door_sea', h: 'door_wall', 6: 'door_window', H: 'door_niche', ',': 'door_turf', ':': 'door_path', o: 'door_planks' },

  // None: it's a home, not a haunt.
  npcs: [],
};
