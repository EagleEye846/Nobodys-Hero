// THE EAST LIGHT: the first of the little lights, and the one that still turns. It stands on its
// own rock in a pool in the middle of an old lamp-yard, and its beam goes round and round over
// the isle and the sea. The yard's low stone wall is broken in places, and wherever there's a
// gap the beam comes through it in a spoke. ONE LAMP, TIMING: walk round outside the wall from
// the west door to the far side, keeping in the wall's shadow, and cross each spoke when the
// beam has just gone by. Caught, it's a white wash and back to the last safe stop; nothing hurts.
// Inside the yard there's a purse at the light's foot, out in the open: in and out between turns.
// On the far side a cliff with a ring at the top (the Climbing Rope) goes up to a shelf where the
// old light stands, dark; its door is the way on (isles_old_lightroom).
//   - The lamp (21,5) is the East Light's lantern; its rock and tower stand in the pool (21,8).
//   - Gaps in the yard wall: west (15, 7-8), south (18-19 and 23-24, row 14), east (27, 9-10).
//   - Safe stops (`lampSafe`): the west path, the south-east corner, the east flat, the shelf.
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  rock face (solid)   ,  wind turf   .  the lamp-yard's slabs
//   ~  the sea and the light's pool (solid; the beam goes over it)   h  the yard wall (solid:
//      squared stone with a coping, drawn by coastTiles.js's `coping`)

export const ISLES_EAST_LIGHT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_east_light',
  // The room's name, for the Room Editor.
  name: 'THE EAST LIGHT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  vesWell: true,
  // Wrecks out on the open sea only (none in the light's pool).
  skyline: [
    { kind: 'mast', x: 6, y: 6, lean: 1, tall: 50 },
    { kind: 'hull', x: 37, y: 19, lean: -1 },
  ],

  tiles: [
    '############################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,,,,,#',
    '#~~~~~~~~~~~~~~h~~~~~~~~~~~h~~~~~,,,,,,,,,,#',
    '#~~~~~~~~~~~,,,h...........h,,,~~,,,,,,,,,,#',
    '#~~~~~~~~~~~,,,h...........h,,,,~,,,,,,,,,,#',
    '#~~~~~~~~~~,,,,h...~~~~~...h,,,,WWWWWWWWWWW#',
    '#~~~~~~~~~~,,,,h...~~~~~...h,,,,WWWWWWWWWWW#',
    '#~~~~~~~~~~,,,,....~~~~~...h,,,,WWWWWWWWWWW#',
    '#~~~~~~~~~~,,,,....~~~~~...h,,,,,,,,,,,,,~~#',
    '#~~~~~~~~~~,,,,h............,,,,,,,,,~~~~~~#',
    '#~~~~~~~~~~,,,,h............,,,,,,,,,~~~~~~#',
    '#~~~~~~~~~~,,,,h...........h,,,,,,,,,~~~~~~#',
    '#~~~~~~~~~~,,,,h...........h,,,,,,,,,,,,,,~#',
    '#~~~~~~~~~~,,,,h...........h,,,,,,,,,,,,,,~#',
    '#~~~~~~~~~~,,,,hhh..hhh..hhh,,,,~~~~~~~~~~~#',
    '#~~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~~~~~~~~~~~#',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~~~~~~~~~~~#',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~,,,,,,,,,,,,,,,,,~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates: the west path, out of the beam.
  playerStart: { x: 2, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 16, w: 1, h: 2, to: 'isles_landing', spawn: { x: 33, y: 12 } },
    // The old light's door, at the foot of its tower on the shelf.
    { x: 39, y: 4, w: 1, h: 1, to: 'isles_old_lightroom', spawn: { x: 3, y: 9 } },
  ],

  cutscenes: [],

  // The East Light: one lamp, all the way round, about eight seconds a turn.
  lamps: [
    { x: 21, y: 5, speed: 45, spread: 28, range: 12, art: 'lens' },
  ],
  // Safe stops, all out of the beam: the west path, the south-east corner, the east flat, the shelf.
  lampSafe: [
    { x: 1, y: 15, w: 13, h: 3 },
    { x: 27, y: 15, w: 5, h: 3 },
    { x: 31, y: 8, w: 6, h: 3 },
    { x: 33, y: 1, w: 9, h: 4 },
  ],
  lampText: { first: 'east_seen', again: 'east_seen_again' },

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The East Light on its rock in the pool (the lamp draws its lit glass).
    { sprite: 'il_light_tower', x: 21, y: 8, text: 'east_tower', walkable: true },
    // The old light, dark, on the shelf; its door is the way on.
    { sprite: 'il_light_tower_old', x: 39, y: 4, text: 'east_old_tower', walkable: true },
    // The Climbing Rope's ring at the top of the cliff (throw from 34,8).
    { sprite: 'grapple_ring', x: 34, y: 4, grapple: true },
    { sprite: 'sign', x: 4, y: 15, text: 'east_sign' },
    { sprite: 'sign', x: 30, y: 8, text: 'east_cliff_sign' },
    { sprite: 'c5_lifebuoy_post', x: 29, y: 17, text: 'east_lifebuoy' },
    { sprite: 'c5_lobster_pots', x: 8, y: 17, text: 'east_pots' },
    { sprite: 'c5_seaweed_heap', x: 36, y: 12, text: 'east_weed' },
    { sprite: 'c5_crate', x: 36, y: 2, text: 'east_oil_crate' },
    // A purse at the light's foot, out in the open, and one at the end of the west path.
    { sprite: 'gold_pouch', x: 21, y: 12, text: 'east_pouch', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 12, y: 3, text: 'east_pouch_far', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'isles_rock', W: 'east_cliff', '~': 'isles_sea', h: 'east_wall', '.': 'east_yard' },

  // A pinwheel on the west path's dead end (x 12 to 14, rows 4 to 6), and a kelpie foal in the
  // east rock pool (row 10, x 37 to 40, deep water both ways). Both keep off the way round the
  // wall, the doors, the safe stops' middles, the rope's foot (34,8) and the purse at the light.
  // No cutscenes in this room.
  npcs: [
    { enemy: 'pinwheel', x: 13, y: 5, patrol: [12, 14], behaviour: 'wander' },
    { enemy: 'kelpie_foal', x: 39, y: 10, patrol: [38, 41], behaviour: 'patrol' },
  ],
};
