// THE OLD TOLLHOUSE (a secret): off the dark spur on the Lantern Path, where
// no lantern is. The old city's tollhouse, where its road crossed the fen. The
// keeper's blade is still in its rack, and the last of the tolls is still in
// the box.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
export const MARSH_TOLLHOUSE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_tollhouse',
  // The room's name, for the Room Editor.
  name: 'THE OLD TOLLHOUSE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // Only the drips.
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.35,
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#............#',
    '#.....I..J...#',
    '#............#',
    '#............#',
    '.............#',
    '#.........$$$#',
    '#.........$$$#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 1, to: 'marsh_lantern_path', spawn: { x: 34, y: 14 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'chest', x: 11, y: 3, text: 'toll_rack', gives: 'reedcutter', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 2, text: 'toll_box', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 4, y: 8, text: 'toll_board' },
    { sprite: 'rubble_heap', x: 8, y: 7, text: 'rubble' },
    { sprite: 'savepoint', x: 2, y: 4, save: true },
  ],
  tileTexts: { W: 'toll_wall', '#': 'toll_wall', I: 'road_pillar', J: 'road_pillar', $: 'fen_water' },

  // Nobody.
  npcs: [],
};
