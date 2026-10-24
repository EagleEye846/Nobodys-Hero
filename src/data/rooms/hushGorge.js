// THE GORGE: the wood breaks off in a cliff, and the way on is down on the
// gorge floor. You rope down from the ring at the edge. Bramble won't go near
// a rope ("I'll go round") and squeezes down a crack in the cliff instead,
// but there's a rock wedged at the bottom of it that only you can shift, from
// below. Then the woodcutters' gate on the floor wants its lever pulled, and
// the lever's in a pocket of bramble only he fits into. And at the far west
// end, a hollow trunk with a raccoon's paw print scratched in it: chop it.
// (Rummage's Hollow, a secret shop, is behind it.)
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   g  plank bridge
//   L  old scarlet tree (walk or hide behind) (solid)
//   M  cliff face (solid)
//   m  cliff top (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
//   ~  brook (solid, until a log sinks into it)
export const HUSH_GORGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_gorge',
  // The room's name, for the Room Editor.
  name: 'THE GORGE',
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
  gloom: 0.2,
  // Mist drifting through, 0 to 1.
  fog: 0.2,
  // Bramble won't go on a rope here: rope off and he stays behind, and you're
  // split up (he has his own way round).
  ropeSplit: true,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddddddddddddddddddddddddddddddddL',
    'LdddddddLddddddddddLdddddddddddLdddL',
    'LddddLdddddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddLdddddddddddL',
    'LdLdddddddddddddLdddddddddyyyyyyyyyy',
    'Ldddddddddddddddddddddddddydddddddyy',
    'LmmmmmmmmmmmdmmmmmmmmmmmmmmmmmmmmmmL',
    'LMMMMMMMMMMMdMMMMMMMMMMMMMMMMMMMMMML',
    'LMMMMMMMMMMMdMMMMMMMMMMMMMMMMMMMMMML',
    'LMMMMMMMMMMMdMMMMMMMMMMMMMMMMMMMMMML',
    'LdddddZdddddddddddddddddddyddddddddL',
    'LdddddZdddddddddddddddddddyddddddLdL',
    'ydddddZdddLddddddddddddddLyddddddddL',
    'LdddddZdddddddddddddyyyyyyyddddddddL',
    'LdddddZdddddddddddddyddddddddddddddL',
    'LdLdddZ~~~~~~~~~~~~~gg~~~~~~~~~~~~~L',
    'LdddddZdddddddddddddyddddddddddddddL',
    'yyyyyydyyyyyyyyyyyyyyddddddddZZZZZZL',
    'yyddddZddddddddLdddddddddddddZdddddL',
    'LdddddZddddddddddddddddddddddddddddL',
    'LddLddZddLddddddddddddddLddddZdddddL',
    'LdddddZddddddddddddddddddddddZdddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 34, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 35, y: 5, w: 1, h: 2, to: 'hush_underroot', spawn: { x: 1, y: 11 } },
    { x: 0, y: 18, w: 1, h: 2, to: 'hush_sawpit', spawn: { x: 30, y: 9 } },
    { x: 0, y: 13, w: 1, h: 1, to: 'hush_rummage', spawn: { x: 14, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The ring to rope down by, Bramble's crack (and the rock at its foot), and
  // the gate and its lever.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'grapple_ring', x: 26, y: 6, grapple: true },
    { sprite: 'sign', x: 28, y: 5, text: 'gorge_sign' },
    { sprite: 'kid_gap', x: 12, y: 7, text: 'gorge_crack', gap: true },
    { sprite: 'push_rock', x: 12, y: 11, text: 'gorge_rock', rock: true },
    { sprite: 'gate_narrow', x: 6, y: 18, text: 'gorge_gate', opensWith: ['gorge_lever'], openText: 'gorge_gate_open' },
    { sprite: 'kid_gap', x: 29, y: 20, text: 'kid_gap', gap: true },
    { sprite: 'lever', x: 32, y: 20, text: 'gorge_lever', lever: 'gorge_lever' },
    { sprite: 'hollow_trunk', x: 1, y: 13, text: 'gorge_trunk', chop: 'open', openText: 'gorge_trunk_open' },
    { sprite: 'chest', x: 33, y: 1, text: 'gorge_chest', gives: 'charcoal_toffee', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 34, y: 21, text: 'gorge_pouch', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chalk_rock_down', x: 24, y: 6, text: 'gorge_chalk' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', M: 'gorge_cliff', m: 'gorge_cliff', '~': 'mist_brook' },

  // On the gorge floor: a Russet by the brook and a Burrhog in the west.
  npcs: [
    { enemy: 'russet', x: 16, y: 13, patrol: [14, 19], behaviour: 'patrol' },
    { enemy: 'burrhog', x: 13, y: 20, patrol: [9, 14] },
  ],
};
