// THE LAMP ROOM: the top of the Last Light, and the boss arena. Eight-sided like a real lantern room
// (the four corners cut off; the glass turns the two north ones on `il_lantern_glass_corner`, the
// south ones are the tower's wall), the storm black on the glass all round, four iron pillars, and in
// the middle of the floor the great lamp, dead: a drum of dark glass rings cracked across, salt on its
// brass. Corrie is sitting on its rim. Stepping in plays `corrie_appears` (src/data/scenes/corrieAppears.js),
// which ends by starting the fight. No monsters, no puzzle, no music of its own (the battle brings
// its own). After the fight the room is a wreck (`wreck`, src/overworld/lampWreck.js): the north wall
// and the roof gone, the storm straight in, the lamp lit till the sea comes over the top (corrie_falls,
// src/data/scenes/tideHeldFinale.js); after the chapter, the same wreck under a quiet grey sky.
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
  // After the fight the wrecked room has the Long Climb again, so walking it isn't silent.
  musicAfter: { scene: 'corrie_falls', song: 'lastlight' },
  // Rain on the lantern glass, the sea far below.
  ambience: 'lighthouse',
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
  vesWell: true,
  // Once the fight has torn it open (src/overworld/lampWreck.js): the north wall and the roof
  // gone, as in the fight's last backdrop. `lamp`: the great lamp's heart, burning `until` then.
  wreck: { after: 'corrie_appears', lamp: { x: 10.5, y: 5, until: 'corrie_falls' } },

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
    // The lantern glass, all round the north side and turning both corners (as in the old lightroom),
    // until the fight: Corrie's storm blows it in (corrie_appears ends in the fight).
    { sprite: 'il_lantern_glass_corner', x: 1, y: 2, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass', x: 3, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass_cracked', x: 5, y: 1, text: 'lamp_glass_cracked', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass', x: 7, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass_salt', x: 9, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass', x: 11, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass_salt', x: 13, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass', x: 15, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass', x: 17, y: 1, text: 'lamp_glass', until: 'corrie_appears' },
    { sprite: 'il_lantern_glass_corner_r', x: 19, y: 2, text: 'lamp_glass', until: 'corrie_appears' },
    // After the fight the north wall and the roof are gone (`wreck` above draws it:
    // src/overworld/lampWreck.js). These are the foot rail the glass stood in, for pressing Z
    // on what's left; then what lies on the boards: glass, stones of the parapet, boards torn
    // up off the iron grating, the wet. (The fallen girder up the left side is the wreck's.) (draft)
    { sprite: 'tr_sill', x: 1, y: 1, text: 'lamp_glass_broken', after: 'corrie_appears' },
    { sprite: 'tr_sill', x: 7, y: 1, text: 'lamp_glass_broken', after: 'corrie_appears' },
    { sprite: 'tr_sill', x: 11, y: 1, text: 'lamp_glass_broken', after: 'corrie_appears' },
    { sprite: 'tr_sill', x: 13, y: 1, text: 'lamp_glass_broken', after: 'corrie_appears' },
    { sprite: 'tr_sill', x: 16, y: 1, text: 'lamp_glass_broken', after: 'corrie_appears' },
    { sprite: 'tr_sill', x: 18, y: 1, text: 'lamp_glass_broken', after: 'corrie_appears' },
    { sprite: 'tr_glass_shards', x: 7, y: 3, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_glass_shards', x: 12, y: 3, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_glass_shards', x: 15, y: 2, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_glass_shards', x: 6, y: 7, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_glass_shards', x: 15, y: 7, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_glass_shards', x: 17, y: 10, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_boards_torn', x: 14, y: 4, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_boards_torn', x: 6, y: 10, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'tr_spar', x: 17, y: 6, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'c5_rubble', x: 17, y: 3, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'c5_rubble', x: 13, y: 6, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'c5_puddle', x: 8, y: 4, flat: true, walkable: true, after: 'corrie_appears' },
    { sprite: 'c5_puddle', x: 14, y: 11, flat: true, walkable: true, after: 'corrie_appears' },
    // The great lamp in the middle of the floor: dead (Corrie sits on its rim in the scene), lit
    // by the fight and burning in the open room till the sea comes over the top (corrie_falls),
    // and dark again after.
    { sprite: 'll_dead_lamp', x: 9, y: 8, text: 'lamp_dead', until: 'corrie_appears' },
    { sprite: 'tr_lamp_lit', x: 9, y: 8, after: 'corrie_appears', until: 'corrie_falls' },
    { sprite: 'll_dead_lamp', x: 9, y: 8, text: 'lamp_drowned', after: 'corrie_falls' },
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
