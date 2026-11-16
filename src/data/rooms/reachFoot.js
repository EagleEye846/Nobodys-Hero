// THE FOOT OF THE LAST LIGHT: the end of the Storm Reach. The tower is not on the skyline any
// more: it goes up out of the sea right in front of you, black brick ribbed with iron, up past
// the top of the view (`lastLightNear`, its door at 19-21, row 18). A stone
// forecourt runs up to its door, a save crystal, and the landing
// on the west where Haddock ties up the Bother and stays with her. No monsters (a save room),
// no puzzle: the last breath before the climb.
//
// The door into the tower is the arch of the near tower at 19-21, row 18: it goes in to `lastlight_foot`.
//
// Arriving: reach_crossing_foot (once) plays on the landing (9,23): the worst crossing, and the
// tower looming. Haddock's boat is a prop (`haddock_reach_foot`, at 5,23) that the scene's boat plays,
// so it ends tied up where the scene leaves it. The step south of the landing (9,25) goes back to the eye.
// OPTIONAL (2026-11-14): a spit of wet rock runs off the forecourt's east end (x 30-33, rows 21-22) to the
// Needle (reach_needle), the hardest of the coast's ring climbs.
// Tile key (see src/overworld/coastTiles.js, reach):
//   #  the tower's plinth (solid)   W  its face (solid)   .  wet rock slabs   ,  turf   o  planks
//   ~  heavy green sea (solid)   x  barnacle rock (solid)

import { LIFE5_PROPS } from '../lifePass5.js';

export const REACH_FOOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_foot',
  // The room's name, for the Room Editor.
  name: 'THE FOOT OF THE LAST LIGHT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Hopes Above Water" (src/data/music/reachRainTheme.js).
  music: 'reachRain',
  // Once the tide has held, the storm's over: What the Tide Left.
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfter' },
  ambience: 'open_sea',
  vesWell: true,
  // The worst of the weather.
  atmosphere: { rain: 1.8, lightning: 1.3, spray: 1.8, foam: 1.4, fog: 0.5 },
  // Until the end of the chapter: once the hero's light has held the sea back (the_light_answers),
  // the storm is gone for good, and the sea lies down.
  // Its light then is the cool grey before dawn, not the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'beach', lamplight: { shade: 0.42, tint: '30, 38, 66' } },
  // The tower itself, near and huge (src/overworld/lastLightNear.js): its door centred on column 20,
  // its foot the bottom of row 17, the wet rock round it covering the plinth, its crown at the very
  // top of the room. Everything walkable (row 18 down) stands in front of it.
  lastLightNear: { x: 20, y: 17 },
  skyline: [
    { kind: 'hull', x: 6, y: 9, lean: -1 },
    { kind: 'mast', x: 29, y: 8, lean: 1, tall: 50 },
  ],

  // The storm's far wrecks stay well out to sea: never in the boat's lane (west of the landing, row 23) or by
  // the jetty, where they used to stand over the Bother and the party. (15 Nov 2026)
  skylineClear: 5,
  skylineKeepOut: [{ x: 0, y: 18, w: 13, h: 9 }],
  tiles: [
    '##################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~#########~~~~~~~~#',
    '#~~~~~~~~~~~~~~~#########~~~~~~~~#',
    '#~~~~~~~~~~~~~~~#########~~~~~~~~#',
    '#~~~~~~~~~~~~~~~WWWWWWWWW~~~~~~~~#',
    '#~~~~~~~~~~~x.............x~~~~~~#',
    '#~~~~~~~~~~~x...............~~~~~#',
    '#~~~~~~~~~~~...............,,x~~~#',
    '#~~~~~~~~~~..............,,,,,....',
    '#~~~~~~~~oo.........~~..,,,,x.....',
    '#~~~~~~~~oo.......x~~~~x~~~~~~~~~#',
    '#~~~~~~~~oo.,...x~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~o~,,,..~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~,,,,.x~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~,x~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '##################################',
  ],

  // Where the player starts, in tile coordinates: the landing.
  playerStart: { x: 9, y: 23 },

  doors: [
    // The tower's door: in to the foot of the Last Light.
    { x: 19, y: 18, w: 3, h: 1, to: 'lastlight_foot', spawn: { x: 11, y: 11 } },
    // (Optional) east along the spit of wet rock (x 30-33, rows 21-22) to the Needle.
    { x: 33, y: 21, w: 1, h: 2, to: 'reach_needle', spawn: { x: 2, y: 35 } },
  ],

  cutscenes: [
    // The landing: the last crossing, and the tower, once.
    { x: 9, y: 22, w: 2, h: 3, scene: 'reach_crossing_foot' },
    // The end of the chapter (tideHeldFinale.js): out of the tower's door, the storm gone.
    { x: 20, y: 19, w: 1, h: 1, scene: 'the_bell', after: 'the_light_answers' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    { sprite: 'savepoint', x: 26, y: 19, save: true },
    // Haddock in the Bother, tied up by the landing (x 5-8): the boat in reach_crossing_foot plays it.
    { sprite: 'cf_haddock_row', x: 5, y: 23, playScene: 'reach_boat_foot', notice: 'stays', animation: 'cf_haddock_row', speed: 0.6, until: 'haddock_gone' },
    // After him: the Bother, empty, tied up where he left her (Ves rows her now).
    { sprite: 'cf_bother', x: 5, y: 23, text: 'bother_after', playScene: 'reach_boat_foot', notice: 'stays', animation: 'cf_bother', speed: 0.6, after: 'haddock_gone' },
    { sprite: 'c5_chain_bollard', x: 11, y: 21, text: 'reach_bollard' },
    { sprite: 'sign', x: 15, y: 19, text: 'foot_sign' },
    { sprite: 'c5_anchor', x: 24, y: 21, text: 'foot_chain' },
    { sprite: 'c5_seaweed_heap', x: 13, y: 26, text: 'reach_weed' },
    { sprite: 'c5_driftwood', x: 14, y: 22, text: 'reach_driftwood' },
    { sprite: 'gold_pouch', x: 27, y: 22, text: 'foot_pouch', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Second pass: the forecourt's rock: a pool, lichen, weed-foot rocks in the sea, a cairn and a
    // tuft or two on the turf, stakes at the tower's foot, a lamp by the landing. Nothing solid on
    // the landing (x 9-10, rows 22-25), the door, or the finale's walks (x 11-22, rows 19-22).
    { sprite: 'il_tidepool', x: 24, y: 19, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 13, y: 19, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 17, y: 19, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 22, y: 21, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 26, y: 20, flat: true, walkable: true },
    { sprite: 'il_grass_tuft', x: 26, y: 21, walkable: true, decor: true },
    { sprite: 'il_grass_tuft_b', x: 25, y: 22, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 27, y: 21, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 12, y: 25, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 11, y: 26, walkable: true, decor: true },
    { sprite: 'il_cairn', x: 14, y: 25, text: 'reach_cairn' },
    { sprite: 'il_drift_timber', x: 15, y: 24, flat: true, walkable: true },
    { sprite: 'il_stakes_rope', x: 13, y: 18, text: 'reach_stakes' },
    { sprite: 'c5_lantern_hook', x: 16, y: 23 },
    { sprite: 'il_rocks', x: 30, y: 20, text: 'reach_rocks' },
    { sprite: 'il_rocks_big', x: 28, y: 24, text: 'reach_rocks' },
    { sprite: 'il_gull_rock', x: 5, y: 19, text: 'reach_gull_rock' },
    { sprite: 'il_rocks', x: 18, y: 26, text: 'reach_rocks' },
    ...(LIFE5_PROPS['reach_foot'] ?? []),
  ],
  tileTexts: { '#': 'foot_plinth', W: 'foot_wall', '~': 'reach_sea', x: 'reach_barnacles', o: 'reach_planks' },

  // None: a save room, and the last crossing's landing.
  npcs: [
  ],
};
