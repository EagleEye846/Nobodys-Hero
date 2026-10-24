// THE OLD STREET: out of Lasthome's far door into the dead part of the city. A
// long street of dead lamps and shut doors. A shutter's down across it, and
// its lever is high on the wall: Ves hooks it with her crutch (a `high`
// lever). Further on, a raised walk with a purse on it: jump up, and Ves can't
// follow; she waits below till you come back down.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   b  old stone step (jump up onto it; Ves can not)
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
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
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
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
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 5, w: 1, h: 4, scene: 'the_dead_city' },
    { x: 13, y: 4, w: 1, h: 5, scene: 'keeper_lights_a_lamp', after: 'the_dead_city' },
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
    // Further along the raised walk: a piece of the Fallen Star, struck into
    // the old steps where it came down (Teasel's favour, one room from her
    // forge: see src/data/fallenStar.js).
    { sprite: 'star_shard', x: 24, y: 4, text: 'old_street_shard', gives: 'star_shard', taken: { gone: true }, light: 24, notice: true },
    { sprite: 'sign', x: 7, y: 4, text: 'old_street_sign' },
    { sprite: 'water_mark', x: 18, y: 7, text: 'water_mark', walkable: true },
    { sprite: 'chest', x: 6, y: 8, text: 'street_chest', gives: 'lamp_soot_shawl', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', '!': 'cracked_floor', I: 'city_pillar', J: 'city_pillar', b: 'city_step' },

  // A Lamp Mite, nesting in a dead lamp.
  npcs: [
    { enemy: 'lamp_mite', x: 24, y: 6, patrol: [20, 27] },
  ],
};
