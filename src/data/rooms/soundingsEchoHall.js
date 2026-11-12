// THE ECHO HALL: the great cave at the heart of the Soundings, the hub. A broad ledge runs along
// the north wall from the Mouth (west) to the Tide Stair (east); below it the cave's own sea fills
// the hall. Everything you say comes back three times. Four ways on:
//   - east, the Tide Stair (on the ledge: always open);
//   - south, the Drowned Chapel: its door is at the bottom of the hall, under the water. The hall's
//     sluice is rusted solid; its chain runs up toward the Tide Stair, and the great sluice wheel at
//     the top of the stair is what drains the hall (it sets this room's tide group,
//     `soundings_hall`, to LOW from there). At LOW a shingle bed bares from the ledge to the door.
//   - north, the Way Up (to the Isles), always open (its gate is in that room);
//   - and two shortcut doors at the hall's foot: the SE door is where the chute from the Three
//     Wells comes down (one way), the SW door goes up a passage to the Weight Room's gallery, whose
//     gate opens from the far side only.
// In the north-west corner, a sea-glass outcrop has a crack only Bramble fits through: behind it, a
// bolt wheel winds up a little grille, and a door goes up to the secret_soundings_bell.
// The tide starts HIGH and has no clock and no wheel here; the doors, the ledge, the east strip and
// the SW ledge are dry at both tides; the two pools either side of the bed are deep at both.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   q  shingle   ;  shallows
//   ~  black water (solid)   x  glowing sea-glass (solid)   I  a rock pillar

// The light off a lump of sea-glass: a small bloom and a pool round it.
const GLASS_GLOW = [{ dy: -8, bloom: 10, strength: 0.45, flicker: 0.1, color: '120, 240, 220' }, { dy: 2, pool: 40, strength: 0.38, flicker: 0.05, color: '120, 240, 220' }];
export const SOUNDINGS_ECHO_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_echo_hall',
  // The room's name, for the Room Editor.
  name: 'THE ECHO HALL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  // After chapter 5 the storm is over (`calmAfter`): the same cave sounds, but the sky in the
  // cave mouth of its fights clears (coastBackdrops.js) and any `_calm` words are used.
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '###..################..#####################',
    '#WW..WWWWWWW###WWWWWW..WWWWWWWWWWWWWW####WW#',
    '#.....x.....WWW...............x......W##W..#',
    '#.....x...xx..........................WW...#',
    '#x.x.xx.....................I..............#',
    '..............I.............................',
    '........I...................................',
    '#..................................x.......#',
    '#..~~.......~~..x..........x..........~....#',
    '#~~~~~~....~~~~~~~~~~~~~~~~~~~~~~~~~.qqqqqq#',
    '#~~~~~~~..~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqqq#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqqq#',
    '#~~~~~~~x~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqxxq#',
    '#~~~~~~~~x~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqq#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqq#',
    '#qxqqq~~~~x~~~~~~~~~~~~~~~~~~~~~~~x~~qqqqqq#',
    '#qqqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqqqq#',
    '.qqqqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqqqq.',
    '.qqqqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~x~qqqqqq.',
    '#qqqqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqqq#',
    '#qqqqqqq~~~~~~~~~~~~~~~~~~~~~~~~~x~~~qqqqqq#',
    'WWWWWWWWWWWWWWWWWWWWW..WWWWWWWWWWWWWWWWWWWWW',
    '#####################..#####################',
  ],

  // The water. Set from the top of the Tide Stair (its great sluice wheel turns this group LOW);
  // nothing here turns it. At LOW the bed (x 12 to 31) bares from the ledge to the chapel door, and
  // joins the SW ledge along rows 17 to 19. Saved with the group.
  tide: {
    group: 'soundings_hall',
    start: 'high',
    low: [
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '            qqqqqqqqqqqqqqqqqqqq            ',
    '            qqqqqqqqqqqqqqqqqqqq            ',
    '            qqqqqqqqqqqqxqqqqqqq            ',
    '            qqq;;qqqqqqqqqqqqqqq            ',
    '            qqqqqqqqqqqqqqqqqqqq            ',
    '            qqqqqqqqqqqqqqqqqqqq            ',
    '            qqqqqqqqqqqqqqq;qqqq            ',
    '            qqxqqqqqqqqqqqqqqqqq            ',
    '       qqqqqqqqqqqqqqqqqqqqqqqqq            ',
    '       qqqqqqqqqqqq;qqqqqqqqqqqq            ',
    '       qqqqqq;qqqqqqqqqqqqqqqxqq            ',
    '            qqqqqqqqqqqqqqqqqqqq            ',
    '                                            ',
    '                                            ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 5, w: 1, h: 2, to: 'soundings_mouth', spawn: { x: 33, y: 8 } },
    { x: 43, y: 5, w: 1, h: 2, to: 'soundings_tide_stair', spawn: { x: 2, y: 24 } },
    { x: 21, y: 0, w: 2, h: 1, to: 'soundings_up', spawn: { x: 11, y: 26 } },
    { x: 21, y: 22, w: 2, h: 1, to: 'soundings_drowned_chapel', spawn: { x: 16, y: 2 } },
    // The shortcuts: the chute's foot from the Three Wells, and the passage up to the Weight Room's gallery.
    { x: 43, y: 17, w: 1, h: 2, to: 'soundings_three_wells', spawn: { x: 34, y: 17 } },
    { x: 0, y: 17, w: 1, h: 2, to: 'soundings_weight_room', spawn: { x: 1, y: 10 } },
    // The secret, up through the outcrop.
    { x: 3, y: 0, w: 2, h: 1, to: 'secret_soundings_bell', spawn: { x: 7, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    // The hall's own sluice, rusted solid, and a dial for the water.
    { sprite: 'c5_sluice_wheel', x: 19, y: 7, text: 'hall_wheel' },
    { sprite: 'tide_dial', x: 24, y: 7, text: 'hall_dial', tideDial: true },
    { sprite: 'sign', x: 34, y: 3, text: 'hall_sign' },
    // The echo stone, a hollow pillar of sea-glass by the way up.
    { sprite: 'sign', x: 19, y: 3, text: 'hall_echo_post' },
    // Drips.
    { sprite: 'c5_stalactite_drip', x: 9, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 33, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.6 },
    { sprite: 'c5_stalactites_wide', x: 25, y: 2, text: 'sound_stalactites' },
    // The secret: Bramble's crack (4,4), his bolt wheel inside (5,2), the grille it lifts (2,4).
    { sprite: 'kid_gap', x: 4, y: 4, text: 'hall_crack', gap: true },
    { sprite: 'lever', x: 5, y: 2, text: 'hall_bolt', lever: 'bell_bolt', by: 'bramble', byText: 'hall_bolt_not_you' },
    { sprite: 'gate_narrow', x: 2, y: 4, text: 'hall_grille', opensWith: ['bell_bolt'], openText: 'hall_grille_open' },
    // Two purses: one on the east strip, one out on the bed (only reachable at low water).
    { sprite: 'gold_pouch', x: 41, y: 20, text: 'hall_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 17, y: 19, text: 'hall_bed_pouch', lowTide: true, gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_seaweed_heap', x: 39, y: 15, text: 'sound_weed' },
    { sprite: 'sign', x: 3, y: 16, text: 'hall_sw_sign' },
    // The hall's own rock: weed off a shelf on the north wall, sea-glass growing out by the way
    // up, dripstone on the ledge, the sounders' ladder up to a crack in the roof, rock standing
    // in the two deep pools, and what the sea has piled on the east strip.
    { sprite: 'sd_weed_ledge', x: 16, y: 2, text: 'sound_weed_ledge' },
    { sprite: 'sd_glass_outcrop', x: 28, y: 2, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_scree', x: 31, y: 2, flat: true, walkable: true },
    { sprite: 'sd_rope_ladder', x: 36, y: 2, text: 'sound_rope_ladder' },
    { sprite: 'sd_stalagmites', x: 41, y: 2, text: 'sound_stalagmites' },
    { sprite: 'sd_diver_gear', x: 36, y: 4, text: 'sound_diver_gear' },
    { sprite: 'sd_glass_rock', x: 36, y: 7, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_stalagmite', x: 15, y: 5, text: 'sound_stalagmites' },
    { sprite: 'sd_scree', x: 9, y: 7, flat: true, walkable: true },
    { sprite: 'sd_rock_pile', x: 11, y: 8, text: 'sound_rocks' },
    { sprite: 'sd_scree', x: 29, y: 8, flat: true, walkable: true },
    { sprite: 'sd_glass_bed', x: 17, y: 8, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'sd_sea_rocks', x: 3, y: 11 },
    { sprite: 'sd_sea_rock', x: 6, y: 13 },
    { sprite: 'sd_sea_rock', x: 2, y: 13 },
    { sprite: 'sd_sea_rock', x: 6, y: 15 },
    { sprite: 'sd_sea_rock', x: 35, y: 13 },
    { sprite: 'sd_timbers', x: 40, y: 10, text: 'sound_timbers' },
    { sprite: 'sd_glass_rock', x: 42, y: 13, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_scree', x: 37, y: 17, flat: true, walkable: true },
    { sprite: 'sd_stalagmites', x: 4, y: 20, text: 'sound_stalagmites' },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'hall_water', q: 'hall_shingle', ';': 'hall_puddle', x: 'sound_glass', I: 'hall_pillar' },

  // A PAIR at the east end: a net wraith patrolling the ledge's lip (row 8, x 32 to 34) and a
  // moonjelly drifting over the east pool just below it (row 10, x 33 to 35: deep at both tides),
  // close enough to fight together. Neither comes near a door, the dial, the crack or a tile the
  // tide changes (the bed is x 12 to 31, rows 9 to 20, and x 7 to 11, rows 17 to 19). No cutscenes
  // in this room.
  npcs: [
    { enemy: 'net_wraith', x: 33, y: 8, patrol: [32, 34], behaviour: 'patrol' },
    { enemy: 'moonjelly', x: 34, y: 10, patrol: [33, 35], behaviour: 'patrol' },
  ],
};
