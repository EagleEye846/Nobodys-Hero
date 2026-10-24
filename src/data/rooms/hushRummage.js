// RUMMAGE'S HOLLOW: behind the hollow trunk in the Gorge (a secret: chop
// it open), a burrow dug in under the roots and stuffed with everything that
// ever fell off the mountain. Rummage, a raccoon in a herald's coat three
// sizes too big, sells the best of it: the best weapons in the Hushwood, for
// you and for Bramble, and a skill point.
// Tile key (see src/overworld/tileset.js):
//   K  cave wall (solid)
//   k  cave rock (solid)
//   q  cave floor
export const HUSH_RUMMAGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_rummage',
  // The room's name, for the Room Editor.
  name: 'RUMMAGE\'S HOLLOW',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // "Everything Falls Somewhere" (rummageTheme.js): a junk shop that tiptoes.
  music: 'rummage',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKk',
    'kqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqk',
    'qqqqqqqqqqqqqqqq',
    'kqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 9, w: 1, h: 1, to: 'hush_gorge', spawn: { x: 1, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'rummage_stand', x: 7, y: 5, shop: 'rummage' },
    { sprite: 'junk_pile', x: 2, y: 3, text: 'rummage_junk' },
    { sprite: 'junk_pile_2', x: 11, y: 3, text: 'rummage_junk_2' },
    { sprite: 'lantern_string', x: 5, y: 2, text: 'rummage_lanterns', light: 50 },
    { sprite: 'lantern_string', x: 9, y: 2, text: 'rummage_lanterns', light: 50 },
    { sprite: 'savepoint', x: 3, y: 9, save: true },
    { sprite: 'crates', x: 12, y: 7, text: 'rummage_crates' },
    { sprite: 'barrel', x: 2, y: 6, text: 'rummage_barrel' },
  ],
  tileTexts: { K: 'rummage_wall', k: 'rummage_wall' },

  // Nobody but Rummage.
  npcs: [],
};
