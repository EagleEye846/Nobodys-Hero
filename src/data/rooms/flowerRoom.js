// FLOWER ROOM: made in Ruins Studio (tools/).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                         W  wall face (solid)
//   H  wall face with a faded banner (solid)    .  floor
//   r  rug                                      p  potted plant (solid)
//   F  flower bed (solid)                       ~  water (solid)
//   D  doorway (walk through it; see `doors`)   U  stairs up (walk through it; see `doors`)
//   C  candle stand (walk or hide behind) (solid)
export const FLOWER_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'flower_room',
  // The room's name, for the Room Editor.
  name: 'FLOWER ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'ruins',

  tiles: [
    '####################',
    '#WWWWWWWHUUUHWWWWWW#',
    '#WWWWWWWWUUUWWWWWWW#',
    '#..................#',
    '#..................#',
    '#.....p.FF.FF.p.~~~#',
    '#.......FF.FF...~~~#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#........rrr.......#',
    '#.......CrrrC......#',
    '#########DDD########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 14, w: 3, h: 1, to: 'pillar_room', spawn: { x: 10, y: 4 } },
    { x: 9, y: 1, w: 3, h: 2, to: 'taper_home', spawn: { x: 10, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 4, y: 5, w: 13, h: 10, scene: 'meet_taper' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'taper', x: 10, y: 5, npc: 'mother_taper', animation: 'taper_watering', until: 'meet_taper' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { F: 'flower_beds', '~': 'ruins_water' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [
    // Dust bunnies nibbling at Taper's moonbells, and a moth drawn to the light.
    { art: 'bunny', enemy: 'bunny', x: 5, y: 9, patrol: [2, 8] },
    { art: 'bunny', enemy: 'bunny', x: 15, y: 10, patrol: [12, 18] },
    { art: 'moth', enemy: 'moth', x: 10, y: 8, patrol: [4, 15] },
  ],
};
