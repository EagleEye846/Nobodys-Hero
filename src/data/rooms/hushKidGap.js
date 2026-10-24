// THE KID GAP: two old bramble hedges across the wood, each with a gate
// of woven branches tied shut from the far side, and each with a hole low
// down that a grown-up couldn't fit through in a hundred years. Bramble can.
// Switch to him (Q), send him through, and have him pull the lever. The second
// hole has a rock in front of it, on your side: only you can shift that. And
// a den-sized pocket in the bramble, with something in it.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_KID_GAP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_kid_gap',
  // The room's name, for the Room Editor.
  name: 'THE KID GAP',
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
  gloom: 0.15,

  tiles: [
    'LLLLLLLLLLLLLyyLLLLLLLLLLLLL',
    'LdddddddddddddyddddddddddddL',
    'LddLddddddddddyyyyLyyddddddL',
    'LdddddddddddddddddddyddddLdL',
    'LdddddddddddddddddddyddddddL',
    'LZZZZZZZdZZZZZZZZZZZdZZZZZZL',
    'LdddddddddddddyyyyyyyddddddL',
    'LddddddddddLddyddddddddddddL',
    'LdddddddddddddydddddddddLddL',
    'LdLdddddddLdddydLddddddddddL',
    'LdddddddddddddyddddddddddddL',
    'LZZZZdZZZZZZZZdZZZZZZZZZZZZL',
    'LddddddddddddydddddddddddddL',
    'LddddddddddddydddddddZZZZZZL',
    'LdddLddddddddydddddddddddddL',
    'LddddddddLdddydddLdddZdddddL',
    'LddddddddddddydddddddZZZZZZL',
    'LLLLLLLLLLLLLyyLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 13, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 13, y: 17, w: 2, h: 1, to: 'hush_hollow_oak', spawn: { x: 14, y: 1 } },
    { x: 13, y: 0, w: 2, h: 1, to: 'hush_leaning_pines', spawn: { x: 14, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Kid gaps (`gap`) only Bramble fits through; levers on the far side open the
  // gates.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'sign', x: 12, y: 13, text: 'kidgap_sign' },
    { sprite: 'gate_narrow', x: 14, y: 11, text: 'kidgap_gate', opensWith: ['gap_lever'], openText: 'kidgap_gate_open' },
    { sprite: 'kid_gap', x: 5, y: 11, text: 'kid_gap', gap: true },
    { sprite: 'lever', x: 3, y: 7, text: 'kidgap_lever', lever: 'gap_lever' },
    { sprite: 'gate_narrow', x: 20, y: 5, text: 'kidgap_gate', opensWith: ['gap_lever_2'], openText: 'kidgap_gate_open' },
    { sprite: 'kid_gap', x: 8, y: 5, text: 'kid_gap', gap: true },
    { sprite: 'push_rock', x: 8, y: 6, text: 'kidgap_rock', rock: true },
    { sprite: 'lever', x: 6, y: 2, text: 'kidgap_lever', lever: 'gap_lever_2' },
    { sprite: 'chalk_rock_up', x: 16, y: 8, text: 'kidgap_chalk' },
    // The pocket in the bramble (Bramble only), with a purse somebody hid.
    { sprite: 'kid_gap', x: 21, y: 14, text: 'kid_gap', gap: true },
    { sprite: 'gold_pouch', x: 25, y: 15, text: 'kidgap_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble' },

  // A Sapling stands in for a tree between the hedges, and a Russet hides behind
  // one up north.
  npcs: [
    { enemy: 'sapling', x: 22, y: 9, patrol: [22, 22], behaviour: 'disguise' },
    { enemy: 'russet', x: 24, y: 2, patrol: [24, 24], behaviour: 'ambush' },
  ],
};
