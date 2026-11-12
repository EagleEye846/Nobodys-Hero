// THE MOUTH OF THE SOUNDINGS: where the sea goes in under the cliffs. A long cave with a shingle
// beach, the open sea booming in at its mouth (south), and at the back of it the way on into the
// dark. The old sounders of the Saltcombe Harbour Board measured these caves, fathom by fathom,
// and left their chart on a board by the entrance: it is the map of the whole dungeon (Z on it).
// PUZZLE-FREE, and no monsters (an area's first room). The first time in, Bramble meets the sea
// indoors (scene `soundings_in`).
//
// Two ways in from the west. The main one is Merrow's: the flooded tunnel in the west wall (rows
// 4 and 5) from the town's sea gate (merrow_sea_gate). The other is the cliff lane from the
// Sunken Lanes (lanes_down), a SHORTCUT for going back: it ends at a gate (2,8 and 2,9) bolted on
// this side. Its bolt (3,7, lever `lane_bolt`) can only be reached from in here, so coming along
// the lane first you meet a shut gate with the cave beyond it; once you've come through Merrow
// you can draw it and walk back to the Lanes this way.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   q  shingle   ;  shallows
//   ~  black water (solid)   0  the open sea at the mouth   x  glowing sea-glass (solid)
//   I  a rock pillar   O  boulder   F  weed

// The light off a lump of sea-glass: a small bloom and a pool round it.
const GLASS_GLOW = [{ dy: -8, bloom: 10, strength: 0.45, flicker: 0.1, color: '120, 240, 220' }, { dy: 2, pool: 40, strength: 0.38, flicker: 0.05, color: '120, 240, 220' }];
export const SOUNDINGS_MOUTH = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_mouth',
  // The room's name, for the Room Editor.
  name: 'THE MOUTH',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  // After chapter 5 the storm is over (`calmAfter`): the same cave sounds, but the sky in the
  // cave mouth of its fights clears (coastBackdrops.js) and any `_calm` words are used.
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  vesWell: true,

  tiles: [
    '####################################',
    '#WWWWWWW###WWWWWWWWWW####WWWWWWWW#W#',
    '#.......WWW..........W##W........WW#',
    '#........xx...........WW..x........#',
    ';;;;...............I...............#',
    ';;;;...............................#',
    '#............I................xx...#',
    '###................................#',
    '........................I...........',
    '....................................',
    '###................................#',
    '#.....F.........x..................#',
    '#qqqqqqqqqqqqqqqqqqqOqqqqqqqFqqqqqq#',
    '#qqqqq~~~qqqqqqqqqqqqq~~qqqqqq~qqqq#',
    '~~~~~~~~~~~~~qqq~~~~~~~~~~qq~~~~~xq~',
    '~~~x~~~~~~~~~~~~000~x~~~~~~~~~~~~~~~',
    '~~~~~~~~~~0000000000000000~00~~~~~~~',
    '~~~~~~~~~~~~~0000000000000000~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // The cliff lane back to the Sunken Lanes (the shortcut, behind its gate).
    { x: 0, y: 8, w: 1, h: 2, to: 'lanes_down', spawn: { x: 29, y: 9 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'soundings_echo_hall', spawn: { x: 2, y: 5 } },
    // The flooded tunnel from Merrow's sea gate.
    { x: 0, y: 4, w: 1, h: 2, to: 'merrow_sea_gate', spawn: { x: 33, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // The whole of column 4 from the tunnel down past the lane's gate.
    { x: 4, y: 2, w: 1, h: 10, scene: 'soundings_in' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    // The sounders' chart: the map of the Soundings.
    { sprite: 'sd_chart', x: 6, y: 4, text: 'mouth_chart', notice: true },
    { sprite: 'sign', x: 9, y: 7, text: 'mouth_sign' },
    // Drips from the roof (each hangs from the ceiling wall above it).
    { sprite: 'c5_stalactite_drip', x: 12, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 29, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.55 },
    { sprite: 'c5_stalactites_wide', x: 16, y: 2, text: 'sound_stalactites' },
    // The sounders' leavings on the beach.
    { sprite: 'c5_rowboat', x: 10, y: 12, text: 'mouth_boat' },
    { sprite: 'c5_rope_coil', x: 15, y: 10, text: 'mouth_line', walkable: true },
    { sprite: 'c5_buoys_pile', x: 24, y: 11, text: 'mouth_buoys' },
    { sprite: 'c5_driftwood', x: 31, y: 12, text: 'mouth_driftwood' },
    // The shortcut: the lane's gate and its bolt, on this side.
    { sprite: 'gate_narrow', x: 2, y: 8, text: 'mouth_lane_gate', opensWith: ['lane_bolt'], openText: 'mouth_lane_open' },
    { sprite: 'gate_narrow', x: 2, y: 9, text: 'mouth_lane_gate', opensWith: ['lane_bolt'] },
    { sprite: 'lever', x: 3, y: 7, text: 'mouth_lane_bolt', lever: 'lane_bolt' },
    { sprite: 'gold_pouch', x: 33, y: 3, text: 'mouth_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The cave itself: dripstone grown up off the floor, slabs down from the roof, stones at
    // the walls' feet, sea-glass in clumps where the wet comes through, and rock standing out
    // of the sea at the mouth.
    { sprite: 'sd_pit_prop', x: 7, y: 2, text: 'sound_pit_prop' },
    { sprite: 'sd_scree', x: 13, y: 2, flat: true, walkable: true },
    { sprite: 'sd_glass_rock', x: 11, y: 3, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_glass_bed', x: 8, y: 3, flat: true, walkable: true },
    { sprite: 'sd_stalagmites', x: 20, y: 3, text: 'sound_stalagmites' },
    { sprite: 'sd_stalagmite', x: 14, y: 6, text: 'sound_stalagmites' },
    { sprite: 'sd_scree', x: 17, y: 5, flat: true, walkable: true },
    { sprite: 'sd_weed_ledge', x: 25, y: 2, text: 'sound_weed_ledge' },
    { sprite: 'sd_glass_rock', x: 27, y: 3, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_scree', x: 30, y: 2, flat: true, walkable: true },
    { sprite: 'sd_glass_rock', x: 32, y: 6, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_glass_bed', x: 29, y: 7, flat: true, walkable: true },
    { sprite: 'sd_rock_pile', x: 25, y: 8, text: 'sound_rocks' },
    { sprite: 'sd_slab', x: 28, y: 10, text: 'sound_slab' },
    { sprite: 'sd_diver_gear', x: 6, y: 10, text: 'sound_diver_gear' },
    { sprite: 'c5_puddle', x: 11, y: 8, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 21, y: 10, flat: true, walkable: true },
    { sprite: 'sd_timbers', x: 17, y: 11, text: 'sound_timbers' },
    { sprite: 'sd_glass_bed', x: 15, y: 11, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 2, y: 11, flat: true, walkable: true },
    // Rock standing out of the sea at the mouth.
    { sprite: 'sd_sea_rock', x: 4, y: 14 },
    { sprite: 'sd_sea_rocks', x: 8, y: 15 },
    { sprite: 'sd_sea_rock', x: 23, y: 15 },
    { sprite: 'sd_sea_rock', x: 30, y: 15 },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'mouth_sea', '0': 'mouth_sea', q: 'mouth_shingle', x: 'sound_glass', I: 'sound_pillar', O: 'mouth_rockfall', F: 'sound_weed', ';': 'mouth_tunnel' },

  // None: an area's first room.
  npcs: [],
};
