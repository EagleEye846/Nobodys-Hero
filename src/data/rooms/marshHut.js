// INSIDE THE STILT HUT: one room, swept once, long ago. An old stove with a
// little fire going in it, a cot, a table, hooks along the walls with nothing
// on them. And Ves, sitting against the wall with her leg out straight, bound
// up in a strip of her own coat (found_ves). Once she's with you: a save, the
// cot to rest on, and the back door out onto the far jetty.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   D  doorway
//   h  hut wall (solid)
//   o  wooden floor
export const MARSH_HUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_hut',
  // The room's name, for the Room Editor.
  name: 'INSIDE THE STILT HUT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#ooooooooooooD',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######DD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'marsh_hut_island', spawn: { x: 13, y: 5 } },
    { x: 13, y: 5, w: 1, h: 1, to: 'marsh_jetty', spawn: { x: 1, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // A line right across the hut, wall to wall, a step in from the door:
    // there's no getting past it without finding her.
    { x: 1, y: 7, w: 12, h: 1, scene: 'found_ves' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'stove', x: 9, y: 2, text: 'hut_stove' },
    { sprite: 'vesper_hurt', x: 10, y: 4, text: null, cast: 'hurt_ves', until: 'found_ves' },
    { sprite: 'bed', x: 2, y: 3, text: 'hut_cot', rest: true },
    { sprite: 'table', x: 5, y: 4, text: 'hut_table' },
    { sprite: 'chair', x: 4, y: 4, text: 'hut_chair' },
    { sprite: 'savepoint', x: 11, y: 7, save: true, after: 'found_ves' },
    { sprite: 'barrel', x: 1, y: 8, text: 'hut_barrel' },
    { sprite: 'crates', x: 12, y: 8, text: 'hut_crates' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 2, y: 2, text: 'hut_hooks' },
    { x: 3, y: 2, text: 'hut_hooks' },
    { x: 4, y: 2, text: 'hut_hooks' },
    { x: 5, y: 2, text: 'hut_hooks' },
    { x: 6, y: 2, text: 'hut_hooks' },
    { x: 7, y: 2, text: 'hut_hooks' },
  ],
  tileTexts: { h: 'hut_wall' },

  // Nobody but her.
  npcs: [],
};
