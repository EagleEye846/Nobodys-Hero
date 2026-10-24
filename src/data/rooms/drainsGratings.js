// THE GRATINGS: where the culverts meet, and iron gratings were put across
// them to stop what washed down from going on. A grating stops you, and a
// cask; it doesn't stop Bramble, who rides a current straight through one and
// on. Two wheels open the gate out. One is at the far end of the main channel,
// past its grating. The other is on a ledge a tile before the grating, where
// nothing stops you, unless something's already stuck in the grating: a cask
// sent down the channel. But a stuck cask stops Bramble too.
// Tile key (see src/overworld/tileset.js):
//   j  dry gutter (a current or sluice water can run in it)
//   K  brick culvert wall (solid)
//   k  dark overhead (solid)
//   q  wet brick walkway
export const DRAINS_GRATINGS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_gratings',
  // The room's name, for the Room Editor.
  name: 'THE GRATINGS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js): drips, and Ves's chalk.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.45,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kKKKKKKKKKKKKqKKKKKKKKKqKKKKKk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
    'kqqqKKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kqqqKKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kqqqjjjjjjjjjjjjjKKKKKKKKKKKKk',
    'qqqqKKKKKKKKKKKqjKKKKKKKKKqKKk',
    'qqqqjjjjjjjjjjjjjjjjjjjjjqqqKk',
    'kqqqKKKKKKKKKKKKKjKKKKKKKKKqKk',
    'kqqqjjjjjjjjjjjjjjKKKKKKKKKqKk',
    'kqqqKKKKKKKKKKKKKKKKKKKKKKKqKk',
    'kqqqjjjjjjjjjjjjjjjjjjjjjjjjKk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'drains_culvert', spawn: { x: 32, y: 7 } },
    { x: 29, y: 3, w: 1, h: 1, to: 'drains_ladle', spawn: { x: 1, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The main channel's grating has a current through it too, which carries
  // Bramble on.
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'chalk_rock_right', x: 2, y: 3, text: 'gratings_chalk' },
    { sprite: 'sign', x: 1, y: 12, text: 'gratings_sign' },
    { sprite: 'cask', x: 2, y: 8, text: 'cask', log: true },
    { sprite: 'drain_grate', x: 18, y: 8, text: 'drain_grate', gap: true },
    { sprite: 'valve_wheel', x: 15, y: 7, text: 'gratings_wheel_ledge', lever: 'ledge' },
    { sprite: 'valve_wheel', x: 26, y: 7, text: 'gratings_wheel_far', lever: 'far' },
    { sprite: 'gate_narrow', x: 5, y: 3, text: 'gratings_gate', opensWith: ['ledge', 'far'], openText: 'gratings_gate_open' },
    { sprite: 'gold_pouch', x: 13, y: 2, text: 'gratings_purse', gold: 170, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 23, y: 2, text: 'gratings_chest', gives: 'mug_barley_sugar', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'rubble_heap', x: 28, y: 4, text: 'rubble' },
    // The channels' currents (a prop's `flow`).
    { sprite: 'current_left', x: 16, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 15, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 14, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 13, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 12, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 11, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 10, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 9, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 8, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 7, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 6, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 5, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 4, y: 6, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_right', x: 4, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 5, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 6, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 7, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 8, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 9, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 10, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 11, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 12, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 13, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 14, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 15, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 16, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 17, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 18, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 19, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 20, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 21, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 22, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 23, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_right', x: 24, y: 8, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1 },
    { sprite: 'current_left', x: 17, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 16, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 15, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 14, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 13, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 12, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 11, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 10, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 9, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 8, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 7, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 6, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 5, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 4, y: 10, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 27, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 26, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 25, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 24, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 23, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 22, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 21, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 20, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 19, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 18, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 17, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 16, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 15, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 14, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 13, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 12, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 11, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 10, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 9, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 8, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 7, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 6, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 5, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
    { sprite: 'current_left', x: 4, y: 12, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1 },
  ],
  tileTexts: { K: 'gratings_wall', k: 'gratings_wall', j: 'culvert_gap' },

  // A Clinker on the landing, and another along the way out.
  npcs: [
    { enemy: 'clinker', x: 2, y: 11, patrol: [1, 3] },
    { enemy: 'clinker', x: 18, y: 3, patrol: [9, 25] },
  ],
};
