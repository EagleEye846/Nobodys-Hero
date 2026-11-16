// THE FLOODED COTTAGE, KITCHEN (a secret): through the parlour's east door. The range, a shelf of
// plates, a table floated against the wall; and across the middle of the room a trench two tiles
// wide where the floor has gone through into the cellar: deep black water, too deep to wade. On
// the far side is the foot of the stair up to the attic, or what's left of it: the lower flight
// is gone, and its top four treads hang off a landing high on the wall (rows 2 and 3, x 9 to 12),
// an iron ring on the landing's edge (11,3). The hatch to the attic is up there, behind the landing.
//   - THE PUZZLE: the cellar's drain wheel (3,2), on this side of the trench. Turn it and the cellar
//     empties through the drain (the tide engine: this room's own tide, `high` at the start with
//     the trench deep; `low`, it's knee-deep like the rest). Cross, stand under the landing at
//     (11,6), face the wall and throw the Climbing Rope at the ring: you're hauled up onto the
//     landing (11,3), and through the hatch (10,1 to 11,1) into the attic. Back down the same
//     way: stand on the ring, face down.
//   - The wheel is on the door's side, and the rope's foot (11,6) is dry at both tides, so
//     nobody can get stuck.
// Tile key (see src/overworld/coastTiles.js, lanes, indoors):
//   #  wall top (solid)   h  board wall (solid)   ;  knee-deep water (walk)
//   ~  the cellar trench, deep (solid) at high water   o  the landing's boards
// (draft)

export const SECRET_LANES_KITCHEN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_lanes_kitchen',
  // The room's name, for the Room Editor.
  name: 'THE FLOODED KITCHEN',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  indoors: true,
  // The Sunken Lanes' song, quieter under a roof, with the rain on it.
  music: 'lanesIndoor',
  ambience: 'drowned_house',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_drowned_house' },
  vesWell: true,

  // The HIGH-water map (the cellar full). At low water the trench is shallows like the rest.
  tiles: [
    '##############',
    '#hhhhhhhhhooh#',
    '#;;;;~~;hoooo#',
    '#;;;;~~;hoooo#',
    '#;;;;~~;hhhhh#',
    '#;;;;~~;hhhhh#',
    ';;;;;~~;;;;;;#',
    '#;;;;~~;;;;;;#',
    '#;;;;~~;;;;;;#',
    '#;;;;~~;;;;;;#',
    '##############',
  ],
  tide: {
    low: [
      '              ',
      '              ',
      '     ;;       ',
      '     ;;       ',
      '     ;;       ',
      '     ;;       ',
      '     ;;       ',
      '     ;;       ',
      '     ;;       ',
      '     ;;       ',
      '              ',
    ],
    start: 'high',
    // Its own tide, kept in the save: the wheel is the only thing that moves it.
    group: 'lanes_cottage',
    hud: false,
  },

  // Where the player starts, in tile coordinates: in from the parlour door.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back to the parlour.
    { x: 0, y: 6, w: 1, h: 1, to: 'secret_lanes_cottage', spawn: { x: 12, y: 3 } },
    // Up through the hatch, from the landing.
    { x: 10, y: 1, w: 2, h: 1, to: 'secret_lanes_attic', spawn: { x: 6, y: 8 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The cellar's drain wheel, on its pipe by the west wall, this side of the trench.
    { sprite: 'c5_sluice_wheel', x: 3, y: 2, text: 'cot_drain', tideWheel: { to: 'low', text: 'cot_drain_turn', already: 'cot_drain_already', busy: 'cot_drain_busy' } },
    // The stair's top flight (no words: it is within two tiles of the rope's foot), the ring on the
    // landing's edge above it, and the hatch behind the landing.
    { sprite: 'ln_stair_stub', x: 10, y: 5, flat: true },
    { sprite: 'grapple_ring', x: 11, y: 3, grapple: true },
    { sprite: 'gs_hatch', x: 10, y: 1, text: 'cot_hatch', walkable: true, flat: true },
    // The kitchen: the range, a shelf of plates, a rail of pans, a barrel of salt.
    { sprite: 'c5_galley_stove', x: 3, y: 8, text: 'cot_range' },
    { sprite: 'in_shelf_neat', x: 2, y: 1, text: 'cot_plates' },
    { sprite: 'in_pans_rail', x: 7, y: 1, text: 'cot_pans' },
    { sprite: 'c5_barrel', x: 12, y: 9, text: 'cot_barrel' },
  ],
  tileTexts: { '#': 'cot_wall', h: 'cot_wall', '~': 'cot_trench', ';': 'cot_water' },

  // One net wraith wanders the east side of the trench (row 9, x 8 to 11). It stays clear of the
  // rope's foot (11,6), the landing and the doors. No cutscenes in this room.
  npcs: [
    { enemy: 'net_wraith', x: 9, y: 9, patrol: [8, 11], behaviour: 'wander' },
  ],
};
