// THE REEDS: a delta of shallows, every channel one stride wide, walled in
// both sides by black water and tall glowing reeds, all alike, all branching.
// You can lose your way in here very easily, and a thing that hunts by
// ripples moves under the reeds. Somebody small came this way long ago and
// left a mark at the forks: a cairn on a nub of shingle, three pale pebbles
// laid out in front of it in a line, pointing the way on. But the reeds are
// Gubb's patch too. He marks his fish-pots with a stake and a cork float, and
// a pot is always at the end of a channel (so a float means a dead end, not a
// way). And the olm has been through and knocked two of the cairns flat.
//
// So the maze is read, not just walked:
//   cairn (cairn_up/down/left/right)  the pebbles point the way on from this fork
//   float (eel_float)                 on the mouth of a branch: a pot, a dead end
//   fallen cairn (cairn_fallen)       the stones were scattered; its words say which
//                                     way the pebbles lay (reeds_fallen_<way>)
//   nothing                           a few forks have no mark at all: pick, and be ready to come back
// The way through is a perfect maze (one route, about 85 tiles, 16 forks on it) laid
// on a two-tile lattice and checked with a small solver. Most forks on the route
// carry a clue (a pointing cairn, a fallen cairn, or a float on every wrong
// branch); a couple have a float on only some of the wrong branches, and two
// have nothing at all, so you pick and be ready to come back. Purses and the
// chest are at the far ends of branches that go nowhere (the pots' catch).
//
// Tile key (see src/overworld/deepTiles.js for how the Stillwater draws them):
//   #  cold black rock overhead (solid)   W  pale flowstone rock face (solid)
//   ;  shallows (walkable)   ~  black water (solid)   q  shingle nub (solid, under a cairn)
//   .  pale wet stone (the two doors)
export const STILLWATER_REEDS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'stillwater_reeds',
  // The room's name, for the Room Editor.
  name: 'THE REEDS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stillwater',
  // "The Stillwater" (src/data/music/stillwaterTheme.js).
  music: 'stillwater',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'lake',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // More mist, here, between the reeds.
  fog: 0.32,
  vesWell: true,

  tiles: [
    '#############################################',
    '#############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~;;;;;~;~;;;~;;;;;;;;;~;;;~;;;;;;;;;~;;;~#',
    '#~~~;~;~;~;~;q~~;q;~;~~~~~;~~~;~~~~~~~;q~~;~#',
    '#~~~;~;~;;;;;~;;;~;~;;;;;;;~;~;;;~;~;;;;;;;;.',
    '#~~~;q;~~~~~;~;q~q;~~~~~~~~~;~~~;~;~;~~~~~;~#',
    '#~~~;~;;;;;~;~;;;~;;;;;;;;;;;;;~;~;;;~;;;;;~#',
    '#~~q~~;~~~;~;~;~~~;~;~~~~~~~;~~~~~~~;~~~~~~~#',
    '.;;;;;;;;~;~;~;;;~;~;~;;;~;~;;;;;;;~;;;~;;;~#',
    '#~~~;~;~~~;~;~;~~~;~;~;~;~;~;~~~~~;q;~;~;~;~#',
    '#~~~;~;~;;;~;;;~;;;~;;;~;~;;;~;;;~;~;~;;;~;~#',
    '#~~~~~;~;~~~~~~~;~~~~~~~;~~~~~~~;~;~;~~~;~~~#',
    '#~~~;;;~;;;;;;;~;;;;;;;~;;;;;;;;;~;;;~;;;;;~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#############################################',
  ],

  // Where the player starts, in tile coordinates (just in from the west door).
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 1, to: 'stillwater_isles', spawn: { x: 42, y: 9 } },
    { x: 44, y: 6, w: 1, h: 1, to: 'stillwater_sunken_hall', spawn: { x: 1, y: 8 } },
  ],

  // No cutscenes here.
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The cairns on the right way, a chest (Ves's coat) and two purses at the
  // far dead ends, a post at the door, and a great many reeds.
  textFile: 'interactions/stillwater.txt',
  props: [
    { sprite: 'jetty_post', x: 2, y: 9, text: 'reeds_post' },
    { sprite: 'chest', x: 30, y: 12, text: 'reeds_chest', gives: 'reedweave_coat', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 14, y: 14, text: 'reeds_purse', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 32, y: 8, text: 'reeds_far_purse', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The marks along the way: the child's cairns (their pebbles point the way on), a cairn the olm
    // knocked flat (its words say which way the stones lie), and Gubb's pot floats (a pot at the end
    // of the channel: not the way).
    { sprite: 'cairn_right', x: 3, y: 9, text: 'reeds_cairn' },
    { sprite: 'eel_float', x: 6, y: 11, text: 'reeds_float', walkable: true },
    { sprite: 'eel_float', x: 7, y: 10, text: 'reeds_float', walkable: true },
    { sprite: 'cairn_fallen', x: 5, y: 7, text: 'reeds_fallen_up' },
    { sprite: 'eel_float', x: 5, y: 4, text: 'reeds_float', walkable: true },
    { sprite: 'cairn_down', x: 13, y: 5, text: 'reeds_cairn' },
    { sprite: 'eel_float', x: 15, y: 10, text: 'reeds_float', walkable: true },
    { sprite: 'cairn_up', x: 15, y: 7, text: 'reeds_cairn' },
    { sprite: 'cairn_down', x: 17, y: 5, text: 'reeds_cairn' },
    { sprite: 'cairn_right', x: 17, y: 7, text: 'reeds_cairn' },
    { sprite: 'eel_float', x: 20, y: 9, text: 'reeds_float', walkable: true },
    { sprite: 'eel_float', x: 28, y: 11, text: 'reeds_float', walkable: true },
    { sprite: 'cairn_fallen', x: 35, y: 11, text: 'reeds_fallen_up' },
    { sprite: 'eel_float', x: 35, y: 8, text: 'reeds_float', walkable: true },
    { sprite: 'cairn_right', x: 39, y: 5, text: 'reeds_cairn' },
    { sprite: 'sunken_pillar_top', x: 27, y: 3, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 2, y: 8, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 35, y: 12, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'glow_reeds_tall', x: 3, y: 3, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.52 },
    { sprite: 'glow_reeds_tall', x: 8, y: 3, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.41 },
    { sprite: 'glow_reeds', x: 12, y: 3, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds', x: 18, y: 3, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.49 },
    { sprite: 'glow_reeds', x: 22, y: 3, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds_tall', x: 30, y: 3, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.47 },
    { sprite: 'glow_reeds', x: 33, y: 3, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.48 },
    { sprite: 'glow_reeds', x: 36, y: 3, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.43 },
    { sprite: 'glow_reeds', x: 41, y: 3, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.46 },
    { sprite: 'glow_reeds_tall', x: 15, y: 4, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.53 },
    { sprite: 'glow_reeds_tall', x: 25, y: 4, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.47 },
    { sprite: 'glow_reeds', x: 39, y: 4, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.41 },
    { sprite: 'glow_reeds_tall', x: 1, y: 5, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.43 },
    { sprite: 'glow_reeds_tall', x: 5, y: 5, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.45 },
    { sprite: 'glow_reeds', x: 9, y: 5, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.50 },
    { sprite: 'glow_reeds_tall', x: 19, y: 5, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.58 },
    { sprite: 'glow_reeds_tall', x: 23, y: 5, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.51 },
    { sprite: 'glow_reeds', x: 31, y: 5, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.49 },
    { sprite: 'glow_reeds', x: 34, y: 5, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.41 },
    { sprite: 'glow_reeds_tall', x: 37, y: 5, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'glow_reeds_tall', x: 43, y: 5, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.45 },
    { sprite: 'glow_reeds', x: 3, y: 6, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.58 },
    { sprite: 'glow_reeds', x: 27, y: 6, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.46 },
    { sprite: 'glow_reeds', x: 7, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.59 },
    { sprite: 'glow_reeds', x: 10, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.52 },
    { sprite: 'glow_reeds', x: 13, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.51 },
    { sprite: 'glow_reeds', x: 22, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.51 },
    { sprite: 'glow_reeds', x: 25, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.54 },
    { sprite: 'glow_reeds', x: 29, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.49 },
    { sprite: 'glow_reeds', x: 33, y: 7, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.54 },
    { sprite: 'glow_reeds_tall', x: 39, y: 7, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'glow_reeds', x: 5, y: 8, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.50 },
    { sprite: 'glow_reeds_tall', x: 17, y: 8, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.44 },
    { sprite: 'glow_reeds_tall', x: 31, y: 8, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.57 },
    { sprite: 'glow_reeds_tall', x: 37, y: 8, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.46 },
    { sprite: 'glow_reeds_tall', x: 9, y: 9, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.56 },
    { sprite: 'glow_reeds_tall', x: 15, y: 9, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.44 },
    { sprite: 'glow_reeds_tall', x: 24, y: 9, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.42 },
    { sprite: 'glow_reeds_tall', x: 27, y: 9, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.56 },
    { sprite: 'glow_reeds_tall', x: 35, y: 9, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.53 },
    { sprite: 'glow_reeds', x: 40, y: 9, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.42 },
    { sprite: 'glow_reeds', x: 43, y: 9, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.51 },
    { sprite: 'glow_reeds', x: 11, y: 10, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.55 },
    { sprite: 'glow_reeds', x: 19, y: 10, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.52 },
    { sprite: 'glow_reeds', x: 8, y: 11, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.44 },
    { sprite: 'glow_reeds', x: 13, y: 11, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.54 },
    { sprite: 'glow_reeds_tall', x: 17, y: 11, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.57 },
    { sprite: 'glow_reeds_tall', x: 21, y: 11, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.58 },
    { sprite: 'glow_reeds', x: 25, y: 11, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.41 },
    { sprite: 'glow_reeds_tall', x: 29, y: 11, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.57 },
    { sprite: 'glow_reeds_tall', x: 32, y: 11, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.54 },
    { sprite: 'glow_reeds', x: 39, y: 11, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.55 },
    { sprite: 'glow_reeds_tall', x: 2, y: 12, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.48 },
    { sprite: 'glow_reeds_tall', x: 15, y: 12, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.43 },
    { sprite: 'glow_reeds', x: 23, y: 12, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.57 },
    { sprite: 'glow_reeds', x: 41, y: 12, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.41 },
    { sprite: 'glow_reeds', x: 5, y: 13, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.56 },
    { sprite: 'glow_reeds', x: 11, y: 13, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.44 },
    { sprite: 'glow_reeds_tall', x: 18, y: 13, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.50 },
    { sprite: 'glow_reeds_tall', x: 26, y: 13, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.54 },
    { sprite: 'glow_reeds_tall', x: 30, y: 13, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.43 },
    { sprite: 'glow_reeds_tall', x: 33, y: 13, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.48 },
    { sprite: 'glow_reeds_tall', x: 37, y: 14, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.53 },
    { sprite: 'glow_reeds_tall', x: 43, y: 14, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.56 },
    { sprite: 'glow_reeds_tall', x: 2, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.41 },
    { sprite: 'glow_reeds_tall', x: 7, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.59 },
    { sprite: 'glow_reeds_tall', x: 10, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'glow_reeds_tall', x: 15, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.42 },
    { sprite: 'glow_reeds_tall', x: 21, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.57 },
    { sprite: 'glow_reeds_tall', x: 25, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.45 },
    { sprite: 'glow_reeds', x: 28, y: 15, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.57 },
    { sprite: 'glow_reeds_tall', x: 31, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.40 },
    { sprite: 'glow_reeds', x: 35, y: 15, text: 'reeds_reeds', animation: 'glow_reeds', speed: 0.47 },
    { sprite: 'glow_reeds_tall', x: 41, y: 15, text: 'reeds_reeds', animation: 'glow_reeds_tall', speed: 0.58 },
    { sprite: 'fungus_pads', x: 6, y: 10, walkable: true, animation: 'fungus_pads', speed: 0.9, decor: true },
    { sprite: 'fungus_pads', x: 30, y: 8, walkable: true, animation: 'fungus_pads', speed: 0.9, decor: true },
    { sprite: 'fungus_pads', x: 28, y: 4, walkable: true, animation: 'fungus_pads', speed: 0.9, decor: true },
    { sprite: 'fungus_pads', x: 29, y: 14, walkable: true, animation: 'fungus_pads', speed: 0.9, decor: true },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'sw_paper_boat', x: 33, y: 10, text: 'lp_reeds_boat', gives: 'paper_boat', animation: 'sw_paper_boat', speed: 0.8, walkable: true, react: true, taken: { gone: true } },
    { sprite: 'sw_pale_snails', x: 20, y: 11, text: 'sp_snails', walkable: true },
    { sprite: 'sw_fish_eggs', x: 36, y: 8, animation: 'sw_fish_eggs', speed: 1.0, flat: true, walkable: true, decor: true },
    { sprite: 'sw_fish_bones', x: 28, y: 8, text: 'sp_bones', walkable: true },
    { sprite: 'sw_float_crate', x: 14, y: 5, text: 'sp_crate', walkable: true },
    { sprite: 'sw_paper_boat', x: 42, y: 13, text: 'sp_paper', animation: 'sw_paper_boat', speed: 0.8, walkable: true },
    { sprite: 'fungus_pads', x: 8, y: 8, text: 'sp_pads', animation: 'fungus_pads', speed: 0.9, walkable: true },
    { sprite: 'fungus_pads', x: 24, y: 6, text: 'sp_pads', animation: 'fungus_pads', speed: 0.9, walkable: true },
    { sprite: 'fungus_pads', x: 38, y: 14, text: 'sp_pads', animation: 'fungus_pads', speed: 0.9, walkable: true },
    { sprite: 'sw_pinecone', x: 4, y: 3, text: 'lp_reeds_pine', animation: 'sw_pinecone', speed: 0.9, walkable: true },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'lake_rock', W: 'lake_wall', '~': 'lake_water', ';': 'lake_shallows', q: 'lake_shingle',
  },

  // A blindfish glides along the long stretch of open water on row 7 (x 20 to 26), crossing the
  // channel at 22 and 24 where only the reeds and the ripples show it; an olm waits in the
  // dead-end channel in the south-east (row 14, x 38 to 42). No scenes, nothing to keep clear of.
  npcs: [
    { enemy: 'blindfish', x: 23, y: 7, patrol: [20, 26], behaviour: 'patrol' },
    { enemy: 'olm', x: 40, y: 14, patrol: [38, 42], behaviour: 'wander' },
  ],
};
