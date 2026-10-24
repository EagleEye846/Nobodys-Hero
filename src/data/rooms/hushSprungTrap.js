// THE SPRUNG TRAP: where the woodcutters tried to catch the Hush. A great
// cage of stakes, smashed outward. Axes left in the ground. Ma's pack. It
// went wrong, and nobody's here (the_sprung_trap); then Bramble finds Ma's
// notch, fresh, past the trap: they went on. Their trap pen still works: a
// pen of bramble split by a gate on a treadle (Bramble gets in by the little
// hole and holds it), with two rocks on one side and two plates on the other,
// and the way out barred till both are down. The plate nearer the gate
// blocks the way to the other one, so mind which rock goes first.
// Tile key (see src/overworld/tileset.js):
//   b  stump (jump up onto it)
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_SPRUNG_TRAP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_sprung_trap',
  // The room's name, for the Room Editor.
  name: 'THE SPRUNG TRAP',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.32,

  tiles: [
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLL',
    'LddddddddddddddyyyyydddddddddL',
    'LddddddddddddddddddydddddddLdL',
    'LddLdddddddddddddddydddddddddL',
    'LddddddddddddddddddbdddddddddL',
    'LZZZZZZZZZZZZZZZZZZdZZZZZZZZZL',
    'LdddddZddddddddZddddddddZddddL',
    'LdddddZdZddddddZddddddddZddddL',
    'LdddddZddddddddZddddddZdZddddL',
    'LdddddZddddddddZddddddddZddddL',
    'LdLdddZdddddddddddddddddZddddL',
    'LdddddZddddddddZddddZdddZddddL',
    'LdddddZddZdddddZddddddddZddLdL',
    'LdddddZddddddZdZdZddddddZddddL',
    'LdddddZddddddddZddddddddZddddL',
    'LdddddZZZZbZZZZZZZZZdZZZZddddL',
    'LdddddddddyddddddddddddddddddL',
    'LdddddddddyddddddddddddddddddL',
    'LdddddddddyyyyyddddddddddddddL',
    'LddLddddddddddyddddLdddddddddL',
    'LdddddddddddddydddddddddddLddL',
    'LdddddddddddLdyddddddddddddddL',
    'LdddddddddddddyddddddddddddddL',
    'LLLLLLLLLLLLLLyyLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 14, y: 23, w: 2, h: 1, to: 'hush_notched', spawn: { x: 15, y: 1 } },
    { x: 15, y: 0, w: 2, h: 1, to: 'hush_windfall', spawn: { x: 15, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 14, y: 20, w: 2, h: 1, scene: 'the_sprung_trap' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The pen: two rocks, two plates, a treadle gate in the middle (Bramble's to
  // hold), the way out north.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'gate_narrow', x: 15, y: 10, text: 'trap_inner_gate', opensWith: ['trap_treadle'] },
    { sprite: 'treadle', x: 21, y: 7, text: 'treadle', treadle: 'trap_treadle' },
    { sprite: 'kid_gap', x: 20, y: 15, text: 'kid_gap', gap: true },
    { sprite: 'push_rock', x: 11, y: 10, text: 'push_rock', rock: true },
    { sprite: 'push_rock', x: 12, y: 8, text: 'push_rock', rock: true },
    { sprite: 'stone_button', x: 18, y: 10, text: 'trap_plate', button: 'plate_west' },
    { sprite: 'stone_button', x: 22, y: 12, text: 'trap_plate', button: 'plate_east' },
    { sprite: 'gate_narrow', x: 19, y: 5, text: 'trap_gate', opensWith: ['plate_west', 'plate_east'], openText: 'trap_gate_open' },
    { sprite: 'rock_stump', x: 8, y: 18, text: 'rock_stump', rockReset: true },
    // What the woodcutters left behind.
    { sprite: 'trap_cage_broken', x: 3, y: 6, text: 'trap_cage' },
    { sprite: 'axe_in_ground', x: 22, y: 19, text: 'trap_axe', gives: 'mas_felling_axe', taken: { gone: true } },
    { sprite: 'old_pack', x: 4, y: 14, text: 'trap_pack', gives: 'mas_scarf', taken: { text: 'trap_pack_empty' } },
    { sprite: 'axe_in_ground', x: 26, y: 7, text: 'trap_axes' },
    { sprite: 'notched_post', x: 27, y: 4, text: 'trap_notch' },
    { sprite: 'paw_print', x: 6, y: 17, text: 'paw_print' },
    { sprite: 'paw_print', x: 4, y: 9, text: 'paw_print' },
    { sprite: 'paw_print', x: 2, y: 13, text: 'paw_print' },
    { sprite: 'gold_pouch', x: 28, y: 22, text: 'trap_pouch', gold: 140, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'trap_stakes', b: 'pen_stump' },

  // A pair of Russets sniffing round the wreck.
  npcs: [
    { enemy: 'russet', x: 2, y: 17, patrol: [2, 2], behaviour: 'ambush' },
    { enemy: 'russet', x: 27, y: 16, patrol: [26, 28] },
  ],
};
