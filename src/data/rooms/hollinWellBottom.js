// UNDER THE WELL: where you come down, after the jump. Black water, a
// ledge of stone, a tunnel going on into the dark, and Ves's chalk on the
// wall. The first room of the Old Drains: the tunnel goes east to Hollin's
// cistern (drains_cistern).
// Tile key (see src/overworld/tileset.js):
//   K  cave wall (solid)
//   k  cave rock (solid)
//   q  cave floor
//   ~  brook (solid, until a log sinks into it)
export const HOLLIN_WELL_BOTTOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_well_bottom',
  // The room's name, for the Room Editor.
  name: 'UNDER THE WELL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // Only dripping water.
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.8,

  tiles: [
    'kkkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKKk',
    'kqqqqqqqqqqqqqqqqk',
    'kqqqq~qqqqqq~qqqqk',
    'kqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqq',
    'kqqqqqqqqqqqqqqqqq',
    'kqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqk',
    'kq~qqqqqqqqqqq~qqk',
    'k~~~~~~~~~~~~~~~~k',
    'kkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 17, y: 5, w: 1, h: 2, to: 'drains_cistern', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 8, y: 9, w: 1, h: 1, scene: 'under_the_well' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'chalk_rock_right', x: 9, y: 2, text: 'well_bottom_chalk', light: 20 },
    { sprite: 'sign', x: 15, y: 5, text: 'well_bottom_end' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 6, y: 1, text: 'well_bottom_up' },
    { x: 7, y: 1, text: 'well_bottom_up' },
    { x: 8, y: 1, text: 'well_bottom_up' },
    { x: 9, y: 1, text: 'well_bottom_up' },
    { x: 10, y: 1, text: 'well_bottom_up' },
    { x: 11, y: 1, text: 'well_bottom_up' },
  ],
  tileTexts: { '~': 'well_bottom_water', K: 'well_bottom_wall', k: 'well_bottom_wall' },

  // Nobody. Nothing.
  npcs: [],
};
