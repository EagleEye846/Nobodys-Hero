// THE OUTFALL: where the old conduit broke, long ago, and all the mountain's
// water goes over its broken lip into the mist. Grey daylight, the first since
// Hollin. Out there in the fog, far off, lights on poles. Ves's last arrow is
// drawn low on the last pillar. Old steps go down beside the falls, into the
// Lantern Marsh.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
//   u  old steps going down (to the Lantern Marsh)
//   ~  deep black water (solid, until a cask sinks into it)
export const DRAINS_OUTFALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_outfall',
  // The room's name, for the Room Editor.
  name: 'THE OUTFALL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // Only the water going over. (No song of its own yet.)
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.55,

  tiles: [
    '##########################',
    '#WWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.........I......J~~~~~~~~',
    '#.................~~~~~~~~',
    '#.................~~~~~~~~',
    '#.................~~~~~~~~',
    '#.................~~~~~~~~',
    '..................~~~~~~~~',
    '..................~~~~~~~~',
    '#.................~~~~~~~~',
    '#.................~~~~~~~~',
    '#.................~~~~~~~~',
    '#.........I.....JJ~~~~~~~~',
    '#...............JJ~~~~~~~~',
    '#############uu###~~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'drains_stair', spawn: { x: 24, y: 2 } },
    { x: 13, y: 14, w: 2, h: 1, to: 'marsh_falls_foot', spawn: { x: 3, y: 2 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 12, y: 2, w: 1, h: 11, scene: 'the_outfall' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'chalk_rock_right', x: 16, y: 6, text: 'outfall_chalk' },
    { sprite: 'light_shaft', x: 14, y: 5, text: 'outfall_light', walkable: true },
    { sprite: 'light_shaft', x: 15, y: 10, text: 'outfall_light', walkable: true },
    { sprite: 'sign', x: 15, y: 8, text: 'outfall_end' },
    { sprite: 'gold_pouch', x: 3, y: 2, text: 'outfall_purse', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'rubble_heap', x: 13, y: 12, text: 'rubble' },
    { sprite: 'rubble_heap', x: 6, y: 2, text: 'rubble' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 18, y: 3, text: 'outfall_mist' },
    { x: 18, y: 4, text: 'outfall_mist' },
    { x: 18, y: 5, text: 'outfall_mist' },
    { x: 18, y: 6, text: 'outfall_mist' },
    { x: 18, y: 7, text: 'outfall_mist' },
    { x: 18, y: 8, text: 'outfall_mist' },
    { x: 18, y: 9, text: 'outfall_mist' },
    { x: 18, y: 10, text: 'outfall_mist' },
    { x: 18, y: 11, text: 'outfall_mist' },
  ],
  tileTexts: { W: 'outfall_wall', '#': 'outfall_wall', '~': 'outfall_mist', I: 'outfall_pillar', J: 'outfall_pillar' },

  // Nobody.
  npcs: [],
};
