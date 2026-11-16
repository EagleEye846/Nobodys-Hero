// THE FISHERS' HOLLOW: the bottom of the cliff cave, at the level of the sea.
// The sea comes in from the west through a low mouth in the rock and lies in a
// long inlet across the cave, foaming on the sand; the fishers who cut the steps
// kept their gear down here (a net on its frame, pots, an old boat turned over
// on the sand). Two stepping stones lead out to a sand bar in the inlet with a
// purse on it. Round the head of the inlet on the east, and out at the bottom
// onto the top of the cliff steps. PUZZLE-FREE.
// Gullrest's rock with Sunnyside's name card, as in the cliff cave above.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  rock (solid)   W  rock face (solid)   :  packed sand   .  warm sand
//   ~  sea (solid; foam finds itself)   ;  shallows   j  stepping stones
//   ^  rock pillar   O  boulder

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SUNNY_CLIFF_HOLLOW = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_cliff_hollow',
  // The room's name, for the Room Editor.
  name: 'THE FISHERS\' HOLLOW',
  // The look of the rock and the battle background (Gullrest's sandstone).
  area: 'gullrest',
  // ...but the name card still counts this as Sunnyside (see overworldScene.js).
  titleArea: 'sunnyside',
  // "The Sea Downstairs", as in the cave above.
  music: 'seaDownstairs',
  ambience: 'cliff_cave',
  // Fights in here are in the dark cave (coastBackdrops.js `cliff_cave`), not on the beach.
  battleArea: 'cliff_cave',
  vesWell: true,
  indoors: true,
  // The inlet's shores drawn soft and ragged, as outside (coastTiles.js blendOn), not boxed in.
  softEdges: true,
  // Still a cave, but less dark than the one above: it opens onto the sea, so a
  // cold grey daylight comes in at the inlet's mouth and the window, and it gets
  // lighter toward the way out to Gullrest. The cave's own gloomy palette.
  tileLook: 'cliffcave',
  lamplight: { shade: 0.5, nightShade: 0.08, tint: '6, 14, 18' },
  atmosphere: { shimmer: 0.5, foam: 0.6, drips: 0.5 },
  wadeSlow: 0.75,

  tiles: [
    '####:::###############',
    '##WW:::WWWWWWWWWWWWWW#',
    '##WW:::WWWWWWWWWWWWWW#',
    '##.................O.#',
    '##.............^.....#',
    'WW........~~.........#',
    '~~~~~j~~~~~~~~;......#',
    '~~~~~j~~~~~~~~;......#',
    '~~~~~..~~~~~~~;......#',
    '~~~~~..~~~~~~~;......#',
    '~~~~~~~~~~~~~~;.....O#',
    '~~~~.....~~..........#',
    '##O...............O..#',
    '##..O................#',
    '##...................#',
    '##O..................#',
    '#########::###########',
    '#########::###########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 5, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 4, y: 0, w: 3, h: 1, to: 'sunny_cliff_cave', spawn: { x: 18, y: 17 } },
    // Out onto the top of Gullrest's cliff steps.
    { x: 9, y: 17, w: 2, h: 1, to: 'gullrest_cliff_steps', spawn: { x: 9, y: 2 } },
  ],

  cutscenes: [],

  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sy_sea_window', x: 9, y: 2, text: 'hollow_window', animation: 'sy_sea_window', speed: 0.55, glow: [{ dy: 4, pool: 60, strength: 0.66, flicker: 0, color: '156, 184, 204' }, { dy: -10, bloom: 12, strength: 0.25, flicker: 0, color: '176, 200, 216' }] },
    { sprite: 'sy_cave_drip', x: 13, y: 3, text: 'cave_drip', walkable: true, animation: 'sy_cave_drip', speed: 0.55 },
    // The fishers' things.
    { sprite: 'c5_net_frame', x: 15, y: 3, text: 'hollow_net' },
    { sprite: 'c5_lobster_pots', x: 17, y: 5, text: 'hollow_pots' },
    { sprite: 'c5_rowboat', x: 14, y: 12, text: 'hollow_boat' },
    // The fishers' kit chest beside the boat: Bramble's first armor on the coast.
    { sprite: 'chest', x: 18, y: 13, text: 'hollow_chest', gives: 'fishers_smock', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'c5_rope_coil', x: 11, y: 13, text: 'cave_coil', walkable: true, flat: true },
    // (These shells carry the grey daylight coming in off the sea at the inlet's mouth, to the west.)
    { sprite: 'sy_shells', x: 3, y: 12, text: 'cave_shells', walkable: true, flat: true, glow: [{ dx: -40, dy: -36, pool: 96, strength: 0.55, flicker: 0.1, color: '150, 180, 196' }] },
    { sprite: 'sy_shells', x: 12, y: 11, text: 'cave_shells', walkable: true, flat: true },
    // The purse out on the sand bar.
    { sprite: 'gold_pouch', x: 6, y: 8, text: 'hollow_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // A thin thread of dusty light from a crack in the roof.
    { sprite: 'sy_dim_shaft', x: 4, y: 15, text: 'cave_shaft', walkable: true, flat: true, animation: 'sy_dim_shaft', speed: 0.55, glow: [{ dx: 3, dy: -4, pool: 30, strength: 0.3, flicker: 0, color: '176, 186, 186' }] },
    // By the way out: a lantern on its post (and the grey daylight from the way out,
    // lighter here, toward Gullrest), and a board.
    { sprite: 'sy_fisher_lantern', x: 8, y: 15, text: 'cave_lantern', glow: [{ dy: -20, bloom: 9, strength: 0.55, flicker: 0.4, color: '255, 156, 68' }, { dy: -4, pool: 50, strength: 0.6, flicker: 0.3, color: '255, 156, 68' }, { dx: 24, dy: 26, pool: 96, strength: 0.55, flicker: 0, color: '196, 206, 206' }] },
    { sprite: 'sign', x: 11, y: 15, text: 'hollow_sign' },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.sunny_cliff_hollow ?? []),
  ],
  tileTexts: { '#': 'cave_rock', W: 'cave_rock', '~': 'hollow_sea', ';': 'hollow_sea', j: 'hollow_stones', '^': 'cave_pillar', O: 'cave_boulder' },

  // A whelkling in the inlet (it swims; wanders x 8 to 12 round row 8, out in
  // the water east of the stepping stones and the sand bar), and a barnacle bat
  // flying over the sand by the boat (patrols x 13 to 18, row 14), clear of the
  // way in (x 4 to 6, row 0) and the way out (x 9 and 10, row 17), and more
  // than 4 tiles apart.
  npcs: [
    { enemy: 'whelkling', x: 17, y: 8, patrol: [16, 19], behaviour: 'wander' },
    { enemy: 'barnacle_bat', x: 15, y: 14, patrol: [13, 18], behaviour: 'patrol' },
  ],
};
