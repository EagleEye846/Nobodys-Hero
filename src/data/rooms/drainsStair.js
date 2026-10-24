// THE WATER STAIR: the old conduit climbs over a buried ridge in great stone
// steps, and its water comes down them in falls. The floor, a terrace a step
// up, a gallery a step above that (split in two by a gap): each can be jumped
// up onto in only one place, and that's just where the water pours, wherever
// the wheels send it. Wheel `a`, on the floor and again on the terrace, sends
// it down the floor's step or the west gallery's; wheel `b`, up in the west
// gallery, stops the east gallery's.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   B  tall stone step (jump up onto it from a step)
//   b  stone step (jump up onto it)
//   W  the old city's stone wall (solid)
export const DRAINS_STAIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_stair',
  // The room's name, for the Room Editor.
  name: 'THE WATER STAIR',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js): drips, and Ves's chalk.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.3,

  tiles: [
    '##########################',
    '#WWWWWWWWWWWWWWWWWWWWWWWW#',
    '#BBBBBBBBBBWWWBBBBBBBBBb..',
    '#BBBBBBBBBBWWWBBBBBBBBBb.#',
    '#WWWWWBWWWWWWWWWWWWBWWWWW#',
    '#bbbbbbbbbbbbbbbbbbbbbbbb#',
    '#bbbbbbbbbbbbbbbbbbbbbbbb#',
    '#WWWWWWWWWWWbWWWWWWWWWWWW#',
    '#........................#',
    '#........................#',
    '.........................#',
    '.........................#',
    '#........................#',
    '#WWWWWWWWWWWWWWWWWWWWWWWW#',
    '##########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'drains_weir', spawn: { x: 28, y: 14 } },
    { x: 25, y: 2, w: 1, h: 1, to: 'drains_outfall', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The falls come and go with the wheels (a prop's `wet`).
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'chalk_rock_right', x: 2, y: 8, text: 'stair_chalk' },
    { sprite: 'sign', x: 4, y: 12, text: 'stair_sign' },
    { sprite: 'valve_wheel', x: 9, y: 9, text: 'stair_wheel_a', lever: 'a' },
    { sprite: 'valve_wheel', x: 3, y: 5, text: 'stair_wheel_a', lever: 'a' },
    { sprite: 'valve_wheel', x: 2, y: 2, text: 'stair_wheel_b', lever: 'b' },
    { sprite: 'gold_pouch', x: 1, y: 3, text: 'stair_purse', gold: 230, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 14, y: 2, text: 'stair_chest', gives: 'hob_porridge', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // The falls.
    { sprite: 'water_flow', x: 12, y: 7, text: 'stair_fall', wet: ['!a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 6, y: 4, text: 'stair_fall', wet: ['a'], animation: 'water_flow', speed: 0.3 },
    { sprite: 'water_flow', x: 19, y: 4, text: 'stair_fall', wet: ['!b'], animation: 'water_flow', speed: 0.3 },
  ],
  tileTexts: { W: 'stair_wall', '#': 'stair_wall', b: 'stair_step', B: 'stair_step' },

  // A Siltling and a Slipjack down on the floor.
  npcs: [
    { enemy: 'siltling', x: 18, y: 11, patrol: [15, 22] },
    { enemy: 'slipjack', x: 6, y: 9, patrol: [3, 10] },
  ],
};
