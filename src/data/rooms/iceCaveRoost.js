// THE ROOST: at the end of the black tunnel from the Hall of Glass, a high
// round chamber of ice where the cave's bats roost, hundreds of them, and
// the great bat that rules them hangs from the roof. Walking in sets them
// off (batsInTheRoost.js): Ves's worst fear, all at once. A way on climbs
// out of the top, plugged with ice until the Roost Mother is gone; then it
// leads up the Ice Chimney (vigilIceChimney.js).
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   v  stalactite (walk under it)                 ^  stalagmite (solid)
//   x  ice crystals (they glow) (solid)           D  doorway (walk through it; see `doors`)
export const ICE_CAVE_ROOST = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ice_cave_roost',
  // The room's name, for the Room Editor.
  name: 'THE ROOST',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'caves',
  // How dark it is (0 to 1): only the ice crystals, and your own light, light it.
  dark: 0.6,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Underground: cave floor shows under anything standing here.
  cave: true,
  // Darkens the screen's edges, like the Ruins.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkttkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKttKKKKKKKKKKKKk',
    'kqqqvqqqvqqqqqqqqqvqqqvqqqqk',
    'kqxqqqqqqqqqqqqqqqqqqqqqqxqk',
    'kqqqqvqqqqqqqqqqqqqqqqvqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kq^qqqqqqqqqqqqqqqqqqqqqq^qk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqxqqqqqqqqqqqqqqqqxqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqq^qqqqqqqqqqqqqqqqqqq^qqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqxqqqqqqqqqqqqqqqqqqqqxqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkDDkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 13, y: 18 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 13, y: 19, w: 2, h: 1, to: 'ice_cave_hall', spawn: { x: 32, y: 4 } },
    // Up the roof tunnel, once it's unplugged.
    { x: 13, y: 1, w: 2, h: 1, to: 'vigil_ice_chimney', spawn: { x: 11, y: 25 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // In among the bats: Ves's worst fear, and the great bat (batsInTheRoost.js).
    { x: 9, y: 15, w: 10, h: 3, scene: 'bats_in_the_roost' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/ice_caves.txt',
  props: [
    // The plug of ice in the roof tunnel, until the Roost Mother is gone.
    { sprite: 'ice_plug', x: 13, y: 3, text: 'roost_onward', until: 'bat_defeated' },
    { sprite: 'ice_plug', x: 14, y: 3, text: 'roost_onward', until: 'bat_defeated' },
    // Little bats hanging from the stalactites, asleep (and watching).
    { sprite: 'small_bat', x: 4, y: 3, animation: 'small_bat_hang', speed: 0.7, text: 'roost_bat', walkable: true },
    { sprite: 'small_bat', x: 8, y: 3, animation: 'small_bat_hang', speed: 0.9, text: 'roost_bat', walkable: true },
    { sprite: 'small_bat', x: 18, y: 3, animation: 'small_bat_hang', speed: 0.8, text: 'roost_bat', walkable: true },
    { sprite: 'small_bat', x: 22, y: 5, animation: 'small_bat_hang', speed: 0.75, text: 'roost_bat', walkable: true },
    // After the fight: the Roost Mother, frozen where she fell, and her little
    // ones perched close against her, where bat_defeated leaves them.
    { sprite: 'small_bat', x: 13, y: 11, animation: 'great_bat_death_remains', speed: 0.8, text: 'roost_remains', light: 26, after: 'bat_defeated' },
    { sprite: 'small_bat', x: 12, y: 12, animation: 'small_bat_perch', speed: 0.5, text: 'roost_pup', walkable: true, after: 'bat_defeated' },
    { sprite: 'small_bat', x: 14, y: 12, animation: 'small_bat_perch', speed: 0.6, text: 'roost_pup', walkable: true, after: 'bat_defeated' },
    { sprite: 'small_bat', x: 15, y: 12, animation: 'small_bat_perch', speed: 0.55, text: 'roost_pup', walkable: true, after: 'bat_defeated' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { K: 'ice_wall', v: 'ice_stalactite', '^': 'ice_stalagmite', x: 'ice_crystals' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  npcs: [],
};
