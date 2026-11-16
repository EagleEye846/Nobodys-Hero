// TAPER'S GLASSHOUSE (id your_room): off her dipping room. A lean-to of old
// glass panes under a crack in the cavern roof, where a thin grey daylight
// comes down. She hardens her seedlings off in here: cold frames with their
// lids propped, staging of pots, and a slate chalked with cold nights.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           .  stone flags
//   h  wall (solid; glass panes hang on it)       D  doorway (walk through it; see `doors`)
// Taper's own props (panes, frames, staging, slate) are drawn in src/data/art/taperHouse.js.
import { R1_PROPS } from '../ruinsLife.js';
export const YOUR_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'your_room',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S GLASSHOUSE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',
  // Grey light through the glass and one candle; cooler than the rest of the house.
  indoors: true,
  lamplight: { shade: 0.3, nightShade: 0, tint: '10, 18, 24' },

  tiles: [
    '##############',
    '##hhhhhhhhhh##',
    '#hhhhhhhhhhhh#',
    '#............#',
    '#............#',
    'D............#',
    'D............#',
    '#............#',
    '#............#',
    '##..........##',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 5, w: 1, h: 2, to: 'taper_hall', spawn: { x: 14, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'th_glass_panes', x: 2, y: 2, text: 'glass_panes' },
    { sprite: 'th_frost_slate', x: 4, y: 2, text: 'glass_slate' },
    { sprite: 'th_glass_panes', x: 5, y: 2, text: 'glass_panes' },
    { sprite: 'th_sconce', x: 7, y: 2, text: 'glass_sconce' },
    { sprite: 'th_glass_panes', x: 8, y: 2, text: 'glass_panes' },
    { sprite: 'th_glass_panes', x: 11, y: 2, text: 'glass_panes' },
    { sprite: 'th_staging', x: 10, y: 3, text: 'glass_staging' },
    { sprite: 'th_cold_frame', x: 4, y: 6, text: 'glass_frame' },
    { sprite: 'th_cold_frame', x: 8, y: 6, text: 'glass_frame_late' },
    { sprite: 'watering_can', x: 12, y: 8, text: 'glass_can' },
    { sprite: 'th_trug', x: 3, y: 8, text: 'glass_trug' },
    // The life pass, round 2 (15 November 2026): chapter 1's dressing, in src/data/ruinsLife.js.
    ...(R1_PROPS['your_room'] ?? []),
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: {},

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [],
};
