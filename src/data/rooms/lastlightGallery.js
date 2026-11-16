// THE GALLERY: a long curved hall, and every wall of it written on. This is where Corrie practised.
// Spell circles chalked on the brick and rubbed out and chalked again, one burnt through to the iron,
// tide sums in a child's hand (the answers wrong, crossed out, right), a big circle on the floor with a
// paper boat at each of its four points, a little table with a jar and a stub of chalk, and on a coat
// stand by the east door a yellow oilskin far too big for any boy. PUZZLE-FREE; a trio of monsters on
// the east half. Nobody says who he is and nobody says where he went. Purse 300 in the south-east.
//   - Doors: the sluice room (0, rows 11-12, west end); the upper hall (31, rows 4-5, east end).
//   - The writing is on the north wall (row 2), the circle on the floor at x 14-16, rows 6-8.
//   - SECRET: the north wall at x 4 (rows 1-2) is a false wall (G, drawn as the brick): walk up into it
//     and you're through, into a den in the thickness of the wall (secret_lastlight_den). A paper boat
//     on the floor beside it (3,3) points its nose at the brick.
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   H  lamp niche   .  flagstones   I  iron pillar   o  a door
// (draft).

import { LIFE5_PROPS } from '../lifePass5.js';

export const LASTLIGHT_GALLERY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_gallery',
  // The room's name, for the Room Editor.
  name: 'THE GALLERY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  music: 'lastlight',
  ambience: 'last_light',
  indoors: true,
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
  vesWell: true,

  tiles: [
    '################################',
    '#hhhGhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#HhhGhHhhhhhhhHhhhhhhhhhhHhhhhH#',
    '#..............................#',
    '#..............................o',
    '#........I.............I.......o',
    '#..............................#',
    '#..............................#',
    '#..............................#',
    '#..............................#',
    '#........I.............I.......#',
    'o..............................#',
    'o..............................#',
    '################################',
  ],

  // Where the player starts, in tile coordinates: in from the sluice room.
  playerStart: { x: 1, y: 11 },

  doors: [
    { x: 0, y: 11, w: 1, h: 2, to: 'lastlight_sluice', spawn: { x: 28, y: 11 } },
    { x: 31, y: 4, w: 1, h: 2, to: 'lastlight_upper', spawn: { x: 2, y: 16 } },
    // Through the false wall into the den.
    { x: 4, y: 1, w: 1, h: 1, to: 'secret_lastlight_den', spawn: { x: 4, y: 5 } },
  ],

  cutscenes: [],

  textFile: 'interactions/lastlight.txt',
  props: [
    // The writing on the north wall, from the west door to the east.
    { sprite: 'll_chalk_circle', x: 2, y: 2, text: 'gal_circle' },
    { sprite: 'll_chalk_sums', x: 7, y: 2, text: 'gal_sums' },
    { sprite: 'll_chalk_hand', x: 10, y: 2, text: 'gal_hand' },
    { sprite: 'll_scorch_circle', x: 15, y: 2, text: 'gal_scorch' },
    { sprite: 'll_chalk_sums', x: 19, y: 2, text: 'gal_sums' },
    { sprite: 'll_chalk_hand', x: 22, y: 2, text: 'gal_hand_sorry' },
    { sprite: 'll_chalk_circle', x: 26, y: 2, text: 'gal_circle' },
    // The big circle on the floor, and the little table beside it.
    { sprite: 'll_floor_circle', x: 14, y: 8, text: 'gal_floor_circle', walkable: true, flat: true },
    { sprite: 'table', x: 6, y: 9, text: 'gal_table' },
    { sprite: 'chair', x: 5, y: 9, text: 'gal_chair' },
    { sprite: 'c5_toy_boat', x: 7, y: 11, text: 'gal_boat' },
    // The hint to the false wall: a paper boat with its nose to the brick.
    { sprite: 'c5_toy_boat', x: 3, y: 3, text: 'gal_boat_wall' },
    { sprite: 'c5_driftwood', x: 2, y: 6, text: 'gal_driftwood' },
    { sprite: 'c5_barrel', x: 12, y: 11, text: 'gal_lime' },
    // The oilskin on its coat stand by the east door.
    { sprite: 'll_big_oilskin', x: 28, y: 5, text: 'gal_oilskin' },
    { sprite: 'c5_lantern_post_unlit', x: 18, y: 4, text: 'gal_lamp' },
    { sprite: 'gold_pouch', x: 29, y: 11, text: 'gal_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // (2026-11-08b) Under the writing, the tower still works: lamp oil stood by the east door with
    // its spill, a drain grating, coal tracked in, and kelp dragged in from the sluice room's door.
    // All clear of the trio's floor (x 20-25, rows 8-10), the circle and both doors.
    { sprite: 'll_drums', x: 29, y: 8, text: 'll_drums' },
    { sprite: 'll_oil_spill', x: 27, y: 9, flat: true, walkable: true },
    { sprite: 'll_grating', x: 11, y: 6, flat: true, walkable: true },
    { sprite: 'll_grating', x: 26, y: 12, flat: true, walkable: true },
    { sprite: 'll_kelp_drag', x: 4, y: 12, flat: true, walkable: true },
    { sprite: 'll_coal_spill', x: 17, y: 12, flat: true, walkable: true },
    { sprite: 'c5_toy_boat', x: 19, y: 6, text: 'gal_boat' },
    { sprite: 'c5_puddle', x: 1, y: 9, flat: true, walkable: true },
    // Wear on the big black flags, so the floor isn't one even grid.
    { sprite: 'c5_floor_crack', x: 21, y: 7, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 4, y: 8, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 15, y: 11, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 24, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 30, y: 3, flat: true, walkable: true },
    ...(LIFE5_PROPS['lastlight_gallery'] ?? []),
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', G: 'll_wall', H: 'll_niche', o: 'll_door', '.': 'll_floor', I: 'll_pillar' },

  // A salt shade, a storm imp and a net wraith on the east half (x 20-25, rows 8-10), three together
  // so it is a trio. Clear of both doors, the floor circle (x 14-16), the oilskin (28,5) and the
  // purse. No cutscenes in this room.
  npcs: [
    { enemy: 'salt_shade', x: 21, y: 8, patrol: [20, 23], behaviour: 'wander', until: 'corrie_falls' },
    { enemy: 'storm_imp', x: 23, y: 9, patrol: [22, 25], behaviour: 'wander', until: 'corrie_falls' },
    { enemy: 'net_wraith', x: 22, y: 10, patrol: [21, 24], behaviour: 'wander', until: 'corrie_falls' },
  ],
};
