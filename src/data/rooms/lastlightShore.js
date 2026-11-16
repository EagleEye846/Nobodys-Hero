// THE SHORE UNDER THE LIGHT: a strip of dark wet sand on the sea side of the Last Light's rock,
// where the wave threw Bramble up. A scene room only (the end of chapter 5, tideHeldFinale.js:
// `beach_bramble_dives`): the sea fills nearly all of the view, heaving up to the top of it, and the
// sand is a strip along the bottom. The tower's black foot stands at the right edge, going up out
// of the water. The Bother rides at her line off the rocks at the left, empty. No monsters, no
// puzzle, no save. The sand runs on round the rock (the east edge) to the forecourt.
//   - The sea x 0-19, rows 0-9 (deep at the top); the surf line row 10; the sand rows 11-14.
//   - Bramble washes up at (6,12); the hero sinks at (7,6), Ves at (12,7); he goes in at (9,10).
//   - Nothing stands on the sand between x 3 and 15 (the scene's walks and the haul).
// Tile key (see src/overworld/coastTiles.js, `lastshore`: the Reach's look with sand):
//   0  deep sea   ~  the sea   ;  the surf   .  wet sand   x  barnacle rock (solid)
// (draft).

export const LASTLIGHT_SHORE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_shore',
  // The room's name, for the Room Editor.
  name: 'THE SHORE UNDER THE LIGHT',
  // The Storm Reach, for the storm and the battle background; the card stays the Last Light's
  // (you come here out of the lamp room, and go back into the tower).
  area: 'reach',
  titleArea: 'lastlight',
  tileLook: 'lastshore',
  // The Long Climb; the scene takes it away for the worst of it.
  music: 'lastlight',
  ambience: 'open_sea',
  // The storm going over: still raining, the sea still white where it breaks.
  atmosphere: { rain: 0.9, lightning: 0.3, spray: 1.4, foam: 1.3, fog: 0.35 },
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'beach' },
  vesWell: true,
  // The tower's foot, up close, at the right edge (lastLightNear.js), standing in the sea.
  lastLightNear: { x: 22, y: 9 },
  // No far wrecks on the water: nothing out there but the two of them.
  skyline: false,

  tiles: [
    '00000000000000000000',
    '00000000000000000000',
    '00000000000000000000',
    '0000000~~~~~~0000000',
    '~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~',
    'x~~~~~~~~~~~~~~~~~~~',
    'xx~~~~~~~~~~~~~~~~~x',
    'x;;;;;;;;;;;;;;;;;xx',
    '.;;..............;;.',
    '....................',
    '....................',
    '....................',
  ],

  // Where the player starts, in tile coordinates (the scene hides you: you're out in the sea).
  playerStart: { x: 9, y: 12 },

  doors: [
    // Round the rock to the forecourt (the scene takes you; there's no walking it).
    { x: 19, y: 11, w: 1, h: 4, to: 'reach_foot', spawn: { x: 20, y: 19 } },
  ],

  // The end of the chapter: washed up here out of the lamp room.
  cutscenes: [
    { x: 9, y: 12, w: 1, h: 1, scene: 'beach_bramble_dives', after: 'corrie_falls' },
  ],

  textFile: 'interactions/reach.txt',
  props: [
    // The Bother, riding at her line off the rocks at the left: empty.
    { sprite: 'cf_bother', x: 1, y: 7, text: 'shore_bother', animation: 'cf_bother', speed: 0.6 },
    // Wrack and driftwood the storm threw up, at the ends of the sand (clear of the scene's floor).
    { sprite: 'c5_seaweed_heap', x: 1, y: 13, text: 'reach_weed' },
    { sprite: 'c5_driftwood', x: 15, y: 14, text: 'reach_driftwood' },
    { sprite: 'il_drift_timber', x: 2, y: 12, flat: true, walkable: true },
    { sprite: 'il_rocks', x: 17, y: 14, text: 'reach_rocks' },
  ],
  tileTexts: { '~': 'reach_sea', 0: 'reach_sea', x: 'reach_barnacles', ';': 'reach_sea', '.': 'shore_sand' },

  npcs: [],
};
