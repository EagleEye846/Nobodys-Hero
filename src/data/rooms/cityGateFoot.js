// THE HERO'S GATE: the end of the city, and of what's built of Chapter 3: a
// great court below the Gate, its two stone doors shut in a wall like a cliff,
// and before them a colossal statue of the Hero with its sword raised in
// welcome, asleep: the Warden. Claw marks on the paving, and something up on
// its shoulder, in the dark (at_the_gate): the Hush. The Warden wakes, and has
// to break (warden_breaks); then the Hush (hush_descends), and through the
// Gate.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
export const CITY_GATE_FOOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_gate_foot',
  // The room's name, for the Room Editor.
  name: 'THE HERO\'S GATE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // Nothing: the wind, and the stone.
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',

  tiles: [
    '############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '...........................#',
    '...........................#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '#..........................#',
    '############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'city_last_street', spawn: { x: 34, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 6, y: 6, w: 1, h: 10, scene: 'at_the_gate' },
    // The whole court in front of the Gate: wherever you are, you can't get
    // past it without the Hush coming down.
    { x: 2, y: 4, w: 25, h: 13, scene: 'hush_descends', after: 'warden_breaks' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The Warden and the Gate as they are before the fight, and after it (`until`
  // / `after` warden_breaks).
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'gate_foot', x: 12, y: 3, text: 'gate_doors', until: 'warden_breaks' },
    { sprite: 'gate_foot_broken', x: 12, y: 3, text: 'gate_broken', after: 'warden_breaks' },
    { sprite: 'warden_asleep', x: 13, y: 7, text: 'gate_warden', cast: 'warden', until: 'warden_breaks' },
    { sprite: 'warden_broken', x: 13, y: 7, text: 'gate_warden_broken', after: 'warden_breaks' },
    { sprite: 'savepoint', x: 3, y: 6, save: true },
    { sprite: 'scorch_mark', x: 9, y: 11, text: 'gate_claws', walkable: true },
    { sprite: 'scorch_mark', x: 17, y: 13, text: 'gate_claws', walkable: true },
    { sprite: 'street_lamp_dead', x: 4, y: 4, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 23, y: 4, text: 'dead_lamp' },
  ],
  tileTexts: { W: 'gate_wall', '#': 'gate_wall' },

  // Nothing awake. Yet.
  npcs: [],
};
