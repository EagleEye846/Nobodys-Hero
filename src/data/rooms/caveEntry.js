// THE ICE CAVES: inside the spire. Cold rock, stalactites to walk under,
// stalagmites to walk round, and a frozen pool. Ice crystals glow in the
// dark; without a candle, they're the light you have. A pack and a chest
// (Vigil Mail, the Hero's own armour, carried this far and left) lie along
// the way, and the passage climbs to the Singing Gallery.
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   v  stalactite (walk under it)                 x  ice crystals (they glow) (solid)
//   ^  stalagmite (solid)                         z  ice
export const CAVE_ENTRY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'cave_entry',
  // The room's name, for the Room Editor.
  name: 'THE ICE CAVES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'caves',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Underground: cave floor shows under anything standing here.
  cave: true,
  // How dark it is (0 to 1): the crystals, and your candle, light it.
  dark: 0.55,
  // Darkens the screen's edges, like the Ruins.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkttkkkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKttKKKKk',
    'kqqqqqvqqqqqKKKKKKKKKqqqqqqqqqqk',
    'kqqxqqqqq^qqKKKKKKKKKqqq^qqqqvqk',
    'kqqqqqqqqqqqKKKKKKKKKqqqqqqqqqqk',
    'kqqqqqvqqqqqqkkkkkkkkqqqqqqxqqqk',
    'kKKKKqqqqqqqqKKKKKKKKqqqqqqqqqqk',
    'kkkkkKqqqqqqqqqqqqqqqqqqzzzqqqqk',
    'kqqqqqqqqqqqqqqqqqvqqqqzzzzzqqqk',
    'kqqxqqqqq^qqqqqqqqqqqqqzzzzzqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqzzzqqqqk',
    'kqqqqqqqqkkkkkkkkkkqqqqqqqqqqqqk',
    'kqqqqqqqqKKKKKKKKKKqqqqqqqqqqqqk',
    'kqqqq^qqqKKKKKKKKKKqqqqqqqq^qqqk',
    'kqqqqqqqqqqqqqqqqqqqqqvqqqqqqqqk',
    'kqqqqqqqqqqxqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkkkkkkqqqqqqqqqqqqk',
    'kKKKKKKKKKKKKKKKKKKqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqtttqqqqqqqqqqqqqqqqqqqqqxqqqqk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 3, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 2, y: 21, w: 3, h: 1, to: 'vigil_hollow', spawn: { x: 36, y: 26 } },
    { x: 25, y: 1, w: 2, h: 2, to: 'cave_gallery', spawn: { x: 4, y: 23 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    { sprite: 'sign', x: 6, y: 20, text: 'cave_sign' },
    { sprite: 'savepoint', x: 28, y: 20, save: true },
    // Vigil Mail in a chest beyond the frozen pool.
    { sprite: 'chest', x: 29, y: 9, text: 'cave_chest', gives: 'vigil_mail', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'old_pack', x: 2, y: 15, text: 'cave_pack', gives: 'hot_cocoa' },
    { sprite: 'cairn', x: 16, y: 9, text: 'cave_cairn' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { K: 'cave_wall', v: 'cave_stalactite', '^': 'cave_stalagmite', x: 'cave_crystals', z: 'cave_pool' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
