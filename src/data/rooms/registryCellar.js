// THE INK CELLAR (a secret, Chapter 3): under the Counting Room, where the clerks
// kept their ink and mixed it, in vats long since dry. The way on is a gate at
// the far end, shut with a seal of three levers that have to go in the order the
// clerks wrote them: the Names, the Hours, the Seal. The Hours' lever is high on
// the wall (Ves hooks it), the Seal's is on the far side of a split strip of paving
// that goes the moment you cross it (and Ves won't), and a lever there drops a
// span of planks for her. Pull them out of order and all three spring back.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
import { LIFE3C_PROPS } from '../lifePass3c.js';
import { R3B_PROPS } from '../r3bLife.js';

export const REGISTRY_CELLAR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'registry_cellar',
  // The room's name, for the Room Editor.
  name: 'THE INK CELLAR',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "Counted Every Night" (registryArchiveTheme.js): the way in to the Registry.
  music: 'registryArchive',
  crumbles: true,
  crumble: { planks: [{ x: 14, y: 7, w: 3, h: 2, lever: 'span' }] },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Down under the hall: dim.
  gloom: 0.18,

  tiles: [
    '######..######################',
    '#WWWWW..WWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWW..WWWWWWWWWWWWWWWWWWWWW#',
    '#W............!!!...........W#',
    '#.............!!!............#',
    '#..I.......J..!!!......I.....#',
    '#.............!!!.........I..#',
    '#.............!!!.............',
    '#.J...........!!!.............',
    '#.........I...!!!...I........#',
    '#.............!!!.J........J.#',
    '#W...I........!!!...........W#',
    '#WW...........!!!..........WW#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 28, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 29, y: 7, w: 1, h: 2, to: 'registry_counting', spawn: { x: 1, y: 7 } },
    { x: 6, y: 0, w: 2, h: 1, to: 'registry_stacks', spawn: { x: 16, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    ...(R3B_PROPS.registry_cellar ?? []),
    // The seal: three levers, in order (the Names, the Hours, the Seal), and the gate they hold.
    { sprite: 'gate_narrow', x: 6, y: 2, text: 'cellar_gate', opensWith: ['ink_names', 'ink_hours', 'ink_seal'], inOrder: true, openText: 'cellar_gate_open', resetText: 'cellar_gate_reset' },
    { sprite: 'gate_narrow', x: 7, y: 2, text: 'cellar_gate', opensWith: ['ink_names', 'ink_hours', 'ink_seal'], inOrder: true },
    { sprite: 'lever', x: 22, y: 3, text: 'cellar_lever_names', lever: 'ink_names' },
    { sprite: 'high_lever', x: 26, y: 3, text: 'cellar_lever_hours', lever: 'ink_hours', high: true },
    { sprite: 'lever', x: 4, y: 3, text: 'cellar_lever_seal', lever: 'ink_seal' },
    // The span for Ves, on the same side as the Seal's lever.
    { sprite: 'lever', x: 11, y: 3, text: 'cellar_lever_span', lever: 'span' },
    { sprite: 'inscription', x: 19, y: 3, text: 'cellar_inscription' },
    { sprite: 'sign', x: 27, y: 7, text: 'cellar_sign' },
    { sprite: 'pot_pile', x: 17, y: 12, text: 'baths_pots' },
    { sprite: 'book_heap', x: 8, y: 12, text: 'stacks_heap' },
    { sprite: 'water_mark', x: 21, y: 8, text: 'water_mark', walkable: true },
    { sprite: 'gold_pouch', x: 3, y: 12, text: 'cellar_purse', gold: 260, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The life pass, round 2 (15 November 2026).
    ...(LIFE3C_PROPS['registry_cellar'] ?? []),
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', '!': 'cracked_floor', I: 'city_pillar', J: 'city_pillar' },

  // A Lamp Mite in the east aisle, a Cairn Hound lying among the vats in the west.
  npcs: [
    { enemy: 'lamp_mite', x: 23, y: 11, patrol: [19, 26] },
    { enemy: 'cairn_hound', x: 8, y: 10, patrol: [3, 12], behaviour: 'disguise' },
  ],
};
