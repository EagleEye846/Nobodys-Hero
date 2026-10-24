// THE HOLLOW OAK: a ring of trunks so old they've grown together, all that's
// left of one great oak, open on the east side. Somebody's backed into it: a
// kid with a hatchet far too big for him, and three of the wood's monsters
// closing in. The scene (bramble_cornered) plays as you come up the path, and
// the fight is Bramble's first with you (bramble_rescued after). A save point,
// once it's quiet again.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_HOLLOW_OAK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_hollow_oak',
  // The room's name, for the Room Editor.
  name: 'THE HOLLOW OAK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's song; Bramble's own ("Didn't Mind the Camp") plays in his
  // scenes.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hushwood',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.15,

  tiles: [
    'LLLLLLLLLLLLLLyyLLLLLLLLLLLLLL',
    'LdddddddddddddyyyydddddddddddL',
    'LddddddddddddddddydLdddddddddL',
    'LddddddddddddLdddydddddddddddL',
    'LddddLLLdddddddddyddddddLddddL',
    'LdddLdddLZdddddddydddddddddddL',
    'LddLdddddZdddddddydddddddddddL',
    'LdLddddddddddddLdydddddddddddL',
    'LdLddddddddddddddyddddddddLddL',
    'LdLddddddddyyyyyyyyyyddddddddL',
    'LdLdddddddddddddddddyyyyyyyyyy',
    'LdLdddddddddddddddddddddddddyy',
    'LddLdddddZddddddddddLddddddddL',
    'LdddLdddLZdddddddddddddddLdddL',
    'LddddLLLdddddddddddddddddddddL',
    'LdddddddddddddddddddddLddddddL',
    'LdddddddddddLddddLdddddddddddL',
    'LddddddddddddddddddddddddddLdL',
    'LddddddddddddddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 28, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 29, y: 10, w: 1, h: 2, to: 'hush_felled_run', spawn: { x: 1, y: 4 } },
    { x: 14, y: 0, w: 2, h: 1, to: 'hush_kid_gap', spawn: { x: 13, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // A line right across the clearing, wall to wall: however you come in
    // from the east, you can't get past it without finding him.
    { x: 21, y: 1, w: 1, h: 18, scene: 'bramble_cornered' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    // Bramble's things, under the oak: he's been camping here.
    { sprite: 'old_pack', x: 4, y: 7, text: 'oak_pack', gives: 'pine_candy', taken: { text: 'oak_pack_empty' } },
    { sprite: 'dropped_cap', x: 6, y: 12, text: 'oak_cap' },
    { sprite: 'savepoint', x: 18, y: 6, save: true, after: 'bramble_rescued' },
    { sprite: 'chest', x: 27, y: 2, text: 'oak_chest', gives: 'herald_honeycake', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'paw_print', x: 23, y: 17, text: 'paw_print' },
    { sprite: 'paw_print', x: 25, y: 18, text: 'paw_print' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 3, y: 6, text: 'oak_ring' },
    { x: 2, y: 9, text: 'oak_ring' },
    { x: 5, y: 14, text: 'oak_ring' },
    { x: 7, y: 4, text: 'oak_ring' },
    { x: 8, y: 13, text: 'oak_ring' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble' },

  // No enemies wandering: the pack in the scene is the fight, and they're gone
  // after.
  npcs: [],
};
