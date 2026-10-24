// THE WINDFALL: a storm brought down the biggest trees in this part of the
// wood, and they lie right across it, too tall to climb from the ground. You
// get up by stumps, one step at a time (jump with Space), and down the far
// side. But saplings have grown up in the way of the stumps you need, and
// Bramble has to fell them, carefully: a sapling falls the way the chopper
// faces, and a log lying in the wrong place blocks a stump for good (until
// the carved stump puts it all back). Here you first see the Hush's shadow go
// over the trees (the_shadow_passes); Bramble pulls you into the leaves.
// Tile key (see src/overworld/tileset.js):
//   B  tall stump or trunk (jump up onto it from a stump)
//   b  stump (jump up onto it)
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
export const HUSH_WINDFALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_windfall',
  // The room's name, for the Room Editor.
  name: 'THE WINDFALL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hushwood',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.35,

  tiles: [
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLL',
    'LddddddddddddddydddddddddddddddL',
    'LddddddddddddLdydddddddddddddddL',
    'LddddddddddddddydddddddddLdddddL',
    'LdddddLddddddddydddddddddddddddL',
    'LddddddddddddddydddddddddddddddL',
    'LddddddddddddddydddddddddddddLdL',
    'LdddddddddddddddddddLbLddddddddL',
    'LBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBL',
    'LddddddddLbddddddddddddddddddddL',
    'LdddddddddddddddLddddddddddddddL',
    'LddddddddddddddddddddddddddddLdL',
    'LdLddddddBBBBBBBBBBBBBBddddddddL',
    'LddddddddddddddddddddddddddddddL',
    'LdddddddddddddddddLddddddddddddL',
    'LddddddddddddddddddddddddddddddL',
    'LBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBL',
    'LdddddddddddddddddddddddddLbLddL',
    'LddddddddddddddyyyyyyyyyyyyydddL',
    'LdddLddddddddddyddddddLddddddddL',
    'LddddddddddLdddydddddddddddddddL',
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 15, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 21, w: 2, h: 1, to: 'hush_sprung_trap', spawn: { x: 15, y: 1 } },
    { x: 15, y: 0, w: 2, h: 1, to: 'hush_millrace', spawn: { x: 15, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 15, y: 18, w: 2, h: 1, scene: 'the_shadow_passes' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Saplings in the way of the stumps (`chop`), and the carved stump that stands
  // them back up.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'thin_pine', x: 27, y: 18, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 10, y: 10, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 11, y: 9, text: 'thin_pine', chop: true },
    { sprite: 'rock_stump', x: 13, y: 19, text: 'rock_stump', rockReset: true },
    { sprite: 'rock_stump', x: 18, y: 11, text: 'rock_stump', rockReset: true },
    { sprite: 'leaf_pile', x: 17, y: 18, text: 'leaf_pile', hide: true },
    { sprite: 'chest', x: 30, y: 1, text: 'windfall_chest', gives: 'ember_potato', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 1, y: 9, text: 'windfall_pouch', gold: 140, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'paw_print', x: 8, y: 18, text: 'paw_print' },
  ],
  tileTexts: { L: 'scarlet_tree', B: 'windfall_trunk', b: 'windfall_stump' },

  // A Burrhog rolls about between the trunks, and a Knotling poses as a stump up
  // north.
  npcs: [
    { enemy: 'burrhog', x: 7, y: 11, patrol: [3, 8] },
    { enemy: 'knotling', x: 27, y: 4, patrol: [27, 27], behaviour: 'disguise' },
  ],
};
