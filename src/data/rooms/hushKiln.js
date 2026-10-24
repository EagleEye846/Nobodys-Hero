// CINDER'S KILN: a clearing where the trees have been cut back for a
// charcoal kiln, a smoking earth mound with an iron door, and the camp of the
// one person who lives this deep in the wood: Nan Cinder, the charcoal
// burner, who knows Bramble far too well. A fire, a cot under an awning to
// sleep in, a save point, and her stall of baked things and candles. Her
// scene plays as you come in (cinder_at_the_kiln). No enemies: they keep away
// from the smoke.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
export const HUSH_KILN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_kiln',
  // The room's name, for the Room Editor.
  name: 'CINDER\'S KILN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.05,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddddddddddddddddddddddddddL',
    'LdddddddLdddddddddddLddddddddL',
    'LddLddddddddLddddddddddddLdddL',
    'LddddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddddddddL',
    'LddddddddddddyyyyyyyyydddddddL',
    'LddddddddddddyyyyyyyyydddddddL',
    'LddddddddddddyyyyyyyyydddddddL',
    'yyyyyyyyyyyyyyyyyyyyyydddddLdL',
    'yydddddddddddyyyyyyyyydddddddL',
    'LddddddddddddyyyyyyyyydddddddL',
    'LddddddddddddyyyyyyyyydddddddL',
    'LddddddddddddyyyyyyyyydddddddL',
    'LddddddddddddddydddddddddddLdL',
    'LdLddddddddddddydddddddddddddL',
    'LddddddddddddddyddddddddLddddL',
    'LdddddLddddddddydddddddddddddL',
    'LddddddddddddddyyddddddddddddL',
    'LLLLLLLLLLLLLLLyyLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 15, y: 18 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 19, w: 2, h: 1, to: 'hush_treadles', spawn: { x: 4, y: 1 } },
    { x: 0, y: 9, w: 1, h: 2, to: 'hush_underroot', spawn: { x: 30, y: 11 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 15, y: 15, w: 2, h: 1, scene: 'cinder_at_the_kiln' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'kiln', x: 18, y: 7, text: 'kiln_kiln' },
    { sprite: 'charcoal_heap', x: 21, y: 8, text: 'kiln_charcoal' },
    { sprite: 'charcoal_heap', x: 22, y: 10, text: 'kiln_charcoal' },
    { sprite: 'soot_kettle', x: 15, y: 10, text: 'kiln_kettle' },
    { sprite: 'campfire', x: 16, y: 10, text: 'kiln_fire' },
    { sprite: 'cinder', x: 17, y: 11, shop: 'cinder_stall', after: 'cinder_at_the_kiln' },
    { sprite: 'tent', x: 9, y: 5, text: 'kiln_awning' },
    { sprite: 'bed', x: 9, y: 7, text: 'kiln_cot', rest: true, dream: 'kiln_dream' },
    { sprite: 'savepoint', x: 12, y: 12, save: true },
    { sprite: 'barrel', x: 23, y: 12, text: 'kiln_barrel' },
    { sprite: 'chalk_tree', x: 4, y: 8, text: 'kiln_chalk' },
    { sprite: 'crates', x: 22, y: 5, text: 'kiln_crates' },
  ],
  tileTexts: { L: 'scarlet_tree' },

  // No enemies: they keep well clear of Nan Cinder's smoke.
  npcs: [],
};
