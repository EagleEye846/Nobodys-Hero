// THE NOTCHED TREES: an old woodcutters' gate in a hedge, with four
// levers about the place, and a carved post by each. Pull them in the wrong
// order and they all drop back. The order is in the posts: Ma's notch, three
// cuts and a tick, cut once, twice, three times, four. One lever's in a pocket
// of bramble only Bramble fits into; one's behind a rock only you can shift.
// Here the trails part: Ves's chalk goes north, and Ma's notches go east,
// into trees too thick to follow (two_trails).
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_NOTCHED = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_notched',
  // The room's name, for the Room Editor.
  name: 'THE NOTCHED TREES',
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
  gloom: 0.25,

  tiles: [
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLL',
    'LddddddddddddddyyddddddddddddddL',
    'LdddddddLddddddyddddddLddddddddL',
    'LdddddddddddddLydddddddddddddddL',
    'LdddLddddddddddydddddddddddLdddL',
    'LddddddddddddddydddddddddddddddL',
    'LZZZZZZZZZZZZZZdZZZZZZZZZZZZZZZL',
    'LddddddddddddddyddddddddddddddLL',
    'LddddddddddddddydddLddddddddddLL',
    'LddddddddddLdddyddddddddddddddLL',
    'LddddddddddddddyddddddddddddddLL',
    'LZZZZZZZdddddddyddddddddddddddLL',
    'LZdddddZdddddddyddddddddZZZZZZLL',
    'LZdddddZdddddddyddddddddZdddddLL',
    'LZdddddddddddddyLdddddddddddddLL',
    'LZdddddZdddddddyddddddddZdddddLL',
    'LZZZZZZZdddddddyddddddddZdddddLL',
    'LddddddddddddddyddddddddZZZZZZLL',
    'LddddddddddLdddyddddddddddddddLL',
    'LddLdddddddddddydddddLddddddddLL',
    'LddddddddddddddyydddddddddddddLL',
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 15, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 21, w: 2, h: 1, to: 'hush_sawpit', spawn: { x: 3, y: 1 } },
    { x: 15, y: 0, w: 2, h: 1, to: 'hush_sprung_trap', spawn: { x: 14, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 15, y: 15, w: 2, h: 1, scene: 'two_trails' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The order-gate (`inOrder`) and its four levers, each with a post that gives
  // its place in the order.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'gate_narrow', x: 15, y: 6, text: 'notched_gate', opensWith: ['one', 'two', 'three', 'four'], inOrder: true, openText: 'notched_gate_open', resetText: 'notched_gate_reset' },
    { sprite: 'sign', x: 17, y: 8, text: 'notched_sign' },
    { sprite: 'lever', x: 4, y: 13, text: 'notched_lever', lever: 'three' },
    { sprite: 'notched_post_3', x: 5, y: 13, text: 'notched_post_3' },
    { sprite: 'kid_gap', x: 7, y: 14, text: 'kid_gap', gap: true },
    { sprite: 'lever', x: 27, y: 15, text: 'notched_lever', lever: 'one' },
    { sprite: 'notched_post', x: 28, y: 15, text: 'notched_post_1' },
    { sprite: 'push_rock', x: 24, y: 14, text: 'push_rock', rock: true },
    { sprite: 'lever', x: 20, y: 10, text: 'notched_lever', lever: 'four' },
    { sprite: 'notched_post_4', x: 21, y: 10, text: 'notched_post_4' },
    { sprite: 'lever', x: 9, y: 8, text: 'notched_lever', lever: 'two' },
    { sprite: 'notched_post_2', x: 10, y: 8, text: 'notched_post_2' },
    { sprite: 'chalk_rock_up', x: 13, y: 16, text: 'notched_chalk' },
    { sprite: 'notched_post', x: 29, y: 19, text: 'notched_ma' },
    { sprite: 'chest', x: 2, y: 2, text: 'notched_chest', gives: 'charcoal_toffee', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 15, text: 'notched_pouch', gold: 130, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 30, y: 8, text: 'notched_thicket' },
    { x: 30, y: 11, text: 'notched_thicket' },
    { x: 30, y: 14, text: 'notched_thicket' },
    { x: 30, y: 17, text: 'notched_thicket' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble' },

  // Two Russets hide behind trees, and a Sapling poses as one by the gate.
  npcs: [
    { enemy: 'russet', x: 19, y: 13, patrol: [19, 19], behaviour: 'ambush' },
    { enemy: 'russet', x: 10, y: 19, patrol: [10, 10], behaviour: 'ambush' },
    { enemy: 'sapling', x: 24, y: 8, patrol: [24, 24], behaviour: 'disguise' },
  ],
};
