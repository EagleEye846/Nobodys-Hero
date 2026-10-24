// THE STARFALL GLADE: through a thin bramble at the Millrace (a secret), a
// round glade where nothing grows taller than your knee: something came down
// out of the sky here, long ago, and left a scorched hollow and a stone that
// still glows. There's a sword stuck in the stone, of pale star-metal (the
// Fallen Star), and a purse somebody dropped running away from it.
//
// It's the Hushwood's best-hidden secret: the way in is a false tree on the
// Millrace's west edge (`&` there), and the stone is ringed by brambles with
// the old woodcutters' gate barred from inside. Bramble crawls in through the
// hole on the east and pulls the bar; then you can walk in and draw it (the
// fallen_star_drawn scene).
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   N  thin bramble: walk straight through it (a secret)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_STARFALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_starfall',
  // The room's name, for the Room Editor.
  name: 'THE STARFALL GLADE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hushwood',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.1,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddddddddddddddddddddL',
    'LddddddddLddddddLddddddL',
    'LdddLddddddddddddddddddL',
    'LddddddZZZZZZZZZZdddLddL',
    'LddddddZyyyyyyyyZddddddL',
    'LddddddZyyyyyyyyZddddddL',
    'LddddddZyyyyyyyyZddddddL',
    'LddddddZyyyyyyyydddddddN',
    'LddddddZyyyyyyyyZddddddL',
    'LddddddZyyyyyyyyZdddLddL',
    'LddLdddZyyyyyyyyZddddddL',
    'LddddddZZZZyZZZZZddddddL',
    'LdddddddLddddddddLdddddL',
    'LddddddddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 21, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 23, y: 8, w: 1, h: 1, to: 'hush_millrace', spawn: { x: 1, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'star_stone_sword', x: 11, y: 8, text: 'starfall_sword', gives: 'fallen_star', drawScene: 'fallen_star_drawn', taken: { sprite: 'star_stone', text: 'starfall_stone' }, light: 40 },
    // The brambles have grown up all round the stone in fifty years. The old
    // woodcutters' gate in them is barred from inside, and the bar's lever is
    // in there too: only someone small gets in, through the hole on the east.
    { sprite: 'kid_gap', x: 16, y: 8, text: 'kid_gap', gap: true },
    { sprite: 'lever', x: 14, y: 6, text: 'starfall_lever', lever: 'star' },
    { sprite: 'gate_narrow', x: 11, y: 12, text: 'starfall_gate', opensWith: ['star'], openText: 'starfall_gate_open' },
    { sprite: 'gold_pouch', x: 2, y: 2, text: 'starfall_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 19, y: 7, text: 'starfall_sign' },
  ],
  tileTexts: { L: 'scarlet_tree', N: 'bramble', Z: 'starfall_brambles' },

  // Nothing comes here. The animals know.
  npcs: [],
};
