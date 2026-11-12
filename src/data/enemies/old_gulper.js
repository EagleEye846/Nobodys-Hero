import { OLD_GULPER_PALETTE, OLD_GULPER_SPRITE, OLD_GULPER_ANIM, OLD_GULPER_AWAKE_SPRITE, OLD_GULPER_AWAKE_ANIM, OLD_GULPER_DEATH_LAST } from '../art/old_gulper.js';

// OLD GULPER, Merrow's midboss: a giant, very old moray eel who nests in the
// great bell of the drowned bell tower, which fell and lies on its side in the
// flooded floor. When he turns over in his sleep the bell rings (one reason the
// bells ring in the empty town). He is grumpy, not evil: he has toothache. One
// tooth at the front is crooked and wobbly, and he keeps rubbing his jaw on the
// bell, which is what rings it. The hero never speaks, so every TALK is
// something he does, told in the panel.
//
// Two `phases` (see bossPhase in src/battle/battleScene.js):
//   1. GRUMPY: woken up and cross about it. He lunges through the box, blows
//      gill bubbles, whips his tail, sucks the water (and you) toward his
//      mouth, and bumps the bell.
//   2. AWAKE (at half his HP): properly awake now, and the tooth is killing
//      him. Both eyes open, faster and harder, and he adds the chomp: his jaws
//      shut on the whole box but for the pocket his crooked tooth props open.
// He CAN be won round (`gentle`: his attacks thin out as MERCY rises): look in
// his mouth and you find the wobbly tooth; hum and he goes still; wiggle the
// tooth (once you've looked, and once he trusts you a little) and it's hanging
// by a thread. Then Pacify, and it comes out in your hand. Beaten, it's knocked
// loose. Either way his room gives the Gulper Tooth (gear.js) after the fight.
// Words are in text/enemies/old_gulper.txt.
//
// Strength: between the Dowager Crab (24,000) and Corrie (50,000). 31,000
// from 8 November 2026 (it was 13,000, then 15,600): about 13 rounds of good
// play at LV 44 with the gear of that point (tools/ttkCheck.html).

// His attacks live in src/battle/attacks/old_gulper.js.
const GRUMPY_ATTACKS = [
  { name: 'gulpLunge', weight: 3 },
  { name: 'gulpBubbles', weight: 3 },
  { name: 'gulpTail', weight: 3 },
  { name: 'gulpPull', weight: 2 },
  { name: 'gulpBell', weight: 3 },
];
const AWAKE_ATTACKS = [
  { name: 'gulpChomp', weight: 4 },
  { name: 'gulpLunge', weight: 3 },
  { name: 'gulpTail', weight: 3 },
  { name: 'gulpBell', weight: 2 },
  { name: 'gulpPull', weight: 2 },
  { name: 'gulpBubbles', weight: 2 },
];

export const OLD_GULPER = {
  name: 'OLD GULPER',
  textFile: 'enemies/old_gulper.txt',
  gait: 'float',
  swims: true,
  // Where he belongs until he's placed in a room (the Studio lists him under
  // this area's heading). The game itself doesn't use it.
  area: 'merrow',
  sprite: { rows: OLD_GULPER_SPRITE, palette: OLD_GULPER_PALETTE },
  anim: OLD_GULPER_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a splash when hit, a bubble now and then (his
  // defeat is the boss finale).
  feel: { hit: 'splash', idle: 'bubbles', at: [0.3, 0.35] },
  // Beaten, he doesn't fade: he has gone back into the bell, tail tip out.
  beatenSprite: { rows: OLD_GULPER_DEATH_LAST, palette: OLD_GULPER_PALETTE },
  boss: true,
  gentle: true,
  // The coast's pirate fight song (Cutlass Weather): big enough for a midboss.
  music: 'pirateBattle',
  backdrop: 'merrow_belfry',
  battlePos: { x: 200, y: 36 },
  maxHp: 39500,
  damage: 110,
  difficulty: { density: 1.85, speed: 1.65 },

  // Below 30% of his HP he adds a light second attack on top.
  secondWind: { below: 0.3, density: 0.25, delay: 2.4 },
  // Its turns run long: as one attack winds down, another follows (encore,
  // see startAttack in battleScene.js).
  encore: { at: 0.85, seconds: 5, density: 0.65 },
  // He bursts up out of the water, too high, and falls back (see stageBits.js).
  entrance: 'surge',
  introCard: { title: 'OLD GULPER', subtitle: 'Do Not Disturb' },

  phases: [
    {
      id: 'grumpy',
      // On to the next phase at half his HP; he can't be knocked below that
      // (floor) until then, so the second phase is never skipped.
      until: { below: 0.5 },
      floor: 0.44,
      lowHp: 0.55,
      patterns: GRUMPY_ATTACKS,
    },
    {
      id: 'awake',
      sprite: { rows: OLD_GULPER_AWAKE_SPRITE, palette: OLD_GULPER_PALETTE },
      anim: OLD_GULPER_AWAKE_ANIM,
      patterns: AWAKE_ATTACKS,
      damage: 119,
      difficulty: { density: 2.00, speed: 1.76 },
      introSfx: 'bell',
      lowHp: 0.25,
      beat: [{ say: 'phase: awake' }, { who: 'vesper', say: 'phase: awake vesper' }, { who: 'foe', say: 'phase: awake foe' }],
    },
  ],

  // Every attack he has, across both phases (the battle checks there are enough).
  patterns: [
    { name: 'gulpLunge', weight: 3 },
    { name: 'gulpBubbles', weight: 3 },
    { name: 'gulpTail', weight: 3 },
    { name: 'gulpPull', weight: 2 },
    { name: 'gulpBell', weight: 3 },
    { name: 'gulpChomp', weight: 2 },
  ],

  // TALK options: everything the hero does is told in the panel. The joke is
  // the tooth: look first, then you may wiggle it (once his MERCY is 30).
  // Humming makes him go still, so his next attack is gentler (`soothe`; the
  // empty `needs` only routes it through the TALK that can soothe, see
  // teamTalk in battleScene.js).
  talk: [
    { name: 'Inspect' },
    { name: 'Look in his mouth', calm: 25, once: true },
    { name: 'Hum', calm: 20, once: true, needs: [], soothe: { density: 0.6, speed: 0.85 }, sfx: 'shimmer' },
    { name: 'Pat the bell', calm: 20, once: true },
    { name: 'Wiggle the tooth', calm: 45, once: true, after: 'Look in his mouth', atCalm: 30 },
  ],
  lullCalm: 12,

  // A little more than the Dowager (10,800 / 60): he's the longer fight.
  rewards: { exp: 13000, coins: 70 },
};
