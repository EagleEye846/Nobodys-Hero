// THE MOUTH OF THE SOUNDINGS: where the sea goes in under the cliffs. A long cave with a shingle
// beach, the open sea booming in at its mouth (south), and at the back of it the way on into the
// dark. The old sounders of the Saltcombe Harbour Board measured these caves, fathom by fathom,
// and left their chart on a board by the entrance: it is the map of the whole dungeon (Z on it).
// PUZZLE-FREE, and no monsters (an area's first room). The first time in, Bramble meets the sea
// indoors (scene `soundings_in`).
//
// TEMP until Merrow: the bible's temporary way in is the west door, from the cliff lane in
// lanes_down. Merrow's own way into the Soundings is the flooded tunnel in the west wall (rows 4
// and 5), choked with fallen boulders for now (the `O` at x 3). When Merrow exists: clear the
// boulders (make them `;`), put the commented door in, and decide whether the cliff lane stays.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   q  shingle   ;  shallows
//   ~  black water (solid)   0  the open sea at the mouth   x  glowing sea-glass (solid)
//   I  a rock pillar   O  boulder   F  weed

export const SOUNDINGS_MOUTH = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_mouth',
  // The room's name, for the Room Editor.
  name: 'THE MOUTH',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  tiles: [
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.....................x............#',
    '#........xx...............x........#',
    ';;;O...............I...............#',
    ';;;O...............................#',
    '#............I................xx...#',
    '#..................................#',
    '........................I...........',
    '....................................',
    '#..................................#',
    '#.....F.........x..................#',
    '#qqqqqqqqqqqqqqqqqqqOqqqqqqqFqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~00000000000000~~~~~~~~~~',
    '~~~~~~~~~~~~00000000000000~~~~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // TEMP until Merrow: the bible's temporary link, back along the cliff lane to the Sunken Lanes.
    { x: 0, y: 8, w: 1, h: 2, to: 'lanes_down', spawn: { x: 29, y: 9 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'soundings_echo_hall', spawn: { x: 2, y: 5 } },
    // TEMP until Merrow: Merrow's own way in, the flooded tunnel in the west wall (the id is the Merrow builder's).
    // { x: 0, y: 4, w: 1, h: 2, to: 'merrow_<last room>', spawn: { x: ?, y: ? } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 6, w: 2, h: 6, scene: 'soundings_in' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    // The sounders' chart: the map of the Soundings.
    { sprite: 'sd_chart', x: 6, y: 4, text: 'mouth_chart', notice: true },
    { sprite: 'sign', x: 9, y: 7, text: 'mouth_sign' },
    // Drips from the roof (each hangs from the ceiling wall above it).
    { sprite: 'c5_stalactite_drip', x: 12, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 29, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.55 },
    { sprite: 'c5_stalactites_wide', x: 16, y: 2, text: 'sound_stalactites' },
    // The sounders' leavings on the beach.
    { sprite: 'c5_rowboat', x: 10, y: 12, text: 'mouth_boat' },
    { sprite: 'c5_rope_coil', x: 15, y: 10, text: 'mouth_line', walkable: true },
    { sprite: 'c5_buoys_pile', x: 24, y: 11, text: 'mouth_buoys' },
    { sprite: 'c5_driftwood', x: 31, y: 12, text: 'mouth_driftwood' },
    { sprite: 'gold_pouch', x: 33, y: 3, text: 'mouth_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'mouth_sea', '0': 'mouth_sea', q: 'mouth_shingle', x: 'sound_glass', I: 'sound_pillar', O: 'mouth_rockfall', F: 'sound_weed', ';': 'mouth_tunnel' },

  // None: an area's first room.
  npcs: [],
};
