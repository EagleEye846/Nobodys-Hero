// THE FOG DECK: the open deck of the biggest wreck in the yard, so long its far end is
// lost in the fog. The sea fog lies thick here (the room turns the fog right up), so
// things come out of it at you: masts, net heaps, a bell on a frame that still rings when
// the wind leans on it (the "fog bell"), and the yard's drowned crews. This is the fight
// room: no puzzle on the way through, just keep your eyes open and walk east.
//
// THE SECRET: in the fog at the north-east corner, a railed-off bit of foredeck with an
// iron gate (39,6) bolted shut from inside. A gap in the rail (36,4), choked with weed, is
// just wide enough for Bramble: E, in he goes, and the bolt wheel (41,4) is his to turn.
// The gate swings open; the open hatch (39,3) goes down into the pocket under the deck
// (secret_wreck_pocket). R or the gate brings everyone together.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   ~  sea / holes in the deck (solid)   f  rail (solid)
//   .  iron deck   :  deck planks   I  mast (solid)   J  stump (solid)   O  crate   F  net heap

export const WRECK_FOG = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_fog',
  // The room's name, for the Room Editor.
  name: 'THE FOG DECK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  vesWell: true,
  // The fog comes right up over the deck here.
  atmosphere: { fog: 2.2, rain: 0.8 },
  lastLight: { x: 30, y: 1 },

  tiles: [
    '############################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#ffffffffffffffffffffffffffffffffffffffffff#',
    '#....:::::...................F......f......#',
    '#....::::~.................~~..............#',
    '#....:::::..........................f......#',
    '#....:::::.I........................fff.fff#',
    '#...............~~~~~~.....................#',
    '................~~~~~~..........I...........',
    '................~~~~~~......................',
    '#.....OO..............::::::::.............#',
    '#.....................::::::::........OF...#',
    '#..~~.................:::I::::...~~........#',
    '#..~..........F....J..::::::::....~........#',
    '#.....................::::::::.............#',
    '#ffffffffffffffffffffffffffffffffffffffffff#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wreck_pumps', spawn: { x: 32, y: 5 } },
    { x: 43, y: 8, w: 1, h: 2, to: 'wreck_galley', spawn: { x: 2, y: 8 } },
    // Down the open hatch in the railed-off foredeck.
    { x: 39, y: 3, w: 1, h: 1, to: 'secret_wreck_pocket', spawn: { x: 7, y: 8 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The fog bell on its frame, the ship's wheel, the deck's odds and ends.
    { sprite: 'c5_harbour_bell', x: 13, y: 4, text: 'fog_bell', animation: 'c5_harbour_bell', speed: 0.9 },
    { sprite: 'c5_ships_wheel', x: 3, y: 5, text: 'fog_wheel' },
    { sprite: 'c5_tattered_sail', x: 20, y: 4, text: 'fog_sail', animation: 'c5_tattered_sail', speed: 0.45 },
    { sprite: 'c5_chain_bollard', x: 15, y: 9, text: 'fog_bollard' },
    { sprite: 'c5_chain_bollard', x: 22, y: 7, text: 'fog_bollard' },
    { sprite: 'c5_tattered_flag', x: 30, y: 13, text: 'fog_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_barrels', x: 9, y: 13, text: 'hull_barrels' },
    { sprite: 'c5_net_frame', x: 24, y: 5, text: 'fog_net' },
    { sprite: 'sign', x: 5, y: 8, text: 'fog_log' },
    { sprite: 'gold_pouch', x: 4, y: 14, text: 'fog_pouch', gold: 140, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The secret: weed in the rail (Bramble's gap), his bolt wheel, the gate, the hatch.
    { sprite: 'c5_seaweed_heap', x: 36, y: 4, text: 'fog_gap', gap: true },
    { sprite: 'valve_wheel', x: 41, y: 4, text: 'fog_bolt', lever: 'fog_bolt', by: 'bramble', byText: 'fog_bolt_not_you' },
    { sprite: 'gate_narrow', x: 39, y: 6, text: 'fog_gate', opensWith: ['fog_bolt'], openText: 'fog_gate_open' },
    { sprite: 'wy_hatch', x: 39, y: 3, text: 'fog_hatch', walkable: true, flat: true },
  ],
  tileTexts: { '#': 'hull_plate', '~': 'fog_sea', f: 'gate_rail', I: 'fog_mast', J: 'fog_stump', O: 'hull_cargo', F: 'hull_net' },

  // Three of the drowned in a TRIO round the flooded hole in the middle of the deck: a bellbuoy
  // bobbing in the hole (row 8, x 17 to 20), a salt shade drifting along its south lip (row 10, x
  // 17 to 20) and a net wraith on the deck just behind (x 17 to 20, home row 11). Touch the shade
  // and the other two come in with it. All are clear of the doors, the foredeck nook and its gate.
  // No cutscenes in this room.
  npcs: [
    { enemy: 'bellbuoy', x: 18, y: 8, patrol: [17, 20], behaviour: 'patrol' },
    { enemy: 'salt_shade', x: 19, y: 10, patrol: [17, 20], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 18, y: 11, patrol: [17, 20], behaviour: 'wander' },
  ],
};
