import { USURPER_PALETTE, USURPER_SPRITE, USURPER_LAUGH_SPRITES } from '../art/usurper.js';

// THE USURPER, the shade on the summit of Mount Vigil who thinks he's the
// Hero: Chapter 2's last boss, and the hardest fight in the game so far.
// He stole the village's blade from Tilda's forge, killed Ves's mother (the
// lamplighter) and pinched out her lantern, and tossed it in the snow when
// you reached the top (summit_arrival, which starts this fight). Beat him
// and usurper_falls plays. Everything he says is in text/enemies/usurper.txt.
//
// His fight comes in three `phases` (see the battle's bossPhase in
// src/battle/battleScene.js), each with its own attacks and lines:
//   1. SMOKE: he's made of shadow. FIGHT passes straight through him, and
//      spells barely touch him (`smoke`). After his first attack, Ves sees
//      her mother's lantern in the snow and breaks away to it.
//   2. FLAME: Ves spends her turns relighting it (`allyTurn`), and its small
//      flame sits in the box during his attacks (`flame`). His attacks send
//      snuffers at it: catch them with your shadow. Each of his turns the
//      flame survives it grows a stage; let it be snuffed and it shrinks
//      back one. Four stages and it blazes.
//   3. LIT: the light makes him solid. It burns him as it catches (`burn`),
//      everything lands now, he drops the blade, and Ves takes it up: her
//      FIGHT is the Hero's blade (`allyFight`), with a team attack
//      (`allyCommands`). His attacks get desperate (`difficulty`).
// He can't be spared, at all: there's no MERCY to fill (`noMercy`, `meter:
// false`), and any try at it he mocks himself ([mercy_mock]).

// In the light he's solid: his see-through colours made (nearly) opaque.
function solid(palette) {
  return Object.fromEntries(Object.entries(palette).map(([key, colour]) => {
    if (colour.length !== 9) return [key, colour];
    const alpha = Math.min(255, Math.round(parseInt(colour.slice(7), 16) * 1.6 + 60));
    return [key, colour.slice(0, 7) + alpha.toString(16).padStart(2, '0')];
  }));
}
const SOLID_PALETTE = solid(USURPER_PALETTE);

// And without the blade (it's in Ves's hands by then): the steel, gold and
// ribbon right of his hip, gone.
const UNARMED = USURPER_SPRITE.map((row, y) => (y < 26 ? row
  : [...row].map((c, x) => (x >= 31 && 'ga@=!s'.includes(c) ? '.' : c)).join('')));

// His attacks live in src/battle/attacks/usurper.js.
const SMOKE_ATTACKS = [
  { name: 'usurperBlade', weight: 3 },
  { name: 'usurperCrown', weight: 2 },
  { name: 'usurperBanners', weight: 2 },
  { name: 'usurperStare', weight: 2 },
  { name: 'usurperHands', weight: 2 },
  { name: 'usurperFanfare', weight: 2 },
];
// Each of these sends snuffers after the flame.
const FLAME_ATTACKS = [
  { name: 'usurperWhiteout', weight: 3 },
  { name: 'usurperShadowBlades', weight: 3 },
  { name: 'usurperGrasp', weight: 3 },
  { name: 'usurperColdCrown', weight: 2 },
];
// No blade now; and his last stand, everything at once.
const LIT_ATTACKS = [
  { name: 'usurperCrown', weight: 2 },
  { name: 'usurperBanners', weight: 2 },
  { name: 'usurperStare', weight: 2 },
  { name: 'usurperHands', weight: 2 },
  { name: 'usurperFanfare', weight: 2 },
  { name: 'usurperLastStand', weight: 3 },
];

export const USURPER_BOSS = {
  name: 'USURPER',
  textFile: 'enemies/usurper.txt',
  area: 'vigil',
  sprite: { rows: USURPER_SPRITE, palette: USURPER_PALETTE },
  // Beaten, he doesn't fade: he doubles over laughing, solid in the light,
  // the way usurper_falls finds him.
  beatenSprite: { rows: USURPER_LAUGH_SPRITES.f1, palette: SOLID_PALETTE },
  // He's tall (50x58), so he stands at the top of the stage, right of the box.
  battlePos: { x: 206, y: -2 },
  boss: true,
  // "Who Would Be Hero" (usurperHeroTheme.js), a real orchestra. The older
  // themes are still in the music list: 'usurperBattle' (the synth
  // original), 'usurperBattleMix' (that with an orchestra layered under it).
  music: 'usurperHero',
  // The summit, the cold beacon behind (src/battle/backdrops.js).
  backdrop: 'summit',
  // Clearly above the Roost Mother (900 HP, 11 damage, density 1.2), but
  // only phase 3 can hurt him, and the lantern catching burns off a quarter,
  // so it's about 1050 HP of real fighting, with Ves's blade and the team
  // attack to do it with (see docs/mountain-enemies.md for the sums).
  maxHp: 1400,
  damage: 14,
  difficulty: { density: 1.35, speed: 1.18 },

  // In his last stand, below a third of his HP, he layers a lighter second
  // attack on top of the first.
  secondWind: { below: 0.34, density: 0.3, delay: 2.5 },

  // His entrance: a title card before the fight (his lines are [boss_intro]).
  introCard: { title: 'THE USURPER', subtitle: 'Who Would Be Hero' },

  phases: [
    {
      id: 'smoke',
      // FIGHT does nothing to smoke; spells do this share of their damage.
      smoke: { fight: 0, spell: 0.04 },
      // On to the next phase after this many of his turns.
      until: { turns: 1 },
      patterns: SMOKE_ATTACKS,
    },
    {
      id: 'flame',
      smoke: { fight: 0, spell: 0.04 },
      // Her lantern's flame, in the box: four stages to light it, and each
      // turn it shrugs off `guard` snuffers before it's snuffed back a stage
      // (one more each time that happens, up to `maxHelp`: Ves shields it).
      flame: { stages: 4, guard: 3, maxHelp: 3 },
      until: { flame: true },
      // Ves isn't fighting: she's at the lantern (her turn is [relight]).
      allyTurn: { vesper: 'relight' },
      patterns: FLAME_ATTACKS,
      difficulty: { density: 1.3, speed: 1.15 },
      // What happens as it starts: narration in the panel, then Ves (in
      // her box, with her portrait), then him (in a speech bubble).
      beat: [{ say: 'phase: flame' }, { who: 'vesper', say: 'phase: flame vesper' }, { who: 'foe', say: 'phase: flame foe' }],
    },
    {
      id: 'lit',
      // The light burns this share of his max HP as it catches.
      burn: 0.25,
      sprite: { rows: UNARMED, palette: SOLID_PALETTE },
      patterns: LIT_ATTACKS,
      difficulty: { density: 1.45, speed: 1.3 },
      // Ves fights with the Hero's blade: her FIGHT at this power (instead
      // of her umbrella's), slashing in gold.
      allyFight: { vesper: { power: 1.4, color: '#fbc954' } },
      // Her SPELLS: these of hers, and the blade's.
      allyCommands: {
        vesper: {
          keep: ['SHELTER', 'ZEPHYR'],
          add: [
            { label: 'BLADE', cost: 20, strikeOne: 1.25, text: 'Ves grips the Hero\'s blade in both hands and brings it down!' },
            // Both of you at once: your best FIGHT and hers, together.
            { label: 'TOGETHER', cost: 50, team: 0.9, text: 'Ves meets your eye. You go in together, one from each side!' },
          ],
        },
      },
      beat: [{ say: 'phase: lit' }, { who: 'vesper', say: 'phase: lit vesper' }, { who: 'foe', say: 'phase: lit foe' }, { say: 'phase: lit spells' }],
    },
  ],

  // Every attack he has, across his phases (the battle checks there are enough).
  patterns: [...SMOKE_ATTACKS, ...FLAME_ATTACKS, ...LIT_ATTACKS.filter(({ name }) => name === 'usurperLastStand')],

  // No mercy, ever: no MERCY meter, and every try at it (a calming TALK or
  // spell, Pacify, a sweet candle, Ves's kind word) he mocks himself, in
  // speech bubbles ([mercy_mock], then [mercy_mock_again]).
  noMercy: { who: 'foe', meter: false },

  // TALK options. None calm him (nothing does). Two help with the lantern:
  // staring him down makes him come at you instead of the flame for a turn
  // (`provoke`: its snuffers turn on you), and guarding it lets it shrug off
  // more this turn (`flameGuard`).
  talk: [
    { name: 'Check' },
    { name: 'Stare him down', provoke: true },
    { name: 'Guard the lantern', flameGuard: 2 },
  ],

  // Well above the Roost Mother's 380: most of a level at the summit.
  rewards: { exp: 600, coins: 160 },

  // A candle lit from her mother's lantern.
  drops: [{ item: 'lamplight_candle', chance: 1 }],
  materials: [{ id: 'shadow_ash', chance: 1, amount: 3 }],
};
