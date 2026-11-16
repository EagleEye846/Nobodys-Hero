import { OLD_DIVER_PALETTE, OLD_DIVER_SPRITE, OLD_DIVER_ANIM } from '../art/old_diver.js';

// The OLD DIVER's numbers: a brass-and-canvas diving suit, empty, that walks
// the wrecks as though somebody were still inside it and had a job to finish.
// Nobody is. It is very good at its job anyway. A slow, heavy walker with a
// harpoon and a perished air hose. Everything it says is in
// text/enemies/old_diver.txt.
export const OLD_DIVER = {
  name: 'OLD DIVER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): heavy lead boots.
  gait: 'stomp',
  textFile: 'enemies/old_diver.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'wreck',
  sprite: { rows: OLD_DIVER_SPRITE, palette: OLD_DIVER_PALETTE },
  anim: OLD_DIVER_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a clank and sparks off the brass when hit,
  // bubbles out of the helmet; beaten, bubbles and it settles under.
  feel: { hit: 'brass', idle: 'bubbles', at: [0.55, 0.1], defeat: 'diver', exit: 'sink' },
  // The coast's fights from the Wreck Yard on: the storm one.
  music: 'coastBattleStorm',
  maxHp: 8700,
  damage: 95,

  difficulty: { density: 1.60, speed: 1.45 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  // (2026-11-10, round 2: it's meant to be one of the coast's hardest, and
  // the careful dodger took almost no hits from it: the encore now comes in
  // sooner and fuller, so the two attacks overlap. Was { at: 0.72, seconds: 5.3, density: 0.8 }.)
  encore: { at: 0.55, seconds: 6.3, density: 0.95 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // Tall and heavy, it stands with its boots on the bottom of the picture.
  battlePos: { x: 222, y: 40 },

  // Its attacks live in src/battle/attacks/old_diver.js.
  patterns: [
    { name: 'diverLamp', weight: 3 },
    { name: 'diverBoots', weight: 3 },
    { name: 'diverHose', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Knock on the helmet', calm: 40 },
    { name: 'Salute', calm: 35 },
    { name: 'Bow your head', calm: 30 },
  ],

  rewards: { exp: 3000, coins: 12 },

  // Part of its kit it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'brass_helmet', chance: 0.4 }],
};
