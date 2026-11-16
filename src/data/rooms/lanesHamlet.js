// THE DROWNED HAMLET: a handful of cottages and half a church, where the lanes met. The church's
// west half still stands, pillars and all, with its pointed windows; the east half has gone into
// the flood, and the water laps at the altar step. South of the green, the lanes run on under the
// water between hedges you can still see the tops of. A FIGHT ROOM, with no puzzle: the way on
// is up onto the old churchyard terrace in the north-east, with the Climbing Rope (a ring at the
// top of the terrace wall, 38,9; throw from 38,13). And in the north-west corner a cottage stands
// in the flood (tiles 5 6 7 D, x 3 to 7, rows 6 to 9), its front door (5,9) reached by wading the
// shallows along row 10: the way into the flooded cottage, a small secret (secret_lanes_cottage,
// then the kitchen, then the attic with the Fair Return's compass glass).
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone (solid)   ,  turf   .  drowned cobbles   :  mud lane
//   ;  shallows (walk)   ~  floodwater (solid)   Z  weed-tangled hedge (solid)   x  rubble
//   ^  a church pillar (solid)   J  a drowned gatepost   O  boulder
//   5 6 7  the cottage's wall, window and roof (solid)   D  its front door

export const LANES_HAMLET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_hamlet',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED HAMLET',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // No ships' masts on the skyline here: the water in the nave is a church's, not the sea's.
  skyline: false,

  tiles: [
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '############,,,WWWWWWWWxxxxxx~~~~~#x,,,,,,,#',
    '############,,,W........;~~~~~~~~~#,,,,,,,,#',
    '###########,,,,W........~~~~~~~~~~#:::::::::',
    '############,,,W...^....;~~~~~~~~~#:::::::::',
    '#WW77777WWW#,,,.........~;~~~~~~~~#,,,,,,,,#',
    '#~~77777~~~#,,,W.........x;~~~~~~~#,,,,,,,,#',
    '#~~56565~~~~,,,W...^......~~~;;;;;#,,,,,,,O#',
    '#~~55D55~~~,,,,...........;;;;;;;;#,,,,,,,,#',
    '.;;;;;;;;;....,,,,,,,,,,,,,,,~~~~~##########',
    '..............,,,,,,,,,,,,,,,~~~~~#WWWWWWWW#',
    '#,,,,,,,,Z,,..,,,ZZZZ,ZZZZZ,,,,,,,#WWWWWWWW#',
    '#,ZZZ,ZZZZ,,..,,,Z,,,,,,,Z,,,,,J,,,,.....,,#',
    '#,,,Z,,,,,,,..............................,#',
    '#,O,,,,,,,,,..............................,#',
    '#,,,,,,,,,,,,,;;;,,,;;;;;;;;;;;;;;;;;;;;;;,#',
    '#~~~~~;;;;;;;;~~~~~~;;;;;;;;;;;;~~~~~~~~~~~#',
    '#~~~~~~;;;;;;~~~~~~~~;;;;;;;;;;~~~~~~~~~~~~#',
    '#~~~~~~~;;;;~~~~~~~~~;;;;;;;;;~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'lanes_sluices', spawn: { x: 37, y: 8 } },
    { x: 43, y: 4, w: 1, h: 2, to: 'lanes_mill', spawn: { x: 2, y: 4 } },
    // In at the flooded cottage's front door, from the shallows in front of it.
    { x: 5, y: 9, w: 1, h: 1, to: 'secret_lanes_cottage', spawn: { x: 6, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The ring up the churchyard terrace (the way on).
    { sprite: 'grapple_ring', x: 38, y: 9, grapple: true },
    // Half a church: the two standing stretches of its north wall, with their windows.
    { sprite: 'c5_church_wall', x: 16, y: 3, text: 'hamlet_church_wall' },
    { sprite: 'c5_church_wall', x: 20, y: 3, text: 'hamlet_church_window' },
    { sprite: 'sign', x: 37, y: 14, text: 'hamlet_terrace_sign' },
    { sprite: 'sign', x: 2, y: 12, text: 'hamlet_sign' },
    { sprite: 'street_lamp', x: 14, y: 12, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 33, y: 13, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 39, y: 6, text: 'fork_lamp' },
    // The cottages in the flood, a drowned signpost, a font, and the green's odds and ends.
    { sprite: 'c5_halfsunk_cottage', x: 2, y: 19, text: 'hamlet_cottage' },
    { sprite: 'c5_halfsunk_cottage', x: 34, y: 18, text: 'hamlet_cottage' },
    { sprite: 'c5_drowned_signpost', x: 25, y: 19, text: 'hamlet_signpost' },
    { sprite: 'c5_barrel', x: 17, y: 9, text: 'hamlet_font' },
    { sprite: 'c5_lobster_pots', x: 40, y: 15, text: 'hamlet_pots' },
    { sprite: 'c5_seaweed_heap', x: 8, y: 3, text: 'fork_weed' },
    { sprite: 'gold_pouch', x: 32, y: 8, text: 'hamlet_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Second pass. The churchyard up on the terrace (clear of the rope's top at column 38),
    // the pews still in their rows in the dry half of the nave, and the lanes south of the
    // green going on under the flood: walls, a doorway, a cart, a fence, a bean bed, weed mats.
    { sprite: 'ln_headstone', x: 36, y: 2, text: 'dress_headstone' },
    { sprite: 'ln_headstone_cross', x: 40, y: 2, text: 'dress_headstone' },
    { sprite: 'ln_headstone', x: 42, y: 3, text: 'dress_headstone' },
    { sprite: 'ln_headstone_cross', x: 36, y: 7, text: 'dress_headstone' },
    { sprite: 'ln_headstone', x: 41, y: 7, text: 'dress_headstone' },
    { sprite: 'c5_chapel_pews', x: 20, y: 6, text: 'dress_pews' },
    { sprite: 'ln_moss_b', x: 16, y: 4, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 26, y: 7, flat: true, walkable: true },
    { sprite: 'ln_lily_mat_b', x: 29, y: 4, flat: true, walkable: true },
    { sprite: 'ln_sunk_wall', x: 14, y: 18, text: 'dress_sunk_wall' },
    { sprite: 'ln_sunk_door_shut', x: 9, y: 20, text: 'dress_sunk_door_shut' },
    { sprite: 'ln_sunk_cart', x: 18, y: 20, text: 'dress_sunk_cart' },
    { sprite: 'ln_sunk_fence', x: 39, y: 17, text: 'dress_sunk_fence' },
    { sprite: 'ln_sunk_bed', x: 40, y: 20, text: 'dress_sunk_bed' },
    { sprite: 'ln_under_a', x: 25, y: 20, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 2, y: 20, flat: true, walkable: true },
    { sprite: 'ln_lily_mat', x: 31, y: 19, flat: true, walkable: true },
    { sprite: 'ln_lily_small', x: 6, y: 18, flat: true, walkable: true },
    { sprite: 'ln_lily_small', x: 21, y: 19, flat: true, walkable: true },
    { sprite: 'mw_laundry_line', x: 6, y: 14, text: 'dress_washing' },
    { sprite: 'ln_moss_a', x: 15, y: 15, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 33, y: 14, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 26, y: 16, flat: true, walkable: true },
    { sprite: 'col_glass_lilac', x: 41, y: 8, walkable: true, flat: true, gives: 'glass_lilac', taken: { gone: true } },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_chimney', x: 14, y: 19, text: 'lp_chimney_h' },
    { sprite: 'lv_sundial', x: 39, y: 4, text: 'lp_sundial', walkable: true },
    { sprite: 'lv_rain_barrel', x: 3, y: 14, text: 'lp_barrel_h', walkable: true },
  ],
  tileTexts: { '5': 'hamlet_gable', '6': 'hamlet_gable_window', '7': 'hamlet_gable_roof', D: 'hamlet_gable_door', '#': 'lanes_rock', W: 'lanes_rock', '~': 'hamlet_flood', ';': 'fork_shallows', Z: 'lanes_hedge', x: 'hamlet_rubble', '^': 'hamlet_pillar', J: 'fork_gatepost', O: 'lanes_stone' },

  // A TRIO on the green (it's the fight room): a shellac (row 15, x 20 to 23), a net wraith drifting
  // about beside it (x 21 to 23, home row 15) and a bellbuoy bobbing in the drowned lane just south
  // (row 17, x 21 to 23, shallows). Touch the shellac and the other two come in with it. None comes
  // near a door, the rope's foot (38,13), the cottage door (5,9) or the purse in the church
  // shallows. No cutscenes in this room.
  npcs: [
    { enemy: 'shellac', x: 21, y: 15, patrol: [20, 23], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 22, y: 15, patrol: [21, 23], behaviour: 'wander' },
    { enemy: 'bellbuoy', x: 22, y: 17, patrol: [21, 23], behaviour: 'patrol' },
  ],
};
