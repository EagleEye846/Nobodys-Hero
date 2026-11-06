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
// Tile key (see src/overworld/coastTiles.js, reach):
//   #  the tower's plinth (solid)   W  its face (solid)   .  wet rock slabs   ,  turf   o  planks
//   ~  heavy green sea (solid)   x  barnacle rock (solid)

export const REACH_FOOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_foot',
  // The room's name, for the Room Editor.
  name: 'THE FOOT OF THE LAST LIGHT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Out Past the Light" (src/data/music/reachTheme.js).
  music: 'reach',
  ambience: 'open_sea',
  vesWell: true,
  // The worst of the weather.
  atmosphere: { rain: 1.8, lightning: 1.3, spray: 1.8, foam: 1.4, fog: 0.5 },
  // The tower itself, near and huge (src/overworld/lastLightNear.js): its door centred on column 20,
  // its foot the bottom of row 17, the wet rock round it covering the plinth, its crown at the very
  // top of the room. Everything walkable (row 18 down) stands in front of it.
  lastLightNear: { x: 20, y: 17 },
  skyline: [
    { kind: 'hull', x: 6, y: 9, lean: -1 },
    { kind: 'mast', x: 29, y: 8, lean: 1, tall: 50 },
  ],

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
    '#~~~~~~~~~~~x...............x~~~~#',
    '#~~~~~~~~~~~.................~~~~#',
    '#~~~~~~~~~~..................~~~~#',
    '#~~~~~~~~~~..............,,,,~~~~#',
    '#~~~~~~~~oo..............,,,x~~~~#',
    '#~~~~~~~~oo......~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~oo......~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~o~,,,...~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~,,,..x~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
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
  ],

  cutscenes: [
    // The landing: the last crossing, and the tower, once.
    { x: 9, y: 22, w: 2, h: 3, scene: 'reach_crossing_foot' },
    // The step south of the landing: back to the eye.
    { x: 9, y: 25, w: 1, h: 1, scene: 'reach_back_to_eye' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    { sprite: 'savepoint', x: 26, y: 19, save: true },
    // Haddock in the Bother, tied up by the landing (x 5-8): the boat in reach_crossing_foot plays it.
    { sprite: 'cf_haddock_row', x: 5, y: 23, npc: 'haddock_reach_foot', animation: 'cf_haddock_row', speed: 0.6 },
    { sprite: 'c5_chain_bollard', x: 11, y: 21, text: 'reach_bollard' },
    { sprite: 'sign', x: 15, y: 19, text: 'foot_sign' },
    { sprite: 'c5_anchor', x: 24, y: 21, text: 'foot_chain' },
    { sprite: 'c5_seaweed_heap', x: 13, y: 26, text: 'reach_weed' },
    { sprite: 'c5_driftwood', x: 14, y: 22, text: 'reach_driftwood' },
    { sprite: 'gold_pouch', x: 27, y: 22, text: 'foot_pouch', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'foot_plinth', W: 'foot_wall', '~': 'reach_sea', x: 'reach_barnacles', o: 'reach_planks' },

  // None: a save room, and the last crossing's landing.
  npcs: [
  ],
};
