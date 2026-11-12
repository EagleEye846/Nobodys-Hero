import { LIMPET_KNIGHT_PALETTE, LIMPET_KNIGHT_SPRITE, LIMPET_KNIGHT_ANIM } from '../art/limpet_knight.js';

// The LIMPET KNIGHT's numbers: a limpet in tiny armour, with a plume, a visor
// and a shield with a limpet on it, who guards a rock, and holds it, against
// everything the sea and the shore can throw. It takes this extremely
// seriously. It bashes with its shield (a wide plate), sucks you toward it
// (a limpet's one real trick: it will not be moved, and neither will you),
// and sends rolling stones down at you off its rock. Everything it says is in
// text/enemies/limpet_knight.txt.
export const LIMPET_KNIGHT = {
  name: 'LIMPET KNIGHT',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a slow, sure stomp.
  gait: 'stomp',
  textFile: 'enemies/limpet_knight.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'wrack',
  sprite: { rows: LIMPET_KNIGHT_SPRITE, palette: LIMPET_KNIGHT_PALETTE },
  // Plume stirs, shield and sword up before an attack, shell slips off when beaten,
  // bows when spared. See src/data/art/limpet_knight.js.
  anim: LIMPET_KNIGHT_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a clack off the shell when hit, a glint up
  // the blade before it swings, a drip now and then; beaten, its shell clatters down.
  feel: { hit: 'shell', windup: 'glint', at: [0.9, 0.12], idle: 'drip', defeat: 'clatter' },
  // Wrack Shore fights use the shanty; the wreck yard's use the storm song.
  music: 'coastBattleStorm',
  maxHp: 11400,
  damage: 93,

  difficulty: { density: 1.70, speed: 1.55 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10, round 2: the encore comes in sooner and fuller, so the two
  // attacks overlap; it was { at: 0.85, seconds: 4.5, density: 0.8 }, and the
  // careful dodger took almost no hits from it.)
  encore: { at: 0.6, seconds: 6, density: 0.9 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 214, y: 50 },

  // Its attacks live in src/battle/attacks/limpet_knight.js.
  patterns: [
    { name: 'limpBash', weight: 3 },
    { name: 'limpSuck', weight: 3 },
    { name: 'limpStones', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Salute', calm: 40 },
    { name: 'Gesture to pass', calm: 35 },
    { name: 'Admire the shield', calm: 30 },
  ],

  rewards: { exp: 2450, coins: 13 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'limpet_plate', chance: 0.4 }],
};
