// THE OLD MILL: Hollin's water mill, its wheel still turning in what's
// left of the leat. The way through to the square is the mill gate, on two
// treadles in the bed of the leat: two logs have to come to rest on them. A
// log rolls along the dry leat until it hits water, and where the water
// stands depends on the two sluices: the first stone (lever `a`, in the
// yard) and the second (`b`, in the miller's sack store, where only Bramble
// can get in). Each log comes up into the leat at its own place, and they
// can't pass each other.
// Tile key (see src/overworld/tileset.js):
//   5  cottage wall (solid)
//   6  boarded cottage window (solid)
//   7  cottage roof (solid)
//   d  leaf litter
//   j  dry stone channel (sluice water can fill it)
//   L  old scarlet tree (walk or hide behind) (solid)
//   X  Hollin's cobbles
//   y  leaf path
//   Z  bramble hedge (solid)
export const HOLLIN_MILL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_mill',
  // The room's name, for the Room Editor.
  name: 'THE OLD MILL',
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
  gloom: 0.48,
  // Mist drifting through, 0 to 1.
  fog: 0.35,

  tiles: [
    'LLLLLLLLLLLLLLLLXXLLLLLLLLLLLLLL',
    'LdddddddddddddddyddddddddddddddL',
    'LdLdddddddddddddyddddddddddddLdL',
    'LdddddddddddddddyddddddddddddddL',
    'LdddddddddddddddyddddddddddddddL',
    'Ldddddddddddddddydd7777777dddddL',
    'LdddddLdddddddddydd7777777dddddL',
    'Ldddddddddddddddydd7777777dddddL',
    'Ldddddddddddddddydd5565565dddddL',
    'LZZZZZZZZZZZZZZZdZZZZZZZZZZZZZZL',
    'LZjjjjjjjjjjjjjjjjjjjjjjjjjjjjZL',
    'LZZdZdZZZZZZZdZdZZZZZZZZZZZZZZdL',
    'LddddddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddddddddddL',
    'LdddddLddddddddddddddddddddddddL',
    'LdddddddddddddddyddddddddddLdddL',
    'LdddddddddddddddydLddddddddddddL',
    'LdddddddddddddddydddddddZZZZZZdL',
    'LdddddddddddddddydddddddZddddZdL',
    'LddddddddLddddddyddddddddddddZdL',
    'LdddddddddddddddyddddLddZddddZdL',
    'LdddddddddddLdddydddddddZZZZZZdL',
    'LdddddddddddddddyddddddddddddddL',
    'LLLLLLLLLLLLLLLLXXLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 23, w: 2, h: 1, to: 'hollin_lane', spawn: { x: 15, y: 1 } },
    { x: 16, y: 0, w: 2, h: 1, to: 'hollin_well', spawn: { x: 15, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The leat's sluices and its water (a prop's `wet`), two logs, two treadles in
  // the leat, and the gate they hold.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'sign', x: 14, y: 17, text: 'mill_sign' },
    { sprite: 'mill_wheel', x: 26, y: 12, text: 'mill_wheel', animation: 'mill_wheel_turning', speed: 0.12 },
    // Two sluices: the leat stops at the first stone (`a`, here in the yard), or
    // at the second (`b`, in the mill's own yard, through the little hole).
    { sprite: 'lever_sluice', x: 9, y: 13, text: 'mill_lever_a', lever: 'a' },
    { sprite: 'lever_sluice', x: 27, y: 19, text: 'mill_lever_b', lever: 'b' },
    { sprite: 'kid_gap', x: 24, y: 19, text: 'kid_gap', gap: true },
    { sprite: 'water_flow', x: 12, y: 10, text: 'mill_water', wet: ['a'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 10, text: 'mill_water', wet: ['b'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'treadle', x: 11, y: 10, text: 'treadle', treadle: 'leat_west' },
    { sprite: 'treadle', x: 19, y: 10, text: 'treadle', treadle: 'leat_east' },
    { sprite: 'roll_log', x: 5, y: 16, text: 'roll_log', log: true },
    { sprite: 'roll_log', x: 15, y: 13, text: 'roll_log', log: true },
    { sprite: 'gate_narrow', x: 16, y: 9, text: 'mill_gate', opensWith: ['leat_west', 'leat_east'] },
    { sprite: 'rock_stump', x: 20, y: 21, text: 'rock_stump', rockReset: true },
    { sprite: 'chalk_rock_up', x: 18, y: 2, text: 'mill_chalk' },
    { sprite: 'chest', x: 1, y: 22, text: 'mill_chest', gives: 'kiln_stew', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 29, y: 1, text: 'mill_pouch', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', j: 'mill_leat', '5': 'hollin_wall', '6': 'hollin_window', '7': 'hollin_roof' },

  // A Hayward stands in the old mill yard, minding the sacks that were never
  // collected.
  npcs: [
    { enemy: 'hayward', x: 20, y: 15, patrol: [18, 23] },
    // Grist, who calls itself the Miller now, and a Hob still keeping the
    // miller's house.
    { enemy: 'grist', x: 6, y: 20, patrol: [2, 10] },
    { enemy: 'hob', x: 24, y: 3, patrol: [20, 28] },
  ],
};
