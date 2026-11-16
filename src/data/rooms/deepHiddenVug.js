// THE VUG: a hollow in the rock the size of a larder, behind a crack you could
// only find by its blue glow in the dark. The walls are lined with crystal
// that has been growing, quietly and alone, since before anyone came down
// here. In the middle, set on a bed of crystal dust as if somebody had put it
// down carefully, a blade of black glass: the Deepglass Blade
// (deepglass_blade). It has been waiting so long it has stopped minding.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid)
//   .  black stone floor   x  glowing crystal (solid, gives light)
//   ^  black stalagmite (solid)
import { R3C_PROPS } from '../r3cLife.js';

export const DEEP_HIDDEN_VUG = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_hidden_vug',
  // The room's name, for the Room Editor.
  name: 'THE VUG',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "The Deep" (src/data/music/deepTheme.js).
  music: 'deep',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // How it rings (a little hollow: ECHOES in src/audio/music.js).
  echo: 'pocket',
  // Dark, so the crystals show as the only light there is.
  dark: 0.8,
  // Glow-worms on Ves's umbrella: your light never drops below this here.
  glowworms: 38,

  tiles: [
    '##############',
    '##############',
    '#WWWWWWWWWWWW#',
    '#WWWWWWWWWWWW#',
    '#Wxx......xxW#',
    '#Wx..^.....xW#',
    '#W..........W#',
    '#W......^...W#',
    '#W^.........W#',
    '##xx......xx##',
    '######..######',
  ],

  // Where the player starts, in tile coordinates (just in from the crack).
  playerStart: { x: 6, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 10, w: 2, h: 1, to: 'deep_first_dark', spawn: { x: 36, y: 2 } },
  ],

  // Nothing plays here.
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deep.txt',
  props: [
    ...(R3C_PROPS.deep_hidden_vug ?? []),
    { sprite: 'chest', x: 6, y: 6, text: 'vg_chest', gives: 'deepglass_blade', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'smooth_stone_c', x: 9, y: 5, text: 'vg_stone' },
    { sprite: 'little_cairn', x: 4, y: 7, text: 'vg_cairn' },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'dp_worm_pile', x: 8, y: 5, text: 'dd_worms', animation: 'dp_worm_pile', speed: 0.7, walkable: true, seenInLight: true },
    // --- end life pass ---
  ],
  tileTexts: { '#': 'deep_rock', W: 'vg_wall', x: 'vg_crystal', '^': 'deep_stalagmite' },

  // Nobody lives in a cupboard of crystal.
  npcs: [],
};
