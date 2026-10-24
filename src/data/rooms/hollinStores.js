// HOLLIN STORES: the village shop, off the green at Hollin Gate. Mags, who
// kept it, left with everyone else fifty years ago and never came back, but
// the shop's still stocked, the honesty tin's still on the counter, and her
// note on the slate still says to pay in it. Press Z on the tin to shop
// (src/data/shops.js: hollin_stores).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         D  doorway (walk through it; see `doors`)
export const HOLLIN_STORES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_stores',
  // The room's name, for the Room Editor.
  name: 'HOLLIN STORES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hollin',
  // "Hush, Little Hollin" (hollinTheme.js): the empty village's lullaby.
  music: 'hollin',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Indoors.
  indoors: true,
  // Nobody's lit a lamp in here for fifty years: only the light from the door.
  lamplight: { shade: 0.35, nightShade: 0.3 },

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######DD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 11, w: 2, h: 1, to: 'hollin_gate', spawn: { x: 14, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The honesty tin on the counter is the shop; the rest is how Mags left it.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'counter', x: 5, y: 5, text: 'hstores_counter' },
    { sprite: 'counter', x: 6, y: 5, text: 'hstores_counter' },
    { sprite: 'counter', x: 7, y: 5, text: 'hstores_counter' },
    { sprite: 'counter', x: 8, y: 5, text: 'hstores_counter' },
    { sprite: 'honesty_tin', x: 6, y: 4, shop: 'hollin_stores' },
    { sprite: 'bookshelf', x: 1, y: 2, text: 'hstores_shelves' },
    { sprite: 'bookshelf', x: 3, y: 2, text: 'hstores_shelves' },
    { sprite: 'bookshelf', x: 10, y: 2, text: 'hstores_shelves' },
    { sprite: 'notice_board', x: 12, y: 3, text: 'hstores_notices' },
    { sprite: 'lamp_cold', x: 9, y: 4, text: 'hstores_lamp' },
    { sprite: 'crates', x: 1, y: 8, text: 'hstores_crates' },
    { sprite: 'crates', x: 2, y: 9, text: 'hstores_crates' },
    { sprite: 'barrel', x: 11, y: 8, text: 'hstores_barrel' },
    { sprite: 'barrel', x: 12, y: 9, text: 'hstores_barrel' },
    { sprite: 'chair', x: 2, y: 5, text: 'hstores_chair' },
  ],
  tileTexts: { h: 'hstores_wall' },

  // Nobody here. Not even the Hush comes in.
  npcs: [],
};
