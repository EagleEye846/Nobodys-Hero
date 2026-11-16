// THE KEEPER'S FIRE: a long tunnel opens into a roomy dark cave, and in the
// middle of it, small and warm and quite impossible, a fire. Somebody is
// sitting by it with a lantern, ahead of you as always (the scene
// keeper_in_the_deep, the only time he's down here). He is friendly. He has
// never been down here. His lantern burns the wrong colour for a moment
// and nobody says so.
//
// After that he stays by his fire, like at the woodcutters' camp in the
// Pinefall, with his theme playing while you're in the room. Nothing else
// happens here.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid)
//   .  black stone floor   q  ash (floor)   ^  black stalagmite (solid)
//   O  glossy black boulder (solid)   J  smooth knob (solid)
import { R3C_PROPS } from '../r3cLife.js';

export const DEEP_KEEPERS_FIRE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_keepers_fire',
  // The room's name, for the Room Editor.
  name: 'THE KEEPER\'S FIRE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "The Deep" (src/data/music/deepTheme.js).
  music: 'deep',
  // His theme while he's at the fire ("Minding the Fire").
  musicAfter: { scene: 'keeper_in_the_deep', song: 'keeper' },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep_fire',
  // How it rings (a cave: ECHOES in src/audio/music.js).
  echo: 'cave',
  // Dark: only your light and the fire show anything (0 to 1).
  dark: 0.92,
  // Glow-worms on Ves's umbrella: your light never drops below this here.
  glowworms: 38,

  tiles: [
    '########################################',
    '########################################',
    '#########WWW###WWWWW##WWW####WW#########',
    '#########...###.....WW...####..#########',
    '#########.O.WWW^.........WWWWO.#########',
    'WWWWWWWWW..^.....J......^......WWWWWWWWW',
    '........................................',
    '........................................',
    '#########...........qqqq.....^.#########',
    '#########.###......J.qqq..^....#########',
    '#########.###^..###........###.#########',
    '#########.###...###.....O..###.#########',
    '########################################',
    '########################################',
  ],

  // Where the player starts, in tile coordinates (just in from the Hero's Camp).
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'deep_heros_camp', spawn: { x: 30, y: 8 } },
    { x: 39, y: 6, w: 1, h: 2, to: 'deep_root', spawn: { x: 1, y: 22 } },
  ],

  // The strip across the cave at 17 sets the scene off; the strips by each
  // door put the fire out once you've met him and are leaving (or coming back).
  cutscenes: [
    { x: 17, y: 3, w: 1, h: 9, scene: 'keeper_in_the_deep' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The fire and the Keeper beside it; a few cairns, stones and a purse.
  textFile: 'interactions/deep.txt',
  props: [
    ...(R3C_PROPS.deep_keepers_fire ?? []),
    { sprite: 'campfire', x: 22, y: 7, text: 'kf_fire', animation: 'campfire', speed: 0.14 },
    { sprite: 'keeper', x: 23, y: 7, cast: 'keeper', text: 'kf_keeper' },
    { sprite: 'little_cairn', x: 5, y: 7, text: 'kf_cairn', seenInLight: true },
    { sprite: 'little_cairn', x: 33, y: 6, text: 'kf_cairn', seenInLight: true },
    { sprite: 'smooth_stone_a', x: 14, y: 8, text: 'fd_stone', seenInLight: true },
    { sprite: 'smooth_stone_c', x: 27, y: 6, text: 'fd_stone', seenInLight: true },
    { sprite: 'gold_pouch', x: 9, y: 11, text: 'kf_purse', gold: 70, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'dp_pale_caps', x: 10, y: 5, text: 'lp_fire_ring', animation: 'dp_pale_caps', speed: 1.0, walkable: true, seenInLight: true },
    { sprite: 'dp_pale_caps', x: 32, y: 7, text: 'dd_caps', animation: 'dp_pale_caps', speed: 1.0, walkable: true, seenInLight: true },
    { sprite: 'dp_floor_stars', x: 6, y: 7, animation: 'dp_floor_stars', speed: 0.6, flat: true, walkable: true, decor: true },
    { sprite: 'dp_floor_stars', x: 34, y: 7, animation: 'dp_floor_stars', speed: 0.6, flat: true, walkable: true, decor: true },
    { sprite: 'dp_floor_stars', x: 30, y: 3, animation: 'dp_floor_stars', speed: 0.6, flat: true, walkable: true, decor: true },
    { sprite: 'drip_puddle', x: 10, y: 7, animation: 'drip_puddle', speed: 0.3, flat: true, walkable: true, decor: true },
    { sprite: 'dp_root_tuft', x: 36, y: 6, text: 'dd_tuft', animation: 'dp_root_tuft', speed: 1.0, walkable: true, seenInLight: true },
    { sprite: 'dp_worm_pile', x: 7, y: 7, text: 'dd_worms', animation: 'dp_worm_pile', speed: 0.7, walkable: true, seenInLight: true },
    { sprite: 'dp_crystal_bud', x: 35, y: 7, text: 'dd_bud', animation: 'dp_crystal_bud', speed: 0.9, walkable: true, seenInLight: true },
    { sprite: 'dp_ash_heap', x: 30, y: 9, text: 'dd_ash', flat: true, walkable: true },
    // --- end life pass ---
  ],
  tileTexts: { '#': 'deep_rock', W: 'deep_face', J: 'deep_knob', '^': 'deep_stalagmite', O: 'deep_boulder', q: 'deep_ash' },

  // No monsters: the scene walks you to 19,7 and the cave round the fire has to
  // stay quiet. (Everything in this room is dark but the fire.)
  npcs: [],
};
