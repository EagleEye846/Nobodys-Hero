// THE GULLS' HOARD (secret): a sandstone cave behind the cove's north cliff where
// the gulls keep everything shiny they have ever borrowed. A heap of spoons and
// buttons, a hand mirror, a handbell done up in tinsel, a note, a chest (kelp crisps) and a
// purse. Reached from the cove at LOW tide, along the shingle spit to the hole in
// the cliff. Nothing hostile.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  cave top (solid)   W  cave wall (solid)   .  sand floor

export const SECRET_GULL_HOARD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_gull_hoard',
  // The room's name, for the Room Editor.
  name: 'THE GULLS\' HOARD',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'cave',
  vesWell: true,
  indoors: true,

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#WWWWWWWWWWWW#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '######..######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'gullrest_cove', spawn: { x: 15, y: 3 } },
  ],

  // None.
  cutscenes: [],

  // The heap, a mirror, a handbell done up in tinsel, a note, a chest and a purse.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'c5_gull_hoard', x: 5, y: 3, text: 'hoard_pile' },
    { sprite: 'mirror', x: 9, y: 3, text: 'hoard_mirror' },
    { sprite: 'c5_handbell', x: 2, y: 4, text: 'hoard_tinsel' },
    { sprite: 'sign', x: 11, y: 6, text: 'hoard_note' },
    { sprite: 'chest', x: 11, y: 4, text: 'hoard_chest', gives: 'kelp_crisps', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'hoard_pouch', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'hoard_wall', '#': 'hoard_wall' },

  npcs: [
  ],
};
