// THE CLIFF CAVE: the way down from the Sea View goes in under the arch at the
// foot of the cliff steps (sy_cliff_path) and on down inside the spur. A tall,
// dim cave of damp grey-brown rock, cold after the sun: the only light is the
// cold grey daylight from a hole in the rock over the pool, the fishers' tin
// lantern on the last post, and one thin thread of dusty light from a crack.
// The old fishers' steps (planks) run down the middle with a rope on posts on
// the left, between you and a sea pool the sea fills through that hole (you can
// see out of it: blue water, a gull). The pool's edge is shallow, and you can
// wade it (`;`, slower, shin-deep); its dark middle (`~`, `0`) is deep, and a
// whelkling lives in it. At the foot a lantern hangs on the last post. A high shelf of rock on the right, jumped up
// to by its step (b, then B), has a chest on it. Then a sand floor, and the way
// on down at the bottom right. PUZZLE-FREE (the jumps are for the chest only).
// Scene `into_the_cliff` (trigger: row 4, the second step down; nobody walks).
// The rock is Gullrest's (`area: 'gullrest'`), but the name card still counts it
// as Sunnyside (`titleArea`), so GULLREST comes up on the cliff steps below.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  rock (solid)   W  rock face (solid)   :  packed sand   .  warm sand
//   o  the fishers' plank steps   ~  the pool's deep water (solid; swimmers cross it)
//   0  its deepest middle (solid)   ;  the pool's shallow edge (wade it)   b B  the shelf's step and the shelf (jump up)   ^  rock pillar
//   O  boulder

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SUNNY_CLIFF_CAVE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_cliff_cave',
  // The room's name, for the Room Editor.
  name: 'THE CLIFF CAVE',
  // The look of the rock and the battle background (Gullrest's sandstone).
  area: 'gullrest',
  // ...but the name card still counts this as Sunnyside (see overworldScene.js).
  titleArea: 'sunnyside',
  // "The Sea Downstairs" (src/data/music/seaDownstairsTheme.js), with drips and surf under it.
  music: 'seaDownstairs',
  ambience: 'cliff_cave',
  // Fights in here are in the dark cave (coastBackdrops.js `cliff_cave`), not on the beach.
  battleArea: 'cliff_cave',
  vesWell: true,
  indoors: true,
  // A real cave: dark, cold and damp between its few lights (the hole onto the
  // sea, the lantern, a thread of light from a crack). The tiles are painted in
  // the cave's own gloomy palette (coastTiles.js `cliffcave`), not the beach's.
  tileLook: 'cliffcave',
  lamplight: { shade: 0.64, nightShade: 0.08, tint: '4, 12, 16' },
  // Little glints on the pool, slow drips, the odd bit of foam where the shallows lap.
  atmosphere: { shimmer: 0.3, foam: 0.35, drips: 0.7 },
  // The pool's shallow edge drags at your boots.
  wadeSlow: 0.75,
  // The shelf (b, B) is the cave's own rough rock, not Gullrest's cut blocks.
  ledges: 'rock',
  // Rough natural rock round the walls (ragged overhangs, fallen stones, shadow at the foot),
  // like the hollow below: the floor's edges bay in and out instead of running ruler-straight.
  softEdges: true,

  tiles: [
    '##########::::##########', // 0
    '##########::::##########', // 1
    '##WWWWWWWW::::###WWWWW##', // 2
    '##WWWWWWW:oooo###WWWWW##', // 3
    '##;;;;;;;:oooo###BBBBB##', // 4
    '##;;~~~;;:oooo###BBBBB##', // 5
    '##;~~~~~;:oooo###BBBBB##', // 6
    '##;~~00~;:oooo###BBBBB##', // 7
    '##;~~00~;:ooooWWWBBBBB##', // 8
    '##;~~~~~;:ooooWWWbbbbb##', // 9
    '##;;~~~;;.............##', // 10
    '##;;;;;;;......^.......#', // 11
    '##;;;;;;;..............#', // 12
    '###.................O..#', // 13
    '###..................O##', // 14
    '##....^..............###', // 15
    '##.O................####', // 16
    '###..........O......####', // 17
    '#####....########...####', // 18
    '#################...####', // 19
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 1 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back up the steps and out under the arch, onto the cliff path.
    { x: 10, y: 0, w: 4, h: 1, to: 'sunny_sea_view', spawn: { x: 24, y: 21 } },
    // On down, into the hollow at the sea.
    { x: 17, y: 19, w: 3, h: 1, to: 'sunny_cliff_hollow', spawn: { x: 5, y: 2 } },
  ],

  // A strip across the second step down: a few words, nobody walks.
  cutscenes: [{ x: 10, y: 4, w: 4, h: 1, scene: 'into_the_cliff' }],

  textFile: 'interactions/sunnyside.txt',
  props: [
    // The hole through the rock over the pool, with the sea in it: cold grey-blue daylight,
    // a soft pool under it and a few glints out on the water.
    { sprite: 'sy_sea_window', x: 4, y: 3, text: 'cave_window', animation: 'sy_sea_window', speed: 0.6, glow: [{ dy: 4, pool: 54, strength: 0.62, flicker: 0, color: '150, 178, 200' }, { dy: -10, bloom: 11, strength: 0.22, flicker: 0, color: '170, 196, 214' }, { dx: 4, dy: 40, pool: 34, strength: 0.26, flicker: 0.15, color: '120, 170, 176' }] },
    // The rope down the left of the steps, on posts; the lantern hangs on the last one.
    { sprite: 'sy_rope_post', x: 9, y: 3, text: 'cave_rope' },
    { sprite: 'sy_rope_v', x: 9, y: 4, text: 'cave_rope' },
    { sprite: 'sy_rope_v', x: 9, y: 5, text: 'cave_rope' },
    { sprite: 'sy_rope_v', x: 9, y: 6, text: 'cave_rope' },
    { sprite: 'sy_rope_v', x: 9, y: 7, text: 'cave_rope' },
    { sprite: 'sy_rope_v', x: 9, y: 8, text: 'cave_rope' },
    // A small warm pool of lantern light at the foot of the steps.
    { sprite: 'sy_fisher_lantern', x: 9, y: 9, text: 'cave_lantern', glow: [{ dy: -20, bloom: 9, strength: 0.55, flicker: 0.4, color: '255, 156, 68' }, { dy: -4, pool: 50, strength: 0.6, flicker: 0.3, color: '255, 156, 68' }] },
    // One thin thread of dusty light from a crack in the roof (no glare).
    { sprite: 'sy_dim_shaft', x: 16, y: 14, text: 'cave_shaft', walkable: true, flat: true, animation: 'sy_dim_shaft', speed: 0.5, glow: [{ dx: 3, dy: -4, pool: 30, strength: 0.32, flicker: 0, color: '176, 186, 186' }] },
    // Drips off the roof.
    { sprite: 'sy_cave_drip', x: 14, y: 10, text: 'cave_drip', walkable: true, animation: 'sy_cave_drip', speed: 0.5 },
    { sprite: 'sy_cave_drip', x: 18, y: 4, text: 'cave_drip', walkable: true, animation: 'sy_cave_drip', speed: 0.62 },
    // The chest up on the shelf.
    { sprite: 'chest', x: 20, y: 5, text: 'cave_chest', gives: 'gaff_hook', taken: { sprite: 'chest_open', text: 'cave_chest_empty' } },
    // Shells washed up by the pool, and an old coil of rope.
    { sprite: 'sy_shells', x: 3, y: 13, text: 'cave_shells', walkable: true, flat: true },
    { sprite: 'sy_shells', x: 8, y: 14, text: 'cave_shells', walkable: true, flat: true },
    { sprite: 'c5_rope_coil', x: 12, y: 16, text: 'cave_coil', walkable: true, flat: true },
    // A crack in the floor, and the roof dripping into a puddle in the bay in the south wall.
    { sprite: 'c5_puddle', x: 6, y: 17, walkable: true, flat: true },
    { sprite: 'c5_floor_crack', x: 10, y: 15, walkable: true, flat: true },
    { sprite: 'c5_stalactite_drip', x: 6, y: 18, text: 'cave_drip', walkable: true, animation: 'c5_stalactite_drip', speed: 0.55 },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.sunny_cliff_cave ?? []),
  ],
  tileTexts: { '#': 'cave_rock', W: 'cave_rock', '~': 'cave_pool', 0: 'cave_pool', ';': 'cave_shallows', o: 'cave_steps', '^': 'cave_pillar', O: 'cave_boulder', b: 'cave_shelf', B: 'cave_shelf' },

  // The cave's own monsters: a whelkling in the pool's deep water (it swims;
  // wanders x 3 to 6 round row 9, so it keeps to the deep middle and the
  // shallows right round it), and a barnacle bat flying up and down the sand
  // floor (patrols x 12 to 17, row 14). Both clear of the scene's trigger (row
  // 4, on the steps; nobody walks) and of both doors (top x 10 to 13, bottom x
  // 17 to 19, row 19), and more than 4 tiles apart, so they're met one at a time.
  // AMBUSH: the bat hangs in the roof over the west end of the sand floor (12,15) and drops on you
  // when you come within two and a half tiles (dust sifts down onto a faint shadow there: `look:
  // 'cave_roof'`, src/overworld/hideouts.js). It comes down where you stood, so keep walking and it
  // misses and gives chase. The way from the steps to the bottom door, and down from the shelf,
  // stays nearer the east side (three and a half tiles or more from it).
  npcs: [
    { enemy: 'whelkling', x: 4, y: 9, patrol: [3, 6], behaviour: 'wander' },
    { enemy: 'barnacle_bat', x: 12, y: 15, patrol: [12, 12], behaviour: 'drop', look: 'cave_roof', reach: 2.5 },
  ],
};
