// THE WAY DOWN: the culvert from the dry pocket comes up into a drowned crossroads, the last dry
// stone of the Lanes. A broad stair goes down from the square to the south, step by step into
// the flood, to Merrow, the town that went under (its first room is merrow_steps). A save
// crystal in the square. And a cliff lane runs off east along the water to the Soundings' mouth:
// a SHORTCUT for coming back. Its far end is a gate bolted on the Soundings' side (see
// soundings_mouth), so the first time through you go down through Merrow and come out in the
// Soundings by its sea gate, and can then draw the bolt and walk back this way.
// PUZZLE-FREE, and no monsters (a save room).
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   .  drowned cobbles   :  mud lane
//   s  the stair down   ~  floodwater (solid)   x  barnacle rock   O  boulder   J  gatepost   ^  a pillar

export const LANES_DOWN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_down',
  // The room's name, for the Room Editor.
  name: 'THE WAY DOWN',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // No wreck masts on the skyline: a snapped mast out over the flood read as a tent, and this water is the drowned Lanes, not the open sea.
  skyline: false,

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,.........^........,,,,,,#',
    '#,,,,,...,................,,x,,#',
    '#,,,,.....................,,,O,#',
    '#,,,,......................,,,,#',
    '#,,,,,........,,...........,,,,#',
    '#####..........,...........:::::',
    '...........................:::::',
    '.....................,.....;~~~#',
    '#####......................~~~~#',
    '#~~~;;J..................J.;~~~#',
    '#~~~~;......#......#......;~~~~#',
    '#~~~~~~~;;;~#ssssss#~;;;~~~~~~~#',
    '#~~~~~~~~~~~#ssssss#~~~~~~~~~~~#',
    '#~~~~~~~~~~~#ssssss#~~~~~~~~~~~#',
    '#~~~~~~~~~~~#~~~~~~#~~~~~~~~~~~#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'lanes_bubble', spawn: { x: 27, y: 9 } },
    // The stair's foot, down into Merrow.
    { x: 13, y: 16, w: 6, h: 1, to: 'merrow_steps', spawn: { x: 16, y: 3 } },
    // The cliff lane on to the Soundings (the shortcut: it ends at a gate bolted on the far side
    // until you've come through Merrow and drawn the bolt, in soundings_mouth).
    { x: 31, y: 8, w: 1, h: 2, to: 'soundings_mouth', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    { sprite: 'savepoint', x: 8, y: 5, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 9, y: 5, travel: 'way_down', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    // The stair down, drawn over its 's' tiles and the '#' parapets either side (flat, walkable).
    { sprite: 'ln_stair', x: 12, y: 17, text: 'down_stair', flat: true, walkable: true },
    { sprite: 'street_lamp', x: 11, y: 12, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 20, y: 12, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 26, y: 7, text: 'fork_lamp' },
    { sprite: 'ln_signpost', x: 22, y: 5, text: 'down_signpost' },
    // The board at the stair's head: MERROW, an arrow down.
    { sprite: 'sign', x: 12, y: 12, text: 'down_head_sign' },
    { sprite: 'c5_buoy_yellow', x: 3, y: 6, text: 'fork_buoy' },
    { sprite: 'gold_pouch', x: 29, y: 3, text: 'down_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The sign for the cliff lane on to the Soundings.
    { sprite: 'sign', x: 28, y: 7, text: 'down_east_sign' },
    // Second pass. The crossroads' well in the square (north of the way through), moss and lost
    // cobbles, puddles; a washing line on the turf; and either side of the stair, the lanes that
    // go on down under the flood with it: a doorway, a wall, a cart, a fence, weed mats.
    { sprite: 'mw_well', x: 17, y: 6, text: 'dress_well' },
    { sprite: 'ln_moss_a', x: 6, y: 8, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 13, y: 4, flat: true, walkable: true },
    { sprite: 'ln_moss_a', x: 23, y: 10, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 9, y: 12, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 20, y: 8, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 6, y: 4, flat: true, walkable: true },
    { sprite: 'mw_laundry_line', x: 24, y: 2, text: 'dress_washing' },
    { sprite: 'ln_sunk_door_shut', x: 3, y: 15, text: 'dress_sunk_door_shut' },
    { sprite: 'ln_sunk_wall', x: 22, y: 16, text: 'dress_sunk_wall' },
    { sprite: 'ln_sunk_cart', x: 8, y: 17, text: 'dress_sunk_cart' },
    { sprite: 'ln_sunk_fence', x: 27, y: 14, text: 'dress_sunk_fence' },
    { sprite: 'ln_under_b', x: 6, y: 16, flat: true, walkable: true },
    { sprite: 'ln_under_a', x: 25, y: 17, flat: true, walkable: true },
    { sprite: 'ln_lily_mat_b', x: 1, y: 13, flat: true, walkable: true },
    { sprite: 'lv_sign_lane', x: 14, y: 3, text: 'lp_lanesign_down' },
    { sprite: 'lv_bench', x: 2, y: 3, text: 'lp_bench_down' },
    { sprite: 'lv_kettle', x: 4, y: 2, text: 'lp_kettle_down' },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'down_flood', s: 'down_stair', x: 'lanes_stone', O: 'lanes_stone', J: 'fork_gatepost', '^': 'hamlet_pillar' },

  // None: a save room.
  npcs: [],
};
