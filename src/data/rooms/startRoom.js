// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)     W  wall face (solid)
//   .  floor                r  rug
//   p  potted plant (solid) P  pillar with a lantern (solid)
//   D  doorway (walk through it; see `doors`)
export const START_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ruins_entrance',
  // Shown on a title card when you arrive.
  name: 'THE RUINS',
  // Picks the battle background (see src/battle/backdrops.js).
  area: 'ruins',
  // The song that plays here (see src/audio/music.js).
  music: 'ruins',

  tiles: [
    '##############################',
    '#WWWWWWWWWWWW##WWWWWWWWWDDWWW#',
    '#WWWWWWWWWWWW##WWWWWWWWWDDWWW#',
    '#............##..............#',
    '#.p..........##.............p#',
    '#............##..............#',
    '#...rrrrrr...##..............#',
    '#...rrrrrr...##......pp......#',
    '#...rrrrrr...##..............#',
    '#...rrrrrr...................#',
    '#............................#',
    '#............##..............#',
    '#............##..............#',
    '#............##......pp......#',
    '#............##..............#',
    '#.p..........##..............#',
    '#............##.............p#',
    '#............##..............#',
    '#............##..............#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 12 },

  // Walking onto a door's tiles takes you to another room. `spawn` is where you
  // arrive there, in tile coordinates.
  doors: [{ x: 24, y: 1, w: 2, h: 2, to: 'lantern_hall', spawn: { x: 10, y: 14 } }],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` names a shop in src/data/shops.js;
  // `save` makes it a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'sign', x: 6, y: 3, text: 'welcome_sign' },
    { sprite: 'sign', x: 21, y: 3, text: 'east_sign' },
    { sprite: 'keeper', x: 9, y: 14, npc: 'old_keeper' },
    { sprite: 'merchant', x: 11, y: 5, shop: 'ruins_shop' },
    { sprite: 'savepoint', x: 3, y: 12, save: true },
  ],

  // Enemies wandering the room. Touching one starts a battle.
  // x/y and the patrol bounds are tile coordinates; `enemy` picks the battle stats.
  // Enemies close together fight you as a group (see GROUP_RADIUS in the overworld scene);
  // these two are far enough apart to fight one at a time.
  npcs: [
    { art: 'dummy', enemy: 'dummy', x: 21, y: 11, patrol: [18, 24] },
    { art: 'bunny', enemy: 'bunny', x: 20, y: 16, patrol: [16, 26] },
  ],
};
