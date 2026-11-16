// UNDER THE POINT (secret, optional: the way to the Fair Return's fog bell). The old fog-watch's steps go down under
// the upturned boat on the slip's point (wreck_slip 27..28, row 7, once the boat has been rolled off them: scene
// point_boat, which needs the last page of the Fair Return's log) into a sea cave in the rock of the point. The
// fog-watch kept their things down here: a bench, chalk tallies of every fog they rang through, a lantern hook. The
// cave goes right through the point to the open sea on the far side, and the sea comes in and out of it.
//
// THE TIDE (shared with the Watch Rock, `group: 'watch_rock'`, on a clock): at HIGH the cave floor is black water
// between two dry ledges (the landing at the foot of the steps, north-west, and the mouth's ledge, east); at LOW it
// drains to wet sand and rock pools, and you can walk across to the mouth (and out to the Watch Rock). The page that
// sends you here says "at the bottom of the ebb". Starts HIGH, so the first time down you watch it go out.
// A dry way along the west wall goes down to a little bay (south-west) where a purse lies and a net wraith drifts.
// Nobody can be stranded: every ledge is dry at both tides and the clock always brings the low back.
// Tile key (src/overworld/coastTiles.js, wreck, painted in the `wreckrock` look; indoors):
//   #  rock (solid)   W  rock face (solid)   :  wet sand   .  shingle   o  the fog-watch's wooden steps
//   ;  rock pool, shallow (walk)   ~  sea (solid)   x  barnacled rock (solid)   N  weed (walk)

export const WRECK_UNDER_POINT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_under_point',
  // The room's name, for the Room Editor.
  name: 'UNDER THE POINT',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'wreck',
  // No song: the sea in the rock, the drips, a hum. Whatever you hear out here is the sea.
  music: null,
  ambience: 'sea_cave',
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  vesWell: true,
  indoors: true,
  // A real cave, dark between its two lights (the steps, the mouth): the Wreck Yard's palette, but the point's bare rock
  // (coastTiles.js `wreckrock`), not the yard's iron.
  tileLook: 'wreckrock',
  lamplight: { shade: 0.62, nightShade: 0.08, tint: '4, 12, 16' },
  atmosphere: { shimmer: 0.3, foam: 0.4, drips: 0.8, haze: 0.4 },
  ledges: 'rock',
  softEdges: true,

  // The HIGH-water map.
  tiles: [
    '###oo#####################', // 0
    '##Woo#WWWWWWW####WWW######', // 1
    '#WWooWWWWWWWWWWWWWWW######', // 2
    '#W:oo:WWWWWWWWWWWWWWWW####', // 3
    '#::::::~~~~WWW~~~WWWWWW###', // 4
    '#:::::~~~~~~x~~~~~~~WWWW##', // 5
    '#:::::~~~~~~~~~~~~~~~WWWW#', // 6
    '#;::::~~~~~~~~~~~x~~~~WWW#', // 7
    '#::::~~~~~~~~~~~~~~~~~::W#', // 8
    '#W::~~~~x~~~~~~~~~~~~::::#', // 9
    '#W::~~~~~~~~~~~~~~~~:::::.', // 10
    '#WW:~~~~~~~~~~~~~~~~:::::.', // 11
    '#W::~~~~~~~~~~~x~~~~~:::W#', // 12
    '#:::~~~~~~~~~~~~~~~~~~WWW#', // 13
    '#::::~~..~~~~~~~~~~~~WWWW#', // 14
    '##########################', // 15
  ],

  // The tide (tides.js): at LOW the floor is sand and pools (a few rocks stand up out of it); the
  // ledges, the steps, the west wall's way and the bay never change.
  tide: {
    start: 'high',
    group: 'watch_rock',
    clock: { high: 22, low: 30, warn: 4 },
    low: [
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '       ::::   :::         ',
      '      :::::: ;::::::      ',
      '      :N::x::::::x:::     ',
      '      :::::::;;:: :::     ',
      '     ::::::;;;;:::::::    ',
      '    :::x :::;;::::N::     ',
      '    ::::::::::::::::      ',
      '    :;;:::::x:::::::      ',
      '    ~;;:::::::: ;::::     ',
      '    ~~::::N::::;;:::~     ',
      '     ~~  :::::::~~~~      ',
      '                          ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 3, y: 3 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Up the steps to the slip's point, beside where the boat was.
    { x: 3, y: 0, w: 2, h: 1, to: 'wreck_slip', spawn: { x: 28, y: 6 } },
    // Out of the mouth onto the Watch Rock's shelf (dry at both tides).
    { x: 25, y: 10, w: 1, h: 2, to: 'wreck_watch_rock', spawn: { x: 2, y: 8 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The landing: the fog-watch's bench, their chalk on the rock, their lantern on its post (cold).
    { sprite: 'bench', x: 1, y: 5, text: 'point_bench' },
    { sprite: 'gs_fog_tally', x: 2, y: 2, text: 'point_tally', flat: true },
    { sprite: 'gs_fog_tally', x: 6, y: 3, text: 'point_tally', flat: true },
    { sprite: 'c5_lantern_post_unlit', x: 5, y: 4, text: 'point_hook' },
    { sprite: 'c5_rope_coil', x: 2, y: 7, text: 'point_rope', walkable: true },
    // The steps' light (from the slip above) and the mouth's (the open sea's grey), in the cave's gloom.
    { sprite: 'gs_fog_a', x: 3, y: 1, flat: true, walkable: true, glow: [{ dy: 0, pool: 46, strength: 0.42, flicker: 0.05, color: '170, 196, 200' }] },
    { sprite: 'gs_fog_b', x: 23, y: 10, flat: true, walkable: true, glow: [{ dy: 0, pool: 64, strength: 0.48, flicker: 0.08, color: '160, 196, 204' }] },
    // Drips from the roof, weed on the walls' feet, an old boat's ribs, the sea's leavings.
    { sprite: 'c5_stalactite_drip', x: 9, y: 2, text: 'point_rock', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 15, y: 2, text: 'point_rock', animation: 'c5_stalactite_drip', speed: 0.6 },
    { sprite: 'c5_stalactite_drip', x: 21, y: 5, text: 'point_rock', animation: 'c5_stalactite_drip', speed: 0.55 },
    { sprite: 'wy_weed_fringe', x: 6, y: 3, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 18, y: 4, flat: true, walkable: true },
    { sprite: 'wy_ribs_jag', x: 23, y: 13 },
    { sprite: 'c5_seaweed_heap', x: 22, y: 9, text: 'point_weed' },
    { sprite: 'c5_wrack_line', x: 20, y: 12, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 3, y: 9, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 2, y: 13, flat: true, walkable: true },
    // The bay at the bottom of the west wall: a purse somebody dropped carrying the bell through.
    { sprite: 'gold_pouch', x: 1, y: 14, text: 'point_pouch', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_rivets', x: 7, y: 14, text: 'sl_rivets', walkable: true },
    { sprite: 'shore_boot', x: 2, y: 10, text: 'sl_boot', walkable: true },
    { sprite: 'c5_rock_pool', x: 4, y: 8, text: 'sl_pool_a', flat: true, walkable: true },
    { sprite: 'shore_shells_b', x: 3, y: 5, text: 'sl_shells_b', flat: true, walkable: true },
    { sprite: 'wy_timber_sunk', x: 12, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 8, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 16, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 16, y: 9, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'point_rock', W: 'point_rock', '~': 'point_water', ';': 'point_pool', o: 'point_steps', x: 'point_rock', N: 'point_weed' },

  // One net wraith in the south-west bay, patrolling row 13 (x 1 to 3; it wanders no further than rows 12 to 14,
  // all dry at both tides). It keeps clear of the steps, the landing and the walk across the floor to the mouth.
  // No scenes here.
  npcs: [
    { enemy: 'net_wraith', x: 2, y: 13, patrol: [1, 3], behaviour: 'patrol' },
  ],
};
