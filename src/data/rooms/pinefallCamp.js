// WOODCUTTERS' CAMP: the first people below the clouds live here: tents
// round a fire, a long table, and a stall with a hand-painted sign, the
// camp's own little sale (in the spirit of the Scarlet Forest's bake sale).
// A save point. The woodcutters are out; the Keeper is minding their fire.
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   d  leaf litter
//   f  fence (solid)
//   y  leaf path
export const PINEFALL_CAMP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_camp',
  // The room's name, for the Room Editor.
  name: 'WOODCUTTERS\' CAMP',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'pinefall',
  // The song that plays here: none at first, only the forest; once you've
  // met the Keeper at the woodcutters' fire, his theme, while he minds it.
  music: null,
  musicAfter: { scene: 'keeper_at_the_fire', song: 'keeper' },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'forest',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LdddddddLdddddddddddddddLddddddL',
    'LdLddddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddddddddLdL',
    'LddddddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddddddddddL',
    'LdLddddddddddddddddddddddddddddL',
    'LdddddddddddyyyyyyyydddddddddddL',
    'ydddddddddddyyyyyyyydddddddddddy',
    'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
    'LdddddddddddyyyyyyyydddddddddddL',
    'LdddddddddddyyyyyyyydddddddddddL',
    'LdddddddddddyyyyyyyydddddddddddL',
    'LddddddddddddddddddddddddddddLdL',
    'LddddddddLddddddddddddLddddddddL',
    'LLdddddddddddddddddddddddddddddL',
    'LddffffffffffffffffffffffffffdLL',
    'LddddddddddddddddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'pinefall_brook', spawn: { x: 28, y: 14 } },
    { x: 31, y: 9, w: 1, h: 2, to: 'pinefall_maze', spawn: { x: 1, y: 11 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [{ x: 3, y: 9, w: 1, h: 2, scene: 'keeper_at_the_fire' }],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'campfire', x: 15, y: 11, text: 'camp_fire' },
    { sprite: 'keeper', x: 16, y: 12, npc: 'old_keeper', after: 'keeper_at_the_fire' },
    { sprite: 'bench', x: 12, y: 12, text: 'camp_bench' },
    { sprite: 'bench', x: 18, y: 12, text: 'camp_bench' },
    { sprite: 'tent', x: 4, y: 4, text: 'camp_tent' },
    { sprite: 'tent', x: 10, y: 4, text: 'camp_tent' },
    { sprite: 'long_table', x: 21, y: 5, text: 'camp_table' },
    { sprite: 'counter', x: 25, y: 12, text: 'camp_stall' },
    { sprite: 'sign', x: 24, y: 12, text: 'camp_stall_sign' },
    { sprite: 'crates', x: 27, y: 12, text: 'camp_crates' },
    { sprite: 'barrel', x: 27, y: 6, text: 'camp_barrel' },
    { sprite: 'notice_board', x: 14, y: 6, text: 'camp_notices' },
    { sprite: 'savepoint', x: 7, y: 11, save: true },
  ],
  tileTexts: { L: 'scarlet_tree', f: 'camp_fence' },

  // No enemies in the Pinefall yet.
  npcs: [],
};
