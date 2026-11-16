// THE CLEFT (a secret, Chapter 3): the way in behind the Old Street, found with
// the Fallen Star. A back lane between the old city's clerks' houses, where
// the city's registry kept its stores and its staff came and went unseen. The
// lane is split across by a strip of cracked paving (`!`) that goes the moment
// the hero crosses it, and Ves won't set foot on it; a lever on the far side
// drops a span of planks for her (`planks`), like the aqueduct's.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
import { LIFE3C_PROPS } from '../lifePass3c.js';
import { R3B_PROPS } from '../r3bLife.js';

export const REGISTRY_CLEFT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'registry_cleft',
  // The room's name, for the Room Editor.
  name: 'THE CLEFT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "Counted Every Night" (registryArchiveTheme.js): the way in to the Registry.
  music: 'registryArchive',
  crumbles: true,
  crumble: { planks: [{ x: 14, y: 6, w: 3, h: 2, lever: 'span' }] },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',
  // A narrow lane between high houses: dim.
  gloom: 0.18,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#....J........!!!.......J....#',
    '#.............!!!............#',
    '..............!!!.............',
    '..............!!!.............',
    '#.............!!!.........J..#',
    '#..........J..!!!............#',
    '#..J.....I....!!!.....I......#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'city_old_street', spawn: { x: 27, y: 4 } },
    { x: 29, y: 6, w: 1, h: 2, to: 'registry_counting', spawn: { x: 28, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    ...(R3B_PROPS.registry_cleft ?? []),
    { sprite: 'lever', x: 20, y: 5, text: 'cleft_lever', lever: 'span' },
    { sprite: 'scorch_mark', x: 4, y: 7, text: 'cleft_scorch', walkable: true, light: 14 },
    { sprite: 'scorch_mark', x: 9, y: 6, text: 'cleft_scorch', walkable: true, light: 14 },
    { sprite: 'scorch_mark', x: 12, y: 7, text: 'cleft_scorch', walkable: true, light: 14 },
    { sprite: 'inscription', x: 7, y: 4, text: 'cleft_inscription' },
    { sprite: 'sign', x: 3, y: 5, text: 'cleft_sign' },
    { sprite: 'gold_pouch', x: 26, y: 10, text: 'cleft_purse', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The life pass, round 2 (15 November 2026).
    ...(LIFE3C_PROPS['registry_cleft'] ?? []),
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', '!': 'cracked_floor', I: 'city_pillar', J: 'city_pillar' },

  // Two Lamp Mites, nesting in the clerks' sconces.
  npcs: [
    { enemy: 'lamp_mite', x: 9, y: 9, patrol: [4, 12] },
    { enemy: 'lamp_mite', x: 22, y: 8, patrol: [19, 27] },
  ],
};
