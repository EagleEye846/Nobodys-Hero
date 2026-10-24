// HOLLIN LANE: the one street of Hollin, cottages either side, gardens
// behind them gone to bramble. The lane gate at the top end is shut and
// barred. Up on the rooftops, the Hush: its shadow goes up and down the lane,
// listening at the gate and at the bottom. Hide in the leaf piles in the
// doorways when it comes. The bar's on the far side of the gate; the lever
// that lifts it is in a back garden, and the only way into the gardens is
// the cat flaps in the cottages' back walls, which only Bramble fits. So he
// goes round the back while you keep your head down.
// Tile key (see src/overworld/tileset.js):
//   5  cottage wall (solid)
//   6  boarded cottage window (solid)
//   7  cottage roof (solid)
//   8  shut cottage door (solid)
//   d  leaf litter
//   f  fence (solid)
//   L  old scarlet tree (walk or hide behind) (solid)
//   X  Hollin's cobbles
export const HOLLIN_LANE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_lane',
  // The room's name, for the Room Editor.
  name: 'HOLLIN LANE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hollin',
  // "Something in the Trees" (hushStalkTheme.js): the Hush is close.
  music: 'hushStalk',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.5,
  // Mist drifting through, 0 to 1.
  fog: 0.4,
  // The Hush on the rooftops (see src/overworld/hushwood.js): up and down the
  // lane, stopping to listen at each end.
  // It fills the lane from fence to fence (`across`): there's no edge to slip
  // along. Only the leaf piles in the doorways keep you hidden.
  hush: { path: [[16, 22, 1.5], [16, 5, 1.5]], speed: 40, radius: 30, across: 72, start: 0.25 },

  tiles: [
    'LLLLLLLLLLLLLLLXXLLLLLLLLLLLLLLLLL',
    'LLddddddddddXXXXXXXXddddddddddddLL',
    'LddddddddddffffddffffddddddddddddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld56558565dfXXXXXXXXfd565585565ddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'LdddddLddddfXXXXXXXXfddddddddddddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld55658565dfXXXXXXXXfd565855655ddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'LdddddddddddXXXXXXXXfddddddLdddddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld77777777dfXXXXXXXXfd777777777ddL',
    'Ld56585655dfXXXXXXXXfd556558565ddL',
    'LddddddddddfXXXXXXXXdddddddddddddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'LddddddddddfXXXXXXXXfddddddddddddL',
    'LLdddddddddfXXXXXXXXfddddddddddddL',
    'LddddddddddfXXXXXXXXfdddddddddddLL',
    'LLLLLLLLLLLLLLLLXXLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 26 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 27, w: 2, h: 1, to: 'hollin_gate', spawn: { x: 19, y: 1 } },
    { x: 15, y: 0, w: 2, h: 1, to: 'hollin_mill', spawn: { x: 16, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The lane gate and its lever (round the back gardens), the cat flaps only
  // Bramble fits, and leaf piles to hide in.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'gate_narrow', x: 15, y: 2, text: 'lane_gate', opensWith: ['lane_bar'], openText: 'lane_gate_open' },
    { sprite: 'gate_narrow', x: 16, y: 2, text: 'lane_gate', opensWith: ['lane_bar'] },
    { sprite: 'cat_flap', x: 20, y: 21, text: 'lane_flap', gap: true },
    { sprite: 'cat_flap', x: 11, y: 15, text: 'lane_flap', gap: true },
    { sprite: 'lever', x: 31, y: 8, text: 'lane_lever', lever: 'lane_bar' },
    { sprite: 'chest', x: 1, y: 9, text: 'lane_chest', gives: 'charcoal_toffee', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 32, y: 15, text: 'lane_pouch', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chalk_rock_up', x: 19, y: 25, text: 'lane_chalk' },
    { sprite: 'leaf_pile', x: 13, y: 23, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 18, y: 19, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 13, y: 15, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 18, y: 10, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 13, y: 6, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 18, y: 4, text: 'leaf_pile', hide: true },
  ],
  tileTexts: { X: 'lane_cobbles', f: 'hollin_palisade', '6': 'hollin_window', '5': 'hollin_wall', '7': 'hollin_roof', '8': 'hollin_door', L: 'scarlet_tree' },

  // No enemies: the lane belongs to the Hush now.
  npcs: [],
};
