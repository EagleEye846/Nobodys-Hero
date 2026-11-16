// THE REEF: two islets with a reef of wet coral between them, and the storm imps wheeling over
// the lot. Two deep cuts run down the reef (columns 19-20 and 23-24) with a spine of coral between
// them (21-22), and none of it ever drains. What gets you over is the BLOWHOLES: holes in the coral
// where the swell heaves under the rock and air comes roaring up out of it (the same updrafts as
// the Wrack dunes, `gusts`): step on one and it throws you to the far side of the cut. Anyone can
// ride them, with Ves or without, before the chapter's end or after it.
//   Going east: the west reef's blowhole (18,6) to the spine (21,6); walk down the spine to the
//   one at its foot (22,13), and over to the east reef (26,13).
//   Going west: the east reef's blowhole (25,9) to the spine (22,9); up to its top (21,5), and over
//   to the west reef (16,5). Every hole has one coming back, so nothing can go wrong.
// SECRET: the spine's tail (21,14) throws you south to a coral head out in the sea (22,16), where a
// sea locker off the first Bother is lashed down (the Petrel Scarf, for Ves, and a page of an old
// log). Its own hole (23,17) throws you back to the spine (21,12).
// After the chapter (the storm over) a bead of stormglass lies on the west reef (17,12), for the
// innkeeper at the Drowned Rat ("A Shelf for the Tankard", text/npcs/rat_innkeeper.txt).
//
// Haddock puts you ashore on the west landing and rows round to the east islet's jetty. The
// jetty (column 35, from 34,7) has the Bother alongside: its end (35,11) rows on to the wreck;
// the step off its west side (34,10) rows back to the first rock. Talk to Haddock from (35,9).
// Tile key (see src/overworld/coastTiles.js, reach):
//   .  wet rock slabs   ,  turf   o  planks   ~  heavy green sea (solid)
//   x  barnacle rock and coral (solid)   ;  pools (walk)

import { LIFE5_PROPS } from '../lifePass5.js';

export const REACH_REEF = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_reef',
  // The room's name, for the Room Editor.
  name: 'THE REEF',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Hopes Above Water" (src/data/music/reachRainTheme.js).
  music: 'reachRain',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as at the tower's foot: no rain or
  // lightning, the sea lying down, and the grey-blue light of a quiet sea in place of the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,
  // Rougher than the first rock.
  atmosphere: { rain: 1.3, lightning: 0.9, spray: 1.4 },
  lastLight: { x: 37, y: 16, scale: 1.45 },
  // The wrecks' silhouettes on the sea keep this many tiles clear of any shore (not in the cuts,
  // not by the coral head): src/overworld/atmosphere.js, buildSkyline.
  skylineClear: 2,
  skyline: [
    { kind: 'hull', x: 4, y: 16, lean: 1 },
    { kind: 'mast', x: 37, y: 5, lean: -1, tall: 40 },
  ],

  // The storm's far wrecks stay well out to sea: never in the boat's lane (west of the landing, row 10) or by
  // the jetty, where they used to stand over the Bother and the party. (15 Nov 2026)
  skylineClear: 5,
  skylineKeepOut: [{ x: 0, y: 5, w: 13, h: 9 }],
  tiles: [
    '##########################################',
    '#~~~~~~~~~~~~~~~x~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~..~~~~~~~~~~~~~~~~~..x~~~~~~~~#',
    '#~~~~~~~~x.,,,~~~~~~~~~~~~~~~....x~~~~~~~#',
    '#~~^~~~~~~.,,,,,.;.x~..~~..,,....~~~~~^~~#',
    '#~~~~~~~~~x,,,,,...~~.;~~.........~~~~~~~#',
    '#~~~~~~~.,,,.......~~..~~.x.......~~~~~~~#',
    '#~~~~~~~x.,,,....x.~x..~~..;,,....oo~~~~~#',
    '#~~~~~~~~..,...;;..~~;.~~...,,,...~o~~~~~#',
    '#~~~~~~~~oo..,..;;.~~..~~.....;...~o~~~~~#',
    '#~~~~~~~~oo.,,,....~~..x~.,,.....xoo~~~~~#',
    '#~~~~~~~~oo..,,...;~~.;~~;,,..;...~o~~~~~#',
    '#~~~~~~~~...,,..;..~~..~x..,,.....~~~~~~~#',
    '#~~~~~~~~~..,,,....~~..~~..;....,~~~~~~~~#',
    '#~~~x~~~~~~.,,,..x.~~..~~...,,,.,~~~~~~~~#',
    '#~~~~x~~~~..,,....;~~~~~~...,,;,,~~~~~~x~#',
    '#~^~~~~~~x....;x~~~~~...~~~x..,,~~~~~~~~~#',
    '#~~~~~~~~~~...x~~~~~~...~~~~~x,,~~~~~x~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '##########################################',
  ],

  // Where the player starts, in tile coordinates: the landing.
  playerStart: { x: 9, y: 10 },

  doors: [],

  // The blowholes (src/overworld/windGeyser.js, Updraft): step on one and it throws you to `to`.
  gusts: [
    { x: 18, y: 6, to: { x: 21, y: 6 } },
    { x: 22, y: 13, to: { x: 26, y: 13 } },
    { x: 25, y: 9, to: { x: 22, y: 9 } },
    { x: 21, y: 5, to: { x: 16, y: 5 } },
    { x: 21, y: 14, to: { x: 22, y: 16 } },
    { x: 23, y: 17, to: { x: 21, y: 12 } },
  ],
  looks: [
    { x: 18, y: 6, text: 'reef_blowhole' },
    { x: 22, y: 13, text: 'reef_blowhole' },
    { x: 25, y: 9, text: 'reef_blowhole' },
    { x: 21, y: 5, text: 'reef_blowhole' },
    { x: 21, y: 14, text: 'reef_blowhole' },
    { x: 23, y: 17, text: 'reef_blowhole' },
  ],

  cutscenes: [
    // The landing: the second crossing, once.
    { x: 9, y: 8, w: 2, h: 5, scene: 'reach_crossing_reef' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    // The sea locker on the coral head (the secret).
    { sprite: 'c5_chest', x: 21, y: 17, text: 'reef_locker', gives: 'petrel_scarf', react: true, taken: { sprite: 'c5_chest_open', text: 'reef_locker_empty' } },
    // After the chapter: a bead of stormglass on the west reef, for the innkeeper.
    { sprite: 'il_shell_row', x: 17, y: 12, text: 'reef_stormglass', gives: 'storm_glass', walkable: true, flat: true, after: 'the_light_answers', taken: { text: 'reef_stormglass_gone' } },
    // Haddock in the Bother alongside the east jetty (x 36-39).
    { sprite: 'cf_haddock_row', x: 36, y: 9, playScene: 'reach_boat_reef', notice: 'stays', animation: 'cf_haddock_row', speed: 0.6, until: 'haddock_gone' },
    // After the chapter: the Bother, empty (Ves rows her now).
    { sprite: 'cf_bother', x: 36, y: 9, text: 'bother_after', playScene: 'reach_boat_reef', notice: 'stays', animation: 'cf_bother', speed: 0.6, after: 'haddock_gone' },
    { sprite: 'c5_chain_bollard', x: 33, y: 6, text: 'reach_bollard' },
    { sprite: 'sign', x: 13, y: 7, text: 'reef_sign' },
    { sprite: 'c5_seaweed_heap', x: 10, y: 13, text: 'reach_weed' },
    { sprite: 'c5_buoys_pile', x: 29, y: 4, text: 'reef_buoys' },
    { sprite: 'c5_driftwood', x: 28, y: 13, text: 'reach_driftwood' },
    { sprite: 'gold_pouch', x: 32, y: 15, text: 'reef_pouch', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // What the sea leaves on a reef: a tide line of torn weed, planks off some older wreck, gulls'
    // marks where they sat the storm out, a crab's road to its hole, rain lying in the hollows.
    { sprite: 'c5_wrack_line', x: 10, y: 16, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 14, y: 10, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 16, y: 7, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 11, y: 12, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 29, y: 12, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 29, y: 9, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 31, y: 3, flat: true, walkable: true },
    // Haddock's mark for the landing: half an oar stuck in a crack, a red rag on it. And a lantern
    // on its post where the jetty starts, the only warm light out here.
    { sprite: 'c5_oar_stuck', x: 10, y: 6 },
    { sprite: 'c5_lantern_hook', x: 33, y: 8 },
    // Second pass: the islets' own look: pools, lichen, sea-pinks and grass, a cairn, an old bow,
    // a stove-in pot, gulls on a rock offshore, rocks breaking the sea. Nothing on the reef, the
    // blowholes or their landings (x 16-26), the landing and its water, the jetty or the pack's ground.
    { sprite: 'il_tidepool', x: 12, y: 8, flat: true, walkable: true },
    { sprite: 'il_cairn', x: 12, y: 3, text: 'reach_cairn' },
    { sprite: 'il_thrift', x: 12, y: 5, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 13, y: 6, walkable: true, decor: true },
    { sprite: 'il_grass_tuft_b', x: 11, y: 11, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 13, y: 13, walkable: true, decor: true },
    { sprite: 'il_rowboat_half', x: 14, y: 15, text: 'reach_rowboat_half' },
    { sprite: 'il_pot_broken', x: 16, y: 14, text: 'reach_pot' },
    { sprite: 'il_lichen', x: 16, y: 10, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 12, y: 16, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 15, y: 3, flat: true, walkable: true },
    { sprite: 'il_tidepool', x: 29, y: 13, flat: true, walkable: true },
    { sprite: 'il_cairn', x: 31, y: 14, text: 'reach_cairn' },
    { sprite: 'il_thrift', x: 30, y: 16, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 31, y: 17, walkable: true, decor: true },
    { sprite: 'il_grass_tuft_b', x: 29, y: 8, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 27, y: 15, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 26, y: 11, flat: true, walkable: true },
    { sprite: 'il_gull_rock', x: 36, y: 3, text: 'reach_gull_rock' },
    { sprite: 'il_rocks_big', x: 4, y: 6, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 7, y: 16, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 38, y: 13, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 13, y: 18, text: 'reach_rocks' },
    ...(LIFE5_PROPS['reach_reef'] ?? []),
  ],
  tileTexts: { '~': 'reach_sea', x: 'reef_coral', o: 'reach_planks', ';': 'reach_pool', '.': 'reef_rock' },

  // A pack of three on the east islet's north end (two storm imps and a pinwheel, all within
  // four tiles of each other, so they come at you together): x 28-32, about rows 3-6, clear of
  // the blowholes and their landings (x 16-26) and the jetty (from 34,7). Nothing on the reef
  // and nothing on the west islet,
  // so the landing (x 9-10, rows 8-12), where the crossing scene ends, has nobody near it.
  npcs: [
    { enemy: 'storm_imp', x: 27, y: 5, patrol: [26, 28], behaviour: 'wander' },
    { enemy: 'storm_imp', x: 31, y: 5, patrol: [30, 32], behaviour: 'wander' },
    { enemy: 'pinwheel', x: 30, y: 3, patrol: [29, 31], behaviour: 'wander' },
  ],
};
