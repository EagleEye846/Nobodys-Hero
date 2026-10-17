// THE BELL TOWER: the bell every climber hears ring once, far above. Dunstan
// rings it every dawn, for the Hero, so they'll know the way, and has never
// once rung it after dark. The bell hangs on a platform of old stone; jump up
// the blocks in the corner to reach it (and ring it yourself, if you must).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   B  tall stone block (jump onto it from a low block)o  wooden floorboards
//   b  low stone block (jump up onto it)          D  doorway (walk through it; see `doors`)
export const REST_BELLTOWER = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_belltower',
  // The room's name, for the Room Editor.
  name: 'THE BELL TOWER',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // Indoors.
  indoors: true,
  // Lit by its one lamp, and daylight down the stairwell (see
  // src/overworld/lamplight.js): dim, but not dark.
  lamplight: { shade: 0.2, nightShade: 0.14 },

  tiles: [
    '############',
    '#hhhhhhhhhh#',
    '#hhhhhhhhhh#',
    '#BBBBBBBBBB#',
    '#BBBBBBBBBB#',
    '#oooooooooB#',
    '#oooooooooB#',
    '#ooooooooob#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#####DD#####',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 5, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 5, y: 21, w: 2, h: 1, to: 'rest_square', spawn: { x: 36, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    // The bell, up on the platform: jump up the blocks in the corner to reach it.
    { sprite: 'bell_frame', x: 4, y: 3, text: 'tower_bell', nightText: 'tower_bell_night', sound: 'bell', wrath: 'tower_bell_wrath' },
    { sprite: 'herald_bell', x: 2, y: 4, npc: 'herald_dunstan' },
    { sprite: 'sign', x: 2, y: 8, text: 'tower_sign' },
    { sprite: 'sign', x: 8, y: 12, text: 'tower_rules' },
    { sprite: 'barrel', x: 1, y: 18, text: 'tower_barrel' },
    { sprite: 'crates', x: 10, y: 18, text: 'tower_crates' },
    { sprite: 'book_stand', x: 1, y: 13, text: 'tower_log', notice: true },
    { sprite: 'street_lamp', x: 9, y: 15, text: 'tower_lamp' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { h: 'tower_wall', b: 'tower_blocks', B: 'tower_blocks' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
