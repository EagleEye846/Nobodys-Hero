import { PRISMOTH_PALETTE, PRISMOTH_SPRITE, PRISMOTH_ANIM } from '../art/prismoth.js';

// The PRISMOTH's numbers: a fat, fuzzy moth from the Glimmering whose wings
// are panes of coloured glass. Every bit of light it flies through comes out
// the other side as a rainbow, which it finds very flattering. It's drawn to
// anything bright and is far too proud of its own colours to be sensible
// about it. Everything it says is in text/enemies/prismoth.txt.
export const PRISMOTH = {
  name: 'PRISMOTH',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'fly',
  textFile: 'enemies/prismoth.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'glimmer',
  sprite: { rows: PRISMOTH_SPRITE, palette: PRISMOTH_PALETTE },
  // The wings beat slowly and glow; they sweep back before it splits a beam;
  // they fly up when it's hit; the colour drains out of them when it's beaten;
  // and it sparkles when it's spared. See src/data/art/prismoth.js.
  anim: PRISMOTH_ANIM,
  // The Chapter 4 battle song.
  music: 'belowBattle',
  maxHp: 1450,
  damage: 37,

  difficulty: { density: 1.35, speed: 1.3 },

  // Its attacks live in src/battle/attacks/prismoth.js.
  patterns: [
    { name: 'prismBurst', weight: 3 },
    { name: 'prismGlitter', weight: 2 },
    { name: 'prismMirror', weight: 2 },
    { name: 'prismArc', weight: 2 },
    { name: 'prismBounce', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hold up a glass', calm: 40 },
    { name: 'Admire the colours', calm: 35 },
    { name: 'Turn down the light', calm: 30 },
  ],

  rewards: { exp: 755, coins: 21 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'spectrum_wafer', chance: 0.4 }],
};
