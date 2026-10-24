// THE QUIET: no birds. Not one. The Hush is up in the canopy here, and
// its shadow goes round and round the wood below, stopping now and then to
// listen. Its loop crosses the way through again and again. Keep moving when
// it's away; when it comes over, get into a leaf pile and keep still. If it
// passes over you anywhere else, it sees you, and you're back at the start of
// the room. The scene as you come in (the_quiet) tells you how.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_QUIET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_quiet',
  // The room's name, for the Room Editor.
  name: 'THE QUIET',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // "Something in the Trees" (hushStalkTheme.js): the Hush is close.
  music: 'hushStalk',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.42,
  // Mist drifting through, 0 to 1.
  fog: 0.35,
  // The Hush's shadow (see src/overworld/hushwood.js): round the room in a loop
  // that crosses the way through four times, stopping to listen at three
  // corners.
  hush: { path: [[5, 9], [18, 4, 1.4], [31, 9], [29, 18, 1.2], [18, 18], [7, 19, 1.0]], speed: 36, radius: 30, start: 0.55 },

  tiles: [
    'LLLLLyyLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddyyddddddddddddddddddddddddddddL',
    'LddddydddLdddddddddddLdddddddddddddL',
    'LdddLydddddddddddddddddddddLdddddddL',
    'LddddyddddddddLddddddddddddddddddddL',
    'LddddyddddddddddddddddddddddddddLddL',
    'LddddyyyyyyyyyyyyyyyyyyyyddddddddddL',
    'LddddddddddddddddddLddddydZZZZZZZZZL',
    'LdddddddddddLdddddddddddyddddddddddL',
    'LddLddddddddddddddddddddLddddddddddL',
    'LddddddddddddZZZZZZZZZZdyddddddddddL',
    'LdddddddLdddddddddddddddydddddLddddL',
    'LddddddddddddddddddddddZZZZZZZZZZZZL',
    'LdddddddddddyyyyyLyyyyyyyddddddddddL',
    'LdddddLdddddyddddddddddddddddddddddL',
    'LdddddddddddyddddddddddddLdddddddddL',
    'LZZZZZZZZZZdyddddddddddddddddddddLdL',
    'LdddddddddddyddddddddddddddddddddddL',
    'LdddddddddLdyddddddddddddddLdddddddL',
    'LddLddddddddyddddddddLdddddddddddddL',
    'LdddddddddddyyyyyyyddddddddddddddddL',
    'LdddddddddddddddddyddddddddddLdddddL',
    'LdddddddddddddLdddyddddddddddddddddL',
    'LdddddLdddddddddddydddddddddddddLddL',
    'LdddddddddddddddddyddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLyyLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 18, y: 24 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 18, y: 25, w: 2, h: 1, to: 'hush_millrace', spawn: { x: 4, y: 1 } },
    { x: 5, y: 0, w: 2, h: 1, to: 'hush_clawed_bridge', spawn: { x: 30, y: 15 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 18, y: 22, w: 2, h: 1, scene: 'the_quiet' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Leaf piles to hide in while the Hush goes over (`hide`).
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'leaf_pile', x: 16, y: 22, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 12, y: 17, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 15, y: 14, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 21, y: 14, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 25, y: 10, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 20, y: 6, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 13, y: 7, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 8, y: 5, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 6, y: 3, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 29, y: 9, text: 'leaf_pile', hide: true },
    { sprite: 'leaf_pile', x: 9, y: 21, text: 'leaf_pile', hide: true },
    { sprite: 'chalk_rock_up', x: 4, y: 4, text: 'quiet_chalk' },
    { sprite: 'paw_print', x: 22, y: 17, text: 'paw_print' },
    { sprite: 'paw_print', x: 27, y: 14, text: 'paw_print' },
    { sprite: 'gold_pouch', x: 33, y: 2, text: 'quiet_pouch', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { L: 'quiet_tree', Z: 'bramble' },

  // No enemies: even the monsters have hidden.
  npcs: [],
};
