// THE LAMP ROOM: the top of the Last Light, and the boss arena. Eight-sided like a real lantern room
// (the four corners cut off; the glass turns the two north ones on `il_lantern_glass_corner`, the
// south ones are the tower's wall), the storm black on the glass all round, four iron pillars, and in
// the middle of the floor the great lamp, dead: a drum of dark glass rings cracked across, salt on its
// brass. Corrie is sitting on its rim. Stepping in plays `corrie_appears` (src/data/scenes/corrieAppears.js),
// which ends by starting the fight. No monsters, no puzzle, no music of its own (the battle brings
// its own). BUILD ONLY: the fight is the Corrie builder's, and the scenes after it are written later.
//   - The lamp prop `ll_dead_lamp` is 4 wide at x 9-12, row 8 (its foot), its rim about row 5.
//   - Pillars at (4,5), (17,5), (4,9), (17,9).
//   - The way in is the door at the bottom (10-11, row 13), back down to the upper hall.
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   o  boards   I  iron pillar
// (draft) story text, for Patrick to review.

export const LASTLIGHT_LAMP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_lamp',
  // The room's name, for the Room Editor.
  name: 'THE LAMP ROOM',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  // None: the fight brings its own song.
  music: null,
  // Rain on the lantern glass, the sea far below.
  ambience: 'lighthouse',
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  tiles: [
    '######################',
    '#hhhhhhhhhhhhhhhhhhhh#',
    '#hhoooooooooooooooohh#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooIooooooooooooIooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooIooooooooooooIooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '##oooooooooooooooooo##',
    '##########oo##########',
  ],

  // Where the player starts, in tile coordinates: in from the door.
  playerStart: { x: 10, y: 12 },

  doors: [
    // Back down to the upper hall (the shadowed corner by its door).
    { x: 10, y: 13, w: 2, h: 1, to: 'lastlight_upper', spawn: { x: 27, y: 4 } },
  ],

  // Stepping in from the door: Corrie, and then the fight.
  cutscenes: [
    { x: 8, y: 9, w: 6, h: 3, scene: 'corrie_appears' },
  ],

  textFile: 'interactions/lastlight.txt',
  props: [
    // The lantern glass, all round the north side and turning both corners (as in the old lightroom).
    { sprite: 'il_lantern_glass_corner', x: 1, y: 2, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass', x: 3, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass_cracked', x: 5, y: 1, text: 'lamp_glass_cracked' },
    { sprite: 'il_lantern_glass', x: 7, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass_salt', x: 9, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass', x: 11, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass_salt', x: 13, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass', x: 15, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass', x: 17, y: 1, text: 'lamp_glass' },
    { sprite: 'il_lantern_glass_corner_r', x: 19, y: 2, text: 'lamp_glass' },
    // The great lamp, dead, in the middle of the floor. Corrie sits on its rim in the scene.
    { sprite: 'll_dead_lamp', x: 9, y: 8, text: 'lamp_dead' },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', o: 'lamp_floor', I: 'lamp_pillar' },

  // None: the boss waits on the lamp.
  npcs: [],
};
