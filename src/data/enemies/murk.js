import { MURK_PALETTE, MURK_SPRITE, MURK_ANIM } from '../art/murk.js';

// The MURK's numbers: a patch of the dark in the Deep that got up and
// followed a light, afraid of it and starving for it. It creeps up behind
// you, reaches for your light with tendrils, eats the little motes of it,
// throws shadows of things that aren't there, and swallows the whole box
// whole for a beat. Everything it says is in text/enemies/murk.txt.
export const MURK = {
  name: 'MURK',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  textFile: 'enemies/murk.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'deep',
  sprite: { rows: MURK_SPRITE, palette: MURK_PALETTE },
  // It's wide, so it stands a little left of the usual spot to stay on screen.
  battlePos: { x: 228, y: 48 },
  // Its battle clips (idle, windup, hurt, death, spared, and an intro as the
  // fight starts): see src/data/art/murk.js.
  anim: MURK_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 3050,
  damage: 44,

  // The Deep: the hardest regulars of the chapter, and the strangest.
  difficulty: { density: 1.55, speed: 1.45 },

  // Its attacks live in src/battle/attacks/murk.js.
  patterns: [
    { name: 'murkBehind', weight: 3 },
    { name: 'murkTendrils', weight: 2 },
    { name: 'murkMotes', weight: 2 },
    { name: 'murkShadows', weight: 2 },
    { name: 'murkSwallow', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Cover your light', calm: 40 },
    { name: 'Share a little light', calm: 35 },
    { name: 'Sit with it in the dark', calm: 30 },
  ],

  rewards: { exp: 1040, coins: 27 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'lightless_jelly', chance: 0.4 }],
};
