// THE WAY OUT: down the stairs from Taper's hallway. A long, quiet corridor
// to the old door out of the Ruins. Taper won't let you through it easily.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            W  wall face (solid)
//   V  wall face with ivy (solid)                  H  wall face with a faded banner (solid)
//   .  floor                                       c  cracked floor (safe)
//   D  doorway (walk through it; see `doors`)      U  stairs up (walk through it; see `doors`)
//   I  tall pillar (walk or hide behind) (solid)
export const WAY_OUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'way_out',
  // The room's name, for the Room Editor.
  name: 'THE WAY OUT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: null,

  tiles: [
    '####################################',
    '#WUUWWWWWWWWWWWVVWWWWWWWWWWVWWWDDDW#',
    '#WUUWWWWWHWWWWWVVWWWWHWWWWWVWWWDDDW#',
    '#......I.....I.....I.....I.........#',
    '#..........c.......................#',
    '#............................c.....#',
    '#..................................#',
    '#......I.....I.....I.....I.........#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 3, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 2, y: 1, w: 2, h: 2, to: 'taper_hall', spawn: { x: 18, y: 7 } },
    { x: 31, y: 1, w: 3, h: 2, to: 'beyond_ruins', spawn: { x: 10, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 5, y: 3, w: 2, h: 5, scene: 'taper_follows' },
    { x: 26, y: 3, w: 2, h: 5, scene: 'taper_blocks' },
    { x: 31, y: 3, w: 3, h: 1, scene: 'leave_ruins' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'savepoint', x: 4, y: 6, save: true },
    { sprite: 'taper', x: 32, y: 4, npc: 'mother_taper', after: 'taper_follows', until: 'taper_blocks' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { I: 'ruins_pillars' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
