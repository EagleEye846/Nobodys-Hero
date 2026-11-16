// THE OLD STREET: out of Lasthome's far door into the dead part of the city. A
// long street of dead lamps and shut doors. A shutter's down across it, and
// its lever is high on the wall: Ves hooks it with her crutch (a `high`
// lever). Further on, a raised walk with a purse on it: jump up, and Ves can't
// follow; she waits below till you come back down. Where a piece of the Fallen
// Star once lay in the steps there is only a scorch now, and a trail of faint
// star-light going along the street to a cleft between two houses, sealed (see
// src/data/rooms/registryCleft.js): the way to the Registry (a secret).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   b  old stone step (jump up onto it; Ves can not)
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
import { LIFE3C_PROPS } from '../lifePass3c.js';
export const CITY_OLD_STREET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_old_street',
  // The room's name, for the Room Editor.
  name: 'THE OLD STREET',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "What They Built for Him" (valleyTheme.js): the dead city.
  music: 'valley',
  // Its old flagstones crack under every landing, and give way in the end,
  // like the Ruins' floors (see OverworldScene.handleLanding). And a split
  // one across the street (`!`) goes the moment you stand on it: the first
  // of the dead city's floors that won't hold (crumble.js).
  crumbles: true,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    '###########################.##',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW.W#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW.W#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW.W#',
    '#..........W.....bbbbbbbbb...#',
    '#..........W.................#',
    '................!.............',
    '................!.............',
    '#....J....IW.........J....I..#',
    '#WWWWWWWWWWWW...WWWWWWWWWWWWW#',
    '#WWWWWWWWWWWW...WWWWWWWWWWWWW#',
    '#WWWWWWWWWWWW...WWWWWWWWWWWWW#',
    '#WWWWWWWWWWWW...WWWWWWWWWWWWW#',
    '#############...##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'lasthome_square', spawn: { x: 32, y: 9 } },
    { x: 29, y: 6, w: 1, h: 2, to: 'city_forum', spawn: { x: 1, y: 9 } },
    { x: 13, y: 13, w: 3, h: 1, to: 'city_baths', spawn: { x: 9, y: 1 } },
    // The cleft between two houses, once it's open (a secret: src/data/rooms/registryCleft.js).
    { x: 27, y: 0, w: 1, h: 1, to: 'registry_cleft', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 5, w: 1, h: 4, scene: 'the_dead_city' },
    { x: 13, y: 4, w: 1, h: 5, scene: 'keeper_lights_a_lamp', after: 'the_dead_city' },
    // The Fallen Star, brought to the sealed cleft, wakes it (`weapon`: only with the sword in your pack).
    // It wants all three torn leaves of the Welcome Register in your pack as well (see
    // src/data/rooms/hollinBackroom.js, marshClerksIslet.js, bathsStokehold.js); without them, the sword alone isn't enough.
    { x: 27, y: 3, w: 1, h: 1, scene: 'star_cleft_opens', weapon: 'fallen_star', gear: ['register_leaf_names', 'register_leaf_hours', 'register_leaf_seal'] },
    { x: 27, y: 3, w: 1, h: 1, scene: 'star_cleft_wants', weapon: 'fallen_star', after: 'the_dead_city', until: 'star_cleft_opens' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'gate_narrow', x: 11, y: 6, text: 'old_shutter', opensWith: ['shutter'] },
    { sprite: 'gate_narrow', x: 11, y: 7, text: 'old_shutter', opensWith: ['shutter'] },
    { sprite: 'high_lever', x: 9, y: 5, text: 'old_shutter_lever', lever: 'shutter', high: true },
    { sprite: 'street_lamp_dead', x: 3, y: 4, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 14, y: 4, text: 'dead_lamp', until: 'keeper_lights_a_lamp' },
    // The one the Keeper lit, and the Keeper, staying by it.
    { sprite: 'street_lamp', x: 14, y: 4, text: 'keeper_lamp', after: 'keeper_lights_a_lamp' },
    { sprite: 'keeper', x: 15, y: 5, npc: 'old_keeper', after: 'keeper_lights_a_lamp' },
    { sprite: 'street_lamp_dead', x: 27, y: 5, text: 'dead_lamp' },
    { sprite: 'gold_pouch', x: 21, y: 4, text: 'old_purse', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Where a piece of the Fallen Star was struck into the old steps: a scorch, and a
    // trail of faint star-light along the street to the cleft (Teasel's favour now goes
    // through the Registry: see src/data/fallenStar.js).
    { sprite: 'scorch_mark', x: 24, y: 4, text: 'old_street_scorch', walkable: true, light: 18, notice: true },
    { sprite: 'scorch_mark', x: 26, y: 5, text: 'old_street_trail', walkable: true, light: 12 },
    { sprite: 'scorch_mark', x: 27, y: 5, text: 'old_street_trail', walkable: true, light: 12 },
    // The cleft is sealed with a carved panel until the sword is held to it.
    { sprite: 'inscription_lit', x: 27, y: 2, text: 'old_street_seal', until: 'star_cleft_opens' },
    { sprite: 'sign', x: 7, y: 4, text: 'old_street_sign' },
    { sprite: 'water_mark', x: 18, y: 7, text: 'water_mark', walkable: true },
    { sprite: 'chest', x: 6, y: 8, text: 'street_chest', gives: 'lamp_soot_shawl', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // The life pass, round 2 (15 November 2026).
    ...(LIFE3C_PROPS['city_old_street'] ?? []),
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', '!': 'cracked_floor', I: 'city_pillar', J: 'city_pillar', b: 'city_step' },

  // A Lamp Mite, nesting in a dead lamp.
  npcs: [
    { enemy: 'lamp_mite', x: 22, y: 7, patrol: [18, 24] },
  ],
};
