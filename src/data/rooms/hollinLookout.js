// THE LOOKOUT: up the old lookout tree at Hollin Gate (a secret), a
// platform of boards with a rail round it, where the woodcutters kept watch
// over the wood. Nobody's been up in fifty years. A chest with a lookout's
// oilskin, a purse, Ma's father's old axe, and the view: the whole Hushwood,
// the mist beyond it, and Hollin's square, and its well.
// Tile key (see src/overworld/tileset.js):
//   f  fence (solid)
//   L  old scarlet tree (walk or hide behind) (solid)
//   o  wooden floor
export const HOLLIN_LOOKOUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_lookout',
  // The room's name, for the Room Editor.
  name: 'THE LOOKOUT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hollin',
  // "Hush, Little Hollin" (hollinTheme.js): the empty village's lullaby.
  music: 'hollin',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hushwood',

  tiles: [
    'LLLLLLLLLLLLLL',
    'LffffffffffffL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LfoooooooooofL',
    'LLLLLLLoLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 11, w: 1, h: 1, to: 'hollin_gate', spawn: { x: 29, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'chest', x: 3, y: 3, text: 'lookout_chest', gives: 'lookouts_oilskin', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'chest', x: 10, y: 3, text: 'lookout_axe', gives: 'heartwood_axe', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 10, y: 8, text: 'lookout_pouch', gold: 250, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'telescope', x: 6, y: 2, text: 'lookout_telescope' },
    { sprite: 'bench', x: 4, y: 6, text: 'lookout_bench' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 12, y: 2, text: 'lookout_view' },
    { x: 12, y: 3, text: 'lookout_view' },
    { x: 12, y: 4, text: 'lookout_view' },
    { x: 12, y: 5, text: 'lookout_view' },
    { x: 12, y: 6, text: 'lookout_view' },
    { x: 12, y: 7, text: 'lookout_view' },
    { x: 12, y: 8, text: 'lookout_view' },
    { x: 12, y: 9, text: 'lookout_view' },
    { x: 12, y: 10, text: 'lookout_view' },
    { x: 1, y: 2, text: 'lookout_view_west' },
    { x: 1, y: 3, text: 'lookout_view_west' },
    { x: 1, y: 4, text: 'lookout_view_west' },
    { x: 1, y: 5, text: 'lookout_view_west' },
    { x: 1, y: 6, text: 'lookout_view_west' },
    { x: 1, y: 7, text: 'lookout_view_west' },
    { x: 1, y: 8, text: 'lookout_view_west' },
    { x: 1, y: 9, text: 'lookout_view_west' },
    { x: 1, y: 10, text: 'lookout_view_west' },
  ],
  tileTexts: { f: 'lookout_rail', L: 'lookout_branches' },

  // Nobody up here.
  npcs: [],
};
