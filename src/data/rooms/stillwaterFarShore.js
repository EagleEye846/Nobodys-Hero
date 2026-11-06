// THE FAR SHORE: the other side of the lake, and quiet, the way a room is
// quiet when someone has just stopped talking in it. Pale stone under an
// overhang, a handful of glowing crystals, and, tucked up against the rock,
// a very small, very old camp: a fire ring gone cold, a bedroll for someone
// the size of a child, three stones stacked into a cairn. A save crystal
// hums near the quay. In the south-east corner the cave floor tilts and runs
// down into a stair, carved steps between two rock faces (q between W), with
// the sign beside it.
// Tile key (see src/overworld/deepTiles.js for how the Stillwater draws them):
//   #  cold black rock overhead (solid)   W  pale flowstone rock face (solid)
//   .  pale wet stone   q  wet shingle   g  jetty boards over the water
//   ~  black water (solid)   ;  shallows (walkable)
//   x  glowing pale crystal (solid)   v  stalactite (walk under)
//   ^  stalagmite (solid)   O  boulder (solid)   I  pillar (solid)   J  broken pillar (solid)
//   b  rock shelf, 12 high   B  rock shelf, 24 high (jump up: the purse is on the top)
export const STILLWATER_FAR_SHORE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'stillwater_far_shore',
  // The room's name, for the Room Editor.
  name: 'THE FAR SHORE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stillwater',
  // "The Stillwater" (src/data/music/stillwaterTheme.js).
  music: 'stillwater',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'lake',
  // The faintest mist off the water.
  fog: 0.1,
  vesWell: true,

  tiles: [
    '####################################',
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#~~~~~~~~~~~.....^........xv...J.BB#',
    '#~~~~~~~~~~~...O..v.....v...^..^.BB#',
    '#~~~~~;q......OO.x..........^...bb.#',
    '#~~~~~;q....OO.....................#',
    '#~~~~~;q.....................OO...O#',
    'gggggggg...........................#',
    'gggggggg....................OO.....#',
    '#~~~~~;q..J.............I........^.#',
    '#~~~~~;q....~........OO..~~~.......#',
    '#~~~~~;q.~~~~~~^........~~~~~......#',
    '#~~~~~~~~~~~~~~~~........~~~.......#',
    '#~~~~~~~~~~~~~~~............#WqqW###',
    '####################################',
  ],

  // Where the player starts, in tile coordinates (the quay).
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'stillwater_sunken_hall', spawn: { x: 38, y: 8 } },
    { x: 30, y: 14, w: 2, h: 1, to: 'stillwater_stair_down', spawn: { x: 8, y: 5 } },
  ],

  // The old camp (the_cold_camp): a line across the whole cave west of the
  // camp, so you can't reach the stair without coming to it. The blindfish
  // stays out at x 1 to 5, well clear of the walk to the bedroll.
  cutscenes: [
    { x: 17, y: 3, w: 1, h: 11, scene: 'the_cold_camp' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The save crystal, the old camp (fire ring, bedroll, cairn), a purse up on
  // the rock shelves (b, then B: jump up), the sign at the stair, and the
  // lake's furniture.
  textFile: 'interactions/stillwater.txt',
  props: [
    { sprite: 'savepoint', x: 11, y: 7, save: true },
    { sprite: 'cold_campfire', x: 22, y: 6, text: 'far_fire' },
    { sprite: 'old_bedroll', x: 20, y: 6, text: 'far_bedroll' },
    { sprite: 'cairn_down', x: 24, y: 6, text: 'far_cairn' },
    { sprite: 'sign', x: 29, y: 13, text: 'far_stair_sign' },
    { sprite: 'gold_pouch', x: 34, y: 3, text: 'far_purse', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'jetty_post', x: 5, y: 7, text: 'jetty_post' },
    { sprite: 'jetty_post', x: 5, y: 10, text: 'jetty_post' },
    { sprite: 'glow_reeds_tall', x: 7, y: 5, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'glow_reeds', x: 8, y: 12, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds', x: 14, y: 13, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.4 },
    { sprite: 'glow_reeds_tall', x: 31, y: 5, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'fungus_pads', x: 3, y: 5, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 4, y: 12, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 11, y: 13, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'sunken_pillar_top', x: 2, y: 3, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 9, y: 4, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    // Set dressing: roots down the walls, and smooth stones and a drip or two
    // on the floor (walkable: in nobody's way).
    { sprite: 'wall_roots', x: 15, y: 2, text: 'sw_roots' },
    { sprite: 'wall_roots', x: 22, y: 2, text: 'sw_roots' },
    { sprite: 'wall_roots', x: 29, y: 2, text: 'sw_roots' },
    { sprite: 'floor_pebbles_cool', x: 23, y: 3, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 32, y: 4, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles_cool', x: 16, y: 5, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 29, y: 5, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles_cool', x: 22, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 33, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 14, y: 8, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 26, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 15, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 19, y: 13, walkable: true, flat: true },
  ],
  tileTexts: {
    '#': 'lake_rock', W: 'lake_wall', '~': 'lake_water', ';': 'lake_shallows', q: 'lake_shingle', g: 'lake_jetty',
    b: 'lake_ledge', B: 'lake_ledge', x: 'lake_crystal', v: 'lake_stalactite', '^': 'lake_stalagmite', O: 'lake_boulder', I: 'lake_pillar', J: 'lake_broken_pillar',
  },

  // One blindfish in the water west of the quay (row 12, off the jetty and
  // well away from the camp and the save crystal). Nothing near the camp:
  // it is meant to be quiet.
  npcs: [
    { enemy: 'blindfish', x: 3, y: 12, patrol: [1, 5], behaviour: 'patrol' },
  ],
};
