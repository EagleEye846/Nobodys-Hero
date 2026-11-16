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
// (draft).

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
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
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

  // Stepping in from the door: Corrie, and then the fight. The trigger is the whole width of the
  // floor below the lamp (rows 9-11), so nobody can slip round it up the sides of the room.
  cutscenes: [
    { x: 1, y: 9, w: 20, h: 3, scene: 'corrie_appears' },
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
    // The keeping of the lamp, pushed back against the walls out of everyone's way (the middle of the
    // floor, x 6-15, is kept clear for the scenes): oil barrels, a coil of line, a broom in its bucket.
    { sprite: 'c5_barrel', x: 2, y: 4, text: 'lamp_barrel' },
    { sprite: 'c5_barrel', x: 19, y: 4, text: 'lamp_barrel' },
    { sprite: 'c5_rope_coil', x: 2, y: 11, walkable: true, flat: true, text: 'lamp_rope' },
    { sprite: 'il_broom', x: 19, y: 10, text: 'lamp_broom' },
    // (2026-11-08b) The keeper's things pushed back to the walls: oil spilt by the barrels, a drain
    // grating, and kelp dragged up even here. All flat, all off the scene's floor.
    { sprite: 'll_oil_spill', x: 2, y: 5, flat: true, walkable: true },
    { sprite: 'll_coal_spill', x: 19, y: 5, flat: true, walkable: true },
    { sprite: 'll_grating', x: 1, y: 8, flat: true, walkable: true },
    { sprite: 'll_grating', x: 20, y: 8, flat: true, walkable: true },
    { sprite: 'll_kelp_drag', x: 18, y: 12, flat: true, walkable: true },
    { sprite: 'oil_can', x: 3, y: 4, text: 'lamp_oilcan' },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', o: 'lamp_floor', I: 'lamp_pillar' },

  // None: the boss waits on the lamp.
  npcs: [],
};
