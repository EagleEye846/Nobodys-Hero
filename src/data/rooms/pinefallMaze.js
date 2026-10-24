// THE TURNING WOOD: a maze of bramble where every way looks like every
// other, and the odd scarlet tree is the only landmark. Its farthest dead end
// hides an old pack.
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   y  leaf path
export const PINEFALL_MAZE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_maze',
  // The room's name, for the Room Editor.
  name: 'THE TURNING WOOD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'pinefall',
  // The song that plays here: none at first, only the forest; once you've
  // met the Keeper at the woodcutters' fire, the Pinefall's waltz.
  music: null,
  musicAfter: { scene: 'keeper_at_the_fire', song: 'pinefall' },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'forest',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LyyyZyyyyyyyyyyyyyyyyyyyyyyyyyyyyyL',
    'LZZyZZZZZZZZZyZyZZLZZZZZZZZyZyZyZZL',
    'LyZyyyZyyyyyyyZyyyZyyyyyyyZyZyZyyyL',
    'LyZZLyZyZZZZZZZyZZZyZZZyZZZyZyZZZyL',
    'LyyyZyyyZyyyZyyyyyyyZyZyyyyyZyZyyyL',
    'LyZyZZZZZyZZZyZZLZZZZyZZZZZZZyZyZyL',
    'LyZyyyyyyyZyyyZyyyyyyyZyyyZyyyZyZyL',
    'LyZZZZZyZyZyZZZZZZZyZyZyZyZyLZZyZyL',
    'LyyyyyyyZyZyZyyyyyZyZyyyZyyyZyyyZyL',
    'LyZyZZZZZyLyZZZyZyZZZZZZZyyZZyZZZyL',
    'yyZyyyZyyyZyyyyyZyyyyyyyZyyyZyyyZyy',
    'LyZZZyZyZZZZZZZZZZZZZZZyZZZZZZZyZZL',
    'LyZyyyZyyyyyyyZyyyyyyyZyyyyyyyZyyyL',
    'LyZyZZZZZZZZZyZyZyZZZZLZZZZZZyZZZyL',
    'LyZyZyyyyyyyyyZyZyZyyyyyyyyyZyyyyyL',
    'LZZyZZZZZyZZZZZyZZZyZZZZZZZyZZZZZyL',
    'LyyyZyyyZyZyyyyyZyyyyyyyZyyyyyZyyyL',
    'LyZZZyZyLyZyZyZZZyZZZZZZZyZyZZZyZZL',
    'LyyyyyZyZyyyZyZyyyZyZyyyyyZyZyyyZyL',
    'LyZZZZZyZZZZZZZyZZZyZyZZZZLZZyyZZyL',
    'LyyyyyZyyyyyyyyyyyyyZyyyyyyyyyyyyyL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 11, w: 1, h: 1, to: 'pinefall_rolling', spawn: { x: 22, y: 4 } },
    { x: 34, y: 11, w: 1, h: 1, to: 'pinefall_tatters', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'old_pack', x: 21, y: 13, text: 'maze_pack', gives: 'climbers_ration', taken: { text: 'maze_pack_empty' } },
  ],
  tileTexts: { L: 'maze_tree', Z: 'bramble' },

  // Two Russets hide behind the maze's landmark trees and a Sapling stands
  // in for one. All three are well away from the far dead end (the old pack
  // at 21,13), where Bramble's join scene will play.
  npcs: [
    { enemy: 'russet', x: 5, y: 5, patrol: [5, 5], behaviour: 'ambush' },
    { enemy: 'sapling', x: 17, y: 7, patrol: [17, 17], behaviour: 'disguise' },
    { enemy: 'russet', x: 27, y: 9, patrol: [27, 27], behaviour: 'ambush' },
  ],
};
