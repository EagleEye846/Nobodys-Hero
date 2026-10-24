// THE MILLRACE: the old leat that fed Hollin's mill, still running after
// fifty years in its stone channels, with two sluices that send its water one
// way or another: full channels are walls, dry ones are paths. Sluice `a` (on
// the east bank) and `b` (on the west) each fill some channels as they empty
// others, and only with both lifted is the way between the banks dry; but the
// way north wants `a` down again, and the way to the door wants `b` down. So
// one of you has to be on the right bank at the right moment, and Bramble's
// little holes are how he gets about. And on the far
// west side, one of the trees along the edge isn't a tree at all: walk
// into it, and you're through, to the Starfall Glade. Only a pale blue
// glint in its leaves gives it away.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   j  dry stone channel (sluice water can fill it)
//   L  old scarlet tree (walk or hide behind) (solid)
//   &  false scarlet tree: walk straight through it (a secret)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_MILLRACE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_millrace',
  // The room's name, for the Room Editor.
  name: 'THE MILLRACE',
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
  gloom: 0.3,
  // Mist drifting through, 0 to 1.
  fog: 0.2,

  tiles: [
    'LLLLyyLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LdddyydddddddddjdddddddddddddddL',
    'LdddyddddddddddjdddddddddddddddL',
    'LdddydLddddddddjddddddddddLddddL',
    'LdddyddddddddddjdddddddddddddddL',
    '&dddyddddddddddjdddLdddddddddddL',
    'LdddyddddddLdddjdddddddddddddddL',
    'LddLyddddddddddjdddddddddddddLdL',
    'LdddyddddddddddjdddddddddddddddL',
    'LZZZZZZdZZZZZZZZZZZZZZjjjjjjjjjL',
    'LdddddddddddddddddddjjdddddddddL',
    'LddddddddddddLddddddjjdddddddLdL',
    'LddddddddyyyyyyyddddjjdddddddddL',
    'LddddddddddddddyddddjjdddddddddL',
    'LddddLdddddddddyddddjjdddddddddL',
    'LddddddddddddddydLddjjdddLdddddL',
    'LddddddddddddddyddddjjdddddddddL',
    'LddddddddddddddyddddjjdddddddddL',
    'LjjjjjjjjjjjjjjjjjjjZZZZZZZdZZZL',
    'LddddddddddddddydddddddddddddddL',
    'LdddLddddddddddyddddddddddddLddL',
    'LddddddddddddddyddddddddLddddddL',
    'LddddddddLdddddydddddddddddddddL',
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 15, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 23, w: 2, h: 1, to: 'hush_windfall', spawn: { x: 15, y: 1 } },
    { x: 4, y: 0, w: 2, h: 1, to: 'hush_quiet', spawn: { x: 18, y: 24 } },
    { x: 0, y: 5, w: 1, h: 1, to: 'hush_starfall', spawn: { x: 22, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Water in the channels comes and goes with the sluice levers (a prop's
  // `wet`).
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'sign', x: 13, y: 20, text: 'millrace_sign' },
    // The two sluices: `a` on the east bank, `b` on the west.
    { sprite: 'lever_sluice', x: 27, y: 12, text: 'millrace_lever_a', lever: 'a' },
    { sprite: 'lever_sluice', x: 8, y: 12, text: 'millrace_lever_b', lever: 'b' },
    { sprite: 'sluice_gate', x: 22, y: 10, text: 'sluice' },
    { sprite: 'sluice_gate', x: 16, y: 8, text: 'sluice' },
    // Little holes: one from the south bank into the sluice house, one from the
    // west bank up into the north-west.
    { sprite: 'kid_gap', x: 27, y: 18, text: 'kid_gap', gap: true },
    { sprite: 'kid_gap', x: 7, y: 9, text: 'kid_gap', gap: true },
    { sprite: 'chalk_rock_up', x: 2, y: 2, text: 'millrace_chalk' },
    // Starlight twinkling on the leaves at the foot of the false tree (`&`).
    { sprite: 'star_glint', x: 2, y: 5, text: 'millrace_glint', walkable: true, animation: 'star_glint', speed: 0.35 },
    { sprite: 'chest', x: 30, y: 1, text: 'millrace_chest', gives: 'kiln_stew', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 16, text: 'millrace_pouch', gold: 160, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'water_flow', x: 1, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 2, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 3, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 4, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 5, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 6, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 7, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 8, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 9, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 10, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 11, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 12, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 13, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 14, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 16, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 17, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 18, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 19, y: 18, text: 'millrace_water', wet: ['!a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 10, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 11, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 12, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 13, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 14, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 15, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 16, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 17, text: 'millrace_water', wet: ['!a'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 10, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 11, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 12, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 13, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 14, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 15, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 16, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 21, y: 17, text: 'millrace_water', wet: ['!b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 22, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 23, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 24, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 25, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 26, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 27, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 28, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 29, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 30, y: 9, text: 'millrace_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 1, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 2, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 3, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 4, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 5, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 6, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 7, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 8, text: 'millrace_water', wet: ['b'], animation: 'water_flow', speed: 0.15 },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', j: 'millrace_channel', N: 'bramble' },

  // A Puffcap in the damp by the south channel, and a Knotling on the east bank.
  npcs: [
    { enemy: 'puffcap', x: 8, y: 21, patrol: [6, 11] },
    { enemy: 'knotling', x: 25, y: 11, patrol: [23, 26] },
    { enemy: 'grist', x: 9, y: 5, patrol: [6, 13] },
  ],
};
