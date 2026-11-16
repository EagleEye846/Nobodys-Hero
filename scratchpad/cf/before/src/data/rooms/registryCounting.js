// THE COUNTING ROOM (a secret, Chapter 3): the registry's long hall, where the
// clerks sat at their desks and counted. Cut across by a wall with two gates in
// it. The first stays open only while somebody stands on a treadle in a little
// room you can only get into over rotten boards, so Ves holds it. The second
// opens for good when a stone's on its plate, and the stone's on the far side.
// (The same lock as the Colonnade's, from the other end of the hall: you come
// in from the east.)
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
import { LIFE3C_PROPS } from '../lifePass3c.js';
import { R3B_PROPS } from '../r3bLife.js';

export const REGISTRY_COUNTING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'registry_counting',
  // The room's name, for the Room Editor.
  name: 'THE COUNTING ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "Counted Every Night" (registryArchiveTheme.js): the way in to the Registry.
  music: 'registryArchive',
  crumbles: true,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',
  gloom: 0.18,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.............W..WWWWWWW.....#',
    '#.............W..W.....W.....#',
    '#.I...J...I...W..W.....W..J..#',
    '#.............W..WWW.WWW.....#',
    '#.............W..............#',
    '..............................',
    '..............W...............',
    '#.............W..............#',
    '#.J...I...J...W...........J..#',
    '#.............W..............#',
    '#............................#',
    '#.............W..............#',
    '#.............W..............#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 28, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 29, y: 7, w: 1, h: 2, to: 'registry_cleft', spawn: { x: 28, y: 6 } },
    { x: 0, y: 7, w: 1, h: 2, to: 'registry_cellar', spawn: { x: 28, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    ...(R3B_PROPS.registry_counting ?? []),
    { sprite: 'rotten_planks', x: 20, y: 5, text: 'rotten_planks', gap: true },
    { sprite: 'treadle', x: 20, y: 3, text: 'treadle', treadle: 'hold' },
    { sprite: 'gate_narrow', x: 14, y: 7, text: 'city_gate', opensWith: ['hold'] },
    { sprite: 'gate_narrow', x: 14, y: 12, text: 'city_gate', opensWith: ['plate'] },
    { sprite: 'stone_button', x: 9, y: 13, text: 'stone_button', button: 'plate' },
    { sprite: 'push_rock', x: 5, y: 12, text: 'counting_stone', rock: true },
    { sprite: 'rock_stump', x: 1, y: 3, text: 'rock_stump', rockReset: true },
    { sprite: 'bookshelf', x: 23, y: 9, text: 'counting_desks' },
    { sprite: 'bookshelf', x: 25, y: 9, text: 'counting_desks' },
    { sprite: 'inscription', x: 11, y: 9, text: 'counting_inscription' },
    { sprite: 'sign', x: 16, y: 9, text: 'counting_sign' },
    { sprite: 'gold_pouch', x: 28, y: 2, text: 'counting_purse', gold: 240, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The life pass, round 2 (15 November 2026).
    ...(LIFE3C_PROPS['registry_counting'] ?? []),
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', I: 'city_pillar', J: 'city_pillar' },

  // A Cairn Hound among the desks, and a Lamp Mite in the south aisle.
  npcs: [
    { enemy: 'lamp_mite', x: 25, y: 12, patrol: [21, 27] },
    { enemy: 'cairn_hound', x: 7, y: 6, patrol: [3, 11], behaviour: 'disguise' },
  ],
};
