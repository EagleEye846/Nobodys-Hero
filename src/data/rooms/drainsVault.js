// THE DROWNED VAULT: a secret, behind the cracked breach in the conduit's
// north wall. A room the old city kept dry, with a stone chest on a dais, and
// water standing in its corners. Whoever bricked up the breach didn't look
// inside.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   G  cracked brick wall: walk straight through it (a secret)
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
//   ~  deep black water (solid, until a cask sinks into it)
export const DRAINS_VAULT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_vault',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED VAULT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js), the drains' song, carried on in.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.5,

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#~~I......I~~#',
    '#~~........~~#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#######G######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 10, w: 1, h: 1, to: 'drains_conduit', spawn: { x: 24, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'chest', x: 7, y: 3, text: 'vault_chest', gives: 'tidemark', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 4, y: 7, text: 'vault_purse', gold: 260, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'conduit_carving', x: 9, y: 6, text: 'vault_carving' },
    { sprite: 'light_shaft', x: 7, y: 5, text: 'vault_light', light: 50, walkable: true },
  ],
  tileTexts: { W: 'vault_wall', '#': 'vault_wall', '~': 'vault_water', I: 'vault_pillar', G: 'conduit_breach' },

  // Nobody has been in here in a very long time.
  npcs: [],
};
