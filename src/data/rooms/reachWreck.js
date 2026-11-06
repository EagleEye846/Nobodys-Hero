// THE WRECK: a big ship that came to grief on a rock out here and lies there still, her masts
// snapped off short and the sea going over her rail. Haddock puts you ashore on the shingle in
// her lee (west) and rows round to the far side. The only way over is across her deck.
//
// The puzzle: throw the Climbing Rope up her side to the ring on the deck's edge (ring 21,8;
// throw from 21,12 on the shingle). On deck, the gangway down the far side (34,6 and 34,7) is
// bolted from inside the deckhouse, and the deckhouse door is stove in and jammed: only a gap
// low in its side (29,6), Bramble's size. E: Bramble squeezes in and turns the bolt wheel
// (29,4, `by: 'bramble'`, lever `reach_bolt`, saved); the gangway gates swing open. R brings
// everybody together. Then down the gangway to the east shore and the jetty: its end (42,13)
// rows on to the eye of the storm; the step off its west side (41,12) rows back to the reef.
// Talk to Haddock from (42,11). The reset
// stump on deck (24,7) puts all three back at the ring.
// Tile key (see src/overworld/coastTiles.js, reach):
//   q  shingle   ,  turf   o  deck boards / planks   g  gangway   f  rail (solid)
//   h  hull side (solid)   a  deckhouse wall (solid)   w  deckhouse porthole (solid)
//   ~  heavy green sea (solid)   x  barnacle rock (solid)

export const REACH_WRECK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_wreck',
  // The room's name, for the Room Editor.
  name: 'THE WRECK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Out Past the Light" (src/data/music/reachTheme.js).
  music: 'reach',
  ambience: 'open_sea',
  vesWell: true,
  // Rougher again: the sea comes over her rail.
  atmosphere: { rain: 1.5, lightning: 1.1, spray: 1.6, fog: 0.9 },
  lastLight: { x: 44, y: 16 },
  skyline: [
    { kind: 'mast', x: 4, y: 6, lean: 1, tall: 58 },
    { kind: 'hull', x: 30, y: 16, lean: -1 },
  ],

  tiles: [
    '################################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~ffffffffffffffff~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~oooooooooaawaaoo~~qqqqx~~~~~~#',
    '#~~~~~~~~~~~~~~~~~oooooooooaoooaoo~~qqqqq~~~~~~#',
    '#~~~~~~~~~~~~~~~~~oooooooooaoooaoo~~qqqqq~~~~~~#',
    '#~~~~~~~~~~~~~~~~~oooooooooaaoaaooggqqqqq~~~~~~#',
    '#~~~~~~~~~~~~~~~~~ooooooooooooooooggqqqqq~~~~~~#',
    '#~~~~~~~~~~~~~~~~~oooooooooooooooo~~qqqqq~~~~~~#',
    '#~~~~~~~~ooqqxqqqqhhhhhhhhhhhhhhhh~~qqqqqoo~~~~#',
    '#~~~~~~~~ooqqqqqqqhhhhhhhhhhhhhhhh~~qqqqq~o~~~~#',
    '#~~~~~~~~ooqqqqqqqhhhhhhhhhhhhhhhh~~qqqqq~o~~~~#',
    '#~~~~~~~~qqqqqqqqqqqqqqqq~~~~~~~~~~~qqqqxoo~~~~#',
    '#~~~~~~~~qqqqqqqqqqqqqqqq~~~~~~~~~~~qq,,,~o~~~~#',
    '#~~~~~~~~qqqqqqqqqqqqqqqq~~~~~~~~~~~qq,,,~~~~~~#',
    '#~~~~~~~~xqqqqqqqqqqqqqqq~~~~~~~~~~~xq,,,~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '################################################',
  ],

  // Where the player starts, in tile coordinates: the landing.
  playerStart: { x: 9, y: 10 },

  doors: [],

  cutscenes: [
    // The landing: the third crossing, once.
    { x: 9, y: 8, w: 2, h: 5, scene: 'reach_crossing_wreck' },
    // The jetty's end: on to the eye. The side step: back to the reef.
    { x: 42, y: 13, w: 1, h: 1, scene: 'reach_to_eye' },
    { x: 41, y: 12, w: 1, h: 1, scene: 'reach_back_to_reef' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    // Up her side: the ring on the deck's edge (throw from 21,12).
    { sprite: 'grapple_ring', x: 21, y: 8, grapple: true },
    // The deckhouse: the gap low in its side (Bramble only), his bolt wheel inside, the gangway gates.
    { sprite: 'wy_hull_hole', x: 29, y: 6, text: 'wreck_gap', gap: true },
    { sprite: 'valve_wheel', x: 29, y: 4, text: 'wreck_bolt', lever: 'reach_bolt', by: 'bramble', byText: 'wreck_bolt_not_you' },
    { sprite: 'gate_narrow', x: 34, y: 6, text: 'wreck_gate', opensWith: ['reach_bolt'], openText: 'wreck_gate_open' },
    { sprite: 'gate_narrow', x: 34, y: 7, text: 'wreck_gate', opensWith: ['reach_bolt'] },
    { sprite: 'rock_stump', x: 24, y: 7, text: 'rock_stump', rockReset: true },
    // Haddock in the Bother alongside the east jetty (x 43-46).
    { sprite: 'cf_haddock_row', x: 43, y: 11, npc: 'haddock_reach', animation: 'cf_haddock_row', speed: 0.6 },
    { sprite: 'c5_chain_bollard', x: 40, y: 8, text: 'reach_bollard' },
    // Her deck: a broken wheel, a stump of mast, a sail in rags, the figurehead on the shingle.
    { sprite: 'c5_ships_wheel', x: 18, y: 7, text: 'wreck_wheel' },
    { sprite: 'c5_tattered_sail', x: 25, y: 4, text: 'wreck_sail', animation: 'c5_tattered_sail', speed: 0.4 },
    { sprite: 'c5_tattered_flag', x: 33, y: 3, text: 'wreck_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_figurehead', x: 16, y: 13, text: 'wreck_figurehead' },
    { sprite: 'c5_anchor', x: 38, y: 4, text: 'wreck_anchor' },
    { sprite: 'sign', x: 12, y: 13, text: 'wreck_sign' },
    { sprite: 'c5_crate', x: 32, y: 8, text: 'wreck_crate' },
    { sprite: 'gold_pouch', x: 32, y: 4, text: 'wreck_pouch', gold: 250, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '~': 'reach_sea', x: 'reach_barnacles', h: 'wreck_side', a: 'wreck_house', w: 'wreck_porthole', f: 'wreck_rail', o: 'wreck_deck', g: 'wreck_gangway', q: 'wreck_shingle' },

  // A pair of salt shades together on the west shingle's south end (x 12-17, about rows 13-15,
  // within four tiles of each other, so they team up), clear of the landing (x 9-10, rows 8-12)
  // where the crossing scene ends, and of the ring's throw spot (21,12); and the old diver on
  // deck, a sentry on row 4 (x 19-23), clear of the ring (21,8) and the deckhouse gap (29,6).
  // Nothing on the east shore, the gangway or the jetty.
  npcs: [
    { enemy: 'salt_shade', x: 13, y: 14, patrol: [12, 14], behaviour: 'wander' },
    { enemy: 'salt_shade', x: 16, y: 14, patrol: [15, 17], behaviour: 'wander' },
    { enemy: 'old_diver', x: 21, y: 4, patrol: [19, 23], behaviour: 'patrol' },
  ],
};
