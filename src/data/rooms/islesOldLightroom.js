// THE OLD LIGHTROOM: the top of the dark light on the shelf, up its forty steps. Nobody has used
// it for years: dust on everything, the great lens grey under it, the logbook's last page long
// ago, the stove cold. And under the window, on a little table, a lantern is burning, and beside
// it a cup of tea with the steam still coming off it. (Lantern 5 of the chapter. Nobody says who
// lit it or poured it: every one of them has a plain excuse, and nobody follows it up.) The
// scene `isles_hot_tea` plays as you come in. PUZZLE-FREE, no monsters. The way on is out of the
// east door and down the back steps to the rope bridge.
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   h  the light's brick wall, under the lantern glass (solid)   o  old boards

export const ISLES_OLD_LIGHTROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_old_lightroom',
  // The room's name, for the Room Editor.
  name: 'THE OLD LIGHTROOM',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  // Rain on the lantern glass, the sea far below.
  ambience: 'lighthouse',
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  // Eight-sided, like the lantern room of a real light: the four corners are cut
  // off (the glass turns the two north ones on `il_lantern_glass_corner`, the
  // south ones are the tower's wall).
  tiles: [
    '##################',
    '#hhhhhhhhhhhhhhhh#',
    '#hhoooooooooooohh#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    'oooooooooooooooooo',
    'oooooooooooooooooo',
    '##oooooooooooooo##',
    '##################',
  ],

  // Where the player starts, in tile coordinates: at the top of the stair.
  playerStart: { x: 3, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'isles_east_light', spawn: { x: 38, y: 4 } },
    { x: 17, y: 8, w: 1, h: 2, to: 'isles_bridge', spawn: { x: 2, y: 9 } },
  ],

  // Coming in from the stair: the tea.
  cutscenes: [
    { x: 4, y: 7, w: 2, h: 4, scene: 'isles_hot_tea' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The lantern glass, all round the north side and turning both corners: tall panes on a
    // brick sill, the storm outside them.
    { sprite: 'il_lantern_glass_corner', x: 1, y: 2, text: 'old_glass' },
    { sprite: 'il_lantern_glass_salt', x: 3, y: 1, text: 'old_glass' },
    { sprite: 'il_lantern_glass', x: 5, y: 1, text: 'old_glass' },
    { sprite: 'il_lantern_glass_cracked', x: 7, y: 1, text: 'old_glass_cracked' },
    { sprite: 'il_lantern_glass', x: 9, y: 1, text: 'old_glass' },
    { sprite: 'il_lantern_glass_salt', x: 11, y: 1, text: 'old_glass' },
    { sprite: 'il_lantern_glass', x: 13, y: 1, text: 'old_glass' },
    { sprite: 'il_lantern_glass_corner_r', x: 15, y: 2, text: 'old_glass' },
    // The great lens, dead under its dust, in the middle of the room.
    { sprite: 'il_dead_lens', x: 8, y: 5, text: 'old_lens' },
    // Under the window: the lantern and the hot tea (lantern 5).
    { sprite: 'il_tea_table', x: 13, y: 3, text: 'old_tea', animation: 'il_tea_table', speed: 0.3, glow: [{ dx: -7, dy: -14, bloom: 12, strength: 0.7, flicker: 0.3, color: '255, 196, 110' }, { dy: -6, pool: 46, strength: 0.45, flicker: 0.2, color: '255, 196, 110' }] },
    { sprite: 'chair', x: 12, y: 4, text: 'old_chair' },
    { sprite: 'il_logbook', x: 4, y: 3, text: 'old_logbook' },
    { sprite: 'c5_galley_stove', x: 2, y: 4, text: 'old_stove' },
    { sprite: 'c5_rope_coil', x: 15, y: 6, text: 'old_rope', walkable: true, flat: true },
    { sprite: 'c5_crate', x: 2, y: 6, text: 'old_oil_crate' },
    { sprite: 'c5_barrel', x: 15, y: 10, text: 'old_oil_barrel' },
  ],
  tileTexts: { '#': 'old_wall', h: 'old_wall', o: 'old_floor' },

  // Nobody here. (And the scene walks the boards between the stair and the table.)
  npcs: [],
};
