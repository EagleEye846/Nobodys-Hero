import { DUMMY_PALETTE, DUMMY_SPRITE } from '../art/dummy.js';

// Lines are pre-wrapped: battle box text fits ~45 characters, speech bubbles ~22.
export const ROGUE_DUMMY = {
  name: 'ROGUE DUMMY',
  sprite: { rows: DUMMY_SPRITE, palette: DUMMY_PALETTE },
  maxHp: 120,
  bulletDamage: 8,

  // One pattern per enemy turn, in this order (see src/battle/bullets.js).
  patterns: ['rain', 'aimed', 'spiral', 'bounce'],

  // Box text at the start of each of your turns.
  flavor: [
    '* The rogue dummy sways in a wind\n  that isn\'t there.',
    '* Smells like fresh cotton.',
    '* The dummy practices its menacing\n  glare.',
    '* Loose threads drift across the\n  floor.',
  ],

  // Speech bubble lines before each attack.
  quips: [
    'Feel the wrath of\n100% cotton!',
    'You can\'t dodge\nforever!',
    'My stuffing is\nmy strength!',
    'Threads of fury!',
    'I was built\nfor this!',
  ],

  acts: [
    { name: 'Check', text: '* ROGUE DUMMY - AT 5 DF 2\n* A training dummy that went\n  freelance. Full of malice. And\n  cotton.' },
    { name: 'Talk', mercy: 30, text: '* You make small talk.\n* The dummy nods along politely.' },
    { name: 'Compliment', mercy: 30, text: '* You praise its stitching.\n* It blushes through the burlap.' },
    { name: 'Soothe', tp: 32, mercy: 45, text: '* You channel calm energy.\n* The dummy\'s stuffing settles.' },
  ],

  rewards: { exp: 40, money: 31 },
};
