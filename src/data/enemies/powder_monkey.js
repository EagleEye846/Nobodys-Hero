import { POWDER_MONKEY_PALETTE, POWDER_MONKEY_SPRITE, POWDER_MONKEY_ANIM } from '../art/ghost_crew.js';

// The POWDER MONKEY: the gunner's boy of the Fair Return, ten or eleven years old
// in a coat cut for a man, whose job was to run powder from the magazine to the
// guns. He is still running it. He rolls round shot across the deck (a fuse
// spark on each), sets a keg down with a slow fuse and leaves it (the spark
// creeps along the deck to it; it bursts into splinters), pokes the rammer
// down the guns' barrels (poles thrust in along lanes), and the smoke of every
// gun he ever served hangs about him, dropping burning wadding. Everything he
// does is slow to go off, because a boy with a match is told to be careful. He
// is waiting for somebody to say "fire", so he can stop waiting. Everything he
// says is in text/enemies/powder_monkey.txt. (All its lines are drafts for the designer.)
export const POWDER_MONKEY = {
  name: 'POWDER MONKEY',
  gait: 'dash',
  swims: true,
  textFile: 'enemies/powder_monkey.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading). The game itself doesn't use it.
  area: 'ghostship',
  sprite: { rows: POWDER_MONKEY_SPRITE, palette: POWDER_MONKEY_PALETTE },
  // He bobs, the match smokes, he swings it up before an attack, puts it out
  // on his boot when spared. See src/data/art/ghost_crew.js.
  anim: POWDER_MONKEY_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): sparks off him when hit and wisps of smoke.
  feel: { hit: 'ghost', idle: 'wisps', defeat: 'ghost', exit: 'float' },
  // "Still on Watch" (src/data/music/ghostCrewBattleTheme.js): the fight song for the crew's two
  // boys, small and lonely, on the ship's shanty. (It used to be the storm fight song.)
  music: 'ghostCrewBattle',
  maxHp: 7300,
  damage: 99,

  difficulty: { density: 1.75, speed: 1.6 },
  encore: { at: 0.85, seconds: 4.5, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 218, y: 44 },

  // His attacks live in src/battle/attacks/powder_monkey.js.
  patterns: [
    { name: 'monkeyKeg', weight: 3 },
    { name: 'monkeyFuse', weight: 3 },
    { name: 'monkeyBroadside', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Say fire', calm: 40 },
    { name: 'Take the match', calm: 35 },
    { name: 'Sit down beside him', calm: 30 },
  ],

  rewards: { exp: 3000, coins: 14 },

  // The slow-match's last length, wound up in a twist of paper, left behind (src/data/items.js).
  drops: [{ item: 'powder_toffee', chance: 0.4 }],
};
