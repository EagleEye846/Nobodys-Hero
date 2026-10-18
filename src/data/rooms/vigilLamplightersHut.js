// THE LAMPLIGHTER'S HUT: one cold room halfway to the sky. Her stove, her
// cot, her ladder, a tin of lamp oil, and on the wall, in chalk, a lamp for
// every lamp she lit on the way up. Ves sees it (vesInTheHut.js). A save
// crystal, and a cot to rest in.
// Tile key (see src/overworld/tileset.js):
//   a  log cabin wall (solid)                     D  doorway (walk through it; see `doors`)
//   #  wall top (solid)                           o  wooden floorboards
export const VIGIL_LAMPLIGHTERS_HUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_lamplighters_hut',
  // The room's name, for the Room Editor.
  name: 'THE LAMPLIGHTER\'S HUT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'ves',
  // Indoors: darkens the screen's edges.
  indoors: true,
  // Lit only by what's lit in it (see src/overworld/lamplight.js): here, just the
  // save crystal. How dark it is between lights, by day and at midnight.
  lamplight: { shade: 0.42, nightShade: 0.16 },

  tiles: [
    '############',
    '#aaaaaaaaaa#',
    '#aaaaaaaaaa#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#####DD#####',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 5, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 5, y: 8, w: 2, h: 1, to: 'vigil_lamplighters_ledge', spawn: { x: 6, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 4, y: 6, w: 4, h: 2, scene: 'ves_in_the_hut' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'fireplace_cold', x: 1, y: 2, text: 'hut_stove' },
    { sprite: 'chalk_tally', x: 5, y: 2, text: 'hut_chalk', notice: true },
    { sprite: 'lamp_ladder', x: 8, y: 2, text: 'hut_ladder' },
    // A cot: sleep in it to restore your HP. The first night, you dream (hutDream.js).
    { sprite: 'bed', x: 9, y: 4, text: 'hut_cot', rest: true, dream: 'hut_dream' },
    { sprite: 'oil_can', x: 4, y: 3, text: 'hut_oil' },
    { sprite: 'crates', x: 1, y: 6, text: 'hut_crates' },
    { sprite: 'savepoint', x: 9, y: 7, save: true },
    // Ves, sitting up by the door to think, from when she cries over the tally
    // (vesInTheHut.js) until you've slept (hutDream.js).
    { sprite: 'vesper_sit', x: 3, y: 7, text: 'hut_ves_thinking', animation: 'ves_sit', speed: 1.2, member: 'vesper', after: 'ves_in_the_hut', until: 'hut_dream' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 10, y: 2, text: 'hut_hook' },
    { x: 3, y: 2, text: 'hut_window' },
  ],
  tileTexts: { a: 'hut_wall', o: 'hut_floor' },

  // No enemies here: the mountain itself is the challenge.
  npcs: [],
};
