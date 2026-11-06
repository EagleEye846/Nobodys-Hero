// THE CRAWL: a low, narrow, tangled place where the roof comes down to
// your hair and the tunnels cross over each other. Something lives in the
// tangle that has no eyes at all. It hunts by sound. It does not wander: it
// sits where the corridor from the west splits in two, and listens. Nothing in
// the dark shows it, but you can see the sound: pale rings spreading over the
// floor from where it is, and the widest ring is the edge of what it hears. If it
// hears you (you're inside the widest ring, and not crouched in a hollow), the
// room starts again from the door you came in by.
//
// The way on is to move it, twice. Loose scree (`lure`) clatters off to a place
// in the tunnels (a ring on the floor shows where) and the blind thing walks the
// short way round the loop to that spot, and stays there, listening, until
// something else is kicked (`stay`). Where it stays is the whole puzzle:
//   1. It starts at the split (J). Nobody gets past it. The heap in the west
//      corridor (A) sends it east along the north tunnel to the fork before the
//      exit (F). The split is clear, but now the exit is guarded.
//   2. Round the south loop (down column 20, east along row 17) the second heap
//      (S) sends it the long way round, down column 29 and west along row 17: it
//      walks down the very tunnel you are standing in, to its noise at the west
//      end. Crouch in the hollow at (26,17) and let it pass, or run on ahead of it
//      up column 20 and round: either way the fork is clear and you go on.
//   3. Coming back from the camp it is at the split again (the room starts afresh
//      each visit), so there is a heap in the exit tunnel (D) that sends it down
//      the south loop, and the way west is open.
// (This is the Hushwood's shadow engine, src/overworld/hushwood.js: SoundHunter,
// with `post`. There is nothing to fight.)
//
// The loop (tiles), clockwise, 30 tiles round, waypoints by index:
//   0 (20,12) THE SPLIT  1 (26,12)  2 (26,11)  3 (29,11) THE FORK  4 (29,17)
//   5 (21,17)  6 (20,17)
// (20,12) east along row 12 to (26,12), up to (26,11), east along row 11 to the
// fork at (29,11), down column 29 to (29,17), west along row 17 to (21,17) and
// (20,17), and up column 20 back to the split. Its hearing is 30px (about two
// tiles), a little more while it listens, so while it sits at the split it covers
// row 12 from x 18 to x 22 and the top of column 20, and at the fork it covers
// row 11 from x 27 to x 31 and the top of column 29: you cannot pass either.
// It walks at 34 px a second and you at 70, so you can always outrun it in
// a tunnel. Nothing it hears but a catch ever sends it home: no kick is a mistake.
//   A (14,10) at the foot of the west corridor, noise to the fork (3), 7 tiles from the
//     split, so a dash past the split the moment you kick still clears its ear by 24px
//   S (24,17) in the south loop, noise to (21,17) (5): from the fork the way
//     round is clockwise, 14 tiles, and the other way 16
//   D (35,10) in the exit tunnel, noise to (29,17) (4): from the split the way
//     round is down column 20 and along row 17, 14 tiles, the other 16
// A hollow at (26,17), on row 17, is somewhere to crouch as it walks by.
//
// The rest of the Crawl is as quiet as it was: a murk in the west chamber with
// a purse (row 9, x 6 to 10), a gnawer in the chest chamber (row 8, x 16 to 22;
// the chest is in the north end of it at 22,7), cairns and bones. Neither
// patrol is near the loop.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid)
//   .  black stone floor   v  a stalactite hanging low (you walk under)
export const DEEP_CRAWL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_crawl',
  // The room's name, for the Room Editor.
  name: 'THE CRAWL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "The Deep" (src/data/music/deepTheme.js).
  music: 'deep',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // Dark: only your light shows anything (0 to 1).
  dark: 0.92,
  // Glow-worms on Ves's umbrella: your light never drops below this here.
  glowworms: 38,
  // A thin gloom for the heartbeat dread when the hunter is near.
  gloom: 0.04,
  // The blind sentry, sitting at the split (see the top of this file and src/overworld/hushwood.js).
  hush: {
    sound: true,
    post: 0,
    path: [[20, 12], [26, 12], [26, 11], [29, 11], [29, 17], [21, 17], [20, 17]],
    speed: 34,
    radius: 30,
    caught: { first: 'crawl_caught', again: 'crawl_caught_again' },
  },

  tiles: [
    '########################################',
    '########################################',
    '########################################',
    '###WWWWWWWWWWWW#########################',
    '###............#########################',
    '####.########..#####WWWW################',
    '####.#########.#####....##W#############',
    '####v###WWWW##.WWWWW....##.#############',
    '####.WWW....##...v......##.#############',
    '####........##.#####....##.#####WWWWWWWW',
    '####.###....##.W#########W.WWWWW........',
    '####.#########..WWWWWWWWW........v......',
    '####.####WWWW#.............##.##########',
    '####.WWWW....#######.#####.##.##########',
    '####.........#######.#####.##.##########',
    '####v####....#######.########.##########',
    'WWWW.###############.WWWWWWWW.##########',
    '.....###############..v.......##########',
    '.....###################################',
    '########################################',
  ],

  // Two steps in from the west door, Ves warns you about what's listening.
  cutscenes: [
    { x: 2, y: 17, w: 1, h: 2, scene: 'something_listening' },
  ],

  // Where the player starts, in tile coordinates (just in from the First Dark).
  playerStart: { x: 1, y: 17 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 17, w: 1, h: 2, to: 'deep_first_dark', spawn: { x: 37, y: 10 } },
    { x: 39, y: 10, w: 1, h: 2, to: 'deep_heros_camp', spawn: { x: 1, y: 9 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // A rubble hollow to crouch in (`hide`) and three scree heaps to kick (`lure`), faintly
  // lit so you can find them in the dark. A chest in the chamber in the north (Ves's Glowcap
  // Canopy), a purse in the west chamber, a few cairns and bones.
  textFile: 'interactions/deep.txt',
  props: [
    { sprite: 'rubble_hide', x: 26, y: 17, text: 'cr_rubble', hide: true, light: 22 },
    // Loose scree to kick, lit faintly so you can find it. Its noise lands at a waypoint of the loop and the
    // hunter stays there: A (foot of the west corridor) at the fork (3), S (south loop) at (21,17) (5),
    // D (exit tunnel) at the south-east corner (4).
    { sprite: 'scree_heap', x: 14, y: 10, text: 'cr_scree_w', lure: { to: 3, stay: true }, light: 22, walkable: true },
    { sprite: 'scree_heap', x: 24, y: 17, text: 'cr_scree', lure: { to: 5, stay: true }, light: 22, walkable: true },
    { sprite: 'scree_heap', x: 35, y: 10, text: 'cr_scree_e', lure: { to: 4, stay: true }, light: 22 },
    { sprite: 'chest', x: 22, y: 7, text: 'cr_chest', gives: 'glowcap_canopy', seenInLight: true, taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'big_bones', x: 20, y: 9, text: 'cr_bones', seenInLight: true },
    { sprite: 'gold_pouch', x: 8, y: 8, text: 'cr_purse', gold: 70, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'little_cairn', x: 5, y: 12, text: 'cr_cairn', seenInLight: true },
    { sprite: 'little_cairn', x: 10, y: 15, text: 'cr_cairn_blind', seenInLight: true },
    { sprite: 'smooth_stone_c', x: 10, y: 14, text: 'cr_stone', seenInLight: true },
  ],
  tileTexts: { '#': 'deep_rock', W: 'deep_face', v: 'cr_stalactite' },

  // A murk in the west chamber (row 9, x 6 to 10: the side tunnel off the
  // west corridor) and a gnawer in the chest chamber (row 8, x 16 to 22).
  // Neither is near the hunter's loop, and nothing here plays a scene.
  npcs: [
    { enemy: 'murk', x: 8, y: 9, patrol: [6, 10] },
    { enemy: 'gnawer', x: 18, y: 8, patrol: [16, 22] },
  ],
};
