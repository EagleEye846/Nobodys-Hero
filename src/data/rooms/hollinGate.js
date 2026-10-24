// HOLLIN GATE: the edge of Hollin, the woodcutters' old village, left
// fifty years ago when the Hush came out of its hollow and walked down the
// lane. Its palisade still stands, and its gate is still barred from the
// inside: there's a gap where a board's come away that only Bramble fits, and
// the bar's on a lever. Inside: the first empty cottages, the village green,
// a save point, and the village shop with its door left open (Hollin
// Stores). And in the north-east, the old lookout tree, its ladder
// hanging off a stump, if you can get up to it (the Lookout, a secret).
// Bramble's grandad was born here (hollin_gate_scene).
// Tile key (see src/overworld/tileset.js):
//   5  cottage wall (solid)
//   6  boarded cottage window (solid)
//   7  cottage roof (solid)
//   8  shut cottage door (solid)
//   D  an open cottage door (walk through it; see `doors`)
//   B  tall stump or trunk (jump up onto it from a stump)
//   b  stump (jump up onto it)
//   d  leaf litter
//   f  fence (solid)
//   L  old scarlet tree (walk or hide behind) (solid)
//   X  Hollin's cobbles
//   y  leaf path
export const HOLLIN_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_gate',
  // The room's name, for the Room Editor.
  name: 'HOLLIN GATE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hollin',
  // "Hush, Little Hollin" (hollinTheme.js): the empty village's lullaby.
  music: 'hollin',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.4,
  // Mist drifting through, 0 to 1.
  fog: 0.3,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLyyLLLLLLLLLLL',
    'Lddddddddddddddddddyy7777777dddL',
    'Ldd777777ddd77777ddyd7777777dddL',
    'Ldd777777ddd77777ddyd7777777dddL',
    'Ldd777777ddd55D55ddyd5658565ddLL',
    'Ldd568565ddddddyyyyydddddddddddL',
    'LddddddddXXXXXXXXXXXXXXddddddddL',
    'LddddddddXXXXXXXXXXXXXXdddddLBLL',
    'LdLddddddXXXXXXXXXXXXXXdddddLbLL',
    'LddddddddXXXXXXXXXXXXXXddddddddL',
    'LddddddddXXXXXXXXXXXXXXddddddddL',
    'LfffffdfffffffdddffffffffffffffL',
    'LddddddddddddddydddddddddddddddL',
    'LddddddddddddddydddddddddddddddL',
    'LddddddddddLdddydddddddddddLdddL',
    'LddLdddddddddddydddddddddddddddL',
    'LddddddddddddddydddddddddddddddL',
    'LddddddddddddddydddddddLdddddddL',
    'LdddddddLddddddydddddddddddddddL',
    'LddddddddddddddydddddddddddddddL',
    'LddddddddddddddydddddddddddddddL',
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 15, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 21, w: 2, h: 1, to: 'hush_clawed_bridge', spawn: { x: 5, y: 1 } },
    { x: 19, y: 0, w: 2, h: 1, to: 'hollin_lane', spawn: { x: 16, y: 26 } },
    { x: 29, y: 6, w: 1, h: 1, to: 'hollin_lookout', spawn: { x: 7, y: 10 } },
    // Hollin Stores, its door left open.
    { x: 14, y: 4, w: 1, h: 1, to: 'hollin_stores', spawn: { x: 6, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 15, y: 13, w: 2, h: 1, scene: 'hollin_gate_scene' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The palisade gate (barred: its lever's inside), the gap only Bramble fits,
  // and the lookout ladder.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'gate_wide', x: 14, y: 11, text: 'hollin_gate_gate', opensWith: ['hollin_bar'], openText: 'hollin_gate_open' },
    { sprite: 'cat_flap', x: 6, y: 11, text: 'hollin_board', gap: true },
    { sprite: 'lever', x: 12, y: 9, text: 'hollin_bar', lever: 'hollin_bar' },
    { sprite: 'hollin_sign', x: 17, y: 13, text: 'hollin_sign' },
    { sprite: 'savepoint', x: 18, y: 8, save: true },
    { sprite: 'stores_sign', x: 13, y: 4, text: 'hstores_sign' },
    { sprite: 'lookout_ladder', x: 29, y: 6, text: 'hollin_ladder', walkable: true },
    // A log rolled against the lookout stump, so the little ones couldn't climb
    // it.
    { sprite: 'roll_log', x: 29, y: 9, text: 'hollin_log', log: true },
    { sprite: 'cart_broken', x: 23, y: 8, text: 'hollin_cart' },
    { sprite: 'washing_line', x: 3, y: 8, text: 'hollin_washing' },
    { sprite: 'chalk_rock_up', x: 17, y: 6, text: 'hollin_chalk' },
    { sprite: 'gold_pouch', x: 1, y: 20, text: 'hollin_gate_pouch', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 5, y: 5, text: 'hollin_door' },
    { x: 24, y: 4, text: 'hollin_door' },
  ],
  tileTexts: { L: 'scarlet_tree', f: 'hollin_palisade', '6': 'hollin_window', '5': 'hollin_wall', '7': 'hollin_roof', '8': 'hollin_door', B: 'hollin_lookout_tree', b: 'hollin_lookout_stump' },

  // Haywards out in the old fields south of the palisade, still guarding them.
  npcs: [
    { enemy: 'hayward', x: 6, y: 16, patrol: [3, 9] },
    { enemy: 'hayward', x: 25, y: 19, patrol: [21, 28] },
    // A Hob sweeping the path outside the first cottages.
    { enemy: 'hob', x: 5, y: 7, patrol: [2, 8] },
  ],
};
